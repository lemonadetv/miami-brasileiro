'use client'
import Link from 'next/link'
import Footer from '../../components/Footer'

const FOTOS = {
  hero:       'photo-1540747913346-19e32dc3e97e', // estádio Copa
  torcida:    'photo-1574629810360-7efbbe195018', // torcedores comemorando
  hardRock:   'photo-1686168523188-8949907234a5', // estádio moderno / Chase Stadium
  selecao:    'photo-1531415074968-036ba1b575da', // campo de cima
  trofeu:     'photo-1562447457-579fc34967f7', // troféu copa
  fans2:      'photo-1594736797933-d0501ba2fe65', // torcedores em estádio
  fans3:      'photo-1551958219-acbc595b93e5', // multidão em jogo
}

const JOGOS_MIAMI = [
  { data: '15 Jun', hora: '18h', jogo: 'Grupo A – Jogo 5', local: 'Hard Rock Stadium' },
  { data: '18 Jun', hora: '15h', jogo: 'Grupo B – Jogo 11', local: 'Hard Rock Stadium' },
  { data: '21 Jun', hora: '18h', jogo: 'Grupo C – Jogo 18', local: 'Hard Rock Stadium' },
  { data: '25 Jun', hora: '18h', jogo: 'Grupo D – Jogo 25', local: 'Hard Rock Stadium' },
  { data: '29 Jun', hora: '21h', jogo: 'Oitavas de Final', local: 'Hard Rock Stadium' },
  { data: '4 Jul',  hora: '18h', jogo: 'Quartas de Final', local: 'Hard Rock Stadium' },
]

const DICAS = [
  { emoji: '🎟️', titulo: 'Ingressos', texto: 'Compre pelo site oficial da FIFA. Pacotes para torcedores da seleção têm prioridade. Fique atento ao sorteio dos grupos.', cor: '#009C3B' },
  { emoji: '🚌', titulo: 'Como chegar', texto: 'Tri-Rail + ônibus especial da FIFA direto ao Hard Rock Stadium. Uber e Lyft com zonas exclusivas. Evite carro próprio.', cor: '#002776' },
  { emoji: '🏨', titulo: 'Hospedagem', texto: 'Reserve com 3–4 meses de antecedência. Doral, Brickell e Miami Beach são os mais procurados. Preços triplicam na semana dos jogos.', cor: '#FFDF00' },
  { emoji: '🇧🇷', titulo: 'Fan zones', texto: 'Espaços oficiais da FIFA no Bayfront Park com telão, shows e comida. Entrada gratuita para quem tem ingresso do dia.', cor: '#009C3B' },
  { emoji: '📋', titulo: 'Documentos', texto: 'Para quem está nos EUA com visto, não há problema. Para convidados do Brasil, verifique a necessidade de ESTA ou visto.', cor: '#002776' },
  { emoji: '💲', titulo: 'Orçamento', texto: 'Preveja $80–150 por dia em alimentação e transporte, além do ingresso. Leve cartão — poucos locais aceitam cash no estádio.', cor: '#FFDF00' },
]

const SEDES_EUA = [
  { cidade: 'Miami, FL ⭐', estadio: 'Hard Rock Stadium', cap: '65.326', jogos: '6 jogos' },
  { cidade: 'Nova York / NJ', estadio: 'MetLife Stadium (Final)', cap: '82.500', jogos: '8 jogos' },
  { cidade: 'Los Angeles, CA', estadio: 'SoFi Stadium', cap: '70.240', jogos: '7 jogos' },
  { cidade: 'Dallas, TX', estadio: 'AT&T Stadium', cap: '80.000', jogos: '7 jogos' },
  { cidade: 'Atlanta, GA', estadio: 'Mercedes-Benz Stadium', cap: '71.000', jogos: '6 jogos' },
  { cidade: 'San Francisco, CA', estadio: "Levi's Stadium", cap: '68.500', jogos: '6 jogos' },
  { cidade: 'Seattle, WA', estadio: 'Lumen Field', cap: '69.000', jogos: '5 jogos' },
  { cidade: 'Kansas City, MO', estadio: 'Arrowhead Stadium', cap: '76.416', jogos: '5 jogos' },
  { cidade: 'Houston, TX', estadio: 'NRG Stadium', cap: '72.220', jogos: '5 jogos' },
  { cidade: 'Philadelphia, PA', estadio: 'Lincoln Financial Field', cap: '69.796', jogos: '5 jogos' },
  { cidade: 'Boston, MA', estadio: 'Gillette Stadium', cap: '65.878', jogos: '5 jogos' },
  { cidade: 'Denver, CO', estadio: 'Empower Field', cap: '76.125', jogos: '5 jogos' },
]

function img(id, w = 1200, h = 600) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&auto=format&fit=crop&q=80`
}

export default function Copa2026Page() {
  return (
    <>
      {/* HERO */}
      <div style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
        <img
          src={img(FOTOS.hero, 1600, 700)}
          alt="Copa do Mundo 2026"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,40,0,0.6) 50%, rgba(0,20,60,0.92) 100%)' }} />
        {/* BR flag stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(to right, #009C3B 33%, #FFDF00 33% 66%, #002776 66%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', gap: 6, marginBottom: 14 }}>
            {['🏆 FIFA World Cup', '🇺🇸 USA · 🇨🇦 CAN · 🇲🇽 MEX', '📅 Jun–Jul 2026'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 14px', color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
            Copa do Mundo 2026<br />
            <span style={{ color: '#FFDF00' }}>em Miami</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.85)', maxWidth: 600, lineHeight: 1.6 }}>
            O guia completo para a comunidade brasileira da Flórida curtir o hexa em casa
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#jogos" style={{ background: '#009C3B', color: '#fff', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>Ver jogos em Miami</a>
            <a href="#dicas" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>Dicas para torcedores</a>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

        {/* STATS */}
        <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { num: '48', label: 'Seleções', sub: 'maior Copa da história' },
              { num: '104', label: 'Jogos', sub: '11 jun a 19 jul 2026' },
              { num: '6', label: 'Jogos em Miami', sub: 'Hard Rock Stadium' },
              { num: '65k', label: 'Torcedores', sub: 'capacidade do estádio' },
            ].map(s => (
              <div key={s.num} style={{ padding: '24px 16px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#009C3B', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontWeight: 700, color: 'var(--text-bright)', marginTop: 4, fontSize: '0.9rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>

          {/* FOTO + TEXTO: Torcida brasileira */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', marginBottom: 56 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              <img src={img(FOTOS.torcida, 800, 600)} alt="Torcida brasileira" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '20px 18px 14px' }}>
                <span style={{ color: '#FFDF00', fontWeight: 700, fontSize: '0.85rem' }}>🇧🇷 A maior torcida do mundo</span>
              </div>
            </div>
            <div>
              <span style={{ display: 'inline-block', background: '#009C3B22', border: '1px solid #009C3B44', color: '#009C3B', borderRadius: 6, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Para a comunidade brasileira</span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--text-bright)', margin: '0 0 16px', lineHeight: 1.2 }}>
                O Brasil vai <span style={{ color: '#FFDF00' }}>jogar perto de você</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 16, fontSize: '0.95rem' }}>
                Com Miami como uma das sedes oficiais, a comunidade brasileira da Flórida terá a chance inédita de torcer pelo hexa a menos de 30 minutos de casa. O Hard Rock Stadium em Miami Gardens vai receber 6 jogos da Copa — incluindo possíveis jogos da seleção brasileira.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                Mais de 2 milhões de brasileiros vivem nos EUA, com forte concentração no Sul da Flórida. A expectativa é que seja a Copa com mais torcedores brasileiros da história, mesmo fora do Brasil.
              </p>
            </div>
          </div>

          {/* HARD ROCK STADIUM */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 56 }}>
            <div style={{ position: 'relative', height: 300 }}>
              <img src={img(FOTOS.hardRock, 1200, 400)} alt="Hard Rock Stadium" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 36, transform: 'translateY(-50%)' }}>
                <div style={{ color: '#FFDF00', fontWeight: 700, fontSize: '0.8rem', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Sede oficial em Miami</div>
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, margin: 0, lineHeight: 1.1 }}>Hard Rock Stadium</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0', fontSize: '0.9rem' }}>Miami Gardens, Florida</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0, borderTop: '1px solid var(--border)' }}>
              {[
                { label: 'Capacidade', valor: '65.326 torcedores' },
                { label: 'Jogos previstos', valor: '6 jogos + possíveis eliminatórias' },
                { label: 'Como chegar', valor: 'Tri-Rail + ônibus FIFA' },
                { label: 'Estacionamento', valor: 'Pré-compra obrigatória' },
              ].map((info, i) => (
                <div key={info.label} style={{ padding: '20px 24px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{info.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-bright)' }}>{info.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* JOGOS EM MIAMI */}
          <div id="jogos" style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 4, height: 32, background: '#009C3B', borderRadius: 2 }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-bright)' }}>Jogos em Miami</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.83rem' }}>Calendário previsto no Hard Rock Stadium</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {JOGOS_MIAMI.map((j, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ background: '#009C3B', color: '#fff', borderRadius: 10, padding: '10px 14px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>{j.data.split(' ')[1]}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>{j.data.split(' ')[0]}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '0.9rem' }}>{j.jogo}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 3 }}>⏰ {j.hora} · 📍 {j.local}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 12 }}>* Datas e horários sujeitos à confirmação oficial da FIFA após o sorteio dos grupos.</p>
          </div>

          {/* FOTO LATERAL: Seleção + texto */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', marginBottom: 56 }}>
            <div>
              <span style={{ display: 'inline-block', background: '#FFDF0022', border: '1px solid #FFDF0044', color: '#FFDF00', borderRadius: 6, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Seleção Brasileira</span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: 'var(--text-bright)', margin: '0 0 16px', lineHeight: 1.2 }}>
                Em busca do <span style={{ color: '#009C3B' }}>Hexa</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14, fontSize: '0.95rem' }}>
                O Brasil se classificou para a Copa 2026 pelas Eliminatórias Sul-Americanas. Com a competição em solo americano, a expectativa é de um apoio sem precedentes da diáspora brasileira — especialmente da comunidade da Flórida.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                O objetivo é claro: encerrar o jejum de mais de 20 anos sem título e conquistar o hexacampeonato histórico.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                {['🏆 Hexa é o objetivo', '👥 Geração jovem e experiente', '🌎 Copa no continente americano'].map(t => (
                  <span key={t} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src={img(FOTOS.fans2, 800, 600)} alt="Torcida no estádio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* DICAS */}
          <div id="dicas" style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 4, height: 32, background: '#002776', borderRadius: 2 }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-bright)' }}>Guia para Torcedores</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.83rem' }}>Tudo o que você precisa saber para aproveitar ao máximo</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {DICAS.map(d => (
                <div key={d.titulo} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', borderLeft: `4px solid ${d.cor}` }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{d.emoji}</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-bright)', fontSize: '1rem', marginBottom: 8 }}>{d.titulo}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>{d.texto}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FOTO FÃNS + TROFÉU */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 56 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 300, position: 'relative' }}>
              <img src={img(FOTOS.fans3, 900, 400)} alt="Torcedores Copa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 20, color: '#fff' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Atmosfera única</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>A Copa é mais que futebol — é cultura brasileira</div>
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 300, position: 'relative' }}>
              <img src={img(FOTOS.trofeu, 400, 400)} alt="Troféu Copa do Mundo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,60,0,0.75), transparent)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', color: '#FFDF00', fontWeight: 900, fontSize: '1rem' }}>
                🏆 Rumo ao Hexa
              </div>
            </div>
          </div>

          {/* SEDES */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 56 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-bright)' }}>🏟️ Sedes nos EUA</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Cidade', 'Estádio', 'Capacidade', 'Jogos'].map(h => (
                      <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SEDES_EUA.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: s.cidade.includes('⭐') ? '#009C3B0d' : 'transparent' }}>
                      <td style={{ padding: '11px 18px', fontWeight: s.cidade.includes('⭐') ? 800 : 600, color: s.cidade.includes('⭐') ? '#009C3B' : 'var(--text-bright)' }}>{s.cidade}</td>
                      <td style={{ padding: '11px 18px', color: 'var(--text-secondary)' }}>{s.estadio}</td>
                      <td style={{ padding: '11px 18px', color: 'var(--text-muted)' }}>{s.cap}</td>
                      <td style={{ padding: '11px 18px', color: 'var(--text-muted)' }}>{s.jogos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 8 }}>
            <img src={img(FOTOS.selecao, 1200, 400)} alt="Campo Copa" style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center 40%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,40,0,0.88) 0%, rgba(0,20,80,0.82) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, margin: '0 0 10px' }}>Fique por dentro de tudo sobre a Copa 2026</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', maxWidth: 480, fontSize: '0.92rem' }}>Notícias, escalações, resultados e análises sobre o Brasil na Copa — direto aqui no Miami Brasileira.</p>
              <Link href="/categoria/esportes" style={{ background: '#009C3B', color: '#fff', padding: '13px 32px', borderRadius: 50, fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem' }}>
                Ver todas as matérias de Esportes →
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
