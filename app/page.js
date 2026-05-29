// app/page.js
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import { getAllArticles, getFeaturedArticle, getArticlesByCategory, formatDateShort, readingTime } from '../lib/articles'

const FALLBACK = {
  'Imigração': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70',
  'Comunidade': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
  'Saúde':      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
  'Negócios':   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70',
  'Esportes':   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=70',
  '_default':   'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=70',
}
function getImg(a) { return a.image || FALLBACK[a.category] || FALLBACK._default }

const CAT_CLASS = {
  'Imigração': 'cat-imigracao',
  'Comunidade': 'cat-comunidade',
  'Saúde': 'cat-saude',
  'Negócios': 'cat-negocios',
  'Esportes': 'cat-esportes',
}
function catCls(c) { return CAT_CLASS[c] || 'cat-default' }

export default function HomePage() {
  const all      = getAllArticles()
  const featured = getFeaturedArticle()
  const rest     = all.filter(a => a.id !== featured?.id)
  const mosaic   = rest.slice(2, 10)

  const imigracao = getArticlesByCategory('Imigração').slice(0, 2)
  const negocios  = getArticlesByCategory('Negócios').slice(0, 4)
  const esportes  = getArticlesByCategory('Esportes').slice(0, 3)

  return (
    <>
      <Header />
      <div className="page">

        {featured && (
          <div className="hero-strip" style={{ marginBottom: 28 }}>
            <Link href={`/artigo/${featured.id}`} className="hero-main-card">
              <img src={getImg(featured)} alt={featured.title} />
              <div className="hero-overlay" />
              <div className="hero-main-content">
                <span className={`cat-tag ${catCls(featured.category)}`}>{featured.category}</span>
                <h1>{featured.title}</h1>
                <div className="hero-meta">{formatDateShort(featured.publishedAt)} &middot; {readingTime(featured.content)}</div>
              </div>
            </Link>
            <div className="hero-side-col">
              {rest.slice(0, 2).map(a => (
                <Link key={a.id} href={`/artigo/${a.id}`} className="hero-side-card">
                  <img src={getImg(a)} alt={a.title} />
                  <div className="hero-side-content">
                    <span className={`cat-tag ${catCls(a.category)}`}>{a.category}</span>
                    <h3>{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hero-side-col">
              {rest.slice(2, 4).map(a => (
                <Link key={a.id} href={`/artigo/${a.id}`} className="hero-side-card">
                  <img src={getImg(a)} alt={a.title} />
                  <div className="hero-side-content">
                    <span className={`cat-tag ${catCls(a.category)}`}>{a.category}</span>
                    <h3>{a.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="main-grid">
          <div>

            {mosaic.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" />
                  <h2>Últimas Notícias</h2>
                  <Link href="/categoria/comunidade" className="see-all">Ver todas &rarr;</Link>
                </div>
                <div className="mosaic-grid">
                  {mosaic.map(a => (
                    <Link key={a.id} href={`/artigo/${a.id}`} className="mosaic-card">
                      <img src={getImg(a)} alt={a.title} />
                      <div className="mc-body">
                        <div className={`cat-tag ${catCls(a.category)}`}>{a.category}</div>
                        <h3>{a.title}</h3>
                        <div className="mc-meta">{formatDateShort(a.publishedAt)} &middot; {readingTime(a.content)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {imigracao.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" style={{ background: 'var(--orange)' }} />
                  <h2>Imigração</h2>
                  <Link href="/categoria/imigracao" className="see-all">Ver todas &rarr;</Link>
                </div>
                <div className="cat-grid-2">
                  {imigracao.map(a => (
                    <Link key={a.id} href={`/artigo/${a.id}`} className="featured-wide">
                      <img src={getImg(a)} alt={a.title} />
                      <div className="info">
                        <div className="tag">Imigração</div>
                        <h3>{a.title}</h3>
                        <div className="meta">{formatDateShort(a.publishedAt)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {negocios.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" style={{ background: '#7C3AED' }} />
                  <h2>Negócios</h2>
                  <Link href="/categoria/negocios" className="see-all">Ver todas &rarr;</Link>
                </div>
                <div className="article-grid">
                  {negocios.map(a => (
                    <Link key={a.id} href={`/artigo/${a.id}`} className="article-card">
                      <img src={getImg(a)} alt={a.title} />
                      <div className="card-body">
                        <div className="card-tag">Negócios</div>
                        <h3>{a.title}</h3>
                        <div className="card-meta"><span>{formatDateShort(a.publishedAt)}</span><div className="dot" /><span>{readingTime(a.content)}</span></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {esportes.length > 0 && (
              <div className="category-section">
                <div className="section-header">
                  <div className="section-bar" style={{ background: '#DC2626' }} />
                  <h2>Esportes</h2>
                  <Link href="/categoria/esportes" className="see-all">Ver todas &rarr;</Link>
                </div>
                <div className="cat-grid-2">
                  {esportes.map(a => (
                    <Link key={a.id} href={`/artigo/${a.id}`} className="featured-wide">
                      <img src={getImg(a)} alt={a.title} />
                      <div className="info">
                        <div className="tag">Esportes</div>
                        <h3>{a.title}</h3>
                        <div className="meta">{formatDateShort(a.publishedAt)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
          <Sidebar articles={all} />
        </div>
      </div>
      <Footer />
    </>
  )
}
