'use client'
import { Monitor, Moon, Sun, ArrowUpRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Footer() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <footer className="site-footer">
      <div>
        <a className="footer-name" href="/">
          Kabeer Thockchom
        </a>
        <p>AI & Data Architecture · San Francisco</p>
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/KabeerThockchom"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ArrowUpRight size={12} />
        </a>
        <a
          href="https://www.linkedin.com/in/kabeerthockchom"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
          <ArrowUpRight size={12} />
        </a>
        <a href="#main">Back to top ↑</a>
      </div>
      <div className="theme-options" role="group" aria-label="Color theme">
        {mounted &&
          [
            { id: 'light', label: 'Light', Icon: Sun },
            { id: 'dark', label: 'Dark', Icon: Moon },
            { id: 'system', label: 'System', Icon: Monitor },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={`Switch to ${label} theme`}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
            >
              <Icon size={15} />
            </button>
          ))}
      </div>
      <p className="footer-note">
        © {new Date().getFullYear()} Kabeer Thockchom. Personal site. Views are
        my own.
      </p>
    </footer>
  )
}
