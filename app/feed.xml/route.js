import { NextResponse } from 'next/server'
import articles from '../../data/articles.json'

const BASE = 'https://miami-brasileiro.vercel.app'

export async function GET() {
  const latest = articles.slice(0, 20)

  const items = latest.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${BASE}/artigo/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/artigo/${a.slug}</guid>
      <description><![CDATA[${a.excerpt || ''}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${a.category}]]></category>
      ${a.imageUrl ? `<enclosure url="${a.imageUrl}" type="image/jpeg" length="0"/>` : ''}
      <author>redacao@miami-brasileiro.vercel.app (${a.source || a.author || 'Redação Miami Brasileira'})</author>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Miami Brasileira</title>
    <link>${BASE}</link>
    <description>Portal de notícias em português para brasileiros que vivem em Miami e na Flórida.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE}/og-image.jpg</url>
      <title>Miami Brasileira</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
