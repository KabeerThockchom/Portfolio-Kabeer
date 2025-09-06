'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import { SOCIAL_LINKS } from './data'
import { GithubIcon, LinkedinIcon } from 'lucide-react'
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
        setTrack(data)
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

  if (loading) {
    return (
      <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 backdrop-blur-sm px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="h-6 w-6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
      </div>
    )
  }

  if (!track.isPlaying && !track.title) {
    return (
      <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 backdrop-blur-sm px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-3 w-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Currently listening to nothing</span>
      </div>
    )
  }

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 backdrop-blur-sm px-2 py-1.5 transition-all hover:border-green-300 hover:bg-green-50/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-green-600 dark:hover:bg-green-950/50 group"
      title={`${track.title} by ${track.artist}`}
    >
      {track.albumImageUrl ? (
        <img
          src={track.albumImageUrl}
          alt={`${track.album} album cover`}
          className="h-6 w-6 rounded object-cover"
        />
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-3 w-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Currently listening to</span>
        <div className="flex items-center space-x-1">
          {track.isPlaying && (
            <div className="flex space-x-0.5">
              <div className="h-2 w-0.5 bg-green-500 animate-pulse"></div>
              <div className="h-1.5 w-0.5 bg-green-500 animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="h-2.5 w-0.5 bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
          )}
          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[180px]">
            {track.title}
          </span>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
          by {track.artist}
        </span>
      </div>
      <svg className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    </a>
  )
}

export function Header() {
  return (
    <header className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-zinc-200 transition-all duration-300 hover:scale-110 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500">
          <div className="absolute inset-0 z-10 hidden rounded-full bg-black/10 opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100 dark:bg-white/10"></div>
          <Image 
            src="/kabeer.png" 
            alt="Kabeer Thockchom profile photo" 
            width={200} 
            height={200}
            className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
          />
        </div>
        <div>
          <Link href="/" className="text-lg font-medium text-black dark:text-white">
            Kabeer Thockchom
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-base text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Senior Applied AI Engineer
          </TextEffect>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex space-x-4">
              <a 
                href="https://github.com/KabeerThockchom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
                aria-label="GitHub"
              >
                <GithubIcon size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/kabeerthockchom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={24} />
              </a>
            </div>
            <HeaderSpotifyWidget />
          </div>
        </div>
      </div>
    </header>
  )
}
