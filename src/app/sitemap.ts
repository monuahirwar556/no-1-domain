import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://no1domain.in'
  const currentDate = new Date().toISOString()

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/listings', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/rules', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' as const },
  ]

  return routes.map((r) => ({
    url: r.path ? `${baseUrl}${r.path}` : `${baseUrl}/`,
    lastModified: currentDate,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
