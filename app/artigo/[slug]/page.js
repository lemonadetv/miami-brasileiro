// artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import { getAllArticles, getArticleBySlug } from '../../../lib/articles'
export async function generateStaticParams() { return getAllArticles().map(a => ({ slug: a.id })) }
export async function generateMetadata({ params }) {
  const a = getArticleBySlug(params.slug)
  if (!a) return { title: 'Not Found' }
  return { title: a.title + ' | Miami Brasileira', description: a.excerpt, openGraph: { title: a.title, description: a.excerpt, images: [{ url: a.image, width: 1200, height: 630 }], type: 'article' } }
}
export default function Page({ params }) {
  const a = getArticleBySlug(params.slug)
  if (!a) notFound()
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, image: a.image, datePublished: a.publishedAt, author: { '@type': 'Organization', name: 'Miami Brasileira' }, articleSection: a.category, inLanguage: 'pt-BR' }
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><h1>{a.title}</h1></>)
}
