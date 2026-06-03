// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

// Safe content renderer - no dangerouslySetInnerHTML
function ArticleContent({ content }) {
  if (!content) return null
  const blocks = content.split('\n\n').filter(function(b) { return b.trim().length > 0 })
  
  return (
    <div className="article-content">
      {blocks.map(function(block, i) {
        const b = block.trim()
        // H2
        if (b.startsWith('## ')) {
          return <h2 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, margin: '32px 0 14px', color: '#111827', borderTop: '2px solid #F3F4F6', paddingTop: 8 }}>{b.slice(3)}</h2>
        }
        // H3
        if (b.startsWith('### ')) {
          return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, margin: '26px 0 12px', color: '#111827' }}>{b.slice(4)}</h3>
        }
        // Bold-only line (heading)
        if (b.startsWith('**') && b.endsWith('**') && b.length > 4) {
          const inner = b.slice(2, -2)
          if (!inner.includes('**')) {
            return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, margin: '26px 0 12px', color: '#111827' }}>{inner}</h3>
          }
        }
        // Numbered list
        if (/^\d+\./.test(b)) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ol key={i} style={{ margin: '0 0 22px 24px', lineHeight: 1.9 }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^\d+\.\s*/, '').replace(/\*\*([^*]+)\*\*/g, '$1')
                return <li key={j}>{text}</li>
              })}
            </ol>
          )
        }
        // Bullet list
        if (b.startsWith('- ') || b.startsWith('* ')) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ul key={i} style={{ margin: '0 0 22px 24px', lineHeight: 1.9 }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^[-*]\s*/, '').replace(/\*\*([^*]+)\*\*/g, '$1')
                return <li key={j}>{text}</li>
              })}
            </ul>
          )
        }
        // Blockquote
        if (b.startsWith('> ')) {
          return <blockquote key={i} style={{ borderLeft: '4px solid #F4622A', margin: '28px 0', padding: '14px 20px', background: 'rgba(244,98,42,.05)', borderRadius: '0 6px 6px 0', fontStyle: 'italic', fontSize: 18, color: '#374151' }}>{b.slice(2)}</blockquote>
        }
        // Link lines [text](url)
        if (b.match(/^\[.+\]\(https?:\/\/.+\)/)) {
          const match = b.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(.*)$/)
          if (match) {
            return (
              <p key={i} style={{ marginBottom: 12 }}>
                <a href={match[2]} target="_blank" rel="noreferrer" style={{ color: '#00897B', textDecoration: 'underline', fontWeight: 600 }}>{match[1]}</a>
                {match[3] && <span style={{ color: '#6B7280' }}>{match[3]}</span>}
              </p>
            )
          }
        }
        // Regular paragraph - strip markdown
        const text = b.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        if (!text.trim()) return null
        return <p key={i} style={{ marginBottom: 22, fontSize: 17, lineHeight: 1.9, color: '#1F2937' }}>{text}</p>
      })}
    </div>
  )
}

const CAT_COLORS = {
  Imigracao: '#F4622A', Comunidade: '#00897B',
  Saude: '#15803D', Negocios: '#7C3AED', Esportes: '#DC2626',
}

export async function generateStaticParams() {
  return getAllArticles().map(function(a) { return { slug: a.id } })
}

export async function generateMetadata(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) return { title: 'Artigo nao encontrado' }
  return {
    title: article.title + ' | Miami Brasileira',
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      locale: 'pt_BR',
    },
  }
}

export default function ArtigoPage(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) notFound()

  const allArticles = getAllArticles()
  const relacionados = allArticles.filter(function(a) { return a.category === article.category && a.id !== article.id }).slice(0, 3)
  const catColor = CAT_COLORS[article.category] || '#00897B'

  return (
    <div>
      <Header />
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body">
            {article.image && (
              <img src={article.image} alt={article.title} className="article-hero-img" />
            )}
            <div className="article-inner">
              <div className="article-breadcrumb">
                <Link href="/">Inicio</Link> &rsaquo;&nbsp;
                <Link href={'/categoria/' + (article.category || '').toLowerCase()}>{article.category}</Link>
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ background: catColor, color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  {article.category}
                </span>
              </div>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta-bar">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.source || 'Miami Brasileira'}</span>
                <span>{readingTime(article.content)}</span>
              </div>
              {article.excerpt && (
                <p className="article-excerpt">{article.excerpt}</p>
              )}
              <ArticleContent content={article.content} />
              {article.sourceUrl && article.sourceUrl !== '#' && (
                <div className="article-source-box">
                  <span>Baseado em <strong>{article.source}</strong></span>
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer nofollow" className="article-source-link">
                    Ver fonte &rarr;
                  </a>
                </div>
              )}
              <ShareButtons title={article.title} />
            </div>
          </article>
          <Sidebar articles={allArticles} />
        </div>
        {relacionados.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="section-header">
              <div className="section-bar" />
              <h2>Noticias Relacionadas</h2>
            </div>
            <div className="article-grid">
              {relacionados.map(function(art) {
                return (
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
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
