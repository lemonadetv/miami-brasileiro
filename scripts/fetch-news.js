// scripts/fetch-news.js
// Bot de noticias para Miami Brasileiro
// Roda via GitHub Actions 2x/dia

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')
const https = require('https')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const NEWS_API_KEY = process.env.NEWS_API_KEY
const FB_TOKEN = process.env.FACEBOOK_PAGE_TOKEN
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID

const QUERIES = [
  { query: 'brazil miami florida community immigration 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida miami 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants brazil 2026', category: 'Saude' },
  { query: 'soccer brazil inter miami sports 2026', category: 'Esportes' },
  { query: 'miami culture leisure restaurants events brazil 2026', category: 'Cultura e Lazer' },
]

const CATEGORY_IMAGES = {
  'Comunidade': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800',
  'Imigracao': 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800',
  'Negocios': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
  'Saude': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  'Esportes': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  'Cultura e Lazer': 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800',
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

function postJson(hostname, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data)
    const options = {
      hostname, path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }
    const req = https.request(options, (res) => {
      let d = ''
      res.on('data', chunk => d += chunk)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch(e) { resolve(d) } })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function fetchNews(query) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
  const data = await fetchJson(url)
  if (!data.articles || data.articles.length === 0) return null
  return data.articles[0]
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[Ì-Í¯]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .substring(0, 80)
}

async function rewrite(article, category) {
  const prompt = `Voce e um jornalista brasileiro especializado na comunidade brasileira em Miami e Sul da Florida.

Reescreva o artigo abaixo em portugues brasileiro, adaptando o conteudo para ser relevante para brasileiros morando nos EUA.
O artigo deve ser informativo, engajante e profissional.

Artigo original:
Titulo: ${article.title}
Conteudo: ${article.description || article.content || ''}

Responda APENAS com JSON valido neste formato exato:
{
  "title": "titulo em portugues (max 80 chars)",
  "excerpt": "resumo de 1-2 frases em portugues (max 200 chars)",
  "content": "artigo completo em markdown com 3-4 paragrafos"
}`

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')
  return JSON.parse(jsonMatch[0])
}

async function postToFacebook(article) {
  if (!FB_TOKEN || !FB_PAGE_ID) {
    console.log('Facebook: sem credenciais, pulando')
    return
  }
  const message = `${article.title}\n\n${article.excerpt}\n\nLeia mais: https://miamibrasileiro.com/artigo/${article.slug}`
  const result = await postJson('graph.facebook.com', `/v19.0/${FB_PAGE_ID}/feed`, {
    message,
    access_token: FB_TOKEN
  })
  console.log('Facebook post:', result)
}

async function main() {
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
  let articles = []
  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'))
  } catch (e) {
    console.log('articles.json nao encontrado, criando novo')
  }

  const existingSlugs = new Set(articles.map(a => a.slug))
  const newArticles = []

  for (const { query, category } of QUERIES) {
    try {
      console.log(`Buscando: ${category}...`)
      const raw = await fetchNews(query)
      if (!raw) { console.log(`  Sem resultados para ${category}`); continue }

      const rewritten = await rewrite(raw, category)
      const slug = slugify(rewritten.title) + '-' + Date.now()

      if (existingSlugs.has(slug)) { console.log(`  Duplicado: ${slug}`); continue }

      const article = {
        id: slug,
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        content: rewritten.content,
        category,
        image: raw.urlToImage || CATEGORY_IMAGES[category],
        source: raw.source?.name || 'Redacao',
        sourceUrl: raw.url || '',
        publishedAt: new Date().toISOString(),
        featured: false
      }

      newArticles.push(article)
      console.log(`  OK: ${article.title}`)

      await postToFacebook(article)

    } catch (e) {
      console.error(`  Erro em ${category}:`, e.message)
    }
  }

  if (newArticles.length > 0) {
    const updated = [...newArticles, ...articles].slice(0, 100)
    fs.writeFileSync(articlesPath, JSON.stringify(updated, null, 2))
    console.log(`\nSalvo: ${newArticles.length} novos artigos`)
  } else {
    console.log('\nNenhum artigo novo encontrado')
  }
}

main().catch(console.error)
