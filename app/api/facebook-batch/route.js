import { NextResponse } from 'next/server'

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

    const results = []

    for (const article of articles) {
      try {
        const articleUrl = siteUrl + '/artigo/' + article.slug
        const excerpt = article.excerpt ? article.excerpt.slice(0, 220) + '...' : ''
        const message = '\uD83D\uDCF0 ' + article.title + '\n\n' + excerpt + '\n\n\uD83D\uDC49 Leia mais: ' + articleUrl

        const res = await fetch('https://graph.facebook.com/v19.0/' + PAGE_ID + '/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, link: articleUrl, access_token: PAGE_TOKEN })
        })

        const data = await res.json()
        results.push({
          slug: article.slug,
          title: article.title,
          success: !data.error,
          post_id: data.id || null,
          error: data.error || null
        })

        await new Promise(r => setTimeout(r, 2000))

      } catch (err) {
        results.push({ slug: article.slug, success: false, error: err.message })
      }
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
