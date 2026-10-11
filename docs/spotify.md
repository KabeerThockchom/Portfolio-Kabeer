# Spotify widget

The original header displays current playback, a paused track, or the last played track. Both responsive views share one polling cycle. Hidden browser tabs pause polling. Spotify errors display “Spotify unavailable” instead of claiming nothing is playing.

The server checks token refresh responses, reuses access tokens until expiry, shares concurrent requests, caches track results for 15 seconds, and honors Spotify's `Retry-After` interval. Requests have an eight-second total timeout. Tokens and raw provider errors never appear in public responses.

## Configuration

Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` in the existing Vercel project. Select the Production environment for the live domain. Store credentials only in environment settings or ignored local environment files.

Authorize the portfolio owner's Spotify account with `user-read-currently-playing` and `user-read-recently-played`. Visitors do not sign in to Spotify.

## Diagnose `/api/spotify`

Healthy responses return HTTP 200 with `status` equal to `playing`, `paused`, `recent`, or `idle`. A missing track is different from an integration failure.

| Failure reason  | Owner action                                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configuration` | Set all three environment variables for the deployment environment.                                                                                       |
| `refresh-token` | Reauthorize the owner's Spotify account. Update `SPOTIFY_REFRESH_TOKEN` and redeploy. Spotify rejected the refresh token as expired, revoked, or invalid. |
| `credentials`   | Check that the client ID and client secret belong to the same Spotify application as the refresh token. Redeploy after updating them.                     |
| `authorization` | Check the app credentials and reauthorize the owner's Spotify account.                                                                                    |
| `permission`    | Check the two required scopes and the app's allowed users in Spotify's Developer Dashboard. Reauthorize if scopes changed.                                |
| `rate-limit`    | Wait for the `Retry-After` interval. The server and widget already enforce it.                                                                            |
| `service`       | Wait for the next retry. Check Spotify service availability if the error persists.                                                                        |

Failures return HTTP 503, or HTTP 429 for rate limits. Permanent authorization failures are not retried on a warm server until its configuration changes or it restarts.

Do not paste client secrets or refresh tokens into chat, source files, or public issue comments. Verify the live endpoint after deployment and production promotion.

## Validation

Run `node --test tests/spotify.test.cjs` and `npm run build`.

## Official references

- [Refreshing tokens](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens)
- [Currently playing track](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track)
- [Recently played tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)
- [Required scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)
- [Rate limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)
