#!/usr/bin/env node
const Anthropic = require('@anthropic-ai/sdk')
const https = require('https')
const fs = require('fs')
const path = require('path')

const client = new Anthropic()
const DATA_PATH = path.join(__dirname, '../data/articles.json')

const SPORTS_QUERIES = [
  { query: 'inter miami MLS 2026 standings results', topic: 'Inter Miami' },
  { query: 'MLS standings table 2026 Eastern Western Conference', topic: 'MLS' },
  { query: 'copa do mundo 2026 FIFA World Cup grupos tabela', topic: 'Copa do Mundo 2026' },
  { query: 'brasileiros futebol miami florida esportes', topic: 'Esportes Brasileiros' },
  { query: 'NBA NFL MLB Miami sports results 2026', topic: 'Esportes Miami' },
]

const IMAGES = {
  'inter miami':   'photo-1574629810360-7efbbe195018',
  'mls':           'photo-1560272564-c83b66b1ad12',
  'copa':          'photo-1551958219-acbc595a0a1e',
  'futebol':       'photo-1574629810360-7efbbe195018',
  'default':       'photo-1560272564-c83b66b1ad12',
}

function getImg(title) {
  const t = title.toLowerCase()
  for (const [k, id] of Object.entries(IMAGES)) {
    if (t.includes(k)) return `https://images.unsplash.com/${id}?w=1280&auto=format&fit=crop&q=80`
  }
  return `https://images.unsplash.com/${IMAGES.default}?w=1280&auto=format&fit=crop&q=80`
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80)
}

function fetchNews(query) {
  return new Promise((resolve) => {
    if (!process.env.NEWS_API_KEY) return resolve([])
    const q = encodeURIComponent(query)
    const url = `https://newsapi.org/v2/everything?q=${q}&language=en&pageSize=3&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    const req = https.get(url, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data).articles || []) } catch { resolve([]) }
      })
    })
    req.on('error', () => resolve([]))
    req.setTimeout(8000, () => { req.destroy(); resolve([]) })
  })
}

async function generateSportsArticle(topic, headlines) {
  const today = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
  const headlineText = headlines.map((h, i) => `${i+1}. ${h.title} (${h.source?.name || 'Internacional'})`).join('\n')

  const prompt = `Você é jornalista esportivo do portal Miami Brasileira. 
Escreva um artigo de atualização esportiva em português brasileiro sobre: ${topic}

Manchetes recentes (use como base, não cite as fontes):
${headlineText || 'Sem manchetes disponíveis — escreva baseado no conhecimento geral de ${today}'}

Regras:
- Título chamativo e informativo (max 80 chars)
- Corpo com 300-450 palavras, 3-4 parágrafos
- Inclua tabelas quando relevante (classificação, resultados) em formato Markdown
- Tom informativo mas engajante para brasileiros em Miami
- Data de referência: ${today}
- NÃO invente placar ou resultado específico que não tenha nas manchetes
- Se não tiver dados concretos, foque em análise e contexto

Retorne APENAS JSON válido:
{
  "title": "...",
  "body": "...",
  "summary": "resumo de 1 frase (max 120 chars)"
}`

  const msg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = msg.content[0].text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')
  return JSON.parse(jsonMatch[0])
}

async function main() {
  console.log('🏆 Bot de Esportes iniciado —', new Date().toISOString())

  let articles = []
  try {
    articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  } catch {
    console.log('Criando novo articles.json...')
  }

  const today = new Date().toISOString().split('T')[0]
  const newArticles = []

  for (const { query, topic } of SPORTS_QUERIES) {
    try {
      console.log(`  → Buscando: ${topic}`)
      const headlines = await fetchNews(query)
      const art = await generateSportsArticle(topic, headlines)

      const slug = slugify(art.title) + '-' + Date.now()
      newArticles.push({
        slug,
        title: art.title,
        body: art.body,
        summary: art.summary || art.body.slice(0, 120) + '...',
        category: 'Esportes',
        publishedAt: new Date().toISOString(),
        image: getImg(art.title),
        source: 'bot-esportes',
        readingTime: Math.ceil(art.body.split(' ').length / 200),
      })

      console.log(`  ✅ "${art.title}"`)
      await new Promise(r => setTimeout(r, 2000))
    } catch (e) {
      console.error(`  ❌ Erro em ${topic}:`, e.message)
    }
  }

  // Manter artigos existentes não-esportes + últimos 10 de esportes
  const nonSports = articles.filter(a => a.category !== 'Esportes').slice(0, 80)
  const oldSports  = articles.filter(a => a.category === 'Esportes').slice(0, 10)
  const merged = [...newArticles, ...oldSports, ...nonSports]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  fs.writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2))
  console.log(`✅ ${newArticles.length} artigos de esportes adicionados. Total: ${merged.length}`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
