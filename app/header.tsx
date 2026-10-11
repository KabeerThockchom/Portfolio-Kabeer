'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import { GithubIcon, LinkedinIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

import type { SpotifyState } from '@/lib/spotify'

// Both responsive widget views share one request cycle.
function useSpotifyTrack() {
  const [track, setTrack] = useState<SpotifyState | null>(null)

  useEffect(() => {
    let active = true
    let running = false
    let nextPoll = 0
    let timer: ReturnType<typeof setTimeout>
    let controller: AbortController | null = null
    const pageIsHidden = () => document.visibilityState === 'hidden'

    async function refresh() {
      if (!active || running || pageIsHidden()) return
      clearTimeout(timer)
      if (Date.now() < nextPoll) {
        timer = setTimeout(refresh, Math.min(nextPoll - Date.now(), 2147483647))
        return
      }
      running = true
      controller = new AbortController()
      let delay = 30000
      try {
        const response = await fetch('/api/spotify', {
          cache: 'no-store',
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(10000),
          ]),
        })
        const data: SpotifyState = await response.json()
        if (
          !['playing', 'paused', 'recent', 'idle', 'unavailable'].includes(
            data.status,
          )
        )
          throw new Error('Invalid Spotify response')
        if (active) setTrack(data)
        if (data.status === 'unavailable') {
          const retryAfter = Number(data.retryAfter)
          delay =
            Number.isFinite(retryAfter) && retryAfter > 0
              ? Math.max(30000, retryAfter * 1000)
              : 60000
        }
      } catch {
        if (active)
          setTrack({
            status: 'unavailable',
            isPlaying: false,
            reason: 'service',
            retryAfter: 60,
          })
        delay = 60000
      } finally {
        running = false
        nextPoll = Date.now() + delay
        if (active && !pageIsHidden())
          timer = setTimeout(refresh, Math.min(delay, 2147483647))
      }
    }

    function visibilityChanged() {
      if (pageIsHidden()) clearTimeout(timer)
      else void refresh()
    }
    void refresh()
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      active = false
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  return track
}

function HeaderSpotifyWidget({ track }: { track: SpotifyState | null }) {
  const loading = !track
  if (loading) {
    return (
      <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 px-2 py-1.5 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="h-6 w-6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
      </div>
    )
  }

  if (!track || !('title' in track)) {
    return (
      <div className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 px-2 py-1.5 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-3 w-3 text-zinc-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {track?.status === 'unavailable'
            ? 'Spotify unavailable'
            : 'Not playing'}
        </span>
      </div>
    )
  }

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white/80 px-2 py-1.5 backdrop-blur-sm transition-all hover:border-green-300 hover:bg-green-50/80 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-green-600 dark:hover:bg-green-950/50"
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
          <svg
            className="h-3 w-3 text-zinc-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {track.status === 'playing'
            ? 'Currently listening to'
            : track.status === 'paused'
              ? 'Paused on Spotify'
              : 'Last played on Spotify'}
        </span>
        <div className="flex items-center space-x-1">
          {track.isPlaying && (
            <div className="flex space-x-0.5">
              <div className="h-2 w-0.5 animate-pulse bg-green-500"></div>
              <div
                className="h-1.5 w-0.5 animate-pulse bg-green-500"
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className="h-2.5 w-0.5 animate-pulse bg-green-500"
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          )}
          <span className="max-w-[180px] truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
            {track.title}
          </span>
        </div>
        <span className="max-w-[180px] truncate text-xs text-zinc-500 dark:text-zinc-400">
          by {track.artist}
        </span>
      </div>
      <svg
        className="h-3 w-3 text-green-500 opacity-0 transition-opacity group-hover:opacity-100"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    </a>
  )
}

export function Header() {
  const track = useSpotifyTrack()

  return (
    <header className="mb-6 sm:mb-8">
      {/* Mobile Layout: Centered Stack */}
      <div className="flex flex-col items-center text-center sm:hidden">
        <div className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-zinc-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500">
          <div className="absolute inset-0 z-10 hidden rounded-full bg-black/10 opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100 dark:bg-white/10"></div>
          <Image
            src="/kabeer.png"
            alt="Kabeer Thockchom profile photo"
            width={200}
            height={200}
            className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
          />
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="text-xl font-bold text-black transition-colors hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
          >
            Kabeer Thockchom
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="mt-1 text-base text-zinc-600 dark:text-zinc-400"
            delay={0.5}
          >
            Field Engineering @ Databricks
          </TextEffect>
          <div className="mt-4 flex flex-col items-center space-y-3">
            <div className="flex space-x-6">
              <a
                href="https://github.com/KabeerThockchom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-all hover:scale-110 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400"
                aria-label="GitHub"
              >
                <GithubIcon size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/kabeerthockchom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-all hover:scale-110 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={24} />
              </a>
            </div>
            <HeaderSpotifyWidget track={track} />
          </div>
        </div>
      </div>

      {/* Desktop Layout: Horizontal */}
      <div className="hidden items-center justify-between sm:flex">
        <div className="flex items-center gap-6">
          <div className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-4 border-zinc-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500">
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
            <Link
              href="/"
              className="text-2xl font-bold text-black transition-colors hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
            >
              Kabeer Thockchom
            </Link>
            <TextEffect
              as="p"
              preset="fade"
              per="char"
              className="mt-1 text-lg text-zinc-600 dark:text-zinc-400"
              delay={0.5}
            >
              Field Engineering @ Databricks
            </TextEffect>
            <div className="mt-5 flex items-center space-x-6">
              <div className="flex space-x-5">
                <a
                  href="https://github.com/KabeerThockchom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 transition-all hover:scale-110 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400"
                  aria-label="GitHub"
                >
                  <GithubIcon size={28} />
                </a>
                <a
                  href="https://www.linkedin.com/in/kabeerthockchom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 transition-all hover:scale-110 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={28} />
                </a>
              </div>
              <HeaderSpotifyWidget track={track} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
