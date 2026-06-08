import { NextResponse } from 'next/server'

export const maxDuration = 60

async function postOne(article, PAGE_ID, PAGE_TOKEN, siteUrl) {
  try {
    const articleUrl = siteUrl + '/artigo/' + article.slug
    const excerpt = article.excerpt ? article.excerpt.slice(0, 220) + '...' : ''
    const caption = '\uD83D\uDCF0 ' + article.title + '\n\n' + excerpt + '\n\n\uD83D\uDC49 Leia mais: ' + articleUrl

    const imageUrl = article.image || null
    let endpoint, body

    if (imageUrl) {
      endpoint = 'https://graph.facebook.com/v19.0/' + PAGE_ID + '/photos'
      body = { url: imageUrl, caption: caption, access_token: PAGE_TOKEN }
    } else {
      endpoint = 'https://graph.facebook.com/v19.0/' + PAGE_ID + '/feed'
      body = { message: caption, link: articleUrl, access_token: PAGE_TOKEN }
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return { slug: article.slug, title: article.title, success: !data.error, post_id: data.id || null, error: data.error || null }
  } catch (err) {
    return { slug: article.slug, success: false, error: err.message }
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    if (body.secret !== (process.env.BATCH_SECRET || 'miami2024')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const PAGE_ID = process.env.FACEBOOK_PAGE_ID
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN
    const siteUrl = 'https://miamibrasileira.com'

    if (!PAGE_ID || !PAGE_TOKEN) {
      return NextResponse.json({ error: 'Facebook nao configurado' }, { status: 500 })
    }

    const ghRes = await fetch(
      'https://raw.githubusercontent.com/lemonadetv/miami-brasileiro/main/data/articles.json',
      { cache: 'no-store' }
    )
    const articles = await ghRes.json()

    const BATCH_SIZE = 5
    const results = []
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE)
      const batchResults = await Promise.all(batch.map(a => postOne(a, PAGE_ID, PAGE_TOKEN, siteUrl)))
      results.push(...batchResults)
    }

    const successCount = results.filter(r => r.success).length
    return NextResponse.json({
      total: articles.length,
      success: successCount,
      failed: articles.length - successCount,
      results
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
