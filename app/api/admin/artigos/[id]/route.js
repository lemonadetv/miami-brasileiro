// app/api/admin/artigos/[id]/route.js
import { NextResponse } from 'next/server'
import { getAllArticles } from '../../../../../lib/articles'
import { saveFileToGitHub } from '../../../../../lib/github'
import { getSessionToken } from '../../../../../lib/auth'
import { cookies } from 'next/headers'

function checkAuth() {
  const c = cookies().get('admin_session')
  return c?.value === getSessionToken()
}

export async function GET(request, { params }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const articles = getAllArticles()
  const article = articles.find(a => a.id === params.id)
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(request, { params }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const articles = getAllArticles()
  const idx = articles.findIndex(a => a.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (body.featured) articles.forEach(a => { a.featured = false })

  articles[idx] = { ...articles[idx], ...body, id: params.id }

  try {
    await saveFileToGitHub('data/articles.json', articles, `[ADMIN] Edita artigo: ${body.title?.slice(0,50) || params.id}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const articles = getAllArticles()
  const filtered = articles.filter(a => a.id !== params.id)

  try {
    await saveFileToGitHub('data/articles.json', filtered, `[ADMIN] Remove artigo: ${params.id}`)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
