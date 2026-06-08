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
  Comunidade: '\n\n[City of Miami](https://www.miamigov.com) - Servicos municipais\n\n[Miami-Dade County](https://www.miamidade.gov) - Servicos do condado\n\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Apoio consular',
  Imigracao:  '\n\n[USCIS](https://www.uscis.gov) - Servicos de imigracao\n\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Documentos e apostilas\n\n[AILA - Advogados de Imigracao](https://www.aila.org) - Encontre um especialista',
  Negocios:   '\n\n[Sunbiz - Empresa na Florida](https://dos.fl.gov/sunbiz) - Registre sua LLC\n\n[SBA](https://www.sba.gov) - Suporte federal para PMEs\n\n[SCORE Miami](https://miami.score.org) - Mentoria gratuita',
  Saude:      '\n\n[Healthcare.gov](https://www.healthcare.gov) - Compare planos de saude\n\n[Florida Medicaid](https://www.myflorida.com/apps/medicaid) - Saude para baixa renda\n\n[Jackson Health](https://jacksonhealth.org) - Hospital publico de Miami',
  Esportes:   '\n\n[Inter Miami CF](https://www.intermiamicf.com) - Futebol em Miami\n\n[Copa do Mundo 2026 Miami](https://www.fifa.com) - Informacoes do Mundial\n\n[Miami Heat](https://www.nba.com/heat) - NBA em Miami',
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

async function loadExistingArticles(token, repo) {
  try {
    const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'
    const r = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' }
    })
    if (!r.ok) return { articles: [], sha: null }
    const data = await r.json()
    const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
    return { articles: Array.isArray(content) ? content : [], sha: data.sha }
  } catch(e) {
    console.error('[ERR] loadExisting:', e.message)
    return { articles: [], sha: null }
  }
}

async function rewrite(article, category) {
  const links = LINKS_UTEIS[category] || ''
  const prompt = `Voce e jornalista brasileira que escreve para o portal Miami Brasileira, voltado para brasileiros em Miami.

NOTICIA (ingles):
Titulo: ${article.title}
Descricao: ${article.description || ''}

Escreva um artigo em PORTUGUES BRASILEIRO com estas regras:

ESTILO:
- Comece com uma situacao real que o leitor vai se identificar ("Imagine a cena...", "Voce ja passou por...")
- Tom direto e acolhedor, como conversa com um amigo que entende do assunto
- Frases curtas. Paragrafos de no maximo 3 linhas
- Use **negrito** para termos importantes e valores em dolares
- Use ### para subtitulos e - para listas quando necessario
- Explique termos em ingles quando aparecerem
- Minimo 500 palavras

PROIBIDO:
- Traco longo ou em dash: — (substitua por virgula, dois pontos ou ponto final)
- "Alem disso", "Vale destacar que", "E importante ressaltar", "Neste contexto", "Tendo em vista", "Cabe mencionar", "De acordo com especialistas"
- Tom formal ou academico
- Palavras repetidas no mesmo paragrafo

Termine com:

### Links Uteis
${links}

Responda APENAS com JSON:
{"titulo":"...","resumo":"2-3 frases sobre o que e e por que importa para brasileiros em Miami","conteudo":"artigo completo em markdown"}`

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

  // Load existing articles and track used images
  const { articles: existing, sha } = await loadExistingArticles(token, repo)
  const usedImages = new Set(existing.map(function(a) { return a.image }).filter(Boolean))

  const newArticles = []

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    console.log('[API] ' + q.category)
    const raws = await fetchNews(q.query)

    // Process just 1 article per category for speed
    for (let j = 0; j < Math.min(raws.length, 1); j++) {
      const raw = raws[j]
      if (!raw.title || raw.title === '[Removed]') continue

      // Skip if we already have this source URL
      const alreadyHave = existing.some(function(a) { return a.sourceUrl === raw.url })
      if (alreadyHave) {
        console.log('[SKIP] Already have: ' + raw.title.slice(0, 50))
        continue
      }

      console.log('[WRITE] ' + raw.title.slice(0, 50))
      const result = await rewrite(raw, q.category)
      if (!result) continue

      // Pick image: prefer article image if not already used
      let image = FALLBACK_IMAGES[q.category]
      if (raw.urlToImage && !usedImages.has(raw.urlToImage)) {
        image = raw.urlToImage
        usedImages.add(raw.urlToImage)
      }

      const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
      newArticles.push({
        id: slug,
        slug,
        title: result.titulo || raw.title,
        excerpt: result.resumo || raw.description || '',
        content: result.conteudo || '',
        category: q.category,
        image: image,
        source: raw.source?.name || 'Agencias',
        sourceUrl: raw.url || '',
        publishedAt: new Date().toISOString(),
        featured: false
      })
      await new Promise(function(r) { setTimeout(r, 500) })
    }
  }

  if (newArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo novo gerado' })
  }

  // Mark first new as featured
  newArticles[0].featured = true

  // Merge: new articles first, keep max 60
  const merged = [...newArticles, ...existing].slice(0, 60)

  try {
    await saveToGitHub(merged, sha, token, repo)
    console.log('[OK] Saved ' + newArticles.length + ' new + ' + existing.length + ' existing = ' + merged.length + ' total')
    return Response.json({
      success: true,
      new: newArticles.length,
      total: merged.length,
      articles: newArticles.map(function(a) { return a.slug })
    })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
