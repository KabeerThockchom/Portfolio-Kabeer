import { NextRequest, NextResponse } from 'next/server'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
  })

  return response.json()
}

export const GET = async (request: NextRequest) => {
  try {
    const { access_token } = await getAccessToken()

    // Try to get currently playing first
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (response.status === 204 || response.status > 400) {
      // No song currently playing, get recently played
      const recentResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (recentResponse.status !== 200) {
        return NextResponse.json({ isPlaying: false })
      }

      const recentData = await recentResponse.json()
      const track = recentData.items[0]?.track

      if (!track) {
        return NextResponse.json({ isPlaying: false })
      }

      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((_artist: any) => _artist.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
      })
    }

    const song = await response.json()

    if (!song || !song.item) {
      return NextResponse.json({ isPlaying: false })
    }

    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ')
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0]?.url
    const songUrl = song.item.external_urls.spotify

    return NextResponse.json({
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
      album,
    })
  } catch (error) {
    console.error('Error fetching from Spotify:', error)
    return NextResponse.json({ isPlaying: false }, { status: 500 })
  }
}