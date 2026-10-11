import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { mkdtemp, readFile, stat, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  authorizationUrl,
  exchangeCode,
  callbackHandler,
  saveToken,
  REDIRECT_URI,
  SCOPES,
} from '../scripts/spotify-authorize.mjs'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status })
const approved = () =>
  json({ refresh_token: 'fake-refresh-token', scope: SCOPES.join(' ') })

test('authorization requests the exact local callback, both scopes, and a new consent dialog', () => {
  const url = new URL(authorizationUrl('fake-client-id', 'fake-state'))
  assert.equal(url.origin, 'https://accounts.spotify.com')
  assert.equal(url.searchParams.get('redirect_uri'), REDIRECT_URI)
  assert.equal(url.searchParams.get('scope'), SCOPES.join(' '))
  assert.equal(url.searchParams.get('state'), 'fake-state')
  assert.equal(url.searchParams.get('show_dialog'), 'true')
})

test('code exchange uses Basic authentication and returns only the refresh token', async () => {
  const token = await exchangeCode({
    clientId: 'fake-id',
    clientSecret: 'fake-secret',
    code: 'fake-code',
    fetcher: async (url, options) => {
      assert.equal(url, 'https://accounts.spotify.com/api/token')
      assert.equal(
        options.headers.Authorization,
        `Basic ${Buffer.from('fake-id:fake-secret').toString('base64')}`,
      )
      assert.equal(options.body.get('redirect_uri'), REDIRECT_URI)
      assert.equal(options.body.get('grant_type'), 'authorization_code')
      assert.equal(options.body.get('code'), 'fake-code')
      return approved()
    },
  })
  assert.equal(token, 'fake-refresh-token')
})

test('rejected or incomplete responses do not expose provider details or accept partial scopes', async () => {
  for (const response of [
    json({ error: 'private-provider-detail' }, 400),
    json({}),
    json({ refresh_token: 'fake-token', scope: SCOPES[0] }),
  ]) {
    await assert.rejects(
      exchangeCode({
        clientId: 'fake-id',
        clientSecret: 'fake-secret',
        code: 'fake-code',
        fetcher: async () => response,
      }),
      (error) => {
        assert.ok(!error.message.includes('private-provider-detail'))
        return true
      },
    )
  }
})

test('callback rejects invalid state and exchanges a valid code exactly once without returning tokens in HTML', async (t) => {
  let calls = 0,
    saved
  const handler = callbackHandler({
    state: 'expected-state',
    clientId: 'fake-id',
    clientSecret: 'fake-secret',
    fetcher: async () => {
      calls++
      return approved()
    },
    onSuccess: (token) => {
      saved = token
    },
    onError: (error) => {
      throw error
    },
  })
  const server = createServer(handler).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise((resolve) => server.close(resolve)))
  const base = `http://127.0.0.1:${server.address().port}`
  assert.equal(
    (await fetch(`${base}/callback?state=wrong&code=fake-code`)).status,
    400,
  )
  assert.equal(calls, 0)
  const response = await fetch(
    `${base}/callback?state=expected-state&code=fake-code`,
  )
  assert.equal(response.status, 200)
  assert.ok(!(await response.text()).includes('fake-refresh-token'))
  assert.equal(saved, 'fake-refresh-token')
  assert.equal(
    (await fetch(`${base}/callback?state=expected-state&code=fake-code`))
      .status,
    409,
  )
  assert.equal(calls, 1)
})

test('saved tokens are private, retain an existing file, and reject newline injection', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'spotify-helper-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const first = await saveToken('first-fake-token', directory)
  const second = await saveToken('second-fake-token', directory)
  assert.notEqual(first, second)
  assert.equal(
    await readFile(join(directory, first), 'utf8'),
    'SPOTIFY_REFRESH_TOKEN=first-fake-token\n',
  )
  assert.equal(
    await readFile(join(directory, second), 'utf8'),
    'SPOTIFY_REFRESH_TOKEN=second-fake-token\n',
  )
  if (process.platform !== 'win32')
    assert.equal((await stat(join(directory, first))).mode & 0o777, 0o600)
  await assert.rejects(
    saveToken('bad-token\nOTHER=value', directory),
    /Invalid refresh token/,
  )
})
