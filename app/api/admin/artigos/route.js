// app/api/admin/artigos/route.js
import { NextResponse } from 'next/server'
import { getAllArticles, generateSlug } from '../../../../lib/articles'
import { saveFileToGitHub } from '../../../../lib/github'
import { getSessionToken } from '../../../../lib/auth'
import { cookies } from 'next/headers'

function checkAuth() {
  const c = cookies().get('admin_session')
  return c?.value === getSessionToken()
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const articles = getAllArticles()
  return NextResponse.json(articles)
}

export async function POST(request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const articles = getAllArticles()

  const slug = generateSlug(body.title) + '-' + Date.now().toString(36)
  const newArticle = {
    id: slug,
    title: body.title,
    excerpt: body.excerpt || '',
    content: body.content || '',
    category: body.category || 'Comunidade',
    publishedAt: new Date().toISOString(),
    image: body.image || '',
    source: body.source || 'Redacao',
    sourceUrl: body.sourceUrl || '#',
    featured: body.featured || false
  }

  // If featured, unfeature others
  if (newArticle.featured) {
    articles.forEach(a => { a.featured = false })
  }

  const updated = [newArticle, ...articles]

  try {
    await saveFileToGitHub('data/articles.json', updated, `[ADMIN] Adiciona artigo: ${body.title.slice(0,50)}`)
    return NextResponse.json({ ok: true, id: slug })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
