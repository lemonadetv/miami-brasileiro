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
      <div className="contato-page">
        <div className="contato-card">
          <h1>Entre em Contato</h1>
          <p className="sub">Tem uma sugestao de pauta, quer anunciar ou so quer dizer oi? Estamos aqui!</p>

          <form action="https://formsubmit.co/contato@miamibrasileiro.com" method="POST">
            <input type="hidden" name="_subject" value="Contato Miami Brasileiro" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://miami-brasileiro.vercel.app/contato" />

            <div className="admin-form-row">
              <div className="form-group">
                <label>Seu nome</label>
                <input type="text" name="nome" placeholder="João Silva" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="joao@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Assunto</label>
              <select name="assunto">
                <option value="pauta">Sugestão de pauta</option>
                <option value="anuncio">Quero anunciar</option>
                <option value="parceria">Parceria</option>
                <option value="correcao">Correção de matéria</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mensagem</label>
              <textarea name="mensagem" placeholder="Escreva sua mensagem aqui..." required style={{ minHeight: 140 }} />
            </div>
            <button type="submit" className="btn-primary">Enviar Mensagem</button>
          </form>

          <div className="contact-info">
            <div className="contact-info-item">
              <div className="ci-icon">📧</div>
              <h4>Email da Redação</h4>
              <p>contato@miamibrasileiro.com</p>
            </div>
            <div className="contact-info-item">
              <div className="ci-icon">💬</div>
              <h4>WhatsApp</h4>
              <p>+1 (305) 000-0000</p>
            </div>
            <div className="contact-info-item">
              <div className="ci-icon">📍</div>
              <h4>Localização</h4>
              <p>Miami, Florida, EUA</p>
            </div>
            <div className="contact-info-item">
              <div className="ci-icon">📣</div>
              <h4>Publicidade</h4>
              <p>anuncie@miamibrasileiro.com</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
