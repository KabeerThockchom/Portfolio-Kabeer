#!/usr/bin/env node
import { createServer } from 'node:http'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { Writable } from 'node:stream'
import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const REDIRECT_URI = 'http://127.0.0.1:8888/callback'
export const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
]

export function authorizationUrl(clientId, state) {
  const url = new URL('https://accounts.spotify.com/authorize')
  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    state,
    show_dialog: 'true',
  }).toString()
  return url.toString()
}

export async function exchangeCode({
  clientId,
  clientSecret,
  code,
  fetcher = fetch,
}) {
  let response
  try {
    response = await fetcher('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    })
  } catch {
    throw new Error(
      'Could not reach Spotify. Run the helper again when the connection is available.',
    )
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      'Spotify rejected the authorization. Check the client ID, client secret, and registered redirect URI, then run the helper again.',
    )
  }
  if (
    typeof data?.refresh_token !== 'string' ||
    !data.refresh_token ||
    /[\r\n]/.test(data.refresh_token)
  ) {
    throw new Error(
      'Spotify did not return a refresh token. Run the authorization again.',
    )
  }
  const granted = new Set(
    typeof data.scope === 'string' ? data.scope.split(' ') : [],
  )
  if (!SCOPES.every((scope) => granted.has(scope))) {
    throw new Error(
      'Spotify did not grant both required permissions. Run the authorization again and approve the requested permissions.',
    )
  }
  return data.refresh_token
}

export function callbackHandler({
  state,
  clientId,
  clientSecret,
  fetcher,
  onSuccess,
  onError,
}) {
  let used = false
  return async function handle(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    const url = new URL(req.url, 'http://127.0.0.1')
    if (req.method !== 'GET' || url.pathname !== '/callback') {
      res.writeHead(404).end('Not found.')
      return
    }
    const supplied = Buffer.from(url.searchParams.get('state') || '')
    const expected = Buffer.from(state)
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      res
        .writeHead(400)
        .end(
          'Invalid authorization state. Use the Spotify page opened by the helper.',
        )
      return
    }
    if (used) {
      res.writeHead(409).end('This authorization has already been used.')
      return
    }
    if (url.searchParams.has('error')) {
      used = true
      res
        .writeHead(400)
        .end('Authorization was not approved. Return to your terminal.')
      onError(new Error('Spotify authorization was not approved.'))
      return
    }
    const code = url.searchParams.get('code')
    if (!code) {
      res.writeHead(400).end('Missing authorization code.')
      return
    }
    used = true
    try {
      const token = await exchangeCode({
        clientId,
        clientSecret,
        code,
        fetcher,
      })
      res.end(
        'Spotify authorization complete. Return to your terminal for the saved token file.',
      )
      onSuccess(token)
    } catch (error) {
      res
        .writeHead(502)
        .end(
          'Could not complete Spotify authorization. Return to your terminal for instructions.',
        )
      onError(error)
    }
  }
}

export async function saveToken(token, directory = process.cwd()) {
  if (typeof token !== 'string' || !token || /[\r\n]/.test(token))
    throw new Error('Invalid refresh token.')
  let filename = '.env.spotify-token'
  let destination = resolve(directory, filename)
  try {
    await writeFile(destination, `SPOTIFY_REFRESH_TOKEN=${token}\n`, {
      mode: 0o600,
      flag: 'wx',
    })
  } catch (error) {
    if (error.code !== 'EEXIST')
      throw new Error(
        'Could not save the token file. Check directory permissions.',
      )
    filename = `.env.spotify-token-${randomBytes(6).toString('hex')}`
    destination = resolve(directory, filename)
    await writeFile(destination, `SPOTIFY_REFRESH_TOKEN=${token}\n`, {
      mode: 0o600,
      flag: 'wx',
    })
  }
  return filename
}

async function openBrowser(url) {
  const command =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'rundll32'
        : 'xdg-open'
  const args =
    process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url]
  await new Promise((resolveOpen) => {
    const child = spawn(command, args, { stdio: 'ignore' })
    child.once('error', () => resolveOpen(false))
    child.once('exit', (code) => resolveOpen(code === 0))
  })
}

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY)
    throw new Error('Run this helper in your own interactive terminal.')
  console.log(
    `First, register this redirect URI in your existing Spotify app: ${REDIRECT_URI}`,
  )
  console.log(
    'This helper requests only current playback and recently played tracks. It does not print your credentials or tokens.\n',
  )
  let muted = false
  const output = new Writable({
    write(chunk, encoding, done) {
      if (!muted) process.stdout.write(chunk, encoding)
      done()
    },
  })
  const rl = createInterface({ input: process.stdin, output, terminal: true })
  rl.on('SIGINT', () => {
    rl.close()
    process.exit(130)
  })
  let clientId, clientSecret
  try {
    clientId = (
      process.env.SPOTIFY_CLIENT_ID || (await rl.question('Client ID: '))
    ).trim()
    if (process.env.SPOTIFY_CLIENT_SECRET)
      clientSecret = process.env.SPOTIFY_CLIENT_SECRET.trim()
    else {
      process.stdout.write('Client secret (hidden): ')
      muted = true
      clientSecret = (await rl.question('')).trim()
      muted = false
      process.stdout.write('\n')
    }
  } finally {
    muted = false
    rl.close()
  }
  if (!clientId || !clientSecret)
    throw new Error('Both the client ID and client secret are required.')

  const state = randomBytes(32).toString('hex')
  let server
  let timeout
  const result = new Promise((resolveToken, rejectToken) => {
    server = createServer(
      callbackHandler({
        state,
        clientId,
        clientSecret,
        onSuccess: resolveToken,
        onError: rejectToken,
      }),
    )
    server.once('error', () =>
      rejectToken(
        new Error(
          'Could not open port 8888. Close the application using that port and run this helper again.',
        ),
      ),
    )
    timeout = setTimeout(
      () =>
        rejectToken(
          new Error('Authorization timed out. Run this helper again.'),
        ),
      10 * 60 * 1000,
    )
    server.listen(8888, '127.0.0.1', () => {
      const url = authorizationUrl(clientId, state)
      console.log(
        `Opening Spotify. If the browser does not open, visit this authorization URL:\n${url}\n`,
      )
      void openBrowser(url)
    })
  })
  try {
    const token = await result
    const filename = await saveToken(token)
    console.log(`Saved the refresh token privately to ${filename}.`)
    console.log(
      'Copy only the value after SPOTIFY_REFRESH_TOKEN= into that Vercel environment variable, then redeploy.',
    )
    if (process.platform === 'darwin')
      console.log(
        `Mac clipboard command: sed -n 's/^SPOTIFY_REFRESH_TOKEN=//p' ${filename} | pbcopy`,
      )
  } finally {
    clearTimeout(timeout)
    server.close()
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
