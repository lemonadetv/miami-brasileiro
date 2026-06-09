// app/contato/page.js
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Contato | Miami Brasileiro',
  description: 'Entre em contato com a redacao do Miami Brasileiro',
}

export default function ContatoPage() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '48px', maxWidth: 600, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Entre em Contato</h1>
            <p style={{ color: '#6B7280', fontSize: 15, margin: 0 }}>
              Tem uma sugestao de pauta, quer colaborar ou so quer dizer oi?
            </p>
          </div>

          <form action="https://formsubmit.co/contato@miamibrasileiro.com" method="POST">
            <input type="hidden" name="_subject" value="Contato Miami Brasileiro" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://miami-brasileiro.vercel.app/contato" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Seu Nome *
                </label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Maria Silva"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="maria@email.com"
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Assunto *
              </label>
              <select
                name="assunto"
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">Selecione um assunto</option>
                <option value="pauta">Sugestao de pauta</option>
                <option value="correcao">Correcao de materia</option>
                <option value="parceria">Parceria editorial</option>
                <option value="outro">Outro assunto</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Mensagem *
              </label>
              <textarea
                name="mensagem"
                placeholder="Escreva sua mensagem aqui..."
                required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', minHeight: 140, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '14px', background: '#009C3B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
