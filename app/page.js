// app/page.js - Layout inspirado no UOL
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import { getAllArticles, getFeaturedArticle, getArticlesByCategory, formatDateShort, readingTime } from '../lib/articles'

const CAT_CONFIG = {
  'Imigracao':  { color: '#F4622A', bg: '#FFF7ED', label: 'Imigracao' },
  'Comunidade': { color: '#00897B', bg: '#F0FDF4', label: 'Comunidade' },
  'Saude':      { color: '#15803D', bg: '#F0FDF4', label: 'Saude' },
  'Negocios':   { color: '#7C3AED', bg: '#F5F3FF', label: 'Negocios' },
  'Esportes':   { color: '#DC2626', bg: '#FEF2F2', label: 'Esportes' },
}
function catColor(c) { return (CAT_CONFIG[c] || {}).color || '#00897B' }

function getImg(a) {
  return a.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=70'
}

function FeaturedCard({ article }) {
  if (!article) return null
  return (
    <Link href={'/artigo/' + article.id} className="featured-main-card">
      <img src={getImg(article)} alt={article.title} />
      <div className="fmc-overlay" />
      <div className="fmc-content">
        <span className="fmc-cat" style={{ background: catColor(article.category) }}>{article.category}</span>
        <h2 className="fmc-title">{article.title}</h2>
        {article.excerpt && <p className="fmc-excerpt">{article.excerpt.slice(0, 100)}...</p>}
        <div className="fmc-meta">{formatDateShort(article.publishedAt)} &middot; {readingTime(article.content)}</div>
      </div>
    </Link>
  )
}

function StackItem({ article }) {
  return (
    <Link href={'/artigo/' + article.id} className="stack-item">
      <img src={getImg(article)} alt={article.title} />
      <div className="si-info">
        <span className="si-cat" style={{ color: catColor(article.category) }}>{article.category}</span>
        <h4 className="si-title">{article.title}</h4>
        <div className="si-meta">{formatDateShort(article.publishedAt)}</div>
      </div>
    </Link>
  )
}

function CompactCard({ article }) {
  return (
    <Link href={'/artigo/' + article.id} className="compact-card">
      <img src={getImg(article)} alt={article.title} />
      <div className="cc-body">
        <span className="cc-cat" style={{ background: catColor(article.category) }}>{article.category}</span>
        <h3 className="cc-title">{article.title}</h3>
        <div className="cc-meta">{formatDateShort(article.publishedAt)} &middot; {readingTime(article.content)}</div>
      </div>
    </Link>
  )
}

function CatBlock({ category, articles, seeAllHref }) {
  if (!articles.length) return null
  const cfg = CAT_CONFIG[category] || { color: '#00897B', bg: '#F9FAFB' }
  const main = articles[0]
  const rest = articles.slice(1, 4)
  return (
    <div className="cat-block" style={{ borderTopColor: cfg.color }}>
      <div className="cat-block-header" style={{ background: cfg.bg }}>
        <span className="cat-block-title" style={{ color: cfg.color }}>{category.toUpperCase()}</span>
        <Link href={seeAllHref} className="cat-block-see-all" style={{ color: cfg.color }}>Ver todas &rarr;</Link>
      </div>
      <div className="cat-block-body">
        <Link href={'/artigo/' + main.id} className="cat-main-story">
          <img src={getImg(main)} alt={main.title} />
          <h3>{main.title}</h3>
          {main.excerpt && <p>{main.excerpt.slice(0, 80)}...</p>}
          <div className="cat-meta">{formatDateShort(main.publishedAt)} &middot; {readingTime(main.content)}</div>
        </Link>
        <div className="cat-side-list">
          {rest.map(function(a) {
            return (
              <Link key={a.id} href={'/artigo/' + a.id} className="cat-side-item">
                <img src={getImg(a)} alt={a.title} />
                <div>
                  <h4>{a.title}</h4>
                  <span>{formatDateShort(a.publishedAt)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const all       = getAllArticles()
  const featured  = getFeaturedArticle()
  const rest      = all.filter(function(a) { return a.id !== (featured && featured.id) })
  const heroStack = rest.slice(0, 4)
  const grid4     = rest.slice(4, 8)
  const grid4b    = rest.slice(8, 12)
  const imigracao = getArticlesByCategory('Imigracao').slice(0, 4)
  const negocios  = getArticlesByCategory('Negocios').slice(0, 4)
  const saude     = getArticlesByCategory('Saude').slice(0, 4)
  const esportes  = getArticlesByCategory('Esportes').slice(0, 4)
  const comunidade = getArticlesByCategory('Comunidade').slice(0, 4)
  return (
    <>
      <Header />
      <div className="page">
        <div className="hero-block">
          <FeaturedCard article={featured} />
          <div className="hero-stack">
            {heroStack.map(function(a) { return <StackItem key={a.id} article={a} /> })}
          </div>
        </div>
        <div className="page-columns">
          <div className="page-main">
            {grid4.length > 0 && (<div className="section-wrap"><div className="section-header"><div className="section-bar" /><h2>Ultimas Noticias</h2><Link href="/" className="see-all">Ver mais &rarr;</Link></div><div className="grid-4">{arid4.map(function(a) { return <CompactCard key={a.id} article={a} /> })}</div></div>)}
            <CatBlock category="Imigracao" articles={imigracao} seeAllHref="/categoria/imigracao" />
            <CatBlock category="Negocios" articles={negocios} seeAllHref="/categoria/negocios" />
            {grid4b.length > 0 && (<div className="section-wrap"><div className="section-header"><div className="section-bar" style={{ background: '#15803D' }} /><h2>Saude &amp; Comunidade</h2></div><div className="grid-4">{grid4b.map(function(a) { return <CompactCard key={a.id} article={a} /> })}</div></div>)}
            <CatBlock category="Saude" articles={saude} seeAllHref="/categoria/saude" />
            <CatBlock category="Esportes" articles={esportes} seeAllHref="/categoria/esportes" />
            <CatBlock category="Comunidade" articles={comunidade} seeAllHref="/categoria/comunidade" />
          </div>
          <Sidebar articles={all} />
        </div>
      </div>
      <Footer />
    </>
  )
}
