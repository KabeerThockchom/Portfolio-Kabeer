import type { Metadata } from 'next'
import Portfolio from './portfolio'
import { WEBSITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  alternates: { canonical: WEBSITE_URL },
  openGraph: { url: WEBSITE_URL },
}

export default function Page() {
  return <Portfolio />
}
