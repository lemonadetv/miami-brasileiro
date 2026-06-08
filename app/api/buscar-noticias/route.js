// app/api/buscar-noticias/route.js
// Bot de noticias automatico - roda 2x por dia via Vercel Cron
import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community immigrants 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida startup 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants 2026', category: 'Saude' },
  { query: 'soccer brazil copa mundo inter miami sports 2026', category: 'Esportes' },
]

// Pool grande de imagens Unsplash por categoria (sem repeticao)
const IMAGE_POOLS = {
  Comunidade: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=70',
    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=70',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=70',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=70',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=70',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=70',
    'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=70',
  ],
  Imigracao: [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
    'https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=800&q=70',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=70',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=70',
  ],
  Negocios: [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=70',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=70',
    'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=70',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=70',
    'https://images.unsplash.com/photo-1541873676-a18131494184?w=800&q=70',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=70',
  ],
  Saude: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=70',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=70',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=70',
  ],
  Esportes: [
    'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800&q=70',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=70',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=70',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=70',
  ],
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
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 80)
}

// Escolhe uma imagem do pool que nao esteja sendo usada
function pickImage(category, usedImages) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.Comunidade
  const available = pool.filter(img => !usedImages.has(img))
  if (available.length > 0) return available[Math.floor(Math.random() * available.length)]
  // Se todas ja foram usadas, usa uma aleatoria do pool mesmo
  return pool[Math.floor(Math.random() * pool.length)]
}

async function fetchNews(query) {
  try {
    const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(query) +
      '&language=en&sortBy=publishedAt&pageSize=5&apiKey=' + process.env.NEWS_API_KEY
    const r = await fetch(url)
    const d = await r.json()
    if (d.status === 'error') {
      console.error('[NewsAPI error]', d.message)
      return []
    }
    return (d.articles || []).filter(a => a.title && a.title !== '[Removed]' && a.description)
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
- Minimo 600 palavras
- Termine com:

### Links e Recursos Uteis
${links}

Responda APENAS com JSON valido:
{"titulo":"...","resumo":"2-3 frases sobre o que e e por que importa","conteudo":"artigo completo em markdown"}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })
    const text = msg.content[0].text.trim()
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON in response')
    return JSON.parse(match[0])
  } catch(e) {
    console.error('[ERR] Claude rewrite:', e.message)
    return null
  }
}

async function loadExistingArticles(token, repo) {
  try {
    const url = `https://api.github.com/repos/${repo}/contents/data/articles.json`
    const r = await fetch(url, { 
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' } 
    })
    if (!r.ok) return { articles: [], sha: null }
    const d = await r.json()
    const content = Buffer.from(d.content, 'base64').toString('utf-8')
    return { articles: JSON.parse(content), sha: d.sha }
  } catch(e) {
    console.error('[ERR] Load existing:', e.message)
    return { articles: [], sha: null }
  }
}

async function saveToGitHub(articles, sha, token, repo) {
  const url = `https://api.github.com/repos/${repo}/contents/data/articles.json`
  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64')
  const body = { 
    message: '[BOT] Auto-update ' + new Date().toISOString().slice(0,10) + ' - ' + articles.length + ' artigos', 
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
    throw new Error('GitHub save failed: ' + JSON.stringify(err).slice(0,200))
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

  // 1. Carrega artigos existentes
  const { articles: existing, sha } = await loadExistingArticles(token, repo)
  console.log(`[BOT] Loaded ${existing.length} existing articles, sha: ${sha?.slice(0,7)}`)

  // 2. Coleta imagens ja em uso para evitar repeticao
  const usedImages = new Set(existing.map(a => a.image))

  // 3. Gera novos artigos
  const newArticles = []

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    console.log(`[API] Searching: ${q.category}`)
    const raws = await fetchNews(q.query)
    
    if (raws.length === 0) {
      console.log(`[SKIP] No articles found for ${q.category}`)
      continue
    }

    // Tenta o primeiro artigo disponivel
    const raw = raws[0]
    console.log(`[WRITE] ${raw.title.slice(0, 50)}`)
    const result = await rewrite(raw, q.category)
    if (!result) { console.log(`[SKIP] Rewrite failed for ${q.category}`); continue }

    const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
    
    // Escolhe imagem unica (prefere urlToImage da noticia, senao usa pool)
    let image = pickImage(q.category, usedImages)
    if (raw.urlToImage && !usedImages.has(raw.urlToImage) && raw.urlToImage.startsWith('http')) {
      image = raw.urlToImage
    }
    usedImages.add(image)

    newArticles.push({
      id: slug,
      slug,
      title: result.titulo || raw.title,
      excerpt: result.resumo || raw.description || '',
      content: result.conteudo || '',
      category: q.category,
      image,
      source: raw.source?.name || 'Agencias',
      sourceUrl: raw.url || '',
      publishedAt: new Date().toISOString(),
      featured: false
    })

    await new Promise(r => setTimeout(r, 800))
  }

  if (newArticles.length === 0) {
    console.log('[BOT] No new articles generated')
    return Response.json({ success: false, message: 'Nenhum artigo novo gerado - verifique NEWS_API_KEY' })
  }

  // 4. Marca o primeiro novo como featured
  newArticles[0].featured = true
  // Desmarca featured dos existentes (opcional - mantem apenas 1 featured)
  const updatedExisting = existing.map(a => ({ ...a, featured: false }))

  // 5. MERGE: novos artigos primeiro, existentes depois (max 60 artigos total)
  const merged = [...newArticles, ...updatedExisting].slice(0, 60)

  // 6. Salva no GitHub
  try {
    await saveToGitHub(merged, sha, token, repo)
    console.log(`[OK] Saved ${merged.length} articles (${newArticles.length} new)`)
    return Response.json({ 
      success: true, 
      new: newArticles.length, 
      total: merged.length,
      articles: newArticles.map(a => a.slug)
    })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
