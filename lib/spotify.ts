type SpotifyConfig = {
  clientId?: string
  clientSecret?: string
  refreshToken?: string
}

type Track = {
  title: string
  artist: string
  album: string
  albumImageUrl?: string
  songUrl: string
}

type FailureReason =
  | 'configuration'
  | 'refresh-token'
  | 'credentials'
  | 'authorization'
  | 'permission'
  | 'rate-limit'
  | 'service'

export type SpotifyState =
  | (Track & { status: 'playing' | 'paused' | 'recent'; isPlaying: boolean })
  | { status: 'idle'; isPlaying: false }
  | {
      status: 'unavailable'
      isPlaying: false
      reason: FailureReason
      retryAfter: number
    }

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENT_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENT_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1'

class SpotifyFailure extends Error {
  constructor(
    public reason: FailureReason,
    public retryAfter = 60,
  ) {
    super(reason)
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {}
}

function trackFields(value: unknown): Track | null {
  const item = record(value)
  if (item.type && item.type !== 'track') return null
  if (typeof item.name !== 'string' || !item.name.trim()) return null
  const songUrl = record(item.external_urls).spotify
  if (typeof songUrl !== 'string') return null
  try {
    const url = new URL(songUrl)
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com')
      return null
  } catch {
    return null
  }
  const album = record(item.album)
  const image = Array.isArray(album.images)
    ? record(album.images[0]).url
    : undefined
  return {
    title: item.name,
    artist: Array.isArray(item.artists)
      ? item.artists
          .map((artist) => record(artist).name)
          .filter((name): name is string => typeof name === 'string')
          .join(', ')
      : '',
    album: typeof album.name === 'string' ? album.name : '',
    albumImageUrl:
      typeof image === 'string' && image.startsWith('https://')
        ? image
        : undefined,
    songUrl,
  }
}

// Share token refreshes and short-lived track results across visitors on a warm server.
export function createSpotifyReader({
  fetcher = fetch,
  getConfig = () => ({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  }),
  now = Date.now,
}: {
  fetcher?: typeof fetch
  getConfig?: () => SpotifyConfig
  now?: () => number
} = {}) {
  let configuration: SpotifyConfig = {}
  let refreshToken: string | undefined
  let token: { value: string; expiresAt: number } | null = null
  let blocked: SpotifyFailure | null = null
  let cached: { state: SpotifyState; expiresAt: number } | null = null
  let pending: Promise<SpotifyState> | null = null

  async function failure(response: Response, tokenRequest = false) {
    if (response.status === 429) {
      const seconds = Number(response.headers.get('Retry-After'))
      return new SpotifyFailure(
        'rate-limit',
        Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : 60,
      )
    }
    if (tokenRequest && [400, 401, 403].includes(response.status)) {
      const data = record(await response.json().catch(() => null))
      if (data.error === 'invalid_grant')
        return new SpotifyFailure('refresh-token')
      if (data.error === 'invalid_client')
        return new SpotifyFailure('credentials')
      return new SpotifyFailure('authorization')
    }
    if (response.status === 401) return new SpotifyFailure('authorization')
    if (response.status === 403) return new SpotifyFailure('permission')
    return new SpotifyFailure('service')
  }

  async function accessToken(signal: AbortSignal) {
    if (token && token.expiresAt > now()) return token.value
    const basic = Buffer.from(
      `${configuration.clientId}:${configuration.clientSecret}`,
    ).toString('base64')
    const response = await fetcher(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken!,
      }),
      cache: 'no-store',
      signal,
    })
    if (!response.ok) throw await failure(response, true)
    const data = record(await response.json())
    if (typeof data.access_token !== 'string' || !data.access_token)
      throw new SpotifyFailure('service')
    const lifetime =
      typeof data.expires_in === 'number' && data.expires_in > 0
        ? data.expires_in
        : 3600
    token = {
      value: data.access_token,
      expiresAt:
        now() + Math.max(1, lifetime - Math.min(30, lifetime / 2)) * 1000,
    }
    if (typeof data.refresh_token === 'string' && data.refresh_token)
      refreshToken = data.refresh_token
    return token.value
  }

  async function spotifyRequest(url: string, signal: AbortSignal) {
    let value = await accessToken(signal)
    let response = await fetcher(url, {
      headers: { Authorization: `Bearer ${value}` },
      cache: 'no-store',
      signal,
    })
    // Retry a rejected access token once. A rejected refresh token requires reauthorization.
    if (response.status === 401) {
      token = null
      value = await accessToken(signal)
      response = await fetcher(url, {
        headers: { Authorization: `Bearer ${value}` },
        cache: 'no-store',
        signal,
      })
    }
    if (response.status !== 204 && !response.ok) throw await failure(response)
    return response
  }

  async function read(): Promise<SpotifyState> {
    try {
      const signal = AbortSignal.timeout(8000)
      const current = await spotifyRequest(CURRENT_ENDPOINT, signal)
      if (current.status !== 204) {
        const data = record(await current.json())
        const track = trackFields(data.item)
        if (track)
          return {
            ...track,
            status: data.is_playing === true ? 'playing' : 'paused',
            isPlaying: data.is_playing === true,
          }
      }
      const recent = await spotifyRequest(RECENT_ENDPOINT, signal)
      if (recent.status === 204) return { status: 'idle', isPlaying: false }
      const data = record(await recent.json())
      const track = Array.isArray(data.items)
        ? trackFields(record(data.items[0]).track)
        : null
      return track
        ? { ...track, status: 'recent', isPlaying: false }
        : { status: 'idle', isPlaying: false }
    } catch (error) {
      const cause =
        error instanceof SpotifyFailure ? error : new SpotifyFailure('service')
      if (
        [
          'refresh-token',
          'credentials',
          'authorization',
          'permission',
        ].includes(cause.reason)
      ) {
        token = null
        blocked = cause
      }
      return {
        status: 'unavailable',
        isPlaying: false,
        reason: cause.reason,
        retryAfter: cause.retryAfter,
      }
    }
  }

  return async function getSpotifyState(): Promise<SpotifyState> {
    const next = getConfig()
    if (
      next.clientId !== configuration.clientId ||
      next.clientSecret !== configuration.clientSecret ||
      next.refreshToken !== configuration.refreshToken
    ) {
      configuration = { ...next }
      refreshToken = next.refreshToken
      token = null
      blocked = null
      cached = null
    }
    if (
      !configuration.clientId ||
      !configuration.clientSecret ||
      !configuration.refreshToken
    ) {
      return {
        status: 'unavailable',
        isPlaying: false,
        reason: 'configuration',
        retryAfter: 60,
      }
    }
    if (blocked)
      return {
        status: 'unavailable',
        isPlaying: false,
        reason: blocked.reason,
        retryAfter: 60,
      }
    if (cached && cached.expiresAt > now()) {
      if (cached.state.status === 'unavailable')
        return {
          ...cached.state,
          retryAfter: Math.max(1, Math.ceil((cached.expiresAt - now()) / 1000)),
        }
      return cached.state
    }
    if (pending) return pending
    pending = read()
      .then((state) => {
        cached = {
          state,
          expiresAt:
            now() +
            (state.status === 'unavailable' ? state.retryAfter * 1000 : 15000),
        }
        return state
      })
      .finally(() => {
        pending = null
      })
    return pending
  }
}

export const getSpotifyState = createSpotifyReader()
