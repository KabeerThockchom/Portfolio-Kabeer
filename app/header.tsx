'use client'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useState, useEffect } from 'react'

type SpotifyTrack = {
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  albumImageUrl?: string
  songUrl?: string
}

function HeaderSpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack>({ isPlaying: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify')
        const data = await response.json()
        setTrack(response.ok ? data : { isPlaying: false })
      } catch (error) {
        console.error('Error fetching Spotify data:', error)
        setTrack({ isPlaying: false })
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading || !track.isPlaying) return null

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center space-x-2 rounded-lg border border-neutral-200 bg-white/80 px-2 py-1.5 backdrop-blur-sm transition-all hover:border-neutral-300 hover:bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/80 dark:hover:border-neutral-600 dark:hover:bg-neutral-950/50"
      title={`${track.title} by ${track.artist}`}
    >
      {track.albumImageUrl ? (
        <img
          src={track.albumImageUrl}
          alt={`${track.album} album cover`}
          className="h-6 w-6 rounded object-cover"
        />
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100 dark:bg-neutral-800">
          <svg
            className="h-3 w-3 text-neutral-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Currently listening to
        </span>
        <div className="flex items-center space-x-1">
          {track.isPlaying && (
            <div className="flex space-x-0.5">
              <div className="h-2 w-0.5 animate-pulse bg-neutral-500"></div>
              <div
                className="h-1.5 w-0.5 animate-pulse bg-neutral-500"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="h-2.5 w-0.5 animate-pulse bg-neutral-500"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}
          <span className="max-w-[180px] truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
            {track.title}
          </span>
        </div>
        <span className="max-w-[180px] truncate text-xs text-neutral-500 dark:text-neutral-400">
          by {track.artist}
        </span>
      </div>
      <svg
        className="h-3 w-3 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    </a>
  )
}

export function Header() {
  return (
    <header className="site-header">
      <Link
        href="/"
        className="header-brand"
        aria-label="Kabeer Thockchom, home"
      >
        Kabeer Thockchom
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#work">Work</Link>
        <Link href="/#writing">Writing</Link>
        <Link href="/#experience">Background</Link>
        <Link href="/#resume">Resume</Link>
      </nav>
      <Link className="header-contact" href="/#contact">
        Contact
        <ArrowUpRight size={16} />
      </Link>
      <div className="header-spotify">
        <HeaderSpotifyWidget />
      </div>
    </header>
  )
}
