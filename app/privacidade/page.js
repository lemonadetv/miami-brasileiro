// app/privacidade/page.js
import Footer from '../../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Politica de Privacidade | Miami Brasileira',
  description: 'Politica de privacidade do portal Miami Brasileira. Saiba como coletamos e usamos seus dados.',
}

export default function PrivacidadePage() {
  const ano = new Date().getFullYear()
  return (
    <>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ color: '#F4622A', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Inicio
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 8px' }}>/</span>
          <span style={{ color: '#6b7280', fontSize: 14 }}>Politica de Privacidade</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111', marginBottom: 8 }}>Politica de Privacidade</h1>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 40 }}>Ultima atualizacao: junho de {ano}</p>

        <div style={{ color: '#374151', lineHeight: 1.8, fontSize: 16 }}>
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              1. Informacoes que Coletamos
            </h2>
            <p style={{ marginBottom: 12 }}>
              O Miami Brasileira coleta informacoes para melhorar a experiencia dos nossos leitores e fornecer
              conteudo relevante sobre a comunidade brasileira em Miami e na Florida.
            </p>
            <p><strong>Informacoes coletadas automaticamente:</strong></p>
            <ul style={{ paddingLeft: 24, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>Endereco IP e dados de localizacao aproximada</li>
              <li style={{ marginBottom: 8 }}>Tipo de navegador e sistema operacional</li>
              <li style={{ marginBottom: 8 }}>Paginas visitadas e tempo de permanencia</li>
              <li style={{ marginBottom: 8 }}>Fonte de acesso (busca organica, redes sociais, acesso direto)</li>
            </ul>
            <p style={{ marginTop: 12 }}><strong>Informacoes fornecidas voluntariamente:</strong></p>
            <ul style={{ paddingLeft: 24, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}>Nome e e-mail ao entrar em contato pelo formulario</li>
              <li style={{ marginBottom: 8 }}>Mensagens enviadas atraves do formulario de contato</li>
            </ul>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              2. Como Usamos Suas Informacoes
            </h2>
            <p style={{ marginBottom: 12 }}>Utilizamos as informacoes coletadas para:</p>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 8 }}>Fornecer, operar e melhorar nosso portal de noticias</li>
              <li style={{ marginBottom: 8 }}>Personalizar o conteudo exibido com base nos seus interesses</li>
              <li style={{ marginBottom: 8 }}>Analisar o desempenho do site e otimizar a experiencia do usuario</li>
              <li style={{ marginBottom: 8 }}>Responder mensagens enviadas pelo formulario de contato</li>
              <li style={{ marginBottom: 8 }}>Cumprir obrigacoes legais aplicaveis</li>
            </ul>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              3. Cookies e Tecnologias Similares
            </h2>
            <p style={{ marginBottom: 12 }}>
              Utilizamos cookies para melhorar sua experiencia de navegacao. Cookies sao pequenos arquivos
              de texto armazenados no seu dispositivo que nos ajudam a lembrar suas preferencias e analisar
              o uso do site.
            </p>
            <p><strong>Tipos de cookies que utilizamos:</strong></p>
            <ul style={{ paddingLeft: 24, marginTop: 8 }}>
              <li style={{ marginBottom: 8 }}><strong>Cookies essenciais:</strong> Necessarios para o funcionamento basico do site</li>
              <li style={{ marginBottom: 8 }}><strong>Cookies analiticos:</strong> Nos ajudam a entender como os visitantes usam o site (Google Analytics)</li>
              <li style={{ marginBottom: 8 }}><strong>Cookies de publicidade:</strong> Usados para exibir anuncios relevantes</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Voce pode desativar cookies nas configuracoes do seu navegador, mas isso pode afetar algumas
              funcionalidades do site.
            </p>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              4. Compartilhamento de Informacoes
            </h2>
            <p style={{ marginBottom: 12 }}>
              Nao vendemos, alugamos ou compartilhamos suas informacoes pessoais com terceiros, exceto nas
              seguintes situacoes:
            </p>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 8 }}><strong>Provedores de servico:</strong> Empresas que nos auxiliam na operacao do site (hospedagem, analytics)</li>
              <li style={{ marginBottom: 8 }}><strong>Obrigacao legal:</strong> Quando exigido por lei, ordem judicial ou autoridades governamentais</li>
              <li style={{ marginBottom: 8 }}><strong>Protecao de direitos:</strong> Para proteger os direitos, propriedade ou seguranca do Miami Brasileira e seus usuarios</li>
            </ul>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              5. Seguranca dos Dados
            </h2>
            <p>
              Implementamos medidas de seguranca tecnicas e organizacionais para proteger suas informacoes
              contra acesso nao autorizado, alteracao, divulgacao ou destruicao. No entanto, nenhuma
              transmissao de dados pela internet e 100% segura, e nao podemos garantir seguranca absoluta.
            </p>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              6. Seus Direitos
            </h2>
            <p style={{ marginBottom: 12 }}>Voce tem o direito de:</p>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 8 }}>Acessar as informacoes pessoais que temos sobre voce</li>
              <li style={{ marginBottom: 8 }}>Solicitar a correcao de dados incorretos</li>
              <li style={{ marginBottom: 8 }}>Solicitar a exclusao dos seus dados pessoais</li>
              <li style={{ marginBottom: 8 }}>Opor-se ao processamento dos seus dados em determinadas circunstancias</li>
              <li style={{ marginBottom: 8 }}>Retirar seu consentimento a qualquer momento</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Para exercer esses direitos, entre em contato conosco atraves da nossa{' '}
              <Link href="/contato" style={{ color: '#F4622A', fontWeight: 600 }}>pagina de contato</Link>.
            </p>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              7. Links para Sites Externos
            </h2>
            <p>
              Nosso portal pode conter links para sites externos. Nao somos responsaveis pelas praticas
              de privacidade desses sites. Recomendamos que voce leia as politicas de privacidade de
              qualquer site que visitar.
            </p>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              8. Alteracoes nesta Politica
            </h2>
            <p>
              Podemos atualizar esta Politica de Privacidade periodicamente. Notificaremos sobre mudancas
              significativas publicando a nova politica nesta pagina com a data de atualizacao. Recomendamos
              revisar esta pagina periodicamente.
            </p>
          </section>

          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f3f4f6' }}>
              9. Contato
            </h2>
            <p>
              Se tiver duvidas sobre esta Politica de Privacidade ou sobre como tratamos seus dados,
              entre em contato conosco:
            </p>
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20, marginTop: 16, border: '1px solid #e5e7eb' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#111', marginBottom: 4 }}>Miami Brasileira</p>
              <p style={{ margin: 0, color: '#6b7280' }}>Portal de Noticias da Comunidade Brasileira em Miami</p>
              <p style={{ margin: '8px 0 0' }}>
                <Link href="/contato" style={{ color: '#F4622A', fontWeight: 600, textDecoration: 'none' }}>
                  Formulario de Contato
                </Link>
              </p>
            </div>
          </section>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24, marginTop: 40, color: '#9ca3af', fontSize: 13 }}>
          <p>Copyright {ano} Miami Brasileira. Todos os direitos reservados.</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
