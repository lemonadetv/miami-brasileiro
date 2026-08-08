'use client'
import { useState } from 'react'
import Footer from '../../components/Footer'

// ── Utilitários ──────────────────────────────────────────────────
const fmt  = n => n.toLocaleString('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 })
const fmtD = n => n.toLocaleString('en-US', { style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:2 })
const pct  = n => parseFloat(n).toFixed(2).replace(/\.?0+$/,'') + '%'

// ── Calculadora de Mortgage ───────────────────────────────────────
function MortgageCalculator() {
  const [price,    setPrice]    = useState(450000)
  const [downPct,  setDownPct]  = useState(10)
  const [rate,     setRate]     = useState(7.0)
  const [years,    setYears]    = useState(30)
  const [propTax,  setPropTax]  = useState(8000)
  const [insurance,setInsurance]= useState(2400)
  const [hoa,      setHoa]      = useState(0)
  const [loanType, setLoanType] = useState('conventional')

  const down      = price * downPct / 100
  const principal = price - down
  const r         = rate / 100 / 12
  const n         = years * 12
  const pi        = r > 0 ? principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1) : principal/n
  const pmi       = downPct < 20 ? Math.round(principal * 0.008 / 12) : 0
  const monthly   = pi + propTax/12 + insurance/12 + hoa/12 + pmi
  const totalPaid = pi * n + down
  const totalInt  = pi * n - principal
  const ltv       = (principal / price * 100).toFixed(1)

  const sliderStyle = { width:'100%', accentColor:'#009C3B', cursor:'pointer' }

  function Row({ label, val, min, max, step, onChange, prefix='', suffix='' }) {
    return (
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}>{label}</span>
          <span style={{ fontSize:14, fontWeight:800, color:'var(--text)' }}>{prefix}{typeof val==='number'?val.toLocaleString('en-US'):val}{suffix}</span>
        </div>
        <input type="range" min={min} max={max} step={step} value={val} onChange={e=>onChange(Number(e.target.value))} style={sliderStyle} />
      </div>
    )
  }

  function Stat({ label, value, color='#009C3B', big }) {
    return (
      <div style={{ background:color+'18', border:'1.5px solid '+color+'30', borderRadius:12, padding: big?'18px 20px':'12px 16px', flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:big?24:18, fontWeight:900, color }}>{value}</div>
      </div>
    )
  }

  const loanTypeInfo = {
    conventional: { min:5, pmiNote:'PMI obrigatório se entrada < 20%', desc:'Padrão para cidadãos/RPs com bom crédito (score 620+). Melhores taxas com 20%+ de entrada.' },
    fha:          { min:3.5, pmiNote:'MIP vitalício (a menos que refinancie)', desc:'Ideal para quem tem crédito a partir de 580 e entrada de 3.5%. Aceita imigrantes com SSN válido.' },
    itin:         { min:15, pmiNote:'Taxas ligeiramente maiores', desc:'Para imigrantes sem SSN ou Green Card — usa o ITIN (número de contribuinte). Exige histórico bancário de 24 meses.' },
    dscr:         { min:20, pmiNote:'Sem comprovação de renda pessoal', desc:'Baseado no aluguel do imóvel, não na sua renda. Excelente para investidores e autônomos.' },
  }

  return (
    <div style={{ background:'var(--bg-card)', borderRadius:20, padding:'28px 24px', boxShadow:'var(--shadow)' }}>
      <h2 style={{ fontSize:'1.3rem', fontWeight:900, marginBottom:6, color:'var(--text)' }}>🏠 Calculadora de Financiamento</h2>
      <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24 }}>Taxa média atual no mercado: 6.8–7.5% (Ago 2026)</p>

      {/* Tipo de empréstimo */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Tipo de Financiamento</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[['conventional','🏦 Conventional'],['fha','🤝 FHA'],['itin','📋 ITIN Loan'],['dscr','🏢 DSCR (Investidor)']].map(([k,l])=>(
            <button key={k} onClick={()=>{ setLoanType(k); if(downPct < loanTypeInfo[k].min) setDownPct(loanTypeInfo[k].min) }}
              style={{ padding:'8px 14px', borderRadius:10, border:'1.5px solid', fontSize:13, fontWeight:700, cursor:'pointer',
                borderColor: loanType===k ? '#009C3B' : 'var(--border)',
                background:  loanType===k ? '#009C3B' : 'var(--bg)',
                color:       loanType===k ? '#fff'    : 'var(--text-muted)' }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ marginTop:10, padding:'10px 14px', background:'#009C3B18', borderRadius:10, fontSize:12, color:'var(--text-muted)', borderLeft:'3px solid #009C3B' }}>
          {loanTypeInfo[loanType].desc}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 32px' }}>
        <div>
          <Row label="Preço do Imóvel" val={price} min={100000} max={2000000} step={5000} onChange={setPrice} prefix="$" />
          <Row label={`Entrada (${downPct}% = ${fmt(down)})`} val={downPct} min={loanTypeInfo[loanType].min} max={50} step={0.5} onChange={setDownPct} suffix="%" />
          <Row label="Taxa de Juros (APR)" val={rate} min={4} max={12} step={0.125} onChange={setRate} suffix="%" />
          <Row label="Prazo" val={years} min={10} max={30} step={5} onChange={setYears} suffix=" anos" />
        </div>
        <div>
          <Row label="Property Tax (anual)" val={propTax} min={0} max={30000} step={500} onChange={setPropTax} prefix="$" />
          <Row label="Seguro Residencial (anual)" val={insurance} min={0} max={10000} step={100} onChange={setInsurance} prefix="$" />
          <Row label="HOA (mensal)" val={hoa} min={0} max={2000} step={50} onChange={setHoa} prefix="$" />
        </div>
      </div>

      {/* Resultados */}
      <div style={{ display:'flex', gap:10, marginTop:8, marginBottom:10 }}>
        <Stat label="Pagamento Total / Mês" value={fmtD(monthly)} color="#009C3B" big />
        <Stat label="Só Principal + Juros" value={fmtD(pi)} color="#002776" />
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <Stat label="Entrada Necessária" value={fmt(down)} color="#b8860b" />
        <Stat label="Total de Juros" value={fmt(totalInt)} color="#e53e3e" />
        <Stat label="Custo Total" value={fmt(totalPaid)} color="#666" />
        <Stat label="LTV" value={ltv+'%'} color={Number(ltv)>80?'#e53e3e':'#009C3B'} />
      </div>

      {pmi > 0 && (
        <div style={{ padding:'12px 16px', background:'#fef3cd', borderRadius:10, fontSize:12, color:'#856404', marginBottom:12, borderLeft:'3px solid #ffc107' }}>
          ⚠️ <strong>PMI:</strong> Com entrada abaixo de 20% você pagará ~{fmt(pmi)}/mês extra até atingir 20% de equity. {loanTypeInfo[loanType].pmiNote}.
        </div>
      )}
      {downPct >= 20 && (
        <div style={{ padding:'12px 16px', background:'#d4edda', borderRadius:10, fontSize:12, color:'#155724', borderLeft:'3px solid #28a745' }}>
          ✅ Com 20%+ de entrada você evita o PMI — economia de ~{fmt(Math.round(principal * 0.008 / 12))}/mês!
        </div>
      )}

      {/* Amortização anual */}
      <details style={{ marginTop:16 }}>
        <summary style={{ cursor:'pointer', fontSize:13, fontWeight:700, color:'#009C3B', padding:'8px 0' }}>📅 Ver tabela de amortização anual</summary>
        <div style={{ overflowX:'auto', marginTop:8 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'var(--bg)' }}>
                {['Ano','Parcela/mês','Principal','Juros','Saldo Devedor'].map(h=>(
                  <th key={h} style={{ padding:'7px 10px', textAlign:'right', fontWeight:700, color:'var(--text-muted)', fontSize:11, textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: years }, (_, i) => {
                const yr = i + 1
                let bal = principal, yPrinc = 0, yInt = 0
                for (let m = 0; m < yr * 12; m++) {
                  const intM = bal * r; const prinM = pi - intM
                  if (m >= (yr-1)*12) { yPrinc += prinM; yInt += intM }
                  bal = Math.max(0, bal - prinM)
                }
                return (
                  <tr key={yr} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'6px 10px', fontWeight:700, textAlign:'right' }}>Ano {yr}</td>
                    <td style={{ padding:'6px 10px', textAlign:'right' }}>{fmtD(pi)}</td>
                    <td style={{ padding:'6px 10px', textAlign:'right', color:'#009C3B' }}>{fmt(yPrinc)}</td>
                    <td style={{ padding:'6px 10px', textAlign:'right', color:'#e53e3e' }}>{fmt(yInt)}</td>
                    <td style={{ padding:'6px 10px', textAlign:'right', fontWeight:700 }}>{fmt(bal)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

// ── Dados informativos ────────────────────────────────────────────
const LOAN_TYPES = [
  { icon:'🏦', name:'Conventional Loan', min_down:'5%', credit:'620+', for:'Cidadãos & Residentes Permanentes', highlight:false,
    pros:['Melhores taxas com 20% de entrada','Sem MIP/PMI com 20%+ de entrada','Flexibilidade de valores e prazos'],
    contras:['Exige crédito mais alto','Sem apoio governamental'], color:'#2563EB' },
  { icon:'🤝', name:'FHA Loan', min_down:'3.5%', credit:'580+', for:'Imigrantes com SSN/Visto válido', highlight:true,
    pros:['Entrada mínima de 3.5%','Aceita credit score menor','Acessível para quem chegou recentemente'],
    contras:['MIP obrigatório durante toda a vigência','Limite de valor do imóvel por condado'], color:'#059669' },
  { icon:'📋', name:'ITIN Loan', min_down:'15%', credit:'Histórico bancário', for:'Sem SSN / sem Green Card', highlight:false,
    pros:['Não exige SSN','Aceita ITIN como identificação','Histórico bancário de 24 meses vale como crédito'],
    contras:['Taxa ligeiramente maior','Exige mais documentação','Poucas instituições oferecem'], color:'#7C3AED' },
  { icon:'🏢', name:'DSCR Loan', min_down:'20%', credit:'Renda do aluguel', for:'Investidores / Autônomos', highlight:false,
    pros:['Sem comprovação de renda pessoal','Baseado no potencial de aluguel do imóvel','Ideal para imóveis de renda'],
    contras:['Down payment maior','Taxa mais alta','Somente para imóveis de investimento'], color:'#D97706' },
]

const PROCESS_STEPS = [
  { n:1, icon:'📊', title:'Verifique seu Crédito', desc:'Acesse seu credit score no Credit Karma ou Experian. Score 620+ para Conventional, 580+ para FHA.' },
  { n:2, icon:'🏦', title:'Pre-Approval', desc:'Busque pre-approval em 2-3 lenders para comparar taxas. O pre-approval mostra aos vendedores que você é um comprador sério.' },
  { n:3, icon:'🏘️', title:'Encontre um Realtor', desc:'Prefira um realtor que fale português e conheça a comunidade brasileira em Miami. O realtor do comprador é pago pelo vendedor — não custa nada para você!' },
  { n:4, icon:'🔍', title:'Home Inspection', desc:'NUNCA pule esta etapa! A inspeção (~$400-600) pode revelar problemas sérios e salvar você de prejuízos enormes.' },
  { n:5, icon:'📝', title:'Oferta & Contrato', desc:'Seu realtor apresenta a oferta. Inclua contingências para financiamento e inspeção para proteger seu depósito.' },
  { n:6, icon:'🎉', title:'Closing', desc:'Leve ~3-5% do preço do imóvel para os custos de fechamento (taxas, seguro de título, etc.). Assine os documentos e receba as chaves!' },
]

const CITIZEN_VS_IMMIGRANT = [
  { aspect:'Tipos disponíveis', cidadao:'Todos (Conventional, FHA, VA, USDA)', imigrante:'Conventional, FHA (com SSN), ITIN, DSCR' },
  { aspect:'Down payment mínimo', cidadao:'3% (Conventional)', imigrante:'3.5% (FHA c/ SSN) / 15% (ITIN)' },
  { aspect:'Credit score', cidadao:'620+ (Conventional)', imigrante:'580+ (FHA) / Histórico bancário (ITIN)' },
  { aspect:'Comprovação de renda', cidadao:'2 anos de tax returns', imigrante:'2 anos de bank statements / pay stubs' },
  { aspect:'SSN obrigatório?', cidadao:'Sim', imigrante:'Não — ITIN aceito em alguns lenders' },
  { aspect:'Green Card necessário?', cidadao:'Sim (cidadão)', imigrante:'Não — visto válido pode ser suficiente' },
  { aspect:'Taxas de juros', cidadao:'Padrão do mercado', imigrante:'Padrão (FHA) ou +0.5-1% (ITIN)' },
]

// ── Página principal ──────────────────────────────────────────────
export default function ComprandoImovel() {
  const [activeTab, setActiveTab] = useState('guia')

  const tabs = [
    { id:'guia',    label:'📚 Guia Completo' },
    { id:'tipos',   label:'🏦 Tipos de Financiamento' },
    { id:'calc',    label:'🧮 Calculadora' },
    { id:'imigrante', label:'✈️ Sou Imigrante' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)' }}>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg, #0a1628 0%, #0d2040 60%, #0a1e10 100%)', padding:'52px 24px 44px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, background:'rgba(0,156,59,0.08)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:200, height:200, background:'rgba(255,223,0,0.06)', borderRadius:'50%' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,156,59,0.15)', border:'1px solid rgba(0,156,59,0.3)', borderRadius:20, padding:'4px 14px', color:'#00b264', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:14 }}>
            🏡 Guia do Comprador Brasileiro
          </div>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#fff', marginBottom:10, lineHeight:1.15 }}>
            Comprando um Imóvel{' '}
            <span style={{ background:'linear-gradient(to right,#00c97a,#ffdf00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>nos EUA</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1rem', maxWidth:560, lineHeight:1.6, marginBottom:28 }}>
            Tudo que você precisa saber para comprar sua casa nos EUA — seja cidadão, residente permanente ou imigrante sem green card.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[['📊','Mercado aquecido','Valorização histórica em Miami'],['✈️','Disponível para imigrantes','ITIN Loan aceita sem Green Card'],['🧮','Calculadora real','Com PMI, taxes e HOA inclusos']].map(([ic,t,d])=>(
              <div key={t} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'12px 16px', flex:'1 1 160px' }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                <div style={{ fontWeight:700, fontSize:13, color:'#fff', marginBottom:2 }}>{t}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position:'sticky', top:0, zIndex:40, background:'rgba(17,17,17,0.97)', backdropFilter:'blur(8px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', overflowX:'auto', scrollbarWidth:'none', padding:'0 8px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding:'14px 18px', borderBottom: activeTab===t.id ? '2px solid #009C3B' : '2px solid transparent',
                color: activeTab===t.id ? '#009C3B' : 'var(--text-muted)', fontWeight:700, fontSize:13,
                background:'none', border:'none', borderBottom: activeTab===t.id ? '2px solid #009C3B' : '2px solid transparent',
                cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 16px 64px' }}>

        {/* ── GUIA COMPLETO ── */}
        {activeTab === 'guia' && (
          <div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, marginBottom:24 }}>📚 Passo a passo para comprar sua casa</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16, marginBottom:48 }}>
              {PROCESS_STEPS.map(s => (
                <div key={s.n} style={{ background:'var(--bg-card)', borderRadius:16, padding:'20px 20px 20px 16px', boxShadow:'var(--shadow)', display:'flex', gap:14, border:'1px solid var(--border)' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#009C3B20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:800, color:'#009C3B', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Passo {s.n}</div>
                    <div style={{ fontWeight:800, fontSize:15, marginBottom:5, color:'var(--text)' }}>{s.title}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custos extras */}
            <h2 style={{ fontSize:'1.3rem', fontWeight:900, marginBottom:16 }}>💰 Custos que Você Precisa Conhecer</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12, marginBottom:32 }}>
              {[
                ['Closing Costs','2–5% do valor do imóvel','Taxas de cartório, título, lender, etc.','#e53e3e'],
                ['Property Tax','1–2% ao ano','Varia por condado. Miami-Dade ~1%.','#D97706'],
                ['HOA','$0–$1.500/mês','Condomínios e comunidades fechadas.','#7C3AED'],
                ['Seguro Residencial','$1.500–$5.000/ano','Seguro de furacão é obrigatório na FL.','#2563EB'],
                ['PMI','~0.8% ao ano','Se entrada for menor que 20%.','#059669'],
                ['Home Inspection','$400–$700','Inspeção antes do fechamento.','#6B7280'],
              ].map(([t,v,d,c]) => (
                <div key={t} style={{ background:'var(--bg-card)', borderRadius:14, padding:'16px', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:12, fontWeight:800, color:c, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{t}</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--text)', marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIPOS DE FINANCIAMENTO ── */}
        {activeTab === 'tipos' && (
          <div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, marginBottom:8 }}>🏦 Tipos de Financiamento Disponíveis</h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:28 }}>Cada tipo tem requisitos e vantagens diferentes — escolha o que melhor se encaixa na sua situação.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {LOAN_TYPES.map(l => (
                <div key={l.name} style={{ background:'var(--bg-card)', borderRadius:18, padding:'24px', boxShadow:'var(--shadow)', border: l.highlight ? '2px solid #009C3B' : '1px solid var(--border)', position:'relative' }}>
                  {l.highlight && <div style={{ position:'absolute', top:12, right:12, background:'#009C3B', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 10px', borderRadius:20, textTransform:'uppercase', letterSpacing:'0.08em' }}>Mais Popular</div>}
                  <div style={{ fontSize:32, marginBottom:10 }}>{l.icon}</div>
                  <h3 style={{ fontSize:'1.1rem', fontWeight:900, marginBottom:4, color:'var(--text)' }}>{l.name}</h3>
                  <div style={{ fontSize:11, color:l.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:14 }}>Para: {l.for}</div>
                  <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                    <div style={{ background:l.color+'18', border:'1px solid '+l.color+'30', borderRadius:8, padding:'6px 12px', fontSize:12, textAlign:'center', flex:1 }}>
                      <div style={{ color:'var(--text-muted)', fontSize:10, marginBottom:2 }}>Entrada Mín.</div>
                      <div style={{ fontWeight:800, color:l.color }}>{l.min_down}</div>
                    </div>
                    <div style={{ background:l.color+'18', border:'1px solid '+l.color+'30', borderRadius:8, padding:'6px 12px', fontSize:12, textAlign:'center', flex:1 }}>
                      <div style={{ color:'var(--text-muted)', fontSize:10, marginBottom:2 }}>Crédito</div>
                      <div style={{ fontWeight:800, color:l.color }}>{l.credit}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    {l.pros.map(p => <div key={p} style={{ fontSize:12, color:'var(--text-muted)', padding:'4px 0', borderBottom:'1px solid var(--border)' }}>✅ {p}</div>)}
                  </div>
                  <div>
                    {l.contras.map(c => <div key={c} style={{ fontSize:12, color:'var(--text-muted)', padding:'4px 0' }}>⚠️ {c}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CALCULADORA ── */}
        {activeTab === 'calc' && <MortgageCalculator />}

        {/* ── SOU IMIGRANTE ── */}
        {activeTab === 'imigrante' && (
          <div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, marginBottom:8 }}>✈️ Comprar Casa sendo Imigrante</h2>
            <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>Boas notícias: imigrantes podem comprar imóveis nos EUA! Veja as diferenças em relação a cidadãos.</p>

            <div style={{ background:'var(--bg-card)', borderRadius:16, overflow:'hidden', marginBottom:32, border:'1px solid var(--border)' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'var(--bg)' }}>
                      <th style={{ padding:'14px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>Aspecto</th>
                      <th style={{ padding:'14px 16px', textAlign:'center', fontSize:12, fontWeight:700, color:'#2563EB', textTransform:'uppercase' }}>🇺🇸 Cidadão/RP</th>
                      <th style={{ padding:'14px 16px', textAlign:'center', fontSize:12, fontWeight:700, color:'#009C3B', textTransform:'uppercase' }}>✈️ Imigrante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CITIZEN_VS_IMMIGRANT.map((r,i) => (
                      <tr key={r.aspect} style={{ borderTop:'1px solid var(--border)', background: i%2===0 ? 'transparent' : 'var(--bg)' }}>
                        <td style={{ padding:'12px 16px', fontWeight:700, fontSize:13 }}>{r.aspect}</td>
                        <td style={{ padding:'12px 16px', textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>{r.cidadao}</td>
                        <td style={{ padding:'12px 16px', textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>{r.imigrante}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 style={{ fontSize:'1.1rem', fontWeight:900, marginBottom:14 }}>💡 Dicas para Imigrantes</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
              {[
                ['📊','Construa seu crédito primeiro','Use um secured credit card por 6-12 meses. Pague 100% da fatura todo mês. Seu score vai subir rapidamente.'],
                ['💰','Separe a entrada + custos de fechamento','Planeje 15-25% do valor do imóvel: entrada + closing costs + reserva de emergência.'],
                ['🏦','Abra conta em um banco americano','Histórico bancário de 24 meses é fundamental para o ITIN Loan. Quanto antes abrir, melhor.'],
                ['📋','Organize sua documentação','Passaporte, visto, ITIN ou SSN, 2 anos de bank statements, pay stubs, tax returns (se tiver).'],
                ['👥','Busque um mortgage broker brasileiro','Lenders familiarizados com brasileiros conhecem os programas certos e facilitam o processo.'],
                ['⚖️','Cuidado com o DSCR','Para investidores, o DSCR pode ser excelente — mas exige 20-25% de entrada e projeta renda de aluguel.'],
              ].map(([ic,t,d]) => (
                <div key={t} style={{ background:'var(--bg-card)', borderRadius:14, padding:'18px', border:'1px solid var(--border)', display:'flex', gap:12 }}>
                  <span style={{ fontSize:24, flexShrink:0 }}>{ic}</span>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, marginBottom:5, color:'var(--text)' }}>{t}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
