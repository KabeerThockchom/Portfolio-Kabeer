import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import Image from 'next/image'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Kabeer Thockchom - Field Engineering @ Databricks',
  description:
    'Part of the Field Engineering team at Databricks, building multi-agent platforms, LLM-powered demos, and RAG architectures for Fortune 500 retail, travel, and hospitality.',
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        {/* Ocean background image */}
        <div className="fixed inset-0 z-0 h-full w-full overflow-hidden">
          <Image
            src="/ocean-background.png"
            alt="Ocean Background"
            fill
            className="object-cover opacity-60"
            priority
            quality={100}
          />
        </div>

        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="relative z-10 flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-7xl flex-1 px-4 pt-10 sm:px-6 lg:px-8">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
