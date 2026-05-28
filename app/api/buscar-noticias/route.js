// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk')~
const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const QUERIES = [
  { query: 'brazil miami florida community', category: 'Comunidade' },
  { query: 'immigration brazil usa green card visa', category: 'Imigração' },
  { query: 'brazil business entrepreneur florida', category: 'Negócios' },
  { query: 'brazil health insurance florida healthcare', category: 'Saúde' },
  { query: 'brazil soccer copa mundo miami', category: 'Esportes' },
]
const FALLBACK_IMAGES = {
  'Imigração': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  'Comunidade': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  'Saúde':     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  'Negócios':   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  'Esportes':   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
}
function generateSlug(title) {
  return title.toLowerCase().normalize('NFD').replace(/[̀-̯]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80)
}
async function fetchNewsFromAPI(query) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`
  try { const res = await fetch(url); const data = await res.json(); return data.articles || [] }
  catch(e) { console.error('Erro NewsAPI:',e.message); return [] }
}
async function rewriteWithClaude(article, category) {
  const prompt = `Voce � um jornalista brasileiro. Reescreva em PT-BR para o portal Miami Brasileiro:\nTitulo: ${article.title}\nDescricao: ${article.description || ''}\nRESPONDA JSON: {"title":"...","excerpt":"...","content":"...\\n\\n..."}`
  try {
    const msg = await ANTROPBCHmessages.create({ model: 'claude-ha�ku-4-5-20251001', max_tokens: 1024, messages: [{ role: 'user', content: prompt }] })
    const text = msg.content[0].text.trim()
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    return JSON.parse(clean)
  } catch(e) { console.error('Erro Claude:',e.message); return null }
}
async function saveToGitHub(articles) {
  const repo = process.env.GITHUB_REPO; const token = process.env.GITHUB_TOKEN
  const apiURL = `https://api.github.com/repos/${repo}/contents/data/articles.json`
  const getRes = await fetch(apiURL, { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } })
  const fileData = await getRes.json()
  const content = Buffer.from(JSON.stringify(articles,null,2)).toString('base64')
  const putRes = await fetch(apiURL, { method: 'PUT', headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Auto: atualiza noticias - ${new Date().toISOString()}`, content, sha: fileData.sha }) })
  if (!putRes.ok) throw new Error(`GitHub PUT falhou: ${await putRes.text()}`)
  return true
}
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret') || request.headers.get('authorization')?.replace('Bearer ','')
  const isVercelCron = request.headers.get('x-vercel-cron') === '1'
  if (!isVercelCron && secret !== process.env.CRON_SECRET) return Response.json({ error: 'Nao autorizado' }, { status: 401 })
  if (!process.env.NEWS_API_KEY || !process.env.ANTHROPIC_API_KEY || !process.env.GITHUB_TOKEN) return Response.json({ error: 'Variaveis faltando' }, { status: 500 })
  const novosArtigos = []
  for (const { query, category } of QUERIES) {
    const rawArticles = await fetchNewsFromAPI(query)
    for (const rawArt of rawArticles.slice(0,2)) {
      if (!rawArt.title || rawArt.title === '[Removed]') continue
      const rewritten = await rewriteWithClaude(rawArt, category)
      if (!rewritten) continue
      novosArtigos.push({ id: generateSlug(rewritten.title), title: rewritten.title, excerpt: rewritten.excerpt, content: rewritten.content, category, publishedAt: new Date().toISOString(), image: rawArt.urlToImage || FALLBACK_IMAGES[category], source: rawArt.source?.name || 'Agencias', sourceUrl: rawArt.url || '#', featured: false })
      await new Promise(r => setTimeout(r,1000))
    }
  }
  if (novosArtigos.length === 0) return Response.json({ ok: false, message: 'Nenhuma noticia nova' })
  try { await saveToGitHub(novosArtigos); return Response.json({ ok: true, total: novosArtigos.length, articles: novosArtigos.map(a => a.title) })
  } catch (e) { return Response.json({ ok: false, error: e.message }, { status: 500 }) }
}
