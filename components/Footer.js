import Link from 'next/link'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">

          {/* SOBRE */}
          <div>
            <div className="footer-logo">
              <div className="icon">🌴</div>
              <div className="name">Miami Brasileiro</div>
            </div>
            <p className="footer-about">
              O portal de notícias da comunidade brasileira em Miami e Sul da Flórida.
              Cobrindo imigração, negócios, saúde, cultura e tudo que importa para
              quem vive o sonho americano.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">📘</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">📸</a>
              <a href="https://youtube.com"   target="_blank" rel="noreferrer" title="YouTube">▶</a>
              <a href="https://wa.me/1305000000" target="_blank" rel="noreferrer" title="WhatsApp">💬</a>
            </div>
          </div>

          {/* CATEGORIAS */}
          <div className="footer-col">
            <h4>Categorias</h4>
            <ul>
              <li><Link href="/categoria/comunidade">Comunidade</Link></li>
              <li><Link href="/categoria/imigracao">Imigração & Vistos</Link></li>
              <li><Link href="/categoria/negocios">Negócios</Link></li>
              <li><Link href="/categoria/saude">Saúde</Link></li>
              <li><Link href="/categoria/esportes">Esportes</Link></li>
              <li><Link href="/categoria/cultura">Cultura & Lazer</Link></li>
            </ul>
          </div>

          {/* PORTAL */}
          <div className="footer-col">
            <h4>Portal</h4>
            <ul>
              <li><Link href="/sobre">Sobre nós</Link></li>
              <li><Link href="/contato">Anuncie</Link></li>
              <li><Link href="/contato">Colabore conosco</Link></li>
              <li><Link href="/contato">Contato</Link></li>
              <li><Link href="/privacidade">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* CONTATO */}
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href="mailto:contato@miamibrasileiro.com">📧 contato@miamibrasileiro.com</a></li>
              <li><a href="mailto:anuncie@miamibrasileiro.com">📣 anuncie@miamibrasileiro.com</a></li>
              <li><span>📍 Miami, FL – EUA</span></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© {ano} Miami Brasileiro. Todos os direitos reservados.</span>
          <span>Feito com ❤️ para a comunidade brasileira</span>
        </div>
      </div>
    </footer>
  )
}
