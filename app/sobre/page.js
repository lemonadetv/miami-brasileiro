// app/sobre/page.js
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Sobre Nos | Miami Brasileiro',
  description: 'Conheça a história do Miami Brasileiro, o principal portal de notícias para brasileiros na Flórida',
}

export default function SobrePage() {
  return (
    <>
      <Header />

      {/* Hero com foto de Miami */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
          alt="Miami skyline ao entardecer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)', display: 'flex', alignItems: 'flex-end', padding: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#009C3B', color: '#fff', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>
              ð¦© NOSSO PORTAL
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.1 }}>
              Sobre o Miami Brasileiro
            </h1>
          </div>
        </div>
      </div>

      {/* Nossa Historia */}
      <div style={{ background: '#fff', padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#009C3B', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Nossa Historia
              </h2>
              <h3 style={{ fontSize: 30, fontWeight: 800, color: '#111', margin: '0 0 20px', lineHeight: 1.2 }}>
                Nascemos da saudade e da necessidade
              </h3>
              <p style={{ color: '#4B5563', fontSize: 16, lineHeight: 1.75, margin: '0 0 16px' }}>
                O Miami Brasileiro nasceu em 2020 da saudade e da necessidade. Um grupo de brasileiros em Miami percebeu que faltava um portal confiável, em português, que ajudasse nossa comunidade a navegar a vida nos EUA.
              </p>
              <p style={{ color: '#4B5563', fontSize: 16, lineHeight: 1.75, margin: '0 0 16px' }}>
                Hoje somos o principal portal de informação para brasileiros na Flórida, com milhares de leitores mensais e cobertura de temas que realmente importam: imigração, saúde, negócios, cultura e muito mais.
              </p>
              <p style={{ color: '#4B5563', fontSize: 16, lineHeight: 1.75, margin: 0 }}>
                Desde os primeiros passos em Miami até a conquista do sonho americano, o Miami Brasileiro está ao seu lado com informação de qualidade, em português, para cada fase da sua jornada nos EUA.
              </p>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Praia de Miami Beach"
                style={{ width: '100%', height: 360, objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nossa Missao */}
      <div style={{ background: '#009C3B', padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Nossa Missao
          </h2>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '0 0 24px', lineHeight: 1.3 }}>
            Conectar, informar e empoderar a comunidade brasileira em Miami.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Acreditamos que toda pessoa merece ter acesso a informação de qualidade no idioma que entende. 
            Por isso entregamos jornalismo honesto, relevante e sempre em português.
          </p>
        </div>
      </div>

      {/* Nossa Equipe */}
      <div style={{ background: '#f8f9fa', padding: '72px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
              <img
                src="https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800&q=80"
                alt="Vida na cidade"
                style={{ width: '100%', height: 340, objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#009C3B', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Nossa Equipe
              </h2>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 20px', lineHeight: 1.2 }}>
                Brasileiros apaixonados por Miami
              </h3>
              <p style={{ color: '#4B5563', fontSize: 16, lineHeight: 1.75, margin: '0 0 16px' }}>
                Somos jornalistas, empreendedores e entusiastas brasileiros apaixonados por Miami. Nossa equipe vive e respira a cidade, conhece os desafios da comunidade e sabe o que você precisa saber para ter sucesso nos EUA.
              </p>
              <p style={{ color: '#4B5563', fontSize: 16, lineHeight: 1.75, margin: '0 0 24px' }}>
                Com correspondentes em Miami, Fort Lauderdale e Orlando, cobrimos tudo o que importa para a comunidade brasileira na Florida e alem.
              </p>
              <Link href="/contato" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#009C3B', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                Fale com a Redação →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Numeros */}
      <div style={{ background: '#fff', padding: '72px 20px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111', margin: '0 0 48px' }}>
            Miami Brasileiro em Numeros
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { num: '50K+', label: 'Leitores Mensais' },
              { num: '2020', label: 'Ano de Fundação' },
              { num: '500+', label: 'Materias Publicadas' },
            ].map(function(item) {
              return (
                <div key={item.label} style={{ padding: '32px 20px', background: '#f8f9fa', borderRadius: 16 }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#009C3B', lineHeight: 1 }}>{item.num}</div>
                  <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 600, marginTop: 8 }}>{item.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
