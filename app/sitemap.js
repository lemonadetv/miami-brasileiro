import articles from '../data/articles.json'

export default function sitemap() {
  const base = 'https://miami-brasileiro.vercel.app'

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/copa-2026`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/privacidade`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/morando-em-miami`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  const categoryPages = [
    'comunidade',
    'imigracao',
    'negocios',
    'saude',
    'esportes',
    'cultura-e-lazer',
  ].map((slug) => ({
    url: `${base}/categoria/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const seen = new Set()
  const articlePages = articles
    .filter((a) => {
      const id = a.slug || a.id
      if (!id || seen.has(id)) return false
      seen.add(id)
      return true
    })
    .map((a) => ({
      url: `${base}/artigo/${a.slug || a.id}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...staticPages, ...categoryPages, ...articlePages]
}
