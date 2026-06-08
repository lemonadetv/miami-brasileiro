// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

// Parse inline markdown: **bold** and [text](url)
function parseInline(text) {
  const result = []
  const re = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g
  let last = 0, m, k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) result.push(text.slice(last, m.index))
    if (m[0].startsWith('**')) {
      result.push(<strong key={k++} style={{ fontWeight: 700, color: '#111827' }}>{m[2]}</strong>)
    } else {
      result.push(
        <a key={k++} href={m[4]} target="_blank" rel="noreferrer"
           style={{ color: '#00897B', textDecoration: 'underline', fontWeight: 600 }}>
          {m[3]}
        </a>
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) result.push(text.slice(last))
  return result
}

// Pick an emoji icon for h3 headings based on keywords
function headingIcon(text) {
  const t = text.toLowerCase()
  if (/link|recurso|site|portal|acesso/.test(t)) return '🔗'
  if (/document|visto|passaporte|apostil|certidao/.test(t)) return '📄'
  if (/custo|taxa|valor|preco|dolar|reais|salario|pagamento|quanto/.test(t)) return '💰'
  if (/saude|medico|hospital|plano|seguro|medicament/.test(t)) return '🏥'
  if (/trabalho|emprego|carreira|profiss|contrat|curricul/.test(t)) return '💼'
  if (/moradia|aluguel|imovel|apartamento|casa|bairro/.test(t)) return '🏠'
  if (/esporte|futebol|inter miami|treino|jogo|partida/.test(t)) return '⚽'
  if (/escola|educacao|curso|estudo|faculdade|colegio/.test(t)) return '🎓'
  if (/viagem|voo|aeroporto|passagem|chegada/.test(t)) return '✈️'
  if (/comunidade|brasileiro|florida|miami/.test(t)) return '🌎'
  if (/dica|importante|atencao|cuidado|erro|evitar/.test(t)) return '💡'
  if (/passo|etapa|processo|como fazer|o que fazer/.test(t)) return '📋'
  return '📌'
}

// Detect if a paragraph has a key stat (dollar, %, years, etc.)
function hasStat(text) {
  return /\$[\d,]+|R\$[\d,]+|\d+%|\d+ anos|\d+ meses|\d+ dias/.test(text)
}

function ArticleContent({ content, category }) {
  if (!content) return null

  // Normalize: ensure headings and standalone links start new blocks
  const normalized = content
    .replace(/\n(#{2,3} )/g, '\n\n$1')
    .replace(/\n(\[[^\]]+\]](https?:)/g, '\n\n$1')
    .replace(/—/g, ' - ')  // catch any remaining em dashes

  const blocks = normalized.split('\n\n').filter(function(b) { return b.trim().length > 0 })

  const catAccent = {
    Imigracao: '#F4622A', Comunidade: '#00897B',
    Saude: '#15803D', Negocios: '#7C3AED', Esportes: '#DC2626',
  }[category] || '#00897B'

  return (
    <div className="article-content">
      {blocks.map(function(block, i) {
        const b = block.trim()

        // Inline image
        const imgMatch = b.match(/^!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)$/)
        if (imgMatch) {
          return (
            <figure key={i} style={{ margin: '28px 0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
              <img src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
              {imgMatch[1] && <figcaption style={{ fontSize: 12, color: '#9CA3AF', padding: '8px 12px', textAlign: 'center', fontStyle: 'italic', background: '#F9FAFB' }}>{imgMatch[1]}</figcaption>}
            </figure>
          )
        }

        // H2
        if (b.startsWith('## ')) {
          const title = b.split('\n')[0].slice(3)
          return (
            <h2 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, margin: '36px 0 16px', color: '#111827', borderLeft: '4px solid ' + catAccent, paddingLeft: 14 }}>
              {title}
            </h2>
          )
        }

        // H3 with icon
        if (b.startsWith('### ')) {
          const title = b.split('\n')[0].slice(4)
          const icon = headingIcon(title)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '30px 0 14px', padding: '10px 16px', background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid ' + catAccent }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{title}</h3>
            </div>
          )
        }

        // Bold-only heading
        if (b.startsWith('**') && b.endsWith('**') && b.length > 4) {
          const inner = b.slice(2, -2)
          if (!inner.includes('**')) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '26px 0 12px', padding: '8px 14px', background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid ' + catAccent }}>
                <span style={{ fontSize: 18 }}>📌</span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{inner}</h3>
              </div>
            )
          }
        }

        // Numbered list
        if (/^\d+\./.test(b)) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ol key={i} style={{ margin: '0 0 22px 0', padding: 0, listStyle: 'none' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^\d+\.\s*/, '')
                return (
                  <li key={j} style={{ display: 'flex', gap: 12, marginBottom: 10, lineHeight: 1.8, alignItems: 'flex-start' }}>
                    <span style={{ minWidth: 26, height: 26, background: catAccent, color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{j + 1}</span>
                    <span style={{ color: '#1F2937', fontSize: 16 }}>{parseInline(text)}</span>
                  </li>
                )
              })}
            </ol>
          )
        }

        // Bullet list
        if (b.startsWith('- ') || b.startsWith('* ')) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ul key={i} style={{ margin: '0 0 22px 0', padding: 0, listStyle: 'none' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^[-*]\s*/, '')
                return (
                  <li key={j} style={{ display: 'flex', gap: 10, marginBottom: 8, lineHeight: 1.8, alignItems: 'flex-start' }}>
                    <span style={{ color: catAccent, fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>▸</span>
                    <span style={{ color: '#1F2937', fontSize: 16 }}>{parseInline(text)}</span>
                  </li>
                )
              })}
            </ul>
          )
        }

        // Blockquote → styled callout box
        if (b.startsWith('> ')) {
          return (
            <div key={i} style={{ margin: '24px 0', padding: '16px 20px', background: 'linear-gradient(135deg, rgba(244,98,42,.06), rgba(0,137,123,.06))', borderLeft: '4px solid ' + catAccent, borderRadius: '0 10px 10px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: 17, color: '#374151', lineHeight: 1.8 }}>{parseInline(b.slice(2))}</p>
            </div>
          )
        }

        // Standalone link → styled link card
        const linkMatch = b.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(.*)$/)
        if (linkMatch) {
          const desc = linkMatch[3].replace(/^[\s\--–:]+/, '').trim()
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer"
               style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', margin: '8px 0', background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: 8, textDecoration: 'none', transition: 'background .2s' }}
               onMouseOver={function(e){ e.currentTarget.style.background='#DCFCE7' }}
               onMouseOut={function(e){ e.currentTarget.style.background='#F0FDF4' }}>
              <span style={{ fontSize: 20 }}>🔗</span>
              <div>
                <div style={{ fontWeight: 700, color: '#065F46', fontSize: 15 }}>{linkMatch[1]}</div>
                {desc && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{desc}</div>}
              </div>
              <span style={{ marginLeft: 'auto', color: '9CA3AF', fontSize: 18 }}>→</span>
            </a>
          )
        }

        // Stat callout — paragraph with dollar/percent/number
        if (hasStat(b) && b.length < 200) {
          return (
            <div key={i} style={{ margin: '20px 0', padding: '16px 20px', background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1px solid #FED7AA', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>📊</span>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.8, color: '#1F2937' }}>{parseInline(b)}</p>
            </div>
          )
        }

        // Regular paragraph
        const inlineContent = parseInline(b)
        if (!inlineContent.length) return null
        return <p key={i} style={{ marginBottom: 22, fontSize: 17, lineHeight: 1.9, color: '#1F2937' }}>{inlineContent}</p>
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
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.publishedAt, locale: 'pt_BR' },
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
            {article.image && <img src={article.image} alt={article.title} className="article-hero-img" />}
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
              {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
              <ArticleContent content={article.content} category={article.category} />
              {article.sourceUrl && article.sourceUrl !== '#' && (
                <div className="article-source-box">
                  <span>Baseado em <strong>{article.source}</strong></span>
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer nofollow" className="article-source-link">Ver fonte &rarr;</a>
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
