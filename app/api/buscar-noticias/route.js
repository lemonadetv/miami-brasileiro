// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community news 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants', category: 'Saude' },
  { query: 'soccer brazil copa mundo inter miami sports', category: 'Esportes' },
]

const FALLBACK_IMAGES = {
  Comunidade: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Imigracao:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  Negocios:   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  Saude:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  Esportes:   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
}

const LINKS_UTEIS = {
  Comunidade: '\n[City of Miami](https://www.miamigov.com) - Servicos municipais\n[Miami-Dade County](https://www.miamidade.gov) - Servicos do condado\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Apoio consular',
  Imigracao:  '\n[USCIS](https://www.uscis.gov) - Servicos de imigracao\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Documentos e apostilas\n[AILA - Advogados de Imigracao](https://www.aila.org) - Encontre um especialista',
  Negocios:   '\n[Sunbiz - Empresa na Florida](https://dos.fl.gov/sunbiz) - Registre sua LLC\n[SBA](https://www.sba.gov) - Suporte federal para PMEs\n[SCORE Miami](https://miami.score.org) - Mentoria gratuita',
  Saude:      '\n[Healthcare.gov](https://www.healthcare.gov) - Compare planos de saude\n[Florida Medicaid](https://www.myflorida.com/apps/medicaid) - Saude para baixa renda\n[Jackson Health](https://jacksonhealth.org) - Hospital publico de Miami',
  Esportes:   '\n[Inter Miami CF](https://www.intermiamicf.com) - Futebol em Miami\n[Copa do Mundo 2026 Miami](https://www.fifa.com) - Informacoes do Mundial\n[Miami Heat](https://www.nba.com/heat) - NBA em Miami',
}

function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 80)
}

async function fetchNews(query) {
  try {
    const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(query) +
      '&language=en&sortBy=publishedAt&pageSize=3&apiKey=' + process.env.NEWS_API_KEY
    const r = await fetch(url)
    const d = await r.json()
    return d.articles || []
  } catch(e) {
    console.error('[ERR] NewsAPI:', e.message)
    return []
  }
}

async function rewrite(article, category) {
  const links = LINKS_UTEIS[category] || ''
  const prompt = `Voce e jornalista brasileira que escreve para o portal Miami Brasileira, voltado para brasileiros em Miami.

NOTICIA (ingles):
Titulo: ${article.title}
Descricao: ${article.description || ''}

Escreva um artigo em PORTUGUES BRASILEIRO seguindo EXATAMENTE este estilo:
- Comece com um cenario real que o leitor vai se identificar ("Imagine a cena...", "Voce ja passou por...")
- Tom acolhedor e direto, como conversa com amigo bem informado
- Use **negrito** para termos importantes e valores em dolares
- Use ### para subtitulos e - para listas
- Explique termos em ingles sempre que aparecerem
- Minimo 500 palavras
- Termine com:

### Links e Recursos Uteis
${links}

Responda APENAS com JSON:
{"titulo":"...","resumo":"2-3 frases sobre o que e e por que importa","conteudo":"artigo completo em markdown"}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })
    const text = msg.content[0].text.trim()
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON')
    return JSON.parse(match[0])
  } catch(e) {
    console.error('[ERR] Claude:', e.message)
    return null
  }
}

async function saveToGitHub(articles) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
  const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'

  let sha = null
  try {
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' } })
    if (r.ok) sha = (await r.json()).sha
  } catch(e) {}

  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64')
  const body = { message: '[BOT] Atualizacao automatica ' + new Date().toISOString(), content }
  if (sha) body.sha = sha

  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) {
    const err = await r.json()
    throw new Error('GitHub save failed: ' + JSON.stringify(err))
  }
  return true
}

async function postToFacebook(article) {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN
    if (!PAGE_ID || !PAGE_TOKEN) return null
    const siteUrl = 'https://miami-brasileiro.vercel.app'
    const articleUrl = siteUrl + '/artigo/' + article.id
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
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (data.error) { console.error('[FB ERR]', article.slug, data.error.message); return null }
    console.log('[FB OK]', article.slug, '->', data.id)
    return data.id
  } catch(e) { console.error('[FB ERR]', article.slug, e.message); return null }
}

export async function GET(request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const { searchParams } = new URL(request.url)
  if (!isVercelCron && process.env.CRON_SECRET && searchParams.get('secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[BOT] Start at ' + new Date().toISOString())
  const newArticles = []

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    console.log('[API] ' + q.category)
    const raws = await fetchNews(q.query)
    
    // Process just 1 article per category for speed
    for (let j = 0; j < Math.min(raws.length, 1); j++) {
      const raw = raws[j]
      if (!raw.title || raw.title === '[Removed]') continue

      console.log('[WRITE] ' + raw.title.slice(0, 50))
      const result = await rewrite(raw, q.category)
      if (!result) continue

      const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
      newArticles.push({
        id: slug,
        slug,
        title: result.titulo || raw.title,
        excerpt: result.resumo || raw.description || '',
        content: result.conteudo || '',
        category: q.category,
        image: raw.urlToImage || FALLBACK_IMAGES[q.category],
        source: raw.source?.name || 'Agencias',
        sourceUrl: raw.url || '',
        publishedAt: raw.publishedAt || new Date().toISOString(),
        featured: false
      })
      await new Promise(r => setTimeout(r, 500))
    }
  }

  if (newArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo gerado' }, { status: 500 })
  }

  // Mark first as featured
  newArticles[0].featured = true

  try {
    await saveToGitHub(newArticles)
    console.log('[OK] Saved ' + newArticles.length + ' articles')

    // Post each new article to Facebook
    for (const article of newArticles) {
      await postToFacebook(article)
      await new Promise(r => setTimeout(r, 3000))
    }

    return Response.json({ success: true, count: newArticles.length, articles: newArticles.map(a => a.slug) })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
      }
