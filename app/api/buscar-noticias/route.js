// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community events 2026', category: 'Comunidade' },
  { query: 'immigration brazil usa green card visa uscis 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida startup miami', category: 'Negocios' },
  { query: 'brazil health insurance florida medicaid healthcare', category: 'Saude' },
  { query: 'brazil soccer copa mundo miami sports inter miami', category: 'Esportes' },
]

const FALLBACK_IMAGES = {
  Imigracao:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  Comunidade: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Saude:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  Negocios:   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  Esportes:   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
}

const LINKS_CATEGORIA = {
  Imigracao: [
    '[USCIS - Peticoes e Status](https://www.uscis.gov) - Site oficial para acompanhar processos de imigracao',
    '[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Servicos consulares para brasileiros na Florida',
    '[Immigration Court - EOIR](https://www.justice.gov/eoir) - Informacoes sobre tribunais de imigracao',
    '[National Immigrant Justice Center](https://immigrantjustice.org) - Assistencia juridica gratuita para imigrantes',
  ],
  Comunidade: [
    '[City of Miami - Servicos](https://www.miamigov.com) - Servicos municipais e eventos da cidade',
    '[Miami-Dade County](https://www.miamidade.gov) - Servicos do condado incluindo moradia e assistencia social',
    '[Consulado do Brasil em Miami](https://miami.itamaraty.gov.br) - Apoio a comunidade brasileira',
    '[211 Broward/Miami-Dade](https://www.211broward.org) - Linha de apoio a servicos sociais na Florida',
  ],
  Saude: [
    '[Healthcare.gov](https://www.healthcare.gov) - Compare e contrate planos de saude (ACA/Obamacare)',
    '[Florida Medicaid](https://www.myflorida.com/apps/medicaid) - Saude para baixa renda na Florida',
    '[Jackson Health System](https://jacksonhealth.org) - Principal rede hospitalar publica de Miami',
    '[Community Health of South Florida](https://www.chisouthfl.org) - Clinicas de baixo custo em Miami',
  ],
  Negocios: [
    '[Sunbiz - Registro de Empresa na Florida](https://dos.fl.gov/sunbiz) - Abra sua LLC ou corporacao',
    '[Small Business Administration](https://www.sba.gov) - Emprestimos e suporte federal para PMEs',
    '[Miami-Dade Beacon Council](https://www.beaconcouncil.com) - Desenvolvimento economico e conexoes',
    '[SCORE Miami](https://miami.score.org) - Mentoria gratuita para empreendedores',
  ],
  Esportes: [
    '[Inter Miami CF - Ingressos](https://www.intermiamicf.com) - Jogos do time de futebol de Miami na MLS',
    '[Copa do Mundo 2026 - Miami](https://www.fifa.com) - Informacoes sobre jogos do Mundial em Miami',
    '[Miami Heat - NBA](https://www.nba.com/heat) - Time de basquete de Miami',
    '[Miami Marlins - MLB](https://www.mlb.com/marlins) - Baseball em Miami',
  ],
}

function generateSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 80)
}

async function fetchNewsFromAPI(query) {
  const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(query) +
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
  const links = (LINKS_CATEGORIA[category] || []).join('\n')

  const prompt = `Voce e uma jornalista brasileira experiente que escreve para o portal "Miami Brasileira", voltado para a comunidade brasileira em Miami e na Florida.

NOTICIA ORIGINAL (em ingles):
Titulo: ${article.title}
Descricao: ${article.description || ''}
Conteudo: ${article.content || article.description || ''}
Fonte: ${article.source?.name || ''}

ESTILO DE ESCRITA (siga rigorosamente):
- Comece com uma cena ou situacao real que o leitor brasileiro em Miami vai se identificar. Ex: "Voce acabou de chegar em Miami e precisa de..." ou "Imagine que voce esta tentando..."
- Escreva em portugues brasileiro natural e acolhedor, como se estivesse conversando com um amigo
- Use **negrito** para destacar informacoes importantes, valores em dolares, prazos e nomes de programas
- Use subtitulos com ### para organizar o artigo
- Use listas numeradas ou com hifen para passos, dicas e opcoes
- Mencione valores em dolares e comparacoes praticas quando relevante
- Explique termos em ingles em portugues (ex: "o Renters Insurance, ou seguro do inquilino")
- Mincione o impacto direto para brasileiros em Miami e na Florida
- Tom: informativo mas humanizado, nunca frio ou tecnico demais

ESTRUTURA DO ARTIGO:
1. Paragrafo de abertura (cenario/contexto para o leitor - 2-3 frases)
2. O que e / O que aconteceu (explicacao clara)
3. ### Subtitulo relevante com detalhes praticos
4. Lista de pontos importantes (numerada ou com hifens)
5. ### Como isso afeta voce (impacto para brasileiros em Miami)
6. Informacoes praticas (valores, prazos, onde ir, o que fazer)
7. ### Links e Recursos Uteis
${links}

REQUISITOS:
- Minimo de 600 palavras no campo "conteudo"
- Use markdown: ### para subtitulos, **texto** para negrito, [Link](url) para links, - para listas
- Os links da secao "Links e Recursos Uteis" devem aparecer como: [Nome do recurso](URL) - descricao

Responda SOMENTE com JSON valido (sem markdown ao redor):
{
  "titulo": "titulo em portugues chamativo (max 100 chars)",
  "resumo": "resumo de 2-3 frases explicando o que e e por que importa para brasileiros em Miami",
  "conteudo": "artigo completo em markdown"
}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
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
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
  const path = 'data/articles.json'
  const apiUrl = 'https://api.github.com/repos/' + repo + '/contents/' + path

  let sha = null
  try {
    const r = await fetch(apiUrl, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json' } })
    if (r.ok) sha = (await r.json()).sha
  } catch(e) {}

  const content = Buffer.from(JSON.stringify(articles, null, 2)).toString('base64')
  const body = { message: '[BOT] Atualizacao automatica - ' + new Date().toISOString(), content }
  if (sha) body.sha = sha

  const r = await fetch(apiUrl, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) throw new Error('GitHub PUT falhou: ' + (await r.text()))
  console.log('[OK] articles.json salvo')
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  if (!isVercelCron && process.env.CRON_SECRET && searchParams.get('secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[BOT] Iniciando busca...')
  const allArticles = []

  for (let qi = 0; qi < QUERIES.length; qi++) {
    const q = QUERIES[qi]
    console.log('[API] ' + q.category)
    const rawArticles = await fetchNewsFromAPI(q.query)

    for (let ri = 0; ri < Math.min(rawArticles.length, 2); ri++) {
      const raw = rawArticles[ri]
      if (!raw.title || raw.title === '[Removed]') continue

      const rewritten = await rewriteWithClaude(raw, q.category)
      if (!rewritten) continue

      const slug = generateSlug(rewritten.titulo || raw.title)
      allArticles.push({
        id: slug + '-' + Date.now().toString(36),
        slug,
        title: rewritten.titulo || raw.title,
        excerpt: rewritten.resumo || raw.description || '',
        content: rewritten.conteudo || '',
        category: q.category,
        image: raw.urlToImage || FALLBACK_IMAGES[q.category],
        source: raw.source?.name || 'Agencias',
        sourceUrl: raw.url || '',
        publishedAt: raw.publishedAt || new Date().toISOString(),
        featured: false
      })

      await new Promise(r => setTimeout(r, 800))
    }
  }

  if (allArticles.length === 0) return Response.json({ success: false, message: 'Nenhum artigo' }, { status: 500 })
  allArticles[0].featured = true

  try {
    await saveToGitHub(allArticles)
    return Response.json({ success: true, count: allArticles.length })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
