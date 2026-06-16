const Anthropic = require('@anthropic-ai/sdk')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const client = new Anthropic()

const QUERIES = [
  { query: 'brazilians miami florida community news', category: 'Comunidade' },
  { query: 'immigration visa green card brazil usa florida', category: 'Imigracao' },
  { query: 'business entrepreneurs brazil miami florida', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants', category: 'Saude' },
  { query: 'soccer brazil inter miami sports', category: 'Esportes' },
  { query: 'miami culture restaurants events florida', category: 'Cultura e Lazer' },
]

const CATEGORY_IMAGES = {
  'Comunidade': [
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=800&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
  ],
  'Imigracao': [
    'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800&q=80',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80',
    'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80',
    'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?w=800&q=80',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    'https://images.unsplash.com/photo-1568218434790-5a06b91f5f42?w=800&q=80',
  ],
  'Negocios': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
    'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80',
  ],
  'Saude': [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&q=80',
  ],
  'Esportes': [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80',
    'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=800&q=80',
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
    'https://images.unsplash.com/photo-1565728744382-61accd4aa148?w=800&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
    'https://images.unsplash.com/photo-1540747913346-19212a729a33?w=800&q=80',
    'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80',
  ],
  'Cultura e Lazer': [
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
  ],
}

function pickImage(category, title) {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Comunidade']
  const hash = crypto.createHash('md5').update(title || '').digest('hex')
  const idx = parseInt(hash.substring(0, 4), 16) % pool.length
  return pool[idx]
}

function fetchUrl(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects === 0) { reject(new Error('Too many redirects')); return }
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MiamiBrasileiro/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      timeout: 10000,
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        resolve(fetchUrl(res.headers.location, redirects - 1))
        return
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')) })
  })
}

function parseRSS(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1]
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`)
      const res = r.exec(block)
      return res ? res[1].trim() : ''
    }
    const title = get('title').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    const link  = get('link')
    const pubDate = get('pubDate')
    const source = get('source') || ''
    if (title) items.push({ title, link, pubDate, source })
  }
  return items
}

async function fetchRSS(query) {
  const encoded = encodeURIComponent(query)
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en&num=10`
  try {
    const { status, body } = await fetchUrl(url)
    if (status !== 200) { console.log(`  RSS ${status} for: ${query}`); return [] }
    const items = parseRSS(body)
    console.log(`  RSS: ${items.length} items for "${query}"`)
    return items
  } catch (e) {
    console.log(`  RSS error: ${e.message}`)
    return []
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

async function rewriteInPortuguese(title, source, category) {
  const prompt = `Voce e um jornalista da comunidade brasileira em Miami.\n\nReescreva a noticia abaixo em portugues brasileiro, focado na comunidade brasileira em Miami/EUA.\n\nTitulo original (em ingles): ${title}\nFonte: ${source || 'Miami Brasileiro'}\nCategoria: ${category}\n\nResponda APENAS com JSON valido, sem markdown, sem texto extra:\n{\n  "title": "Titulo em portugues (max 90 chars, impactante e direto)",\n  "excerpt": "Resumo em 2-3 frases (max 180 chars)",\n  "content": "Artigo completo em portugues (minimo 5 paragrafos, ~400-600 palavras). Inclua contexto para brasileiros em Miami, impacto na comunidade, dicas praticas quando relevante. Use subtitulos com ## quando apropriado.",\n  "source": "Nome curto da fonte original"\n}`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = msg.content[0].text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.log(`  Claude error: ${e.message}`)
    return null
  }
}

async function postToFacebook(article) {
  const pageId    = process.env.FACEBOOK_PAGE_ID
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN
  if (!pageId || !pageToken) {
    console.log('  Facebook: sem credenciais, pulando')
    return
  }
  const postUrl  = `https://miamisbrasileiro.com/artigo/${article.slug}`
  const message  = `${article.title}\n\n${article.excerpt}\n\nLeia mais: ${postUrl}`
  const body     = `message=${encodeURIComponent(message)}&link=${encodeURIComponent(postUrl)}&access_token=${pageToken}`
  try {
    const { status, body: res } = await fetchUrl(`https://graph.facebook.com/v19.0/${pageId}/feed`)
    if (status === 200) console.log('  Facebook: postado!')
    else console.log(`  Facebook: erro ${status}: ${res.slice(0,120)}`)
  } catch (e) {
    console.log(`  Facebook: ${e.message}`)
  }
}

async function main() {
  console.log('=== Miami Brasileiro - Bot de Noticias ===')
  console.log('Data:', new Date().toLocaleString('pt-BR', { timeZone: 'America/New_York' }))

  const dataPath = path.join(__dirname, '..', 'data', 'articles.json')
  let existing = []
  try {
    existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  } catch {
    console.log('Nenhum artigo existente encontrado, comecando do zero.')
  }

  const existingTitles = new Set(existing.map(a => a.title && a.title.toLowerCase().trim()))
  const newArticles = []
  let totalFetched = 0

  for (const { query, category } of QUERIES) {
    console.log(`\n[${category}] Buscando: "${query}"`)
    const items = await fetchRSS(query)
    totalFetched += items.length

    let saved = 0
    for (const item of items.slice(0, 3)) {
      if (existingTitles.has(item.title.toLowerCase().trim())) {
        console.log(`  Duplicado: ${item.title.slice(0, 60)}...`)
        continue
      }

      console.log(`  Reescrevendo: ${item.title.slice(0, 60)}...`)
      const rewritten = await rewriteInPortuguese(item.title, item.source, category)
      if (!rewritten) continue

      const article = {
        slug:        slugify(rewritten.title),
        title:       rewritten.title,
        excerpt:     rewritten.excerpt,
        content:     rewritten.content,
        category,
        source:      rewritten.source || item.source || 'Miami Brasileiro',
        originalUrl: item.link,
        image:       pickImage(category, rewritten.title),
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        createdAt:   new Date().toISOString(),
      }

      newArticles.push(article)
      existingTitles.add(item.title.toLowerCase().trim())
      saved++

      await postToFacebook(article)
      await new Promise(r => setTimeout(r, 800))
    }
    console.log(`  Salvos: ${saved}`)
  }

  const merged = [...newArticles, ...existing].slice(0, 150)
  fs.mkdirSync(path.dirname(dataPath), { recursive: true })
  fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2))

  console.log(`\n=== Total buscados: ${totalFetched} | Novos: ${newArticles.length} | Arquivo: ${merged.length} artigos ===`)
}

main().catch(console.error)
