// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

// Simple markdown -> JSX renderer
function renderContent(content) {
  const blocks = (content || '').split('\n\n').filter(Boolean)
  return blocks.map(function(block, i) {
    // H2: ## Title
    if (block.startsWith('## ')) {
      return <h2 key={i}>{block.slice(3)}</h2>
    }
    // H3: ### Title or **Title**
    if (block.startsWith('### ')) {
      return <h3 key={i}>{block.slice(4)}</h3>
    }
    if (block.startsWith('**') && block.endsWith('**') && !block.slice(2,-2).includes('**')) {
      return <h3 key={i}>{block.slice(2,-2)}</h3>
    }
    // Numbered list
    if (/^\d+\.\s/.test(block)) {
      const items = block.split('\n').filter(Boolean)
      return (
        <ol key={i} style={{ margin: '0 0 22px 24px', lineHeight: 1.9 }}>
          {items.map(function(item, j) {
            const text = item.replace(/^\d+\.\s*/, '')
            return <li key={j} dangerouslySetInnerHTML={{ __html: boldify(text) }} />
          })}
        </ol>
      )
    }
    // Bullet list
    if (block.startsWith('- ') || block.startsWith('* ')) {
      const items = block.split('\n').filter(Boolean)
      return (
        <ul key={i} style={{ margin: '0 0 22px 24px', lineHeight: 1.9 }}>
          {items.map(function(item, j) {
            const text = item.replace(/^[-*]\s*/, '')
            return <li key={j} dangerouslySetInnerHTML={{ __html: boldify(text) }} />
          })}
        </ul>
      )
    }
    // Blockquote
    if (block.startsWith('> ')) {
      return <blockquote key={i}>{block.slice(2)}</blockquote>
    }
    // Regular paragraph with inline bold
    return <p key={i} dangerouslySetInnerHTML={{ __html: boldify(block) }} />
  })
}

function boldify(text) {
  // **bold** -> <strong>bold</strong>
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#00897B;text-decoration:underline">$1</a>')
}

const CAT_COLORS = {
  'Imigracao':  '#F4622A',
  'Comunidade': '#00897B',
  'Saude':      '#15803D',
  'Negocios':   '#7C3AED',
  'Esportes':   '#DC2626',
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.id }))
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: 'Artigo nao encontrado' }
  return {
    title: article.title + ' | Miami Brasileira',
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
  if (!article) notFound()

  const allArticles = getAllArticles()
  const relacionados = allArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  const catColor = CAT_COLORS[article.category] || '#00897B'

  return (
    <>
      <Header />
      <div className="article-page">
        <div className="article-page-grid">

          <article className="article-body">
            {article.image && (
              <img src={article.image} alt={article.title} className="article-hero-img" />
            )}

            <div className="article-inner">
              {/* Breadcrumb */}
              <div className="article-breadcrumb">
                <Link href="/">Inicio</Link> &rsaquo;&nbsp;
                <Link href={'/categoria/' + (article.category || '').toLowerCase()}>{article.category}</Link> &rsaquo;&nbsp;
                {article.title.slice(0, 50)}...
              </div>

              {/* Category badge */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  background: catColor, color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px'
                }}>
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="article-title">{article.title}</h1>

              {/* Meta */}
              <div className="article-meta-bar">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.source || 'Redacao'}</span>
                <span>{readingTime(article.content)}</span>
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="article-excerpt">{article.excerpt}</p>
              )}

              {/* Content */}
              <div className="article-content">
                {renderContent(article.content)}
              </div>

              {/* Source */}
              {article.sourceUrl && article.sourceUrl !== '#' && (
                <div className="article-source-box">
                  <span>Baseado em conteudo de <strong>{article.source}</strong></span>
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer nofollow" className="article-source-link">
                    Ver fonte original &rarr;
                  </a>
                </div>
              )}

              {/* Share */}
              <ShareButtons title={article.title} />
            </div>
          </article>

          <Sidebar articles={allArticles} />
        </div>

        {/* Related */}
        {relacionados.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="section-header">
              <div className="section-bar" />
              <h2>Noticias Relacionadas</h2>
            </div>
            <div className="article-grid">
              {relacionados.map(art => (
                <Link key={art.id} href={'/artigo/' + art.id} className="article-card">
                  <img src={art.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70'} alt={art.title} />
                  <div className="card-body">
                    <div className="card-tag">{art.category}</div>
                    <h3>{art.title}</h3>
                    <div className="card-meta">
                      <span>{art.publishedAt && art.publishedAt.slice(0, 10)}</span>
                      <div className="dot" />
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
