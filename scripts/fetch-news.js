// scripts/fetch-news.js
// Bot de noticias para Miami Brasileiro
// Roda via GitHub Actions 2x/dia
// Usa Google News RSS (gratuito, sem limite de quota)

const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')
const https = require('https')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FB_TOKEN = process.env.FACEBOOK_PAGE_TOKEN
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID

const QUERIES = [
  { query: 'brazilians miami florida community news', category: 'Comunidade' },
  { query: 'immigration visa green card brazil usa florida', category: 'Imigracao' },
  { query: 'business entrepreneurs brazil miami florida', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants', category: 'Saude' },
  { query: 'soccer brazil inter miami sports', category: 'Esportes' },
  { query: 'miami culture restaurants events florida', category: 'Cultura e Lazer' },
]

const CATEGORY_IMAGES = {
  'Comunidade': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800',
  'Imigracao': 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800',
  'Negocios': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
  'Saude': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  'Esportes': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  'Cultura e Lazer': 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800',
}

function fetchRSS(query) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(query)
    const reqOptions = {
      hostname: 'news.google.com',
      path: `/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsFetcher/1.0)' }
    }
    https.get(reqOptions, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location
        https.get(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          let data = ''
          res2.on('data', chunk => data += chunk)
          res2.on('end', () => resolve(parseRSS(data)))
        }).on('error', reject)
        return
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(parseRSS(data)))
    }).on('error', reject)
  })
}

function parseRSS(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const extract = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
      if (!m) return ''
      return m[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]*>/g, '')
        .trim()
    }
    const title = extract('title')
    const description = extract('description')
    const source = extract('source')
    if (title && !title.includes('<?xml')) {
      items.push({ title, description, source })
    }
  }
  return items.slice(0, 5)
}

function postJson(hostname, urlPath, bodyData) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyData)
    const options = {
      hostname,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }
    }
    const req = https.request(options, (res) => {
      let d = ''
      res.on('data', chunk => d += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(d)) } catch (e) { resolve(d) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    .substring(0, 80)
}

async function rewrite(article, category) {
  const prompt = `Voce e um jornalista brasileiro especializado na comunidade brasileira em Miami e Sul da Florida.\n\nReescreva o artigo abaixo em portugues brasileiro, adaptando o conteudo para ser relevante para brasileiros morando nos EUA.\nO artigo deve ser informativo, engajante e profissional.\n\nArtigo original:\nTitulo: ${article.title}\nConteudo: ${article.description || ''}\n\nResponda APENAS com JSON valido neste formato exato:\n{\n  "title": "titulo em portugues (max 80 chars)",\n  "excerpt": "resumo de 1-2 frases em portugues (max 200 chars)",\n  "content": "artigo completo em markdown com 3-4 paragrafos"\n}`

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
    console.log('  Facebook: sem credenciais, pulando')
    return
  }
  const message = `${article.title}\n\n${article.excerpt}\n\nLeia mais: https://miamibrasileiro.com/artigo/${article.slug}`
  try {
    const result = await postJson(
      'graph.facebook.com',
      `/v19.0/${FB_PAGE_ID}/feed`,
      { message, access_token: FB_TOKEN }
    )
    console.log('  Facebook:', JSON.stringify(result))
  } catch (e) {
    console.error('  Facebook erro:', e.message)
  }
}

async function main() {
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json')
  let articles = []
  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'))
  } catch (e) {
    console.log('articles.json nao encontrado, criando novo')
  }

  const existingTitles = new Set(articles.map(a => a.title))
  const newArticles = []

  for (const { query, category } of QUERIES) {
    try {
      console.log(`Buscando: ${category}...`)
      const items = await fetchRSS(query)
      if (!items || items.length === 0) {
        console.log(`  Sem resultados RSS para ${category}`)
        continue
      }

      const raw = items[0]
      if (!raw.title) { console.log(`  Titulo vazio`); continue }
      console.log(`  Encontrado: ${raw.title.substring(0, 70)}`)

      const rewritten = await rewrite(raw, category)
      if (existingTitles.has(rewritten.title)) {
        console.log(`  Duplicado, pulando`)
        continue
      }

      const slug = slugify(rewritten.title) + '-' + Date.now()
      const article = {
        id: slug,
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        content: rewritten.content,
        category,
        image: CATEGORY_IMAGES[category],
        source: raw.source || 'Google News',
        sourceUrl: '',
        publishedAt: new Date().toISOString(),
        featured: false
      }

      newArticles.push(article)
      existingTitles.add(rewritten.title)
      console.log(`  Salvo: ${article.title}`)

      await postToFacebook(article)

    } catch (e) {
      console.error(`  Erro em ${category}:`, e.message)
    }
  }

  if (newArticles.length > 0) {
    const updated = [...newArticles, ...articles].slice(0, 100)
    fs.writeFileSync(articlesPath, JSON.stringify(updated, null, 2))
    console.log(`\nTotal salvo: ${newArticles.length} novos artigos`)
  } else {
    console.log('\nNenhum artigo novo encontrado')
  }
}

main().catch(console.error)
