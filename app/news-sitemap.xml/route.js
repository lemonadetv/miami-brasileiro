import { NextResponse } from 'next/server'
import articles from '../../../data/articles.json'

const BASE = 'https://miami-brasileiro.vercel.app'

export async function GET() {
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  // Get articles from last 2 days (or last 10 if none are that recent)
  let recent = articles.filter(a => new Date(a.publishedAt) >= twoDaysAgo)
  if (recent.length === 0) recent = articles.slice(0, 10)

  const urls = recent.map(a => `
  <url>
    <loc>${BASE}/artigo/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Miami Brasileira</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title><![CDATA[${a.title}]]></news:title>
    </news:news>
    ${a.imageUrl ? `<image:image><image:loc>${a.imageUrl}</image:loc></image:image>` : ''}
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
