'use client'
import { useState } from 'react'

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtD = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const pct = (n) => n.toFixed(1) + '%'

function InputRow({ label, value, onChange, min, max, step, prefix, suffix }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{prefix}{Number(value).toLocaleString('en-US')}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#009C3B' }} />
    </div>
  )
}

function ResultBox({ label, value, color, small }) {
  const c = color || '#009C3B'
  return (
    <div style={{ background: c + '18', border: '1px solid ' + c + '35', borderRadius: 10, padding: small ? '10px 14px' : '14px 18px', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: small ? 11 : 12, color: '#666', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: small ? 15 : 20, fontWeight: 800, color: c }}>{value}</div>
    </div>
  )
}

function Modal({ title, icon, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: '#fff', borderRadius: '20px 20px 0 0', zIndex: 1 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: '#f5f5f5', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#666' }}>x</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

function MortgageCalc({ onClose }) {
  const [price, setPrice] = useState(450000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(71)
  const [years, setYears] = useState(30)
  const [taxes, setTaxes] = useState(450)
  const [ins, setIns] = useState(180)

  const realRate = rate / 10
  const principal = price * (1 - down / 100)
  const r = realRate / 100 / 12
  const n = years * 12
  const pi = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const piti = pi + taxes + ins
  const totalInterest = pi * n - principal
  const downPayment = price * down / 100
  const pmiNote = down < 20 ? ' + PMI ~$' + Math.round(principal * 0.008 / 12) + '/mes' : ''

  return (
    <Modal title="Simulacao de Financiamento" icon="🏠" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#888', marginTop: 0, marginBottom: 20 }}>Taxa media atual: 6.8-7.2% (Jun 2026)</p>
      <InputRow label="Preco do imovel" value={price} onChange={setPrice} min={100000} max={2000000} step={5000} prefix="$" suffix="" />
      <InputRow label="Entrada" value={down} onChange={setDown} min={3} max={50} step={1} prefix="" suffix="%" />
      <InputRow label="Taxa de juros" value={rate} onChange={setRate} min={40} max={100} step={1} prefix="" suffix={'% (' + pct(realRate) + ')'} />
      <InputRow label="Prazo" value={years} onChange={setYears} min={10} max={30} step={5} prefix="" suffix=" anos" />
      <InputRow label="IPTU + HOA (mensal)" value={taxes} onChange={setTaxes} min={0} max={2000} step={50} prefix="$" suffix="" />
      <InputRow label="Seguro (mensal)" value={ins} onChange={setIns} min={50} max={500} step={10} prefix="$" suffix="" />
      <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 10 }}>
        <ResultBox label="Parcela total/mes" value={fmtD(piti) + pmiNote} color="#009C3B" />
        <ResultBox label="So o financiamento" value={fmtD(pi)} color="#002776" small={true} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <ResultBox label="Entrada necessaria" value={fmt(downPayment)} color="#b8860b" small={true} />
        <ResultBox label="Total de juros" value={fmt(totalInterest)} color="#c0392b" small={true} />
        <ResultBox label="Custo total" value={fmt(pi * n + downPayment)} color="#777" small={true} />
      </div>
      <div style={{ marginTop: 18, padding: '12px 16px', background: '#f0fdf4', borderRadius: 10, fontSize: 12, color: '#555' }}>
        {down >= 20 ? '✅ Com 20%+ de entrada voce evita o PMI (seguro obrigatorio).' : '⚠️ Entrada abaixo de 20%: voce pagara PMI de ~$' + Math.round(principal * 0.008 / 12) + '/mes ate atingir 20% de equity.'}
      </div>
    </Modal>
  )
}

function InvestmentCalc({ onClose }) {
  const [initial, setInitial] = useState(10000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(70)
  const [years, setYears] = useState(20)

  const realRate = rate / 10
  const r = realRate / 100 / 12
  const n = years * 12
  const future = initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r)
  const totalInvested = initial + monthly * n
  const profit = future - totalInvested
  const multiplier = (future / Math.max(totalInvested, 1)).toFixed(1)

  const milestones = [5, 10, 15, 20, 30].filter(y => y <= years)
  if (!milestones.includes(years)) milestones.push(years)

  return (
    <Modal title="Simulador de Investimentos" icon="📈" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#888', marginTop: 0, marginBottom: 20 }}>S&P 500 historico: ~10%/ano | High-yield savings: 4-5%</p>
      <InputRow label="Investimento inicial" value={initial} onChange={setInitial} min={0} max={500000} step={1000} prefix="$" suffix="" />
      <InputRow label="Aporte mensal" value={monthly} onChange={setMonthly} min={0} max={10000} step={100} prefix="$" suffix="" />
      <InputRow label="Taxa anual estimada" value={rate} onChange={setRate} min={10} max={150} step={5} prefix="" suffix={'% (' + pct(realRate) + ')'} />
      <InputRow label="Periodo" value={years} onChange={setYears} min={1} max={40} step={1} prefix="" suffix=" anos" />
      <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 10 }}>
        <ResultBox label="Valor final" value={fmt(future)} color="#009C3B" />
        <ResultBox label="Lucro total" value={fmt(profit)} color="#002776" small={true} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <ResultBox label="Total investido" value={fmt(totalInvested)} color="#777" small={true} />
        <ResultBox label="Multiplicador" value={multiplier + 'x'} color="#b8860b" small={true} />
      </div>
      <div style={{ marginTop: 18, background: '#f0fdf4', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#009C3B', marginBottom: 8 }}>Projecao por etapas</div>
        {milestones.map(y => {
          const ny = y * 12
          const fy = initial * Math.pow(1 + r, ny) + monthly * ((Math.pow(1 + r, ny) - 1) / r)
          return (
            <div key={y} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #d1fae5' }}>
              <span style={{ color: '#555' }}>{y} {y === 1 ? 'ano' : 'anos'}</span>
              <span style={{ fontWeight: 700, color: '#009C3B' }}>{fmt(fy)}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

function CarCalc({ onClose }) {
  const [price, setPrice] = useState(35000)
  const [down, setDown] = useState(3000)
  const [months, setMonths] = useState(60)
  const [rate, setRate] = useState(65)
  const [mode, setMode] = useState('finance')
  const [leaseMonths, setLeaseMonths] = useState(36)
  const [residual, setResidual] = useState(55)

  const realRate = rate / 10
  const principal = price - down
  const r = realRate / 100 / 12
  const n = months
  const finPayment = n > 0 ? principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0
  const finTotal = finPayment * n + down
  const finInterest = finPayment * n - principal

  const residualVal = price * residual / 100
  const ln = leaseMonths
  const leasePayment = ((price - down - residualVal) / ln) + ((price - down + residualVal) * r)
  const leaseTotal = leasePayment * ln + down

  return (
    <Modal title="Calculadora de Veiculos" icon="🚗" onClose={onClose}>
      <p style={{ fontSize: 13, color: '#888', marginTop: 0, marginBottom: 16 }}>Taxa media financiamento 2026: 6-8% | Lease: 4-7%</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['finance', 'Financiamento'], ['lease', 'Leasing']].map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)}
            style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              background: mode === m ? '#009C3B' : '#f0f0f0', color: mode === m ? '#fff' : '#555' }}>
            {m === 'finance' ? '💳 ' : '🔄 '}{label}
          </button>
        ))}
      </div>
      <InputRow label="Preco do veiculo" value={price} onChange={setPrice} min={5000} max={200000} step={1000} prefix="$" suffix="" />
      <InputRow label="Entrada" value={down} onChange={setDown} min={0} max={50000} step={500} prefix="$" suffix="" />
      <InputRow label="Taxa de juros anual" value={rate} onChange={setRate} min={20} max={200} step={5} prefix="" suffix={'% (' + pct(realRate) + ')'} />
      {mode === 'finance' ? (
        <>
          <InputRow label="Prazo" value={months} onChange={setMonths} min={24} max={84} step={12} prefix="" suffix=" meses" />
          <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 10 }}>
            <ResultBox label="Parcela mensal" value={fmtD(finPayment)} color="#009C3B" />
            <ResultBox label="Total de juros" value={fmt(finInterest)} color="#c0392b" small={true} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <ResultBox label="Custo total" value={fmt(finTotal)} color="#002776" small={true} />
            <ResultBox label="Proprietario?" value="Sim ✅" color="#009C3B" small={true} />
          </div>
        </>
      ) : (
        <>
          <InputRow label="Duracao do lease" value={leaseMonths} onChange={setLeaseMonths} min={24} max={48} step={12} prefix="" suffix=" meses" />
          <InputRow label="Valor residual" value={residual} onChange={setResidual} min={30} max={70} step={5} prefix="" suffix="%" />
          <div style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 10 }}>
            <ResultBox label="Parcela mensal" value={fmtD(leasePayment)} color="#002776" />
            <ResultBox label="Total do lease" value={fmt(leaseTotal)} color="#777" small={true} />
          </div>
          <ResultBox label="Proprietario?" value="Nao — devolve ao fim ❌" color="#c0392b" small={true} />
        </>
      )}
      <div style={{ marginTop: 16, padding: '12px 16px', background: '#fff8e1', borderRadius: 10, fontSize: 12, color: '#555' }}>
        {mode === 'finance'
          ? 'Financiando ' + months + ' meses voce paga ' + fmtD(finPayment) + '/mes e se torna dono do carro ao final.'
          : 'No lease de ' + leaseMonths + ' meses voce paga menos por mes, mas devolve o carro. Ideal para trocar a cada 2-3 anos.'}
      </div>
    </Modal>
  )
}

const tools = [
  { key: 'mortgage', icon: '🏠', label: 'Financiamento', sublabel: 'Casa & Ape' },
  { key: 'investment', icon: '📈', label: 'Investimentos', sublabel: 'Juros Compostos' },
  { key: 'car', icon: '🚗', label: 'Veiculos', sublabel: 'Compra & Lease' },
]

export default function Toolbox() {
  const [open, setOpen] = useState(null)
  return (
    <>
      <div style={{
        background: 'linear-gradient(90deg, #002776 0%, #009C3B 100%)',
        padding: '7px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 700, marginRight: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>🧰 Ferramentas</span>
        {tools.map(t => (
          <button key={t.key} onClick={() => setOpen(t.key)}
            style={{
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 9,
              padding: '5px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#fff',
            }}>
            <span style={{ fontSize: 17 }}>{t.icon}</span>
            <span style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{t.label}</div>
              <div style={{ fontSize: 10, opacity: 0.72, lineHeight: 1.3 }}>{t.sublabel}</div>
            </span>
          </button>
        ))}
      </div>
      {open === 'mortgage' && <MortgageCalc onClose={() => setOpen(null)} />}
      {open === 'investment' && <InvestmentCalc onClose={() => setOpen(null)} />}
      {open === 'car' && <CarCalc onClose={() => setOpen(null)} />}
    </>
  )
}
