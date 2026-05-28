// app/artigo/[slug]/page.js — Página de artigo individual
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import Link from 'next/link'
import {
  getAllArticles,
  getArticleBySlug,
  formatDate,
  readingTime
} from '../../../lib/articles'

// Gera as páginas estáticas para cada artigo
export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.id }))
}

// Gera os metadados de SEO de cada artigo
export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: 'Artigo não encontrado' }
  return {
    title: `${article.title} | Miami Brasileiro`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    }
  }
}

export default function ArtigoPage({ params }) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const allArticles = getAllArticles()

  // Artigos relacionados: mesma categoria, exceto o atual
  const relacionados = allArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  // Formata o conteúdo: quebra de linha dupla vira parágrafo
  const paragrafos = (article.content || '').split('\n\n').filter(Boolean)

  return (
    <>
      <Header />

      <div className="article-page">
        <div className="article-page-grid">

          {/* ===== ARTIGO ===== */}
          <article className="article-body">

            {/* Imagem de capa */}
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="article-hero-img"
              />
            )}

            <div className="article-inner">

              {/* Breadcrumb */}
              <div className="article-breadcrumb">
                <Link href="/">Início</Link> &rsaquo;&nbsp;
                <Link href={`/categoria/${article.category.toLowerCase()}`}>{article.category}</Link> &rsaquo;&nbsp;
                {article.title.slice(0, 60)}...
              </div>

              {/* Categoria */}
              <div style={{marginBottom:'10px'}}>
                <span style={{
                  background: article.category === 'Imigração' ? '#F4622A' :
                              article.category === 'Saúde'     ? '#15803D' :
                              article.category === 'Negócios'  ? '#7C3AED' :
                              article.category === 'Esportes'  ? '#DC2626' : '#00897B',
                  color:'white', fontSize:'11px', fontWeight:700,
                  padding:'3px 10px', borderRadius:'3px',
                  textTransform:'uppercase', letterSpacing:'.5px'
                }}>
                  {article.category}
                </span>
              </div>

              {/* Título */}
              <h1 className="article-title">{article.title}</h1>

              {/* Meta */}
              <div className="article-meta-bar">
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>✍️ {article.source || 'Redação'}</span>
                <span>⏱ {readingTime(article.content)}</span>
              </div>

              {/* Resumo (excerpt) */}
              {article.excerpt && (
                <p className="article-excerpt">{article.excerpt}</p>
              )}

              {/* Conteúdo */}
              <div className="article-content">
                {paragrafos.map((par, i) => {
                  // Suporte básico a títulos no conteúdo (**Título** vira <h3>)
                  if (par.startsWith('**') && par.endsWith('**')) {
                    return <h3 key={i}>{par.slice(2, -2)}</h3>
                  }
                  return <p key={i}>{par}</p>
                })}
              </div>

              {/* Box de fonte original */}
              {article.sourceUrl && article.sourceUrl !== '#' && (
                <div className="article-source-box">
                  <span>📰 Baseado em conteúdo de <strong>{article.source}</strong></span>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer nofollow"
                    className="article-source-link"
                  >
                    Ver fonte original →
                  </a>
                </div>
              )}

              {/* Compartilhar */}
              <div className="article-share">
                <span className="share-label">Compartilhar:</span>
                <button
                  className="share-btn share-fb"
                  onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                >
                  📘 Facebook
                </button>
                <button
                  className="share-btn share-wa"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`)}
                >
                  💬 WhatsApp
                </button>
              </div>

            </div>
          </article>

          {/* ===== SIDEBAR ===== */}
          <Sidebar articles={allArticles} />

        </div>

        {/* ===== RELACIONADOS ===== */}
        {relacionados.length > 0 && (
          <div style={{marginTop:'40px'}}>
            <div className="section-header">
              <div className="section-bar" />
              <h2>Notícias Relacionadas</h2>
            </div>
            <div className="article-grid">
              {relacionados.map(art => (
                <Link key={art.id} href={`/artigo/${art.id}`} className="article-card">
                  <img
                    src={art.image || `https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70`}
                    alt={art.title}
                  />
                  <div className="card-body">
                    <div className="card-tag">{art.category}</div>
                    <h3>{art.title}</h3>
                    <div className="card-meta">
                      <span>{art.publishedAt?.slice(0,10)}</span>
                      <span className="dot" />
                      <span>{readingTime(art.content)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  )
}
