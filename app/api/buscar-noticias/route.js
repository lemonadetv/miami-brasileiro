// app/api/buscar-noticias/route.js
import Anthropic from '@anthropic-ai/sdk'

export const maxDuration = 60

const ANTHROPIC = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const QUERIES = [
  { query: 'brazil miami florida community news 2026', category: 'Comunidade' },
  { query: 'immigration visa green card uscis brazil usa 2026', category: 'Imigracao' },
  { query: 'brazil business entrepreneur florida miami 2026', category: 'Negocios' },
  { query: 'health insurance medicaid florida immigrants 2026', category: 'Saude' },
  { query: 'soccer brazil copa mundo inter miami sports 2026', category: 'Esportes' },
  { query: 'miami culture leisure restaurants events brazilian community 2026', category: 'Cultura e Lazer' },
]

const FALLBACK_IMAGES = {
  Comunidade:       'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Imigracao:        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=70',
  Negocios:         'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70',
  Saude:            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
  Esportes:         'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
  'Cultura e Lazer':'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=70',
}

const INLINE_IMAGES = {
  Comunidade:       'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=70',
  Imigracao:        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=70',
  Negocios:         'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=70',
  Saude:            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=70',
  Esportes:         'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=70',
  'Cultura e Lazer':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=70',
}