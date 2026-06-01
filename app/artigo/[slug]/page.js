// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

function renderContent(content) {
  const blocks = (content || '').split('\n\n').filter(Boolean)
  return blocks.map(function(block, i) {
    if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>
    if (block.startsWith('### ')) return <h3 key={i}>{block.slice(4)}</h3>
    return <p key={i}>{block}</p>
  })
}

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.id }))
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
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: 'article',
    },
  }
}

export default function ArtigoPage({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()
  const allArticles = getAllArticles()
  const relacionados = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: 'Miami Brasileira' },
    articleSection: article.category,
    inLanguage: 'pt-BR',
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://miami-brasileiro.vercel.app' },
      { '@type': 'ListItem', position: 2, name: article.title },
    ]
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body" itemScope itemType="https://schema.org/Article">
            <h1 itemProp="headline">{article.title}</h1>
            <div className="article-content" itemProp="articleBody">
              {renderContent(article.content)}
            </div>
            <ShareButtons title={article.title} />
          </article>
          <Sidebar articles={allArticles} />
        </div>
      </div>
      <Footer />
    </>
  )
}
