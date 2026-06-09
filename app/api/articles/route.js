// app/api/articles/route.js - Public endpoint for ticker
import { NextResponse } from 'next/server'
import { getAllArticles } from '../../../lib/articles'

export async function GET() {
  try {
    var articles = getAllArticles().slice(0, 10)
    return NextResponse.json(articles.map(function(a) {
      return { id: a.id, title: a.title, category: a.category }
      }))
    } catch(e) {
    return NextResponse.json([], { status: 500 })
    }
  }
