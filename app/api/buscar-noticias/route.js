// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community news 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida miami 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants 2026', category: 'Saude' },
  { query: 'soccer brazil copa mundo inter miami sports 2026', category: 'Esportes' },
  { query: 'miami culture leisure restaurants events brazilian community 2026', category: 'Cultura e Lazer' },
]

const FALLBACK_IMAGES = {
  Comunidade:       'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Imigracao:        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  Negocios:         'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  Saude:            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  Esportes:         'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
  'Cultura e Lazer':'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=70',
}

const INLINE_IMAGES = {
  Comunidade:       'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Imigracao:        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=70',
  Negocios:         'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=70',
  Saude:            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=70',
  Esportes:         'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
  'Cultura e Lazer':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=70',
}

const LINKS_UTEIS = {
  Comunidade:       '\n[City of Miami](https://www.miamigov.com) - Servicos municipais\n[Miami-Dade County](https://www.miamidade.gov) - Servicos do condado\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Apoio consular',
  Imigracao:        '\n[USCIS](https://www.uscis.gov) - Servicos de imigracao\n[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Documentos e apostilas\n[AILA - Advogados de Imigracao](https://www.aila.org) - Encontre um especialista',
  Negocios:         '\n[Sunbiz - Empresa na Florida](https://dos.fl.gov/sunbiz) - Registre sua LLC\n[SBA](https://www.sba.gov) - Suporte federal para PMEs\n[SCORE Miami](https://miami.score.org) - Mentoria gratuita',
  Saude:            '\n[Healthcare.gov](https://www.healthcare.gov) - Compare planos de saude\n[Florida Medicaid](https://www.myflorida.com/apps/medicaid) - Saude para baixa renda\n[Jackson Health](https://jacksonhealth.org) - Hospital publico de Miami',
  Esportes:         '\n[Inter Miami CF](https://www.intermiamicf.com) - Futebol em Miami\n[Copa do Mundo 2026 Miami](https://www.fifa.com) - Informacoes do Mundial\n[Miami Heat](https://www.nba.com/heat) - NBA em Miami',
  'Cultura e Lazer':'\n[Visit Miami](https://www.miamiandbeaches.com) - Guia oficial de turismo\n[Eventbrite Miami](https://www.eventbrite.com/d/fl--miami/) - Eventos em Miami\n[Time Out Miami](https://www.timeout.com/miami) - O que fazer em Miami',
}

function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
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
  const inlineImg = INLINE_IMAGES[category] || FALLBACK_IMAGES[category] || ''
  const prompt = `Voce e jornalista brasileira que escreve para o portal Miami Brasileira, voltado para brasileiros em Miami.

NOTICIA (ingles):
Titulo: ${article.title}
Descricao: ${article.description || ''}

Escreva um artigo LONGO e RICO em PORTUGUES BRASILEIRO seguindo EXATAMENTE este formato:

1. ABERTURA: Comece com um cenario real que o leitor vai se identificar ("Imagine a cena...", "Voce ja passou por...")
2. Use ### com EMOJI para cada subtitulo. Ex: ### 🏠 O que e o Renters Insurance?
3. Use **negrito** para termos importantes, valores em dolares, nomes de lugares
4. Use listas numeradas (1. 2. 3.) e bullets (- ) onde apropriado
5. Insira UMA imagem inline no meio do artigo usando EXATAMENTE este formato:
   ![descricao relevante da imagem](${inlineImg})
6. Minimo 600 palavras
7. SEMPRE termine com esta secao EXATA:

### 🔗 Links e Recursos Uteis
${links}

IMPORTANTE: Use emojis nos titulos das secoes. O artigo deve parecer profissional, acolhedor e util para quem vive em Miami.

Responda APENAS com JSON valido:
{"titulo":"...","resumo":"2-3 frases sobre o que e e por que importa para brasileiros em Miami","conteudo":"artigo completo em markdown com headers emoji, bold, lista, imagem inline e links"}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
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

async function getExistingArticles() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
  const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'
  try {
    const r = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' }
    })
    if (!r.ok) return []
    const data = await r.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return JSON.parse(content)
  } catch(e) {
    console.error('[ERR] getExisting:', e.message)
    return []
  }
}

async function saveToGitHub(newArticles) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
  const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'

  // Get current SHA and existing articles
  let sha = null
  let existing = []
  try {
    const r = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' }
    })
    if (r.ok) {
      const data = await r.json()
      sha = data.sha
      const raw = Buffer.from(data.content, 'base64').toString('utf-8')
      existing = JSON.parse(raw)
    }
  } catch(e) {
    console.error('[WARN] Could not fetch existing articles:', e.message)
  }

  // Merge: new articles first, then existing (excluding duplicates by id)
  const existingIds = new Set(newArticles.map(a => a.id))
  const merged = [
    ...newArticles,
    ...existing.filter(a => !existingIds.has(a.id))
  ].slice(0, 300) // keep max 300 articles

  const content = Buffer.from(JSON.stringify(merged, null, 2)).toString('base64')
  const body = {
    message: '[BOT] Atualizacao automatica ' + new Date().toISOString(),
    content
  }
  if (sha) body.sha = sha

  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!r.ok) {
    const err = await r.json()
    throw new Error('GitHub save failed: ' + JSON.stringify(err))
  }
  return merged.length
}

async function postToFacebook(article) {
  const token = process.env.FB_ACCESS_TOKEN
  const pageId = process.env.FB_PAGE_ID
  if (!token || !pageId) return false
  try {
    const msg = article.title + '\n\n' + (article.excerpt || '') +
      '\n\nLeia mais: https://miami-brasileiro.vercel.app/artigo/' + article.id
    const r = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, access_token: token })
    })
    return r.ok
  } catch(e) {
    console.error('[ERR] Facebook:', e.message)
    return false
  }
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

    // Process 1 article per category for speed
    for (let j = 0; j < Math.min(raws.length, 1); j++) {
      const raw = raws[j]
      if (!raw.title || raw.title === '[Removed]') continue

      console.log('[WRITE] ' + raw.title.slice(0, 50))
      const result = await rewrite(raw, q.category)
      if (!result) continue

      const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
      const article = {
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
      }
      newArticles.push(article)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  if (newArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo gerado' }, { status: 500 })
  }

  // Mark first as featured
  newArticles[0].featured = true

  // Post to Facebook (best effort)
  let fbPosted = 0
  for (const article of newArticles) {
    const ok = await postToFacebook(article)
    if (ok) fbPosted++
    await new Promise(r => setTimeout(r, 300))
  }

  try {
    const totalSaved = await saveToGitHub(newArticles)
    console.log('[OK] Saved ' + newArticles.length + ' new + ' + (totalSaved - newArticles.length) + ' existing = ' + totalSaved + ' total')
    return Response.json({
      success: true,
      new: newArticles.length,
      total: totalSaved,
      facebook: fbPosted,
      articles: newArticles.map(a => a.slug)
    })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
