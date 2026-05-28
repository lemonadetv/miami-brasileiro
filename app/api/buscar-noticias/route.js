// app/api/buscar-noticias/route.js
// ============================================================
// MOTOR DE AUTOMAÇÃO DO PORTAL
// ============================================================
// Este endpoint é chamado automaticamente 3x por dia pelo
// Vercel Cron (veja vercel.json). Ele:
//   1. Busca notícias relevantes na NewsAPI
//   2. Envia cada notícia ao Claude para reescrever em PT-BR
//      adaptando para a comunidade brasileira de Miami
//   3. Salva o novo articles.json no GitHub (que aciona redeploy)
// ============================================================

import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Consultas de busca na NewsAPI
const QUERIES = [
  { query: 'brazil miami florida community', category: 'Comunidade' },
  { query: 'immigration brazil usa green card visa', category: 'Imigração' },
  { query: 'brazil business entrepreneur florida', category: 'Negócios' },
  { query: 'brazil health insurance florida healthcare', category: 'Saúde' },
  { query: 'brazil soccer copa mundo miami', category: 'Esportes' },
]

// Imagens de fallback por categoria (Unsplash)
const FALLBACK_IMAGES = {
  'Imigração': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  'Comunidade': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  'Saúde':      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  'Negócios':   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  'Esportes':   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
}

// ── GERA SLUG A PARTIR DO TÍTULO ──────────────────────────
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

// ── BUSCA NOTÍCIAS NA NEWSAPI ─────────────────────────────
async function fetchNewsFromAPI(query) {
  const url = `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(query)}&` +
    `language=en&` +
    `sortBy=publishedAt&` +
    `pageSize=3&` +
    `apiKey=${process.env.NEWS_API_KEY}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.articles || []
  } catch (e) {
    console.error('Erro NewsAPI:', e.message)
    return []
  }
}

// ── REESCREVE ARTIGO COM CLAUDE ───────────────────────────
async function rewriteWithClaude(article, category) {
  const prompt = `Você é um jornalista brasileiro especializado em cobrir notícias para a comunidade brasileira em Miami, Flórida.

Baseado na notícia abaixo (em inglês), escreva um artigo completo em PORTUGUÊS BRASILEIRO para o portal "Miami Brasileiro".

NOTÍCIA ORIGINAL:
Título: ${article.title}
Descrição: ${article.description || ''}
Fonte: ${article.source?.name || 'desconhecida'}
URL original: ${article.url || ''}

INSTRUÇÕES:
1. Escreva um TÍTULO em português, chamativo e relevante para brasileiros em Miami (máximo 100 caracteres)
2. Escreva um RESUMO de 1-2 frases (o que é, por que importa para brasileiros em Miami)
3. Escreva o CONTEÚDO COMPLETO do artigo em 4-6 parágrafos (400-600 palavras), incluindo:
   - Contexto para quem mora em Miami e região
   - Impacto prático para a comunidade brasileira
   - Dicas ou próximos passos quando relevante
   - Tom: jornalístico mas acessível, como uma conversa com um amigo bem informado
4. Não invente dados ou estatísticas que não estejam na notícia original

RESPONDA EXATAMENTE NESTE FORMATO JSON (sem markdown, apenas o JSON):
{
  "title": "Título aqui",
  "excerpt": "Resumo aqui",
  "content": "Conteúdo completo aqui, com parágrafos separados por \\n\\n"
}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = msg.content[0].text.trim()
    // Remove possível markdown ```json ... ```
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/,'')
    return JSON.parse(clean)
  } catch (e) {
    console.error('Erro Claude:', e.message)
    return null
  }
}

// ── SALVA ARTIGOS NO GITHUB ───────────────────────────────
async function saveToGitHub(articles) {
  const repo  = process.env.GITHUB_REPO   // ex: "seunome/miami-brasileiro"
  const token = process.env.GITHUB_TOKEN
  const path  = 'data/articles.json'
  const apiURL = `https://api.github.com/repos/${repo}/contents/${path}`

  // 1. Pega o SHA atual do arquivo (necessário para atualizar)
  const getRes = await fetch(apiURL, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
  })
  const fileData = await getRes.json()
  const sha = fileData.sha

  // 2. Codifica o conteúdo em base64
  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64')

  // 3. Commita o arquivo atualizado
  const putRes = await fetch(apiURL, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `[BOT] Auto: atualiza notícias — ${new Date().toISOString()}`,
      content,
      sha
    })
  })

  if (!putRes.ok) {
    const err = await putRes.text()
    throw new Error(`GitHub PUT falhou: ${err}`)
  }

  return true
}

// ── HANDLER PRINCIPAL ─────────────────────────────────────
export async function GET(request) {
  // Verifica a chave secreta (segurança)
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret') || request.headers.get('authorization')?.replace('Bearer ', '')

  // O Vercel Cron chama sem secret, mas envia o header x-vercel-cron
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Verifica variáveis obrigatórias
  if (!process.env.NEWS_API_KEY || !process.env.ANTHROPIC_API_KEY || !process.env.GITHUB_TOKEN) {
    return Response.json({ error: 'Variáveis de ambiente faltando. Veja .env.local.example' }, { status: 500 })
  }

  console.log('[BOT] Iniciando busca automática de notícias...')

  const novosArtigos = []

  // Processa cada categoria
  for (const { query, category } of QUERIES) {
    console.log(`[API] Buscando: ${query}`)
    const rawArticles = await fetchNewsFromAPI(query)

    for (const rawArt of rawArticles.slice(0, 2)) { // máximo 2 por categoria
      if (!rawArt.title || rawArt.title === '[Removed]') continue

      console.log(`[WRITE] Reescrevendo: ${rawArt.title.slice(0,60)}...`)
      const rewritten = await rewriteWithClaude(rawArt, category)
      if (!rewritten) continue

      const id = generateSlug(rewritten.title)

      novosArtigos.push({
        id,
        title:       rewritten.title,
        excerpt:     rewritten.excerpt,
        content:     rewritten.content,
        category,
        publishedAt: new Date().toISOString(),
        image:       rawArt.urlToImage || FALLBACK_IMAGES[category],
        source:      rawArt.source?.name || 'Agências',
        sourceUrl:   rawArt.url || '#',
        featured:    false
      })

      // Pausa de 1s entre chamadas ao Claude (evita rate limit)
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  if (novosArtigos.length === 0) {
    return Response.json({ ok: false, message: 'Nenhuma notícia nova encontrada' })
  }

  // Salva no GitHub (dispara rebuild do Vercel)
  try {
    await saveToGitHub(novosArtigos)
    console.log(`[OK] ${novosArtigos.length} artigos salvos no GitHub!`)
    return Response.json({
      ok: true,
      total: novosArtigos.length,
      articles: novosArtigos.map(a => a.title)
    })
  } catch (e) {
    console.error('[ERR] Erro ao salvar:', e.message)
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
