'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import { SOCIAL_LINKS } from './data'
import { GithubIcon, LinkedinIcon } from 'lucide-react'

export function Header() {
  return (
    <header className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-full border-2 border-zinc-200 transition-all duration-300 hover:scale-110 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500">
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
          <Link href="/" className="font-medium text-black dark:text-white">
            Kabeer Thockchom
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            AI & Data Consultant
          </TextEffect>
          <div className="mt-3 flex space-x-3">
            <a 
              href="https://github.com/KabeerThockchom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
              aria-label="GitHub"
            >
              <GithubIcon size={22} />
            </a>
            <a 
              href="https://www.linkedin.com/in/kabeerthockchom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={22} />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
