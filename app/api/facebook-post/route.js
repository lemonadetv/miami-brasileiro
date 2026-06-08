import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { article } = await request.json()
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN
    if (!PAGE_ID || !PAGE_TOKEN) {
      return NextResponse.json({ error: 'Facebook nao configurado' }, { status: 500 })
    }
    const siteUrl = 'https://miamibrasileira.com'
    const articleUrl = siteUrl + '/artigo/' + article.slug
    const excerpt = article.excerpt ? article.excerpt.slice(0, 220) + '...' : ''
    const message = '📰 ' + article.title + '\n\n' + excerpt + '\n\n👉 Leia mais: ' + articleUrl
    const res = await fetch('https://graph.facebook.com/v19.0/' + PAGE_ID + '/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, link: articleUrl, access_token: PAGE_TOKEN })
    })
    const data = await res.json()
    if (data.error) return NextResponse.json({ error: data.error }, { status: 400 })
    return NextResponse.json({ success: true, post_id: data.id })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
      }
