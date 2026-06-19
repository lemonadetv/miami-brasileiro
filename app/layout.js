import './globals.css'
import './uol-extra.css'
import { Analytics } from '@vercel/analytics/react'
import Header from '../components/Header'

export const metadata = {
  metadataBase: new URL('https://miami-brasileiro.vercel.app'),
  title: {
    default: 'Miami Brasileira — Notícias para brasileiros em Miami',
    template: '%s | Miami Brasileira',
  },
  description: 'Portal de notícias em português para brasileiros que vivem em Miami e na Flórida. Comunidade, imigração, negócios, saúde, esportes e cultura.',
  keywords: ['brasileiros em miami', 'brasileiros na florida', 'noticias miami portugues', 'comunidade brasileira miami', 'imigracao eua', 'vida em miami'],
  authors: [{ name: 'Redação Miami Brasileira' }],
  creator: 'Miami Brasileira',
  publisher: 'Miami Brasileira',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://miami-brasileiro.vercel.app',
    siteName: 'Miami Brasileira',
    title: 'Miami Brasileira — Notícias para brasileiros em Miami',
    description: 'Portal de notícias em português para brasileiros que vivem em Miami e na Flórida.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Miami Brasileira' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miami Brasileira — Notícias para brasileiros em Miami',
    description: 'Portal de notícias em português para brasileiros que vivem em Miami e na Flórida.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: '8s0o6jV4fgBkcAMdH84MU9SpW2W4JZK54ugld_shq98',
  },
  alternates: {
    canonical: 'https://miami-brasileiro.vercel.app',
    types: {
      'application/rss+xml': 'https://miami-brasileiro.vercel.app/feed.xml',
    },
  },
}

export const revalidate = 3600

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
