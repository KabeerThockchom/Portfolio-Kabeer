import { NextResponse } from 'next/server'
import { getSpotifyState } from '@/lib/spotify'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function GET() {
  const state = await getSpotifyState()
  const unavailable = state.status === 'unavailable'
  return NextResponse.json(state, {
    status: unavailable ? (state.reason === 'rate-limit' ? 429 : 503) : 200,
    headers: {
      'Cache-Control': 'no-store',
      ...(unavailable ? { 'Retry-After': String(state.retryAfter) } : {}),
    },
  })
}
