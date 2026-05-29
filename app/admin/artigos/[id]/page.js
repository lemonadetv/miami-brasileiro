'use client'
import { useState, useEffect } from 'react'
import ArticleForm from '../ArticleForm'
import { useRouter } from 'next/navigation'

export default function EditArtigo({ params }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/artigos/${params.id}`)
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(d => { setArticle(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 16, color: '#9CA3AF' }}>
      Carregando artigo...
    </div>
  )

  if (!article || article.error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 16, color: '#EF4444' }}>
      Artigo nao encontrado.
    </div>
  )

  return <ArticleForm initial={article} isNew={false} />
}
