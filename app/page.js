// app/page.js — Página inicial do portal
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import {
  getAllArticles,
  getFeaturedArticle,
  getLatestArticles,
  getArticlesByCategory,
  formatDateShort,
  readingTime
} from '../lib/articles'

// Mapa de classes CSS por categoria
function getCatClass(cat = '') {
  const map = {
    'Imigração': 'cat-imigracao',
    'Comunidade': 'cat-comunidade',
    'Saúde': 'cat-saude',
    'Negócios': 'cat-negocios',
    'Esportes': 'cat-esportes',
  }
  return map[cat] || 'cat-default'
}

// Imagem de fallback por categoria
function getFallbackImage(cat = '') {
  const map = {
    'Imigração': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70',
    'Comunidade': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
    'Saúde':      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
    'Negócios':   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70',
    'Esportes':   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=70',
  }
  return map[cat] || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=70'
}

export default function HomePage() {
  const allArticles  = getAllArticles()
  const featured     = getFeaturedArticle()
  const latest       = getLatestArticles(6)
  const imigracao    = getArticlesByCategory('Imigração').slice(0, 4)
  const negocios     = getArticlesByCategory('Negócios').slice(0, 4)
  const esportes     = getArticlesByCategory('Esportes').slice(0, 4)

  // Dois artigos para o hero secundário (excluindo o destaque)
  const heroSide = allArticles.filter(a => a.id !== featured?.id).slice(0, 2)

  return (
    <>
      <Header />

      <div className="page">
        <div className="main-grid">

          {/* ===== LEFT COLUMN ===== */}
          <div>

            {/* ── HERO ── */}
            {featured && (
              <div className="hero" style={{marginBottom:'28px'}}>

                {/* Principal */}
                <Link href={`/artigo/${featured.id}`} className="hero-main">
                  <img
                    src={featured.image || getFallbackImage(featured.category)}
                    alt={featured.title}
                  />
                  <div className="hero-overlay" />
                  <div className="hero-content">
                    <span className={`cat-tag ${getCatClass(featured.category)}`}>
                      {featured.category}
                    </span>
                    <h1>{featured.title}</h1>
                    <div className="hero-meta">
                      📅 {formatDateShort(featured.publishedAt)} &nbsp;·&nbsp;
                      ⏱ {readingTime(featured.content)}
                    </div>
                  </div>
                </Link>

                {/* Secundários */}
                {heroSide.map(art => (
                  <Link key={art.id} href={`/artigo/${art.id}`} className="hero-side">
                    <img
                      src={art.image || getFallbackImage(art.category)}
                      alt={art.title}
                    />
                    <div className="hero-overlay" />
                    <div className="hero-side-content">
                      <span className={`cat-tag ${getCatClass(art.category)}`} style={{fontSize:'9px',padding:'2px 6px'}}>
                        {art.category}
                      </span>
                      <h3>{art.title}</h3>
                    </div>
                  </Link>
                ))}

              </div>
            )}

            {/* ── ÚLTIMAS NOTӍCIAS ── */}
            <div className="section-header">
              <div className="section-bar" />
              <h2>Últimas Notícias</h2>
              <Link href="/todas" className="see-all">Ver todas →</Link>
            </div>

            <div className="article-grid">
              {latest.map(art => (
                <Link key={art.id} href={`/artigo/${art.id}`} className="article-card">
                  <img
                    src={art.image || getFallbackImage(art.category)}
                    alt={art.title}
                  />
                  <div className="card-body">
                    <div className="card-tag">{art.category}</div>
                    <h3>{art.title}</h3>
                    <div className="card-meta">
                      <span>{formatDateShort(art.publishedAt)}</span>
                      <span className="dot" />
                      <span>{readingTime(art.content)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── IMIGRAÇÃO ── */}
            {imigracao.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" />
                  <h2>✈️ Imigração & Vistos</h2>
                  <Link href="/categoria/imigracao" className="see-all">Ver mais →</Link>
                </div>

                {/* Destaque da categoria */}
                {imigracao[0] && (
                  <Link href={`/artigo/${imigracao[0].id}`} className="featured-wide">
                    <img
                      src={imigracao[0].image || getFallbackImage('Imigração')}
                      alt={imigracao[0].title}
                    />
                    <div className="info">
                      <div className="tag">Destaque</div>
                      <h3>{imigracao[0].title}</h3>
                      <p>{imigracao[0].excerpt}</p>
                      <div className="meta">
                        📅 {formatDateShort(imigracao[0].publishedAt)} &nbsp;·&nbsp;
                        ⏱ {readingTime(imigracao[0].content)}
                      </div>
                    </div>
                  </Link>
                )}

                <div className="article-list">
                  {imigracao.slice(1).map(art => (
                    <Link key={art.id} href={`/artigo/${art.id}`} className="article-list-item">
                      <img
                        src={art.image || getFallbackImage(art.category)}
                        alt={art.title}
                      />
                      <div className="info">
                        <div className="tag">{art.category}</div>
                        <h4>{art.title}</h4>
                        <div className="time">{formatDateShort(art.publishedAt)} · {readingTime(art.content)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── NEGÓCIOS ── */}
            {negocios.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" />
                  <h2>💼 Negócios & Empreendedorismo</h2>
                  <Link href="/categoria/negocios" className="see-all">Ver mais →</Link>
                </div>
                <div className="cat-grid-2">
                  {negocios.map(art => (
                    <Link key={art.id} href={`/artigo/${art.id}`} className="article-card">
                      <img
                        src={art.image || getFallbackImage('Negócios')}
                        alt={art.title}
                      />
                      <div className="card-body">
                        <div className="card-tag">{art.category}</div>
                        <h3>{art.title}</h3>
                        <div className="card-meta">
                          <span>{formatDateShort(art.publishedAt)}</span>
                          <span className="dot" />
                          <span>{readingTime(art.content)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── ESPORTES ── */}
            {esportes.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" />
                  <h2>⚽ Esportes & Copa 2026</h2>
                  <Link href="/categoria/esportes" className="see-all">Ver mais →</Link>
                </div>
                <div className="article-list">
                  {esportes.map(art => (
                    <Link key={art.id} href={`/artigo/${art.id}`} className="article-list-item">
                      <img
                        src={art.image || getFallbackImage('Esportes')}
                        alt={art.title}
                      />
                      <div className="info">
                        <div className="tag">{art.category}</div>
                        <h4>{art.title}</h4>
                        <div className="time">{formatDateShort(art.publishedAt)} · {readingTime(art.content)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>{/* /left col */}

          {/* ===== SIDEBAR ===== */}
          <Sidebar articles={allArticles} />

        </div>
      </div>

      <Footer />
    </>
  )
}
