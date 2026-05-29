import './globals.css'

export const metadata = {
  title: 'Miami Brasileira – O Portal da Comunidade Brasileira em Miami',
  description: 'Portal de noticias da comunidade brasileira em Miami e Sul da Florida. Imigracao, negocios, saude, esportes e muito mais.',
  keywords: 'brasileiras miami, comunidade brasileira florida, imigracao eua, noticias miami',
  openGraph: {
    title: 'Miami Brasileira',
    description: 'Portal de notícias da comunidade brasileira em Miami e Sul da Flórida.',
    locale: 'pt_BR',
    type: 'website',
  },
}

// Atualiza a página a cada 1 hora (revalidação incremental)
export const revalidate = 3600

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
