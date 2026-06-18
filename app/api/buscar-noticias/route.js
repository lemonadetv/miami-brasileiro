import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida miami 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants 2026', category: 'Saude' },
  { query: 'soccer copa mundo inter miami mls 2026', category: 'Esportes' },
  { query: 'miami culture restaurants events nightlife 2026', category: 'Cultura e Lazer' },
]

// Verified Unsplash photo IDs by topic keyword (all tested 200 OK)
const TOPIC_IMAGES = [
  { keys: ['copa','world cup','mundial','futebol','soccer','mls','inter miami','casemiro'], id: 'photo-1574629810360-7efbbe195018' },
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
  { keys: ['restaurante','restaurant','comida','food','gastronomia','culinaria'], id: 'photo-1546069901-ba9599a7e63c' },
  { keys: ['dinheiro','money','dolar','dollar','financ','invest'], id: 'photo-1580519542036-c47de6196ba5' },
  { keys: ['trabalho','job','emprego','work','career','rh'], id: 'photo-1497366216548-37526070297c' },
  { keys: ['tecnolog','tech','software','app','digital','laptop'], id: 'photo-1498050108023-c5249f4df085' },
  { keys: ['comunidade','community','familia','family','reuniao'], id: 'photo-1529156069898-49953e39b3ac' },
  { keys: ['celebracao','celebration','evento','event','show'], id: 'photo-1492684223066-81342ee5ff30' },
]

// Category fallbacks (when no keyword matches)
const CATEGORY_FALLBACK = {
  'Comunidade':    'photo-1529156069898-49953e39b3ac',
  'Imigracao':     'photo-1436491865332-7a61a109cc05',
  'Negocios':      'photo-1507003211169-0a1dd7228f2d',
  'Saude':         'photo-1576091160399-112ba8d25d1d',
  'Esportes':      'photo-1574629810360-7efbbe195018',
  'Cultura e Lazer': 'photo-1506905925346-21bda4d32df4',
  'default':       'photo-1533929736458-ca588d08c8be',
}

function getTopicImage(title, category) {
  const t = (title || '').toLowerCase()
  for (const { keys, id } of TOPIC_IMAGES) {
    if (keys.some(k => t.includes(k))) {
      return 'https://images.unsplash.com/' + id + '?w=1280&auto=format&fit=crop&q=80'
    }
  }
  const fallbackId = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK['default']
  return 'https://images.unsplash.com/' + fallbackId + '?w=1280&auto=format&fit=crop&q=80'
}

async function validateImage(url) {
  if (!url || !url.startsWith('http')) return false
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const r = await fetch(url, { method: 'HEAD', signal: ctrl.signal })
    clearTimeout(timer)
    const ct = r.headers.get('content-type') || ''
    return r.ok && ct.includes('image')
  } catch { return false }
}

function generateSlug(title) {
  return (title || 'artigo')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 80)
}

async function fetchNews(query) {
  const key = process.env.NEWSAPI_KEY
  if (!key) return []
  try {
    const url = 'https://newsapi.org/v2/everything?q=' + encodeURIComponent(query) + '&language=en&pageSize=5&sortBy=publishedAt&apiKey=' + key
    const r = await fetch(url)
    const d = await r.json()
    return (d.articles || []).filter(a => a.title && a.title !== '[Removed]' && a.description)
  } catch(e) {
    console.error('[ERR] NewsAPI:', e.message)
    return []
  }
}

async function rewrite(article, category, heroImage) {
  const siteUrl = 'https://miami-brasileiro.vercel.app'
  const prompt = `Voce e jornalista brasileira experiente do portal Miami Brasileira, voltado para brasileiros em Miami e Sul da Florida.

NOTICIA ORIGINAL (em ingles):
Titulo: ${article.title}
Descricao: ${article.description || ''}
Fonte: ${article.source?.name || 'Agencias internacionais'}
Data: ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR') : 'Hoje'}

INSTRUCOES - Escreva um artigo LONGO, RICO e PROFISSIONAL em PORTUGUES BRASILEIRO com:

1. ABERTURA CATIVANTE: Comece com cenario real que o leitor vai se identificar. Ex: "Imagine que voce acaba de..."
2. Use ### com EMOJI para CADA subtitulo (minimo 4 subtitulos)
3. Use **negrito** para termos importantes, valores em dolares, nomes de lugares, datas
4. Use listas (1. 2. 3. ou -) onde fizer sentido organizar informacao
5. No MEIO do artigo, insira exatamente esta imagem inline: ![Imagem do artigo](${heroImage})
6. MINIMO 700 palavras
7. Tom: profissional mas acolhedor, como se fosse um amigo brasileiro experiente explicando
8. Termine SEMPRE com esta secao:

### \u2705 Resumo e Proximos Passos
- **O que fazer agora**: [acao concreta]
- **Onde buscar ajuda em Miami**: [recurso local especifico]
- **Fique de olho em**: [o que acompanhar]

Responda SOMENTE com JSON valido (sem markdown ao redor):
{"titulo":"titulo em portugues brasileiro chamativo e SEO-friendly (max 80 chars)","resumo":"2-3 frases sobre o que e e por que importa para brasileiros em Miami","conteudo":"artigo completo em markdown"}`

  try {
    const msg = await ANTHROPIC.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
    const text = msg.content[0].text.trim()
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('no JSON in response')
    return JSON.parse(match[0])
  } catch(e) {
    console.error('[ERR] Claude:', e.message)
    return null
  }
}

async function saveToGitHub(newArticles) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
  const url = 'https://api.github.com/repos/' + repo + '/contents/data/articles.json'
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
    console.error('[WARN] fetch existing:', e.message)
  }
  // Deduplicate using slug (handles both old and new articles)
  const newSlugs = new Set(newArticles.map(a => a.slug || a.id).filter(Boolean))
  const merged = [
    ...newArticles,
    ...existing.filter(a => {
      const key = a.slug || a.id
      return key && !newSlugs.has(key)
    })
  ].slice(0, 400)
  const content = Buffer.from(JSON.stringify(merged, null, 2)).toString('base64')
  const body = { message: '[BOT] Atualizacao automatica ' + new Date().toISOString(), content }
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
    const msg = article.title + '\n\n' + (article.excerpt || '') + '\n\nhttps://miami-brasileiro.vercel.app/artigo/' + article.slug
    const r = await fetch('https://graph.facebook.com/' + pageId + '/feed', {
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
  const secret = searchParams.get('secret')
  if (!isVercelCron && secret !== process.env.BOT_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  console.log('[BOT] Start at ' + new Date().toISOString())
  const newArticles = []
  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    console.log('[API] Fetching: ' + q.category)
    const raws = await fetchNews(q.query)
    // Process up to 2 articles per category
    for (let j = 0; j < Math.min(raws.length, 2); j++) {
      const raw = raws[j]
      if (!raw.title || raw.title === '[Removed]' || !raw.description) continue
      console.log('[WRITE] ' + raw.title.slice(0, 60))
      // Smart image selection: validate news image, fallback to topic-based
      let heroImage = getTopicImage(raw.title, q.category)
      if (raw.urlToImage) {
        const isValid = await validateImage(raw.urlToImage)
        if (isValid) heroImage = raw.urlToImage
      }
      const result = await rewrite(raw, q.category, heroImage)
      if (!result) continue
      const slug = generateSlug(result.titulo || raw.title) + '-' + Date.now().toString(36)
      const article = {
        id: slug,
        slug,
        title: result.titulo || raw.title,
        excerpt: result.resumo || raw.description || '',
        content: result.conteudo || '',
        category: q.category,
        image: heroImage,
        source: raw.source?.name || 'Agencias',
        sourceUrl: raw.url || '',
        originalUrl: raw.url || '',
        publishedAt: raw.publishedAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        featured: false
      }
      newArticles.push(article)
      await new Promise(r => setTimeout(r, 600))
    }
  }
  if (newArticles.length === 0) {
    return Response.json({ success: false, message: 'Nenhum artigo gerado' }, { status: 500 })
  }
  newArticles[0].featured = true
  let fbPosted = 0
  for (const article of newArticles) {
    const ok = await postToFacebook(article)
    if (ok) fbPosted++
    await new Promise(r => setTimeout(r, 300))
  }
  try {
    const totalSaved = await saveToGitHub(newArticles)
    console.log('[OK] Saved ' + newArticles.length + ' new, total: ' + totalSaved)
    return Response.json({
      success: true,
      new: newArticles.length,
      total: totalSaved,
      facebook: fbPosted,
      articles: newArticles.map(a => ({ slug: a.slug, title: a.title, image: a.image }))
    })
  } catch(e) {
    console.error('[ERR] Save:', e.message)
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
