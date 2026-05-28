// components/Sidebar.js
// Barra lateral com: mais lidas, newsletter, WhatsApp, links úteis, anúncio

export default function Sidebar({ articles = [] }) {

  // Pega as 5 mais recentes como "mais lidas"
  const maisLidas = articles.slice(0, 5)

  return (
    <aside className="sidebar">

      {/* MAIS LIDAS */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">🔥 Mais Lidas</div>
        <div className="sidebar-box-body">
          {maisLidas.map((art, i) => (
            <a key={art.id} href={`/artigo/${art.id}`} className="trending-item" style={{display:'flex',gap:'12px',alignItems:'flex-start',padding:'10px 0',borderBottom: i < maisLidas.length-1 ? '1px solid #F3F4F6' : 'none',textDecoration:'none'}}>
              <div className="trending-num">{i + 1}</div>
              <h4 style={{fontSize:'13px',fontWeight:600,color:'#1F2937',lineHeight:1.35}}>{art.title}</h4>
            </a>
          ))}
          {maisLidas.length === 0 && (
            <p style={{fontSize:'13px',color:'#9CA3AF',padding:'8px 0'}}>Carregando notícias...</p>
          )}
        </div>
      </div>

      {/* ANÚNCIO */}
      <div className="ad-box">
        <div className="ad-title">Anuncie Aqui</div>
        <div className="ad-sub">
          Alcance milhares de brasileiros em Miami e Sul da Flórida todos os dias
        </div>
        <a href="/contato" className="ad-btn">Fale conosco</a>
      </div>

      {/* NEWSLETTER */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">📧 Receba Notícias</div>
        <div className="sidebar-box-body newsletter-box">
          <p>Cadastre seu e-mail e receba as principais notícias da comunidade brasileira de Miami toda manhã.</p>
          <input type="text"  placeholder="Seu nome" />
          <input type="email" placeholder="Seu melhor e-mail" />
          <button type="button">Quero receber →</button>
        </div>
      </div>

      {/* WHATSAPP */}
      <div className="whatsapp-box">
        <div className="whatsapp-box-inner">
          <div style={{fontSize:+36px',marginBottom:'8px'}}>💬</div>
          <div style={{fontSize:'15px',fontWeight:800,marginBottom:'6px'}}>Grupo no WhatsApp</div>
          <div style={{fontSize:'12px',opacity:.9,sarginBottom:'14px',lineHeight:1.5}}>
            Junte-se a +3.000 brasileiros em Miami no nosso grupo de notícias
          </div>
          <a href="https://wa.me/1305000000" target="_blank" rel="noreferrer" className="wb-btn">
            Entrar no grupo
          </a>
        </div>
      </div>

      {/* LINKS ÚTEIS */}
      <div className="sidebar-box">
        <div className="sidebar-box-header">📌 Links Úteis</div>
        <div className="sidebar-box-body" style={{padding:'12px 16px'}}>
          {[
            { emoji: '🏛', title: 'Consulado Geral do Brasil em Miami', url: 'https://miami.itamaraty.gov.br', label: 'miami.itamaraty.gov.br' },
            { emoji: '🛂', title: 'USCIS – Serviços de Imigração', url: 'https://uscis.gov', label: 'uscis.gov' },
            { emoji: '🚗', title: 'FLHSMV – Carteira de Motorista', url: 'https://flhsmv.gov', label: 'flhsmv.gov' },
            { emoji: '🏥', title: 'Seguro Saúde – Healthcare.gov', url: 'https://healthcare.gov', label: 'healthcare.gov' },
          ].map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{display:'flex',flexDirection:'column',padding:'8px 0',borderBottom:'1px solid #F3F4F6',textDecoration:'none'}}
            >
              <span style={{fontSize:'13px',fontWeight:600,color:'#1F2937'}}>{link.emoji} {link.title}</span>
              <span style={{fontSize:'11px',color:'#9CA3AF',marginTop:'2px'}}>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

    </aside>
  )
}
