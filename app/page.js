import { promises as fs } from 'fs'
import path from 'path'
import HeroCarousel from '@/components/HeroCarousel'
import Sidebar from '@/components/Sidebar'

const CAT_COLORS = {
  'Comunidade': '#00897B',
  'Imigracao':  '#F4622A',
  'Negocios':   '#7C3AED',
  'Saude':      '#15803D',
  'Esportes':   '#DC2626',
  'Cultura e Lazer': '#D97706',
}

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'agora'
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

async function getArticles() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'articles.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const articles = JSON.parse(raw)
    return articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  } catch {
    return []
  }
}

function MsnCard({ art, imgHeight = 'h160' }) {
  if (!art) return null
  const color = CAT_COLORS[art.category] || '#555'
  const reactions1 = ((art.slug || '').charCodeAt(0) % 40) + 5
  const reactions2 = ((art.slug || '').charCodeAt(1) % 80) + 10
  return (
    <a href={`/artigo/${art.slug}`} className="msn-card" style={{ textDecoration: 'none' }}>
      <img src={art.image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800'} alt={art.title} className={`msn-card-img ${imgHeight}`} />
      <div className="msn-card-body">
        <div className="msn-card-source">
          <span className="msn-card-cat" style={{ background: color }}>{art.category}</span>
          <span className="dot" />
          <span>{timeAgo(art.publishedAt)}</span>
        </div>
        <h3 className="msn-card-title">{art.title}</h3>
        <div className="msn-card-footer">
          <div className="msn-card-reactions">
            <span>💬 {reactions1}</span>
            <span>❤️ {reactions2}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

function MsnCardWide({ art }) {
  if (!art) return null
  const color = CAT_COLORS[art.category] || '#555'
  return (
    <a href={`/artigo/${art.slug}`} className="msn-card-wide" style={{ textDecoration: 'none' }}>
      <img src={art.image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800'} alt={art.title} className="msn-card-wide-img" />
      <div className="msn-card-wide-body">
        <div>
          <span style={{ fontSize: 9, fontWeight: 800, background: color, color: 'white', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>{art.category}</span>
        </div>
        <div className="msn-card-wide-title" style={{ marginTop: 5 }}>{art.title}</div>
        <div className="msn-card-wide-meta">{timeAgo(art.publishedAt)} · {art.source || 'Miami Brasileiro'}</div>
      </div>
    </a>
  )
}

function CatBlock({ title, color, articles }) {
  if (!articles || articles.length === 0) return null
  const [main, ...rest] = articles
  const emoji = { 'Comunidade': '🏙️', 'Imigracao': '✈️', 'Negocios': '💼', 'Saude': '🏥', 'Esportes': '⚽', 'Cultura e Lazer': '🎭' }[title] || '📰'
  const catSlug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
  return (
    <div className="cat-block section-wrap">
      <div className="section-hd">
        <div className="section-hd-bar" style={{ background: color }} />
        <span className="section-hd-title">{emoji} {title}</span>
        <a href={`/categoria/${catSlug}`} className="section-hd-link">Ver todas →</a>
      </div>
      <div className="cat-block-grid">
        <a href={`/artigo/${main.slug}`} className="cat-block-main">
          <img src={main.image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800'} alt={main.title} className="cat-block-main-img" />
          <div className="cat-block-main-body">
            <h3 className="cat-block-main-title">{main.title}</h3>
            {main.excerpt && <p className="cat-block-main-excerpt">{main.excerpt.slice(0, 100)}...</p>}
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>{timeAgo(main.publishedAt)}</div>
          </div>
        </a>
        <div className="cat-block-list">
          {rest.slice(0, 4).map((art, i) => (
            <a key={art.slug || i} href={`/artigo/${art.slug}`} className="cat-list-item">
              <img src={art.image || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=800'} alt={art.title} className="cat-list-img" />
              <div>
                <span className="cat-list-title">{art.title}</span>
                <span className="cat-list-time">{timeAgo(art.publishedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  const articles = await getArticles()
  const CATEGORIES = ['Comunidade', 'Imigracao', 'Negocios', 'Saude', 'Esportes', 'Cultura e Lazer']
  const byCategory = {}
  CATEGORIES.forEach(cat => { byCategory[cat] = articles.filter(a => a.category === cat) })
  const gridArticles = CATEGORIES.flatMap(cat => byCategory[cat].slice(0, 2)).slice(0, 8)
  const trending = articles.slice(0, 8)

  return (
    <div className="msn-page">
      <HeroCarousel articles={articles} />
      <div className="msn-layout">
        <div className="msn-main">
          {gridArticles.length > 0 && (
            <div className="section-wrap">
              <div className="section-hd">
                <div className="section-hd-bar" style={{ background: 'var(--teal)' }} />
                <span className="section-hd-title">📰 Em Destaque</span>
              </div>
              <div className="msn-grid msn-grid-4">
                {gridArticles.map((art, i) => (
                  <MsnCard key={art.slug || i} art={art} imgHeight={i < 2 ? 'h200' : 'h140'} />
                ))}
              </div>
            </div>
          )}
          {CATEGORIES.map(cat => (
            <CatBlock key={cat} title={cat} color={CAT_COLORS[cat]} articles={byCategory[cat]} />
          ))}
          {articles.length > 0 && (
            <div className="section-wrap">
              <div className="section-hd">
                <div className="section-hd-bar" style={{ background: 'var(--orange)' }} />
                <span className="section-hd-title">🕐 Mais Recentes</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {articles.slice(0, 10).map((art, i) => (
                  <MsnCardWide key={art.slug || i} art={art} />
                ))}
              </div>
            </div>
          )}
        </div>
        <Sidebar articles={trending} />
      </div>
    </div>
  )
    }
