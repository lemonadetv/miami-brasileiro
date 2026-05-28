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

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.id }))
}

export async function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) return { title: 'Artigo não encontrado' }
  return {
    title: `${article.title} | Miami Brasileiro`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [{ url: article.image }] }
  }
}

export default function ArtigoPage({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!article) { notFound() }
  const allArticles = getAllArticles()
  const relacionados = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3)
  const paragrafos = (article.content || '').split('\n\n').filter(Boolean)

  return (
    <>
      <Header />
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body">
            {article.image && (<img src={article.image} alt={article.title} className="article-hero-img" />)}
            <div className="article-inner">
              <div className="article-breadcrumb">
                <Link href="/">Inicio</Link> &rsaquo;&nbsp;
                <Link href={`/categoria/${article.category.toLowerCase()}`}>{article.category}</Link> &rsaquo;</div>
              <h1>{article.title}</h1>
              <div className="article-meta-bar">
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>{rticle.source || 'Redacao'}</span>
                <span>⏱ {readingTime(article.content)}</span>
              </div>
              {article.excerpt && (<p className="article-excerpt">{article.excerpt}</p>)}
              <div className="article-content">
                {paragrafos.map((par, i) => {
                  if (par.startsWith('**') && par.endsWith('**')) return <h3 key={i}>{par.slice(2,-2)}</h3>
                  return <p key={i}>{par}</p>
                })}
              </div>
              <div className="article-share">
                <span className="share-label">Compartilhar:</span>
              </div>
            </div>
          </article>
          <Sidebar articles={allArticles} />
        </div>
      </div>
      <Footer />
    </>
  )
}
