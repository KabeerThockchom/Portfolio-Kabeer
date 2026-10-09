import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { LAST_UPDATED } from './data'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: WEBSITE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${WEBSITE_URL}/blog/exploring-the-intersection-of-design-ai-and-design-engineering`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
