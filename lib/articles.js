// lib/articles.js
// Funções para ler e salvar artigos
// Os artigos ficam no arquivo data/articles.json do repositório GitHub

import path from 'path'
import fs from 'fs'

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json')

// Lê todos os artigos (do arquivo local)
export function getAllArticles() {
  try {
    const raw = fs.readFileSync(ARTICLES_FILE, 'utf-8')
    const articles = JSON.parse(raw)
    // Ordena do mais recente para o mais antigo
    return articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  } catch (e) {
    console.error('Erro ao ler artigos:', e)
    return []
  }
}

// Busca um artigo pelo slug/id
export function getArticleBySlug(slug) {
  const all = getAllArticles()
  return all.find(a => a.id === slug) || null
}

// Retorna os artigos por categoria
export function getArticlesByCategory(category) {
  return getAllArticles().filter(a => a.category === category)
}

// Retorna o artigo em destaque
export function getFeaturedArticle() {
  const all = getAllArticles()
  return all.find(a => a.featured) || all[0]
}

// Retorna os artigos mais recentes (excluindo o destaque)
export function getLatestArticles(limit = 6) {
  const all = getAllArticles()
  const featured = getFeaturedArticle()
  return all.filter(a => a.id !== featured?.id).slice(0, limit)
}

// Gera um slug a partir de um título
export function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

// Formata a data em português
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Formata a data curta
export function formatDateShort(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short'
  })
}

// Estima tempo de leitura
export function readingTime(content = '') {
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min`
}
