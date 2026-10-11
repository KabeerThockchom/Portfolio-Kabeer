const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const source = fs.readFileSync(
  path.join(__dirname, '../lib/spotify.ts'),
  'utf8',
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText
const moduleRecord = { exports: {} }
vm.runInNewContext(compiled, {
  module: moduleRecord,
  exports: moduleRecord.exports,
  process,
  Buffer,
  URL,
  URLSearchParams,
  AbortSignal,
  fetch,
})
const { createSpotifyReader } = moduleRecord.exports
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers })
const empty = () => new Response(null, { status: 204 })
const token = (extra = {}) =>
  json({ access_token: 'test-access-token', expires_in: 3600, ...extra })
const track = {
  type: 'track',
  name: 'Test song',
  artists: [{ name: 'Test artist' }],
  album: {
    name: 'Test album',
    images: [{ url: 'https://i.scdn.co/image/test' }],
  },
  external_urls: { spotify: 'https://open.spotify.com/track/test' },
}
const current = (isPlaying = true, item = track) =>
  json({ is_playing: isPlaying, item })
const plain = (value) => JSON.parse(JSON.stringify(value))

function harness(responses, initialConfig) {
  let time = 0
  let config =
    initialConfig === undefined
      ? {
          clientId: 'test-client',
          clientSecret: 'test-secret',
          refreshToken: 'test-refresh',
        }
      : initialConfig
  const calls = []
  const read = createSpotifyReader({
    now: () => time,
    getConfig: () => config,
    fetcher: async (url, options) => {
      calls.push({ url, options })
      assert.equal(options.cache, 'no-store')
      assert.ok(options.signal instanceof AbortSignal)
      assert.ok(responses.length, 'Unexpected extra Spotify request')
      const response = responses.shift()
      if (response instanceof Error) throw response
      return response
    },
  })
  return {
    read,
    calls,
    advance: (seconds) => {
      time += seconds * 1000
    },
    configure: (value) => {
      config = value
    },
  }
}

test('missing configuration does not contact Spotify', async () => {
  const h = harness([], {})
  assert.deepEqual(plain(await h.read()), {
    status: 'unavailable',
    isPlaying: false,
    reason: 'configuration',
    retryAfter: 60,
  })
  assert.equal(h.calls.length, 0)
})

test('playing track includes original artwork and deduplicates concurrent visitors', async () => {
  const h = harness([token(), current(), current()])
  const states = await Promise.all([h.read(), h.read(), h.read()])
  assert.deepEqual(plain(states[0]), {
    status: 'playing',
    isPlaying: true,
    title: 'Test song',
    artist: 'Test artist',
    album: 'Test album',
    albumImageUrl: 'https://i.scdn.co/image/test',
    songUrl: 'https://open.spotify.com/track/test',
  })
  assert.equal(h.calls.length, 2)
  await h.read()
  assert.equal(h.calls.length, 2)
  h.advance(16)
  await h.read()
  assert.equal(h.calls.length, 3)
  assert.equal(
    h.calls.filter((call) => call.url.includes('/api/token')).length,
    1,
  )
})

test('a paused track is not reported as playing', async () => {
  const h = harness([token(), current(false)])
  const state = await h.read()
  assert.equal(state.status, 'paused')
  assert.equal(state.isPlaying, false)
})

test('no active playback falls back to the last played track', async () => {
  const h = harness([token(), empty(), json({ items: [{ track }] })])
  const state = await h.read()
  assert.equal(state.status, 'recent')
  assert.equal(state.isPlaying, false)
  assert.ok(h.calls[2].url.endsWith('recently-played?limit=1'))
})

test('unsupported playback falls back safely; empty history is idle', async () => {
  const h = harness([
    token(),
    current(true, { type: 'episode', name: 'Episode' }),
    json({ items: [] }),
  ])
  assert.deepEqual(plain(await h.read()), { status: 'idle', isPlaying: false })
})

test('invalid refresh tokens stop repeated failures and recover after configuration changes', async () => {
  const h = harness([
    json(
      { error: 'invalid_grant', error_description: 'private provider detail' },
      400,
    ),
    token(),
    current(),
  ])
  const state = await h.read()
  assert.equal(state.status, 'unavailable')
  assert.equal(state.reason, 'refresh-token')
  h.advance(3600)
  await h.read()
  assert.equal(h.calls.length, 1)
  h.configure({
    clientId: 'test-client',
    clientSecret: 'test-secret',
    refreshToken: 'test-new-refresh',
  })
  assert.equal((await h.read()).status, 'playing')
  const publicState = JSON.stringify(state)
  for (const secret of [
    'private provider detail',
    'test-secret',
    'test-refresh',
  ])
    assert.ok(!publicState.includes(secret))
})

test('wrong client credentials are distinguished from an invalid refresh token', async () => {
  const h = harness([json({ error: 'invalid_client' }, 401)])
  assert.equal((await h.read()).reason, 'credentials')
  assert.equal(h.calls.length, 1)
})

test('permission errors are not disguised as no playback or retried through history', async () => {
  const h = harness([
    token(),
    json({ error: { message: 'Insufficient scope' } }, 403),
  ])
  const state = await h.read()
  assert.equal(state.status, 'unavailable')
  assert.equal(state.reason, 'permission')
  assert.equal(h.calls.length, 2)
})

test('provider rate limits retain the full Retry-After interval', async () => {
  const h = harness([
    token(),
    json({}, 429, { 'Retry-After': '120' }),
    current(),
  ])
  assert.equal((await h.read()).retryAfter, 120)
  h.advance(16)
  assert.equal((await h.read()).retryAfter, 104)
  assert.equal(h.calls.length, 2)
  h.advance(105)
  assert.equal((await h.read()).status, 'playing')
  assert.equal(h.calls.length, 3)
})

test('a rejected access token refreshes once and retries the player request', async () => {
  const h = harness([
    token(),
    json({}, 401),
    token({ access_token: 'replacement-token' }),
    current(),
  ])
  assert.equal((await h.read()).status, 'playing')
  assert.equal(h.calls.length, 4)
  assert.equal(
    h.calls[3].options.headers.Authorization,
    'Bearer replacement-token',
  )
})

test('a second authorization failure does not create a retry loop', async () => {
  const h = harness([token(), json({}, 401), token(), json({}, 401)])
  assert.equal((await h.read()).reason, 'authorization')
  h.advance(120)
  await h.read()
  assert.equal(h.calls.length, 4)
})

test('rotated refresh tokens are used for subsequent token requests', async () => {
  const h = harness([
    token({ refresh_token: 'rotated-test-refresh', expires_in: 60 }),
    current(),
    token(),
    current(),
  ])
  await h.read()
  h.advance(61)
  await h.read()
  assert.equal(
    h.calls[2].options.body.get('refresh_token'),
    'rotated-test-refresh',
  )
})

test('malformed token responses never send Bearer undefined', async () => {
  const h = harness([json({ expires_in: 3600 })])
  assert.equal((await h.read()).reason, 'service')
  assert.equal(h.calls.length, 1)
})

test('network failures and malformed JSON return safe temporary failure states', async () => {
  for (const responses of [
    [new Error('private network details')],
    [token(), new Response('invalid JSON')],
  ]) {
    const h = harness(responses)
    const state = await h.read()
    assert.equal(state.reason, 'service')
    assert.equal(state.status, 'unavailable')
    assert.ok(!JSON.stringify(state).includes('private'))
    const calls = h.calls.length
    h.advance(30)
    await h.read()
    assert.equal(h.calls.length, calls)
  }
})
