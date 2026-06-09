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
              <div className="icon">🦩</div>
              <div className="name">Miami Brasileiro</div>
            </div>
            <p className="footer-about">
              O portal de noticias da comunidade brasileira em Miami e Sul da Florida.
              Informacao confiavel, em portugues, para voce navegar a vida nos EUA.
            </p>
            <Link href="/sobre" style={{ display:'inline-block', marginTop: 8, color:'#009C3B', fontWeight:600, fontSize:14 }}>
              Sobre Nos →
            </Link>
          </div>

          {/* CATEGORIAS */}
          <div>
            <h4 className="footer-heading">Categorias</h4>
            <ul className="footer-links">
              <li><Link href="/categoria/comunidade">Comunidade</Link></li>
              <li><Link href="/categoria/imigracao">Imigracao</Link></li>
              <li><Link href="/categoria/negocios">Negocios</Link></li>
              <li><Link href="/categoria/saude">Saude</Link></li>
              <li><Link href="/categoria/esportes">Esportes</Link></li>
              <li><Link href="/categoria/cultura-lazer">Cultura e Lazer</Link></li>
            </ul>
          </div>

          {/* PORTAL */}
          <div>
            <h4 className="footer-heading">Portal</h4>
            <ul className="footer-links">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/sobre">Sobre Nos</Link></li>
              <li><Link href="/anuncie">Anuncie</Link></li>
            </ul>
          </div>

          {/* FALE CONOSCO */}
          <div>
            <h4 className="footer-heading">Fale Conosco</h4>
            <p style={{ fontSize:13, color:'#9CA3AF', marginBottom:16, lineHeight:1.5 }}>
              Sugestoes de pauta, parcerias ou duvidas? Nossa equipe esta pronta para ajudar.
            </p>
            <Link href="/contato" className="btn-primary" style={{ display:'inline-block', padding:'10px 20px', background:'#009C3B', color:'#fff', borderRadius:6, textDecoration:'none', fontWeight:600, fontSize:14 }}>
              Fale Conosco
            </Link>
            <div style={{ marginTop:16 }}>
              <a href="https://www.facebook.com/miamibrasileira" target="_blank" rel="noreferrer" style={{ color:'#009C3B', fontSize:13, fontWeight:600 }}>
                📘 Facebook
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <span>© {ano} Miami Brasileiro. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}
