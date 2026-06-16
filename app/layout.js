import './globals.css'
import './uol-extra.css'
import { Analytics } from '@vercel/analytics/react'
import Header from '../components/Header'

export const metadata = {
  title: 'Miami Brasileira - O Portal da Comunidade Brasileira em Miami',
  description: 'Portal de noticias da comunidade brasileira em Miami e Sul da Florida.',
  openGraph: { title: 'Miami Brasileira', locale: 'pt_BR', type: 'website' },
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
