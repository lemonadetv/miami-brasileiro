'use client'
import { useState, useEffect, useRef } from 'react'

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
  const days = Math.floor(h / 24)
  return `${days}d atrás`
}

export default function HeroCarousel({ articles = [] }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)
  const featured = articles.slice(0, 6)
  const listItems = articles.slice(6, 11)

  const go = (idx) => {
    setActive((idx + featured.length) % featured.length)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(p => (p + 1) % featured.length), 6000)
  }

  useEffect(() => {
    if (featured.length === 0) return
    timerRef.current = setInterval(() => setActive(p => (p + 1) % featured.length), 6000)
    return () => clearInterval(timerRef.current)
  }, [featured.length])

  if (featured.length === 0) return null

  const cur = featured[active]
  const catColor = CAT_COLORS[cur.category] || '#555'

  return (
    <div className="hero-wrap">
      {/* Main carousel */}
      <div className="carousel">
        {featured.map((art, i) => (
          <div key={art.slug || i} className={`carousel-slide${i === active ? ' active' : ''}`}>
            <img
              src={art.image || '/placeholder.jpg'}
              alt={art.title}
              className="carousel-img"
              style={{ height: 380 }}
            />
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <a href={`/artigo/${art.slug}`} style={{ textDecoration: 'none' }}>
                <span
                  className="carousel-cat"
                  style={{ background: CAT_COLORS[art.category] || '#555' }}
                >
                  {art.category}
                </span>
                <h2 className="carousel-title">{art.title}</h2>
                <span className="carousel-source">{art.source || 'Miami Brasileiro'} · {timeAgo(art.publishedAt)}</span>
              </a>
            </div>
          </div>
        ))}
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={() => go(active - 1)} aria-label="Anterior">&#8249;</button>
          <div className="carousel-dots">
            {featured.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === active ? ' active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button className="carousel-btn" onClick={() => go(active + 1)} aria-label="Próximo">&#8250;</button>
        </div>
      </div>

      {/* Side list */}
      <div className="hero-list">
        <div className="hero-list-header">Mais Notícias</div>
        {listItems.map((art, i) => (
          <a key={art.slug || i} href={`/artigo/${art.slug}`} className="hero-list-item">
            <img
              src={art.image || '/placeholder.jpg'}
              alt={art.title}
              className="hero-list-img"
            />
            <div className="hero-list-info">
              <span
                className="hero-list-cat"
                style={{ color: CAT_COLORS[art.category] || '#00b4a2' }}
              >
                {art.category}
              </span>
              <span className="hero-list-title">{art.title}</span>
              <span className="hero-list-time">{timeAgo(art.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
