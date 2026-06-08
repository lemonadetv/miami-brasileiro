// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community news 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants', category: 'Saude' },
  { query: 'soccer brazil inter miami mls 2026', category: 'Esportes' },
]

// Pools per category so bot never reuses same image
const IMAGE_POOLS = {
  Comunidade: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=70',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=70',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=70',
  ],
  Imigracao: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=70',
    'https://images.unsplash.com/photo-1589456506629-345e9e5edc7d?w=800&q=70',
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=70',
  ],
  Negocios: [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=70',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=70',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=70',
  ],
  Saude: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=70',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=70',
  ],
  Esportes: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=70',
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=70',
    'https://images.unsplash.com/photo-1614680376408-16afefa3332b?w=800&q=70',
  ],
}

function pickImage(category, usedImages) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.Comunidade
  const available = pool.filter(img => !usedImages.has(img))
  const src = available.length > 0 ? available[0] : pool[Math.floor(Math.random() * pool.length)]
  return src
}

const LINKS_UTEIS = {
  Comunidade: '\n[City of Miami](https://www.miamigov.com) - Servicos municipais\n[Miami-Dade County](https://www.miamidade.gov) - Servicos do condado\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Apoio consular',
  Imigracao:  '\n[USCIS](https://www.uscis.gov) - Servicos de imigracao\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Documentos e apostilas',
  Negocios:   '\n[Sunbiz - Empresa na Florida](https://dos.fl.gov/sunbiz) - Registre sua LLC\n[SBA](https://www.sba.gov) - Suporte federal para PMEs',
  Saude:      '\n[Healthcare.gov](https://www.healthcare.gov) - Compare planos de saude\n[Florida Medicaid](https://www.myflorida.com/apps/medicaid) - Saude para baixa renda',
  Esportes:   '\n[Inter Miami CF](https://www.intermiamicf.com) - Futebol em Miami\n[Copa do Mundo 2026](https://www.fifa.com) - Informacoes do Mundial',
}

function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 60)
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
  const prompt = `Voce e jornalista brasileira que escreve para Miami Brasileira, portal para brasileiros em Miami.

NOTICIA: ${article.title} - ${article.description || ''}

Escreva artigo em PORTUGUES BRASILEIRO:
- Tom acolhedor, como conversa com amigo bem informado
- Use **negrito** para termos importantes
- Use ### para subtitulos
- Minimo 400 palavras

Termine com:
### Links Uteis
${links}

Responda APENAS com JSON:
{"titulo":"...","resumo":"2 frases","conteudo":"artigo em markdown"}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
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

async function loadExistingArticles(token, repo) {
  try {
    const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' } })
    if (!r.ok) return { articles: [], sha: null }
    const data = await r.json()
    const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
    return { articles: Array.isArray(content) ? content : [], sha: data.sha }
  } catch(e) {
    console.error('[ERR] loadExisting:', e.message)
    return { articles: [], sha: null }
  }
}

async function saveToGitHub(articles, sha, token, repo) {
  const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'
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

export async function GET(request) {
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  const { searchParams } = new URL(request.url)
  if (!isVercelCron && process.env.CRON_SECRET && searchParams.get('secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'

  console.log('[BOT] Start at ' + new Date().toISOString())

  // Load existing articles to avoid replacing them
  const { articles: existing, sha } = await loadExistingArticles(token, repo)
  const usedImages = new Set(existing.map(a => a.image).filter(Boolean))
  console.log('[BOT] Existing articles: ' + existing.length)

  const newArticles = []

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    console.log('[API] ' + q.category)
    const raws = await fetchNews(q.query)

    for (let j = 0; j < Math.min(raws.length, 1); j++) {
      const raw = raws[j]
      if (!raw.title || raw.title === '[Removed]') continue

      console.log('[WRITE] ' + raw.title.slice(0, 50))
      const result = await rewrite(raw, q.category)
      if (!result) continue

      const image = (raw.urlToImage && raw.urlToImage.startsWith('http') && !usedImages.has(raw.urlToImage))
        ? raw.urlToImage
        : pickImage(q.category, usedImages)

      const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
      const article = {
        id: slug, slug,
        title: result.titulo || raw.title,
        excerpt: result.resumo || raw.description || '',
        content: result.conteudo || '',
        category: q.category,
        image,
        source: raw.source?.name || 'Agencias',
        sourceUrl: raw.url || '',
        publishedAt: raw.publishedAt || new Date().toISOString(),
        featured: false
      }
      newArticles.push(article)
      usedImages.add(image)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  if (newArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo gerado' }, { status: 500 })
  }

  newArticles[0].featured = true

  // MERGE: new articles first, keep existing up to 60 total
  const merged = [...newArticles, ...existing].slice(0, 60)

  try {
    await saveToGitHub(merged, sha, token, repo)
    console.log('[OK] Saved ' + merged.length + ' articles (' + newArticles.length + ' new)')
    return Response.json({ success: true, new: newArticles.length, total: merged.length })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
