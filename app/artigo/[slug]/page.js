// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

function toHtml(text) {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:var(--orange);text-decoration:underline;font-weight:600">$1</a>')
}

function ArticleContent({ content, relacionados, catColor }) {
  if (!content) return null
  // Normalize: ensure headings always have a blank line AFTER them
  // so '### Header\n- item' splits into two separate blocks
  const normalized = content
    .replace(/(#{2,3} [^\n]+)\n([^\n])/g, '$1\n\n$2')
    .replace(/(#{2,3} [^\n]+)\n([^\n])/g, '$1\n\n$2')
  const blocks = normalized.split(/\n\n+/).filter(b => b.trim().length > 0)
  // Insert "Leia também" box after block 4 if there are related articles
  const insertAt = 4

  return (
    <div className="article-content">
      {blocks.map(function(block, i) {
        const b = block.trim()
        const elements = []

        // Insert "Leia também" box mid-article
        if (i === insertAt && relacionados && relacionados.length > 0) {
          elements.push(
            <div key="leia-tb" className="leia-tambem" style={{ borderLeft: '4px solid ' + catColor }}>
              <div className="leia-tambem-label" style={{ color: catColor }}>📌 Leia também</div>
              {relacionados.slice(0, 2).map(r => (
                <Link key={r.slug || r.id} href={'/artigo/' + (r.slug || r.id)} className="leia-tambem-link">
                  {r.title}
                </Link>
              ))}
            </div>
          )
        }

        const imgMatch = b.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/)
        if (imgMatch) {
          elements.push(
            <figure key={i} className="article-figure">
              <img src={imgMatch[2]} alt={imgMatch[1]} className="article-figure-img" />
              {imgMatch[1] && <figcaption className="article-figure-caption">{imgMatch[1]}</figcaption>}
            </figure>
          )
          return elements
        }

        if (b.startsWith('## ')) {
          elements.push(<h2 key={i} className="article-h2" style={{ borderBottom: '2px solid ' + catColor }}>{b.slice(3)}</h2>)
          return elements
        }

        if (b.startsWith('### ')) {
          elements.push(<h3 key={i} className="article-h3">{b.slice(4)}</h3>)
          return elements
        }

        if (b.startsWith('**') && b.endsWith('**') && !b.slice(2,-2).includes('**')) {
          elements.push(<h3 key={i} className="article-h3">{b.slice(2,-2)}</h3>)
          return elements
        }

        if (b === '---') {
          elements.push(<hr key={i} className="article-divider" />)
          return elements
        }

        if (b.startsWith('> ')) {
          elements.push(
            <blockquote key={i} className="article-quote" style={{ borderColor: catColor }}
              dangerouslySetInnerHTML={{ __html: toHtml(b.slice(2)) }} />
          )
          return elements
        }

        if (b.startsWith('**Dica') || b.startsWith('**Importante') || b.startsWith('**Aten') || b.startsWith('**Nota')) {
          elements.push(
            <div key={i} className="article-tip" style={{ borderColor: catColor, background: catColor + '12' }}
              dangerouslySetInnerHTML={{ __html: toHtml(b) }} />
          )
          return elements
        }

        if (b.includes('|') && b.split('\n')[0].includes('|')) {
          const rows = b.split('\n').filter(r => r.trim() && !r.match(/^\|[-\s|]+\|$/))
          elements.push(
            <div key={i} className="article-table-wrap">
              <table className="article-table">
                {rows.map((row, ri) => {
                  const cells = row.split('|').filter(c => c.trim())
                  const Tag = ri === 0 ? 'th' : 'td'
                  return (
                    <tr key={ri} style={{ background: ri === 0 ? catColor : ri % 2 === 0 ? 'var(--bg-hover)' : 'transparent' }}>
                      {cells.map((cell, ci) => (
                        <Tag key={ci} className={ri === 0 ? 'article-table-th' : 'article-table-td'}
                          dangerouslySetInnerHTML={{ __html: toHtml(cell.trim()) }} />
                      ))}
                    </tr>
                  )
                })}
              </table>
            </div>
          )
          return elements
        }

        if (/^\d+\./.test(b)) {
          const lines = b.split('\n').filter(Boolean)
          elements.push(
            <ol key={i} className="article-ol">
              {lines.map((line, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: toHtml(line.replace(/^\d+\.\s*/, '')) }} />
              ))}
            </ol>
          )
          return elements
        }

        if (b.startsWith('- ') || b.startsWith('* ')) {
          const lines = b.split('\n').filter(Boolean)
          elements.push(
            <ul key={i} className="article-ul">
              {lines.map((line, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: toHtml(line.replace(/^[-*]\s*/, '')) }} />
              ))}
            </ul>
          )
          return elements
        }

        const linkMatch = b.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)(.*)$/)
        if (linkMatch) {
          elements.push(
            <p key={i} className="article-p">
              <a href={linkMatch[2]} target="_blank" rel="noreferrer" className="article-link">{linkMatch[1]}</a>
              {linkMatch[3] && <span>{linkMatch[3]}</span>}
            </p>
          )
          return elements
        }

        const html = toHtml(b)
        if (!html.trim()) return null
        elements.push(<p key={i} className="article-p" dangerouslySetInnerHTML={{ __html: html }} />)
        return elements
      })}
    </div>
  )
}

const CAT_COLORS = {
  'Imigracao': '#F4622A', 'Comunidade': '#00897B',
  'Saude': '#15803D', 'Negocios': '#7C3AED', 'Esportes': '#DC2626',
  'Cultura e Lazer': '#D97706',
}

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.slug || a.id }))
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
      images: article.image ? [article.image] : [],
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
  const relacionados = allArticles
    .filter(a => a.category === article.category && (a.slug || a.id) !== (article.slug || article.id))
    .slice(0, 4)
  const maisRecentes = allArticles
    .filter(a => (a.slug || a.id) !== (article.slug || article.id) && !relacionados.find(r => (r.slug||r.id) === (a.slug||a.id)))
    .slice(0, 4)
  const catColor = CAT_COLORS[article.category] || '#F4622A'
  const catSlug = (article.category || '').toLowerCase().replace(/ e /g, '-e-').replace(/\s+/g, '-')

  return (
    <div>
      <div className="article-page">
        <div className="article-page-grid">
          {/* Main article */}
          <article className="article-body">
            {/* Hero image */}
            {article.image && (
              <div className="article-hero">
                <img src={article.image} alt={article.title} className="article-hero-img" />
                <div className="article-hero-overlay" />
                <div className="article-hero-cat">
                  <Link href={'/categoria/' + catSlug}
                    style={{ background: catColor, color: 'white', padding: '4px 14px', borderRadius: 4,
                      fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.8px',
                      textDecoration: 'none' }}>
                    {article.category}
                  </Link>
                </div>
              </div>
            )}

            <div className="article-inner">
              {/* Breadcrumb */}
              <nav className="article-breadcrumb">
                <Link href="/">Inicio</Link>
                <span>›</span>
                <Link href={'/categoria/' + catSlug}>{article.category}</Link>
              </nav>

              {/* Title */}
              <h1 className="article-title">{article.title}</h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="article-excerpt">{article.excerpt}</p>
              )}

              {/* Meta bar */}
              <div className="article-meta-bar">
                <span className="article-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {formatDate(article.publishedAt)}
                </span>
                <span className="article-meta-sep">·</span>
                <span className="article-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {article.source || 'Miami Brasileira'}
                </span>
                <span className="article-meta-sep">·</span>
                <span className="article-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {readingTime(article.content)}
                </span>
                {article.originalUrl && (
                  <>
                    <span className="article-meta-sep">·</span>
                    <a href={article.originalUrl} target="_blank" rel="noreferrer" className="article-source-link">
                      Ver fonte original →
                    </a>
                  </>
                )}
              </div>

              {/* Content */}
              <ArticleContent content={article.content} relacionados={relacionados} catColor={catColor} />

              {/* Share */}
              <div className="article-share-wrap">
                <ShareButtons title={article.title} />
              </div>
            </div>
          </article>

          <Sidebar articles={allArticles} />
        </div>

        {/* Related articles */}
        {relacionados.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <span className="related-bar" style={{ background: catColor }} />
              <h2 className="related-title">Mais sobre {article.category}</h2>
              <Link href={'/categoria/' + catSlug} className="related-see-all" style={{ color: catColor }}>
                Ver todos →
              </Link>
            </div>
            <div className="related-grid">
              {relacionados.map(art => (
                <Link key={art.slug || art.id} href={'/artigo/' + (art.slug || art.id)} className="related-card">
                  <div className="related-card-img-wrap">
                    <img src={art.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70'}
                      alt={art.title} className="related-card-img" />
                    <span className="related-card-cat" style={{ background: catColor }}>{art.category}</span>
                  </div>
                  <div className="related-card-body">
                    <h3 className="related-card-title">{art.title}</h3>
                    <span className="related-card-meta">{formatDate(art.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mais recentes */}
        {maisRecentes.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <span className="related-bar" style={{ background: 'var(--teal)' }} />
              <h2 className="related-title">Mais Noticias</h2>
              <Link href="/" className="related-see-all" style={{ color: 'var(--teal)' }}>
                Ver home →
              </Link>
            </div>
            <div className="related-grid">
              {maisRecentes.map(art => {
                const c = CAT_COLORS[art.category] || '#555'
                return (
                  <Link key={art.slug || art.id} href={'/artigo/' + (art.slug || art.id)} className="related-card">
                    <div className="related-card-img-wrap">
                      <img src={art.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70'}
                        alt={art.title} className="related-card-img" />
                      <span className="related-card-cat" style={{ background: c }}>{art.category}</span>
                    </div>
                    <div className="related-card-body">
                      <h3 className="related-card-title">{art.title}</h3>
                      <span className="related-card-meta">{formatDate(art.publishedAt)}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  )
}
