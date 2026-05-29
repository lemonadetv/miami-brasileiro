// app/api/buscar-noticias/route.js
// Motor de automacao do portal Miami Brasileira
// Chamado pelo Vercel Cron 1x por dia

import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community events', category: 'Comunidade' },
  { query: 'immigration brazil usa green card visa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida startup', category: 'Negocios' },
  { query: 'brazil health insurance florida healthcare medicaid', category: 'Saude' },
  { query: 'brazil soccer copa mundo miami sports', category: 'Esportes' },
]

const FALLBACK_IMAGES = {
  Imigracao:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  Comunidade: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Saude:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  Negocios:   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  Esportes:   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
}

const LINKS_UTEIS = {
  Imigracao: [
    { titulo: 'USCIS - Servicos de Imigracao dos EUA', url: 'https://www.uscis.gov', desc: 'Site oficial para petições de visto e green card' },
    { titulo: 'Consulado Geral do Brasil em Miami', url: 'https://miami.itamaraty.gov.br', desc: 'Servicos consulares para brasileiros na Florida' },
    { titulo: 'Immigration Court Information', url: 'https://www.justice.gov/eoir', desc: 'Informacoes sobre tribunais de imigracao' },
  ],
  Comunidade: [
    { titulo: 'City of Miami - Servicos ao Cidadao', url: 'https://www.miamigov.com', desc: 'Servicos municipais de Miami' },
    { titulo: 'Miami-Dade County', url: 'https://www.miamidade.gov', desc: 'Servicos do condado de Miami-Dade' },
    { titulo: 'Consulado Geral do Brasil em Miami', url: 'https://miami.itamaraty.gov.br', desc: 'Apoio a comunidade brasileira' },
  ],
  Saude: [
    { titulo: 'Healthcare.gov - Planos de Saude', url: 'https://www.healthcare.gov', desc: 'Marketplace de seguros saude dos EUA' },
    { titulo: 'Medicaid Florida', url: 'https://www.myflorida.com/apps/medicaid', desc: 'Programa de saude para baixa renda na Florida' },
    { titulo: 'Jackson Health System Miami', url: 'https://jacksonhealth.org', desc: 'Principal rede hospitalar publica de Miami' },
  ],
  Negocios: [
    { titulo: 'Florida Department of State - Empresa', url: 'https://dos.fl.gov/sunbiz', desc: 'Registrar empresa na Florida (Sunbiz)' },
    { titulo: 'Small Business Administration', url: 'https://www.sba.gov', desc: 'Suporte federal para pequenas empresas' },
    { titulo: 'Miami-Dade Beacon Council', url: 'https://www.beaconcouncil.com', desc: 'Desenvolvimento economico em Miami-Dade' },
  ],
  Esportes: [
    { titulo: 'Inter Miami CF', url: 'https://www.intermiamicf.com', desc: 'Clube de futebol de Miami na MLS' },
    { titulo: 'FIFA World Cup 2026', url: 'https://www.fifa.com/en/tournaments/mens/worldcup', desc: 'Copa do Mundo 2026 - jogos em Miami' },
    { titulo: 'Miami Heat - NBA', url: 'https://www.nba.com/heat', desc: 'Time de basquete de Miami' },
  ],
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

async function fetchNewsFromAPI(query) {
  const url = 'https://newsapi.org/v2/everything?' +
    'q=' + encodeURIComponent(query) +
    '&language=en&sortBy=publishedAt&pageSize=3&apiKey=' + process.env.NEWS_API_KEY

  try {
    const res = await fetch(url)
    const data = await res.json()
    return data.articles || []
  } catch (e) {
    console.error('[ERR] NewsAPI:', e.message)
    return []
  }
}

async function rewriteWithClaude(article, category) {
  const links = LINKS_UTEIS[category] || []
  const linksText = links.map(function(l) { return '- ' + l.titulo + ': ' + l.url }).join('\n')

  const prompt = 'Voce e uma jornalista brasileira especializada em cobrir noticias para a comunidade brasileira em Miami, Florida.\n\n' +
    'Baseado na noticia abaixo (em ingles), escreva um artigo COMPLETO E DETALHADO em PORTUGUES BRASILEIRO.\n' +
    'O artigo precisa ter NO MINIMO 600 palavras, ser bem explicado e pratico para quem mora em Miami.\n\n' +
    'NOTICIA ORIGINAL:\n' +
    'Titulo: ' + article.title + '\n' +
    'Descricao: ' + (article.description || '') + '\n' +
    'Conteudo: ' + (article.content || article.description || '') + '\n\n' +
    'INSTRUCOES IMPORTANTES:\n' +
    '1. TITULO: Em portugues, chamativo para brasileiros em Miami (max 100 caracteres)\n' +
    '2. RESUMO: 2-3 frases claras sobre o que e e por que importa para brasileiros em Miami\n' +
    '3. CONTEUDO: Artigo LONGO e DETALHADO com:\n' +
    '   - Contexto completo do assunto\n' +
    '   - Impacto pratico para brasileiros que moram em Miami e na Florida\n' +
    '   - Explicacao de termos tecnicos em portugues simples\n' +
    '   - Como isso afeta o dia a dia da comunidade\n' +
    '   - Dicas praticas, prazos importantes, documentos necessarios quando relevante\n' +
    '   - Comparacao com o Brasil quando ajuda a entender melhor\n' +
    '   - Onde buscar ajuda ou mais informacoes\n' +
    '   - SECAO FINAL: "Links e Recursos Uteis" com estes links formatados assim:\n' +
    '     [Nome do recurso](URL) - Descricao breve\n' +
    linksText + '\n\n' +
    'FORMATO DE RESPOSTA (JSON puro, sem markdown):\n' +
    '{\n' +
    '  "titulo": "Titulo aqui",\n' +
    '  "resumo": "Resumo aqui",\n' +
    '  "conteudo": "Conteudo completo aqui com paragrafos separados por \\n\\n"\n' +
    '}'

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = msg.content[0].text.trim()
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('JSON nao encontrado')
    return JSON.parse(match[0])
  } catch (e) {
    console.error('[ERR] Claude:', e.message)
    return null
  }
}

async function saveToGitHub(articles) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileira'
  const path = 'data/articles.json'
  const apiUrl = 'https://api.github.com/repos/' + repo + '/contents/' + path

  let sha = null
  try {
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' }
    })
    if (getRes.ok) sha = (await getRes.json()).sha
  } catch (e) {}

  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64')
  const body = { message: '[BOT] Atualizacao automatica - ' + new Date().toISOString(), content }
  if (sha) body.sha = sha

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!putRes.ok) {
    const err = await putRes.json()
    throw new Error('GitHub PUT falhou: ' + JSON.stringify(err))
  }
  console.log('[OK] articles.json salvo')
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'

  if (!isVercelCron && process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[BOT] Iniciando busca de noticias...')
  const allArticles = []

  for (var qi = 0; qi < QUERIES.length; qi++) {
    var q = QUERIES[qi]
    console.log('[API] Buscando: ' + q.category)
    const rawArticles = await fetchNewsFromAPI(q.query)

    for (var ri = 0; ri < Math.min(rawArticles.length, 2); ri++) {
      var raw = rawArticles[ri]
      if (!raw.title || raw.title === '[Removed]') continue

      console.log('[WRITE] Reescrevendo: ' + raw.title.slice(0, 60))
      const rewritten = await rewriteWithClaude(raw, q.category)
      if (!rewritten) continue

      const slug = generateSlug(rewritten.titulo || raw.title)
      const image = raw.urlToImage || FALLBACK_IMAGES[q.category] || FALLBACK_IMAGES.Comunidade

      allArticles.push({
        id: slug + '-' + Date.now().toString(36),
        slug: slug,
        title: rewritten.titulo || raw.title,
        excerpt: rewritten.resumo || raw.description || '',
        content: rewritten.conteudo || '',
        category: q.category,
        image: image,
        source: raw.source && raw.source.name ? raw.source.name : 'NewsAPI',
        sourceUrl: raw.url || '',
        publishedAt: raw.publishedAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        featured: false
      })

      await new Promise(function(r) { setTimeout(r, 800) })
    }
  }

  if (allArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo gerado' }, { status: 500 })
  }

  if (allArticles.length > 0) allArticles[0].featured = true

  try {
    await saveToGitHub(allArticles)
    console.log('[OK] Total: ' + allArticles.length + ' artigos salvos')
    return Response.json({ success: true, count: allArticles.length, articles: allArticles.map(function(a) { return a.slug }) })
  } catch (e) {
    console.error('[ERR] Salvar GitHub:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
