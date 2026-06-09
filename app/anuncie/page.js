// app/anuncie/page.js
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Anuncie | Miami Brasileiro',
  description: 'Anuncie no portal numero 1 da comunidade brasileira em Miami e Sul da Florida',
}

export default function AnunciePage() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', background: '#f8f9fa', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#009C3B', color: '#fff', padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 16 }}>
              📣 PUBLICIDADE
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111', margin: '0 0 12px', lineHeight: 1.2 }}>
              Alcance a Comunidade<br />Brasileira em Miami
            </h1>
            <p style={{ color: '#6B7280', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              Conecte sua marca com milhares de brasileiros na Florida. 
              Solucoes de publicidade sob medida para o seu negocio.
            </p>
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 24px' }}>
              Solicite uma Proposta
            </h2>

            <form action="https://formsubmit.co/contato@miamibrasileiro.com" method="POST">
              <input type="hidden" name="_subject" value="Solicitacao de Anuncio - Miami Brasileiro" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://miami-brasileiro.vercel.app/anuncie" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Joao Santos"
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    placeholder="Nome da sua empresa"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email Profissional *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="joao@empresa.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Tipo de Anuncio *
                </label>
                <select
                  name="tipo_anuncio"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                >
                  <option value="">Selecione o tipo de anuncio</option>
                  <option value="banner-home">Banner na Home</option>
                  <option value="banner-categoria">Banner em Categoria</option>
                  <option value="artigo-patrocinado">Artigo Patrocinado</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="pacote-completo">Pacote Completo</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Detalhes da Campanha
                </label>
                <textarea
                  name="mensagem"
                  placeholder="Conte sobre seu produto ou servico, objetivos da campanha, publico-alvo e orcamento previsto..."
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', minHeight: 120, resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '14px', background: '#009C3B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
              >
                Enviar Solicitacao
              </button>
            </form>

            <p style={{ marginTop: 16, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
              Nossa equipe retornara em ate 48 horas uteis com uma proposta personalizada.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
