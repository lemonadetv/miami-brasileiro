// app/copa-2026/page.js
import Footer from '../../components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Copa do Mundo 2026 | Miami Brasileira',
  description: 'Tudo sobre a Copa do Mundo FIFA 2026 nos EUA, Canada e Mexico. Jogos em Miami, selecao brasileira, ingressos e muito mais.',
}

export default function Copa2026Page() {
  return (
    <>
      <div className="copa-page">
        <div style={{ background: 'linear-gradient(135deg, #009c3b 0%, #ffdf00 50%, #002776 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>Soccer Trophy</div>
            <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 12, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Copa do Mundo FIFA 2026</h1>
            <p style={{ fontSize: 20, opacity: 0.95, maxWidth: 600, margin: '0 auto' }}>EUA - Canada - Mexico | 11 de junho a 19 de julho de 2026</p>
            <p style={{ fontSize: 16, marginTop: 12, opacity: 0.85 }}>Jogos em Miami no Hard Rock Stadium</p>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 48 }}>
            {[
              { emoji: 'Globe', titulo: '48 Selecoes', desc: 'Maior Copa da historia' },
              { emoji: 'Stadium', titulo: '16 Estadios', desc: 'em 3 paises' },
              { emoji: 'Calendar', titulo: '104 Jogos', desc: '11 jun a 19 jul 2026' },
              { emoji: 'Medal', titulo: 'Miami', desc: 'Sede de jogos da Copa' },
            ].map(function(c) {
              return (
                <div key={c.titulo} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{c.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#111', marginBottom: 4 }}>{c.titulo}</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{c.desc}</div>
                </div>
              )
            })}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '2px solid #16a34a', borderRadius: 20, padding: 36, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#15803d', marginBottom: 16 }}>Copa em Miami</h2>
            <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
              Miami e uma das sedes oficiais da Copa do Mundo 2026! O Hard Rock Stadium,
              em Miami Gardens, recebera jogos da fase de grupos e possivelmente fases eliminatorias.
              Para a comunidade brasileira na Florida, esta e uma oportunidade unica de ver o Brasil jogar
              praticamente em casa.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Estadio', valor: 'Hard Rock Stadium' },
                { label: 'Capacidade', valor: '65.000 torcedores' },
                { label: 'Cidade', valor: 'Miami Gardens, FL' },
                { label: 'Jogos previstos', valor: 'Grupos + eliminatorias' },
              ].map(function(i) {
                return (
                  <div key={i.label} style={{ background: 'white', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{i.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginTop: 4 }}>{i.valor}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 36, marginBottom: 48, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 8 }}>Selecao Brasileira</h2>
            <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 15 }}>O pentacampeao busca o hexacampeonato em solo americano</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {[
                { titulo: 'Classificacao', texto: 'O Brasil se classificou para a Copa 2026 pelas Eliminatorias Sul-Americanas, garantindo presenca na competicao.' },
                { titulo: 'Vantagem geografica', texto: 'Com a Copa nos EUA, o Brasil contara com enorme apoio da diaspora brasileira, especialmente na Florida.' },
                { titulo: 'Objetivo', texto: 'Conquistar o hexacampeonato mundial e encerrar um jejum de mais de 20 anos sem titulo.' },
                { titulo: 'Geracao', texto: 'Selecao conta com jovens talentos e veteranos experientes buscando escrever historia.' },
              ].map(function(s) {
                return (
                  <div key={s.titulo} style={{ background: '#f9fafb', borderRadius: 12, padding: 20, borderLeft: '4px solid #009c3b' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 8 }}>{s.titulo}</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{s.texto}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: 36, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 20 }}>Formato da Copa 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { fase: 'Fase de Grupos', detalhe: '12 grupos de 4 times', cor: '#6366f1' },
                { fase: 'Oitavas de Final', detalhe: '32 times avancam', cor: '#0891b2' },
                { fase: 'Quartas de Final', detalhe: '16 melhores', cor: '#059669' },
                { fase: 'Semifinais', detalhe: '8 times restantes', cor: '#d97706' },
                { fase: 'Terceiro Lugar', detalhe: 'Disputa do bronze', cor: '#dc2626' },
                { fase: 'Final', detalhe: 'MetLife Stadium, NJ', cor: '#7c3aed' },
              ].map(function(f) {
                return (
                  <div key={f.fase} style={{ background: 'white', borderRadius: 12, padding: 16, borderTop: '3px solid ' + f.cor }}>
                    <div style={{ fontWeight: 700, color: f.cor, fontSize: 14, marginBottom: 4 }}>{f.fase}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{f.detalhe}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 20, padding: 36, marginBottom: 48, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 20 }}>Sedes nos EUA</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Cidade</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Estadio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151' }}>Capacidade</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cidade: 'Miami, FL', estadio: 'Hard Rock Stadium', cap: '65.326' },
                    { cidade: 'Nova York / NJ', estadio: 'MetLife Stadium (Final)', cap: '82.500' },
                    { cidade: 'Los Angeles, CA', estadio: 'SoFi Stadium', cap: '70.240' },
                    { cidade: 'Dallas, TX', estadio: 'AT&T Stadium', cap: '80.000' },
                    { cidade: 'Atlanta, GA', estadio: 'Mercedes-Benz Stadium', cap: '71.000' },
                    { cidade: 'San Francisco, CA', estadio: "Levi's Stadium", cap: '68.500' },
                    { cidade: 'Seattle, WA', estadio: 'Lumen Field', cap: '69.000' },
                    { cidade: 'Kansas City, MO', estadio: 'Arrowhead Stadium', cap: '76.416' },
                    { cidade: 'Denver, CO', estadio: 'Empower Field', cap: '76.125' },
                    { cidade: 'Houston, TX', estadio: 'NRG Stadium', cap: '72.220' },
                    { cidade: 'Philadelphia, PA', estadio: 'Lincoln Financial Field', cap: '69.796' },
                    { cidade: 'Boston, MA', estadio: 'Gillette Stadium', cap: '65.878' },
                  ].map(function(s, i) {
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.cidade}</td>
                        <td style={{ padding: '12px 16px', color: '#374151' }}>{s.estadio}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.cap}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', borderRadius: 20, padding: 40, textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Fique por dentro da Copa 2026</h2>
            <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
              Todas as novidades, escalacoes, resultados e analises sobre o Brasil na Copa aqui no Miami Brasileira.
            </p>
            <Link href="/categoria/esportes" style={{ display: 'inline-block', background: 'white', color: '#1d4ed8', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 50, textDecoration: 'none' }}>
              Ver todas as materias de Esportes
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
