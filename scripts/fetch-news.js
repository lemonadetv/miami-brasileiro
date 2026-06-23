#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

const client = new Anthropic()

const QUERIES = [
  { query: 'brazil miami florida community 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'ImigraÃ§Ã£o' },
  { query: 'brazil business entrepreneur florida miami 2026', category: 'NegÃ³cios' },
  { query: 'health insurance medicaid florida immigrants 2026', category: 'SaÃºde' },
  { query: 'soccer copa mundo inter miami mls 2026', category: 'Esportes' },
  { query: 'miami culture restaurants events nightlife 2026', category: 'Cultura e Lazer' },
]

const TOPIC_IMAGES = [
  { keys: ['copa','world cup','mundial','futebol','soccer','mls','inter miami'], id: 'photo-1574629810360-7efbbe195018' },
  { keys: ['bola','ball','gol','goal','stadium','estadio'], id: 'photo-1560272564-c83b66b1ad12' },
  { keys: ['samba','carnival','carnaval','danca','dance','festa'], id: 'photo-1516450360452-9312f5e86fc7' },
  { keys: ['miami beach','brickell','downtown','skyline'], id: 'photo-1533929736458-ca588d08c8be' },
  { keys: ['florida','palm','praia','beach','ocean'], id: 'photo-1506905925346-21bda4d32df4' },
  { keys: ['wynwood','arte','graffiti','street art','mural'], id: 'photo-1611348524140-53c9a25263d6' },
  { keys: ['visto','visa','passaporte','passport','imigra'], id: 'photo-1436491865332-7a61a109cc05' },
  { keys: ['green card','residencia','documento','citizenship'], id: 'photo-1589829545856-d10d557cf95f' },
  { keys: ['negocio','business','empresa','startup','empreende'], id: 'photo-1507003211169-0a1dd7228f2d' },
  { keys: ['llc','contrato','contract','document','escritorio'], id: 'photo-1454165804606-c3d57bc86b40' },
  { keys: ['saude','health','medico','hospital','doctor'], id: 'photo-1519494026892-80bbd2d6fd0d' },
  { keys: ['seguro','insurance','medicaid','medicare','plano'], id: 'photo-1576091160399-112ba8d25d1d' },
  { keys: ['restaurante','restaurant','comida','food','gastronomia'], id: 'photo-1546069901-ba9599a7e63c' },
  { keys: ['dinheiro','money','dolar','dollar','financ','invest'], id: 'photo-1580519542036-c47de6196ba5' },
  { keys: ['trabalho','job','emprego','work','career'], id: 'photo-1497366216548-37526070297c' },
  { keys: ['tecnolog','tech','software','app','digital','laptop'], id: 'photo-1498050108023-c5249f4df085' },
  { keys: ['comunidade','community','familia','family','reuniao'], id: 'photo-1529156069898-49953e39b3ac' },
  { keys: ['celebracao','celebration','evento','event','show'], id: 'photo-1492684223066-81342ee5ff30' },
]

const CATEGORY_FALLBACK = {
  'Comunidade':      'photo-1529156069898-49953e39b3ac',
  'ImigraÃ§Ã£o':       'photo-1436491865332-7a61a109cc05',
  'NegÃ³cios':        'photo-1507003211169-0a1dd7228f2d',
  'SaÃºde':           'photo-1576091160399-112ba8d25d1d',
  'Esportes':        'photo-1574629810360-7efbbe195018',
  'Cultura e Lazer': 'photo-1506905925346-21bda4d32df4',
  'default':         'photo-1533929736458-ca588d08c8be',
}

function getTopicImage(title, category) {
  const t = (title || '').toLowerCase()
  for (const { keys, id } of TOPIC_IMAGES) {
    if (keys.some(k => t.includes(k))) {
      return 'https://images.unsplash.com/' + id + '?w=1280&auto=format&fit=crop&q=80'
    }
  }
  const fid = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK['default']
  return 'https://images.unsplash.com/' + fid + '?w=1280&auto=format&fit=crop&q=80'
}

function validateImage(url) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(false)
    try {
      const mod = url.startsWith('https') ? https : http
      // Try HEAD first
      const headReq = mod.request(url, { method: 'HEAD', timeout: 4000 }, (res) => {
        const ct = res.headers['content-type'] || ''
        const cl = res.headers['content-length']
        if (res.statusCode >= 200 && res.statusCode < 300 && ct.includes('image')) {
          if (cl !== undefined && parseInt(cl, 10) === 0) return resolve(false)
          return resolve(true)
        }
        // HEAD failed (non-2xx or not image content-type) â retry with GET
        tryGet()
      })
      headReq.on('error', () => tryGet())
      headReq.on('timeout', () => { headReq.destroy(); tryGet() })
      headReq.end()

      function tryGet() {
        try {
          const getReq = mod.request(url, { method: 'GET', timeout: 5000 }, (res) => {
            const ct = res.headers['content-type'] || ''
            const cl = res.headers['content-length']
            if (res.statusCode >= 200 && res.statusCode < 300 && ct.includes('image')) {
              if (cl !== undefined && parseInt(cl, 10) === 0) {
                res.destroy()
                return resolve(false)
              }
              res.destroy()
              return resolve(true)
            }
            // Read only the first 1KB then destroy
            let bytes = 0
            res.on('data', (chunk) => {
              bytes += chunk.length
              if (bytes >= 1024) res.destroy()
            })
            res.on('close', () => resolve(false))
            res.on('end', () => resolve(false))
          })
          getReq.on('error', () => resolve(false))
          getReq.on('timeout', () => { getReq.destroy(); resolve(false) })
          getReq.end()
        } catch { resolve(false) }
      }
    } catch { resolve(false) }
  })
}

function extractOgImage(articleUrl) {
  return new Promise((resolve) => {
    if (!articleUrl || !articleUrl.startsWith('http')) return resolve(null)
    try {
      const mod = articleUrl.startsWith('https') ? https : http
      const req = mod.request(articleUrl, { method: 'GET', timeout: 5000 }, (res) => {
        let body = ''
        let done = false
        res.on('data', (chunk) => {
          if (done) return
          body += chunk.toString()
          // Stop once we have enough HTML to find og:image (typically in <head>)
          if (body.length > 50000) {
            done = true
            res.destroy()
            parseAndResolve(body)
          }
        })
        res.on('end', () => {
          if (!done) parseAndResolve(body)
        })
        res.on('close', () => {
          if (!done) parseAndResolve(body)
        })
      })
      req.on('error', () => resolve(null))
      req.on('timeout', () => { req.destroy(); resolve(null) })
      req.end()

      function parseAndResolve(html) {
        try {
          // Try og:image
          const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
          if (ogMatch && ogMatch[1]) return resolve(ogMatch[1])
          // Try twitter:image
          const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)
          if (twMatch && twMatch[1]) return resolve(twMatch[1])
          resolve(null)
        } catch { resolve(null) }
      }
    } catch { resolve(null) }
  })
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[Ì-Í¯]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    + '-' + Date.now().toString(36)
}

function fetchNews(query) {
  return new Promise((resolve) => {
    if (!process.env.NEWS_API_KEY) { resolve([]); return }
    const q = encodeURIComponent(query)
    const url = 'https://newsapi.org/v2/everything?q=' + q + '&language=en&sortBy=publishedAt&pageSize=3&apiKey=' + process.env.NEWS_API_KEY
    https.get(url, (res) => {
      let body = ''
      res.on('data', d => body += d)
      res.on('end', () => {
        try { resolve(JSON.parse(body).articles || []) } catch { resolve([]) }
      })
    }).on('error', () => resolve([]))
  })
}

async function rewrite(article, category, heroImage) {
  const prompt = `Você é um jornalista sênior do portal Miami Brasileira, o maior portal de notícias em português para brasileiros em Miami e na Flórida. Seu estilo é claro, envolvente e profissional — como os melhores portais brasileiros de jornalismo digital.

Baseado APENAS no resumo abaixo, escreva um artigo ORIGINAL, COMPLETO e PROFISSIONAL em português brasileiro.

TÍTULO ORIGINAL: ${article.title}
RESUMO: ${article.description || article.title}
CATEGORIA: ${category}

INSTRUÇÕES DE ESTILO:
- Mínimo 850 palavras, bem desenvolvidas
- Use **negrito** para destacar informações-chave, números importantes e termos relevantes
- Parágrafo de abertura forte: contextualize o tema com dados ou fato impactante
- Analise o impacto específico para brasileiros em Miami/Flórida
- Inclua contexto local (legislação americana, vida prática em Miami, comunidade brasileira)
- Tom jornalístico: informativo, objetivo, mas humano e próximo do leitor
- Termine com perspectiva prática: o que o leitor pode fazer ou esperar

ESTRUTURA OBRIGATÓRIA:
# [Título em português — atraente, informativo, específico]

[Parágrafo de abertura forte — dado, fato ou contexto impactante — 3-4 frases]

## 🔍 [Subtítulo 1 — O que aconteceu e por quê importa]
[2-3 parágrafos ricos com análise aprofundada, contexto histórico e dados quando possível]

## 🇧🇷 [Subtítulo 2 — O que muda para brasileiros em Miami]
[2-3 parágrafos com perspectiva direta para a comunidade brasileira na Flórida]

## 📋 [Subtítulo 3 — O que você precisa saber e fazer]
[2-3 parágrafos com informações práticas e acionáveis para o leitor]

## 🔮 [Subtítulo 4 — Próximos passos e perspectivas]
[2-3 parágrafos com análise do que vem por aí e como se preparar]

---

*A **Miami Brasileira** acompanha de perto todos os desenvolvimentos que impactam a comunidade brasileira na Flórida. Fique por dentro.*

Escreva SOMENTE o artigo completo, sem comentários ou explicações extras.`

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  })

  const body = msg.content[0].text
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : article.title
  const slug = generateSlug(title)

  return {
    id: slug,
    slug,
    title,
    category,
    date: new Date().toISOString().split('T')[0],
    author: 'Redacao Miami Brasileira',
    imageUrl: heroImage,
    image: heroImage,
    excerpt: body.replace(/^#.+\n/, '').replace(/#{1,3}[^\n]+\n/g, '').trim().substring(0, 200) + '...',
    content: body,
    source: article.url || '',
  }
}

async function main() {
  const articlesPath = path.join(__dirname, '..', 'data', 'articles.json')
  let existing = []
  try { existing = JSON.parse(fs.readFileSync(articlesPath, 'utf8')) } catch { existing = [] }

  const existingSlugs = new Set(existing.map(a => a.slug || a.id).filter(Boolean))
  const newArticles = []

  for (const { query, category } of QUERIES) {
    try {
      console.log('Buscando:', category)
      const articles = await fetchNews(query)
      let processed = 0

      for (const art of articles) {
        if (processed >= 2) break
        if (!art.title || !art.description) continue
        const tmpSlug = generateSlug(art.title)
        if (existingSlugs.has(tmpSlug)) continue

        let imageUrl = getTopicImage(art.title, category) // Unsplash fallback (last resort)

        // Try og:image from article page
        if (art.url) {
          const ogImage = await extractOgImage(art.url)
          if (ogImage) imageUrl = ogImage
        }

        // Override with NewsAPI image if available (highest priority)
        if (art.urlToImage && await validateImage(art.urlToImage)) {
          imageUrl = art.urlToImage
        }

        console.log('  Reescrevendo:', art.title.substring(0, 60))
        const newArt = await rewrite(art, category, imageUrl)
        if (existingSlugs.has(newArt.slug)) continue
        existingSlugs.add(newArt.slug)
        newArticles.push(newArt)
        processed++
      }
    } catch (e) {
      console.error('Erro na categoria', category, e.message)
    }
  }

  if (newArticles.length > 0) {
    const updated = [...newArticles, ...existing]
    fs.writeFileSync(articlesPath, JSON.stringify(updated, null, 2))
    console.log('Adicionados', newArticles.length, 'artigos novos')
  } else {
    console.log('Nenhum artigo novo encontrado')
  }
}

main().catch(console.error)
