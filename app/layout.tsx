import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Header } from './header'
import { Footer } from './footer'
import { WEBSITE_URL } from '@/lib/constants'
import './globals.css'

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  title: {
    default: 'Kabeer Thockchom — AI & Data Architecture',
    template: '%s | Kabeer Thockchom',
  },
  description:
    'Kabeer Thockchom builds practical AI and data systems in Field Engineering at Databricks. Selected projects, technical writing, and experience.',
  openGraph: {
    type: 'website',
    siteName: 'Kabeer Thockchom',
    title: 'Kabeer Thockchom — AI systems for the real world',
    description:
      'Selected work in AI architecture, agent systems, and data platforms.',
    images: [{ url: '/kabeer.png', alt: 'Kabeer Thockchom' }],
  },
  twitter: {
    card: 'summary',
    title: 'Kabeer Thockchom — AI & Data Architecture',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <ThemeProvider
          enableSystem
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <div className="site-shell">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
