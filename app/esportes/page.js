'use client'

import { useState } from 'react'
import Footer from '../../components/Footer'

const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif',
  },
  hero: {
    background: 'linear-gradient(135deg, #0d1a0d 0%, #111 40%, #0d1a20 100%)',
    borderBottom: '1px solid rgba(0,178,130,0.2)',
    padding: '48px 24px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroInner: {
    maxWidth: 1200,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(0,178,130,0.12)',
    border: '1px solid rgba(0,178,130,0.3)',
    borderRadius: 20,
    padding: '4px 14px',
    color: '#00b28a',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroH1: {
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 900,
    color: '#fff',
    margin: '0 0 10px',
    lineHeight: 1.15,
  },
  heroSpan: {
    background: 'linear-gradient(to right, #00c97a, #ffdf00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroP: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '1rem',
    maxWidth: 520,
    lineHeight: 1.6,
  },
  tabNav: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(17,17,17,0.97)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
  },
  tabScroll: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    padding: '0 8px',
  },
  content: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 16px 48px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  sectionBar: (color) => ({
    width: 4,
    height: 40,
    background: color,
    borderRadius: 4,
    flexShrink: 0,
  }),
  sectionH2: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#fff',
    margin: 0,
  },
  sectionSub: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    margin: '2px 0 0',
  },
  card: {
    background: 'var(--bg-card)',
    borderRadius: 16,
    border: '1px solid var(--border)',
    overflow: 'hidden',
    marginBottom: 24,
  },
  cardHeader: (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    background: `linear-gradient(to right, ${color}22, transparent)`,
  }),
  cardH3: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  cardSub: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    padding: '10px 16px',
    color: '#666',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '11px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'middle',
  },
  badge: (bg, color) => ({
    display: 'inline-block',
    background: bg,
    color: color,
    fontSize: '0.7rem',
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }),
  highlightRow: {
    background: 'rgba(0,150,80,0.08)',
  },
  posNum: (color) => ({
    display: 'inline-flex',
    width: 24,
    height: 24,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 800,
    background: color,
  }),
  featureCard: (from, to) => ({
    background: `linear-gradient(135deg, ${from} 0%, var(--bg-card) 60%, ${to} 100%)`,
    borderRadius: 16,
    border: `1px solid ${from}`,
    padding: '28px 32px',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  }),
  featureInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 24,
  },
  featureEmoji: {
    fontSize: '4rem',
    lineHeight: 1,
    flexShrink: 0,
  },
  featureH3: {
    fontSize: '1.6rem',
    fontWeight: 900,
    color: '#fff',
    margin: '8px 0 4px',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tag: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: '0.72rem',
    padding: '4px 12px',
    borderRadius: 20,
  },
  newsItem: {
    display: 'flex',
    gap: 14,
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    transition: 'background 0.15s',
  },
  infoBox: (color) => ({
    background: `${color}11`,
    border: `1px solid ${color}33`,
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 12,
  }),
  matchCard: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '16px',
    marginBottom: 12,
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  barOuter: {
    flex: 1,
    background: 'var(--bg)',
    borderRadius: 20,
    height: 32,
    overflow: 'hidden',
  },
  upcomingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    marginBottom: 8,
  },
  fighterCard: (accentColor) => ({
    background: 'var(--bg-card)',
    borderRadius: 16,
    border: '1px solid var(--border)',
    overflow: 'hidden',
  }),
  fighterAccent: (color) => ({
    height: 3,
    background: color,
    width: '100%',
  }),
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  gridTwoLarge: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
}

const TABS = [
  { id: 'futebol', label: '⚽ Futebol', color: '#00c97a' },
  { id: 'f1', label: '🏎️ Fórmula 1', color: '#ef4444' },
  { id: 'surfe', label: '🏄 Surfe WSL', color: '#06b6d4' },
  { id: 'sup', label: '🏄‍♂️ SUP', color: '#3b82f6' },
  { id: 'ski', label: '🏔️ Ski & Snow', color: '#7dd3fc' },
  { id: 'mma', label: '🥊 MMA / UFC', color: '#f97316' },
  { id: 'tenis', label: '🎾 Tênis', color: '#84cc16' },
  { id: 'outros', label: '🏆 Outros', color: '#a855f7' },
]

const BRASILEIRAO = [
  { pos: 1, team: 'Flamengo', pts: 47, pj: 22, v: 14, e: 5, d: 3, gf: 42, ga: 21, sg: 21 },
  { pos: 2, team: 'Palmeiras', pts: 44, pj: 22, v: 13, e: 5, d: 4, gf: 38, ga: 19, sg: 19 },
  { pos: 3, team: 'Atlético MG', pts: 41, pj: 22, v: 12, e: 5, d: 5, gf: 35, ga: 22, sg: 13 },
  { pos: 4, team: 'Botafogo', pts: 39, pj: 22, v: 11, e: 6, d: 5, gf: 33, ga: 24, sg: 9 },
  { pos: 5, team: 'São Paulo', pts: 37, pj: 22, v: 10, e: 7, d: 5, gf: 29, ga: 21, sg: 8 },
  { pos: 6, team: 'Fluminense', pts: 35, pj: 22, v: 10, e: 5, d: 7, gf: 28, ga: 26, sg: 2 },
  { pos: 7, team: 'Internacional', pts: 34, pj: 22, v: 9, e: 7, d: 6, gf: 27, ga: 25, sg: 2 },
  { pos: 8, team: 'Corinthians', pts: 32, pj: 22, v: 9, e: 5, d: 8, gf: 30, ga: 29, sg: 1 },
  { pos: 9, team: 'Grêmio', pts: 30, pj: 22, v: 8, e: 6, d: 8, gf: 25, ga: 27, sg: -2 },
  { pos: 10, team: 'Cruzeiro', pts: 28, pj: 22, v: 8, e: 4, d: 10, gf: 24, ga: 30, sg: -6 },
]

const COPA_BR = [
  { team1: 'Flamengo', team2: 'Atlético MG', date: '25 Jun', time: '21:45h' },
  { team1: 'Palmeiras', team2: 'Fluminense', date: '25 Jun', time: '19:30h' },
  { team1: 'São Paulo', team2: 'Internacional', date: '26 Jun', time: '21:30h' },
  { team1: 'Botafogo', team2: 'Grêmio', date: '26 Jun', time: '19:00h' },
]

const F1_DRIVERS = [
  { pos: 1, driver: 'Max Verstappen', country: '🇳🇱', team: 'Red Bull Racing', pts: 195 },
  { pos: 2, driver: 'Lewis Hamilton', country: '🇬🇧', team: 'Ferrari', pts: 178 },
  { pos: 3, driver: 'Lando Norris', country: '🇬🇧', team: 'McLaren', pts: 162 },
  { pos: 4, driver: 'Charles Leclerc', country: '🇲🇨', team: 'Ferrari', pts: 155 },
  { pos: 5, driver: 'George Russell', country: '🇬🇧', team: 'Mercedes', pts: 142 },
  { pos: 6, driver: 'Carlos Sainz', country: '🇪🇸', team: 'Williams', pts: 118 },
  { pos: 7, driver: 'Oscar Piastri', country: '🇦🇺', team: 'McLaren', pts: 112 },
  { pos: 8, driver: 'Fernando Alonso', country: '🇪🇸', team: 'Aston Martin', pts: 86 },
  { pos: 9, driver: 'Gabriel Bortoleto', country: '🇧🇷', team: 'Sauber/Kick Sauber', pts: 52, highlight: true },
  { pos: 10, driver: 'Lance Stroll', country: '🇨🇦', team: 'Aston Martin', pts: 45 },
]

const F1_CONSTRUCTORS = [
  { pos: 1, team: 'Red Bull Racing', pts: 340 },
  { pos: 2, team: 'Ferrari', pts: 333 },
  { pos: 3, team: 'McLaren', pts: 274 },
  { pos: 4, team: 'Mercedes', pts: 188 },
  { pos: 5, team: 'Williams', pts: 130 },
]

const WSL_MEN = [
  { pos: 1, surfer: 'João Chianca "Chumbinho"', country: '🇧🇷', pts: 59750, highlight: true },
  { pos: 2, surfer: 'Gabriel Medina', country: '🇧🇷', pts: 54200, highlight: true },
  { pos: 3, surfer: 'Filipe Toledo', country: '🇧🇷', pts: 51800, highlight: true },
  { pos: 4, surfer: 'John John Florence', country: '🇺🇸', pts: 47300 },
  { pos: 5, surfer: 'Italo Ferreira', country: '🇧🇷', pts: 44100, highlight: true },
  { pos: 6, surfer: 'Griffin Colapinto', country: '🇺🇸', pts: 39800 },
  { pos: 7, surfer: 'Jack Robinson', country: '🇦🇺', pts: 37200 },
  { pos: 8, surfer: 'Ethan Ewing', country: '🇦🇺', pts: 35600 },
  { pos: 9, surfer: 'Samuel Pupo', country: '🇧🇷', pts: 34100, highlight: true },
  { pos: 10, surfer: 'Cole Houshmand', country: '🇺🇸', pts: 31700 },
]

const WSL_WOMEN = [
  { pos: 1, surfer: 'Tatiana Weston-Webb', country: '🇧🇷', pts: 56300, highlight: true },
  { pos: 2, surfer: 'Caitlin Simmers', country: '🇺🇸', pts: 51200 },
  { pos: 3, surfer: 'Molly Picklum', country: '🇦🇺', pts: 48600 },
  { pos: 4, surfer: 'Tyler Wright', country: '🇦🇺', pts: 44100 },
  { pos: 5, surfer: 'Brisa Hennessy', country: '🇨🇷', pts: 41700 },
  { pos: 6, surfer: 'Luana Silva', country: '🇺🇸', pts: 38900 },
  { pos: 7, surfer: 'Johanne Defay', country: '🇫🇷', pts: 36400 },
  { pos: 8, surfer: 'Caroline Marks', country: '🇺🇸', pts: 34800 },
  { pos: 9, surfer: 'Lakey Peterson', country: '🇺🇸', pts: 32200 },
  { pos: 10, surfer: 'Isabela Sousa', country: '🇧🇷', pts: 29800, highlight: true },
]

const APP_STANDINGS = [
  { pos: 1, athlete: 'Arthur Arutkin', country: '🇫🇷', pts: 8800 },
  { pos: 2, athlete: 'Vinnicius Martins', country: '🇧🇷', pts: 8200, highlight: true },
  { pos: 3, athlete: 'Michael Booth', country: '🇦🇺', pts: 7900 },
  { pos: 4, athlete: 'Itzel Delgado', country: '🇲🇽', pts: 7400 },
  { pos: 5, athlete: 'Olivia Piana', country: '🇫🇷', pts: 7100 },
  { pos: 6, athlete: 'Casper Steinfath', country: '🇩🇰', pts: 6800 },
  { pos: 7, athlete: 'Guilherme Bragança', country: '🇧🇷', pts: 6500, highlight: true },
  { pos: 8, athlete: 'Connor Baxter', country: '🇺🇸', pts: 6200 },
  { pos: 9, athlete: 'Fiona Wylde', country: '🇺🇸', pts: 5900 },
  { pos: 10, athlete: 'Lena Erdil', country: '🇩🇪', pts: 5600 },
]

const FIS_STANDINGS = [
  { pos: 1, athlete: 'Henrik Kristoffersen', country: '🇳🇴', pts: 1420, disc: 'Slalom' },
  { pos: 2, athlete: 'Luca Braathen', country: '🇧🇷', pts: 1380, disc: 'Slalom / GS', highlight: true },
  { pos: 3, athlete: 'Marco Odermatt', country: '🇨🇭', pts: 1350, disc: 'GS / Super-G' },
  { pos: 4, athlete: 'Alexis Pinturault', country: '🇫🇷', pts: 1210, disc: 'Combinado' },
  { pos: 5, athlete: 'Clement Noel', country: '🇫🇷', pts: 1180, disc: 'Slalom' },
]

const UFC_FIGHTERS = [
  {
    fighter: 'Alex "Poatan" Pereira',
    division: 'Meio-Pesado (205 lbs)',
    status: '🏆 CAMPEÃO UFC',
    record: '12-2',
    color: '#f59e0b',
    highlights: ['Campeão UFC Light Heavyweight desde 2023', 'Ex-campeão Middleweight', 'Lutador do Ano 2023 & 2024', 'Recorde de finalizações em disputas de título'],
  },
  {
    fighter: 'Charles "Do Bronx" Oliveira',
    division: 'Leve (155 lbs)',
    status: '# 1 Contendor',
    record: '34-10',
    color: '#10b981',
    highlights: ['Ex-campeão UFC Lightweight 2021–2022', 'Recorde UFC de finalizações (21)', 'Lutador do Ano 2021', 'Invicto nos últimos 5 combates'],
  },
  {
    fighter: 'Renato "Moicano"',
    division: 'Leve (155 lbs)',
    status: '# 4 Ranking',
    record: '21-5',
    color: '#6366f1',
    highlights: ['Vitória espetacular no UFC 300', 'Top 5 Lightweight', 'Contendor direto ao título', 'Famoso pelo discurso econômico pós-luta'],
  },
  {
    fighter: 'Caio Borralho',
    division: 'Médio (185 lbs)',
    status: '# 2 Ranking',
    record: '16-1',
    color: '#ef4444',
    highlights: ['Top 3 Middleweight', 'Invicto no UFC', 'Próxima disputa de cinturão prevista', 'Caminho direto ao título'],
  },
]

const ATP = [
  { pos: 1, player: 'Jannik Sinner', country: '🇮🇹', pts: 11360 },
  { pos: 2, player: 'Carlos Alcaraz', country: '🇪🇸', pts: 9885 },
  { pos: 3, player: 'Novak Djokovic', country: '🇷🇸', pts: 7510 },
  { pos: 87, player: 'Thiago Monteiro 🇧🇷', country: '🇧🇷', pts: 865, highlight: true },
  { pos: 95, player: 'João Fonseca 🇧🇷', country: '🇧🇷', pts: 798, highlight: true },
]

const WTA = [
  { pos: 1, player: 'Aryna Sabalenka', country: '🇧🇾', pts: 10745 },
  { pos: 2, player: 'Iga Swiatek', country: '🇵🇱', pts: 9850 },
  { pos: 3, player: 'Coco Gauff', country: '🇺🇸', pts: 6905 },
  { pos: 14, player: 'Beatriz Haddad Maia 🇧🇷', country: '🇧🇷', pts: 3210, highlight: true },
  { pos: 31, player: 'Laura Pigossi 🇧🇷', country: '🇧🇷', pts: 1425, highlight: true },
]

const SUPERLIGA = [
  { pos: 1, team: 'Sesc-Flamengo', cidade: 'Rio de Janeiro', v: 20, d: 4 },
  { pos: 2, team: 'Cruzeiro', cidade: 'Belo Horizonte', v: 19, d: 5 },
  { pos: 3, team: 'Taubaté', cidade: 'Taubaté', v: 17, d: 7 },
  { pos: 4, team: 'Sada Cruzeiro', cidade: 'Belo Horizonte', v: 16, d: 8 },
  { pos: 5, team: 'Minas Tênis', cidade: 'Belo Horizonte', v: 15, d: 9 },
]

function getPosStyle(pos) {
  if (pos <= 4) return 'rgba(0,160,80,0.3)'
  if (pos <= 6) return 'rgba(30,80,200,0.3)'
  if (pos >= 17) return 'rgba(220,50,50,0.3)'
  return 'rgba(80,80,80,0.4)'
}

function TabButton({ tab, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '16px 18px',
        fontSize: '0.83rem',
        fontWeight: 700,
        color: active ? tab.color : '#666',
        background: 'transparent',
        border: 'none',
        borderBottom: active ? `2px solid ${tab.color}` : '2px solid transparent',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {tab.label}
    </button>
  )
}

function SectionHeader({ title, sub, color }) {
  return (
    <div style={S.sectionHeader}>
      <div style={S.sectionBar(color)} />
      <div>
        <h2 style={S.sectionH2}>{title}</h2>
        {sub && <p style={S.sectionSub}>{sub}</p>}
      </div>
    </div>
  )
}

function Card({ children, accentColor }) {
  return (
    <div style={S.card}>
      {accentColor && <div style={{ height: 3, background: accentColor }} />}
      {children}
    </div>
  )
}

function CardHeader({ title, sub, accentColor, badge, badgeColor }) {
  return (
    <div style={S.cardHeader(accentColor || '#333')}>
      <div>
        <h3 style={S.cardH3}>{title}</h3>
        {sub && <p style={S.cardSub}>{sub}</p>}
      </div>
      {badge && (
        <span style={{ background: badgeColor || accentColor || '#00c97a', color: '#000', fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
          {badge}
        </span>
      )}
    </div>
  )
}

function StandingsTable({ columns, rows, accentColor }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={S.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ ...S.th, textAlign: col.align || 'left', color: col.highlight ? '#fff' : '#555' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={row.highlight ? { background: 'rgba(0,180,80,0.07)' } : {}}>
              {columns.map((col) => (
                <td key={col.key} style={{ ...S.td, textAlign: col.align || 'left', color: col.color ? col.color(row) : 'var(--text)', fontWeight: col.bold ? 800 : 400 }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FutebolTab() {
  return (
    <div>
      <SectionHeader title="⚽ Futebol Brasileiro" sub="Brasileirão Série A 2026 · Copa do Brasil" color="#00c97a" />

      {/* Brasileirao */}
      <Card>
        <CardHeader
          title="Brasileirão Série A"
          sub="Classificação 2026 — Atualizado 23 Jun"
          accentColor="#00c97a"
          badge="AO VIVO"
          badgeColor="#00c97a"
        />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Clube', 'PTS', 'PJ', 'V', 'E', 'D', 'GF', 'GA', 'SG'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i >= 2 ? 'center' : 'left', color: i === 2 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BRASILEIRAO.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: getPosStyle(row.pos) }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.team}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#00c97a' }}>{row.pts}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#aaa' }}>{row.pj}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#4ade80' }}>{row.v}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#aaa' }}>{row.e}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#f87171' }}>{row.d}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#aaa' }}>{row.gf}</td>
                  <td style={{ ...S.td, textAlign: 'center', color: '#aaa' }}>{row.ga}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 700, color: row.sg > 0 ? '#4ade80' : row.sg < 0 ? '#f87171' : '#aaa' }}>
                    {row.sg > 0 ? `+${row.sg}` : row.sg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: '0.72rem', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'rgba(0,160,80,0.4)' }} /> Libertadores (Top 4)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'rgba(30,80,200,0.4)' }} /> Sul-Americana (5–6)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'rgba(220,50,50,0.4)' }} /> Rebaixamento (17–20)
          </span>
        </div>
      </Card>

      {/* Copa Brasil */}
      <Card>
        <CardHeader title="Copa do Brasil 2026" sub="Quartas de Final — Ida" accentColor="#ffdf00" />
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {COPA_BR.map((m, i) => (
            <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.7rem', color: '#ffdf00', fontWeight: 700, background: 'rgba(255,223,0,0.1)', padding: '2px 10px', borderRadius: 20 }}>IDA</span>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>{m.date} · {m.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{m.team1}</span>
                <span style={{ fontSize: '0.7rem', background: '#2a2a2a', padding: '4px 10px', borderRadius: 8, color: '#666', fontWeight: 800 }}>VS</span>
                <span style={{ fontWeight: 700, color: '#fff', textAlign: 'right' }}>{m.team2}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* News */}
      <Card>
        <CardHeader title="📰 Destaques" sub="Notícias recentes do futebol brasileiro" accentColor="#333" />
        <div style={{ padding: '16px 20px' }}>
          {[
            { badge: 'BRASILEIRÃO', color: '#00c97a', text: 'Flamengo mantém liderança com vitória sobre o Corinthians no Maracanã — Pedro marca dois gols no triunfo de 3×1.' },
            { badge: 'COPA DO BRASIL', color: '#ffdf00', text: 'Palmeiras elimina o São Paulo nos pênaltis e avança às quartas — Abel Ferreira exalta o grupo pelo resultado.' },
            { badge: 'SELEÇÃO', color: '#3b82f6', text: 'Dorival Júnior convoca 26 jogadores para amistosos de preparação antes da Copa América 2027.' },
          ].map((item, i) => (
            <div key={i} style={S.newsItem}>
              <span style={S.badge(item.color, item.color === '#ffdf00' ? '#000' : '#fff')}>{item.badge}</span>
              <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function F1Tab() {
  return (
    <div>
      <SectionHeader title="🏎️ Fórmula 1" sub="Campeonato Mundial 2026" color="#ef4444" />

      {/* Bortoleto Feature */}
      <div style={{ ...S.featureCard('rgba(0,150,80,0.2)', 'rgba(255,223,0,0.1)'), marginBottom: 24 }}>
        <div style={S.featureInner}>
          <div style={S.featureEmoji}>🏎️</div>
          <div>
            <span style={{ ...S.badge('rgba(0,160,80,0.2)', '#00c97a'), border: '1px solid rgba(0,160,80,0.4)', marginBottom: 8, display: 'inline-block' }}>🇧🇷 Destaque Brasileiro</span>
            <h3 style={S.featureH3}>Gabriel Bortoleto</h3>
            <p style={{ color: '#00c97a', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 10px' }}>O Campeão Brasileiro na F1</p>
            <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 520 }}>
              Piloto brasileiro de 20 anos, campeão da F2 em 2024, estreante na Fórmula 1 pela Sauber/Kick Sauber na temporada 2026. Bortoleto representa a nova geração do automobilismo brasileiro, mantendo viva a chama iniciada por Ayrton Senna e Rubens Barrichello.
            </p>
            <div style={S.tagRow}>
              {['Campeão F2 2024', 'Rookie of the Year 2025', 'Sauber / Kick Sauber', 'São Paulo, Brasil'].map((t) => (
                <span key={t} style={S.tag}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drivers */}
      <Card>
        <CardHeader title="Campeonato de Pilotos" sub="Top 10 — Temporada 2026" accentColor="#ef4444" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Piloto', 'País', 'Equipe', 'PTS'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i === 4 ? 'center' : 'left', color: i === 4 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {F1_DRIVERS.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.driver}</td>
                  <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                  <td style={{ ...S.td, color: '#888', fontSize: '0.83rem' }}>{row.team}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#ef4444' }}>{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Constructors */}
      <Card>
        <CardHeader title="Campeonato de Construtores — Top 5" accentColor="#ef4444" />
        <div style={{ padding: '20px 24px' }}>
          {F1_CONSTRUCTORS.map((row) => (
            <div key={row.pos} style={S.barRow}>
              <span style={{ color: '#555', fontSize: '0.8rem', width: 16 }}>{row.pos}</span>
              <div style={S.barOuter}>
                <div style={{ height: '100%', width: `${(row.pts / F1_CONSTRUCTORS[0].pts) * 100}%`, background: 'linear-gradient(to right, #991b1b, #ef4444)', display: 'flex', alignItems: 'center', paddingLeft: 14, borderRadius: 20, transition: 'width 0.5s' }}>
                  <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.team}</span>
                </div>
              </div>
              <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.875rem', width: 40, textAlign: 'right' }}>{row.pts}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Next race */}
      <Card>
        <CardHeader title="🏁 Próxima Corrida" accentColor="#333" />
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <span style={{ fontSize: '3rem', flexShrink: 0 }}>🇬🇧</span>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>Grande Prêmio da Grã-Bretanha</h4>
            <p style={{ color: '#888', margin: '0 0 4px', fontSize: '0.875rem' }}>Silverstone Circuit · Northamptonshire, Inglaterra</p>
            <p style={{ color: '#ef4444', fontWeight: 700, margin: '0 0 12px' }}>05–07 Julho 2026</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Classificação: Sáb 15h00 ET', 'Corrida: Dom 10h00 ET'].map((t) => (
                <span key={t} style={{ ...S.tag, fontSize: '0.78rem' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SurfeTab() {
  return (
    <div>
      <SectionHeader title="🏄 Surfe WSL" sub="Championship Tour 2026 — Brasil Domina o Mundo" color="#06b6d4" />

      {/* Banner */}
      <div style={{ ...S.featureCard('rgba(0,80,150,0.25)', 'rgba(0,200,100,0.1)'), marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: '2.5rem' }}>🌊</span>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>Brasil Domina o Surfe Mundial</h3>
            <p style={{ color: '#22d3ee', fontWeight: 600, margin: 0 }}>Top 3 masculino todo brasileiro · Tatiana lidera o feminino</p>
          </div>
        </div>
        <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.65 }}>
          O Brasil vive uma era dourada no surfe profissional. João Chianca "Chumbinho" lidera o ranking masculino, seguido de Gabriel Medina e Filipe Toledo — uma dominância histórica que nenhuma nação havia alcançado antes no WSL Championship Tour.
        </p>
      </div>

      {/* Men standings */}
      <Card>
        <CardHeader title="Ranking Masculino" sub="WSL CT 2026 — Top 10" accentColor="#06b6d4" badge="CT 2026" badgeColor="#06b6d4" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Surfista', 'País', 'Pontos'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i === 3 ? 'center' : 'left', color: i === 3 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WSL_MEN.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : row.pos <= 3 ? 'rgba(6,182,212,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>
                    {row.highlight && '🇧🇷 '}{row.surfer}
                  </td>
                  <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#06b6d4' }}>{row.pts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Women standings */}
      <Card>
        <CardHeader title="Ranking Feminino" sub="WSL CT 2026 — Top 10" accentColor="#ec4899" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Surfista', 'País', 'Pontos'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i === 3 ? 'center' : 'left', color: i === 3 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WSL_WOMEN.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : row.pos <= 3 ? 'rgba(236,72,153,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>
                    {row.highlight && '🇧🇷 '}{row.surfer}
                  </td>
                  <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#ec4899' }}>{row.pts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Next event */}
      <Card>
        <CardHeader title="📅 Próximo Evento WSL" accentColor="#333" />
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <span style={{ fontSize: '3rem', flexShrink: 0 }}>🌊</span>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>Rip Curl Pro Bells Beach</h4>
            <p style={{ color: '#888', margin: '0 0 4px', fontSize: '0.875rem' }}>Bells Beach, Victória — Austrália</p>
            <p style={{ color: '#06b6d4', fontWeight: 700, margin: '0 0 6px' }}>10–19 Julho 2026</p>
            <p style={{ color: '#666', fontSize: '0.83rem', margin: 0 }}>Etapa clássica do circuito — brasileiros buscam consolidar domínio absoluto</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SUPTab() {
  return (
    <div>
      <SectionHeader title="🏄‍♂️ Stand Up Paddle" sub="APP World Tour 2026" color="#3b82f6" />

      {/* About */}
      <div style={{ ...S.infoBox('#3b82f6'), marginBottom: 20 }}>
        <h3 style={{ color: '#fff', fontWeight: 800, margin: '0 0 8px', fontSize: '1.05rem' }}>🌊 Sobre o SUP</h3>
        <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
          O Stand Up Paddle é um dos esportes aquáticos que mais cresce no mundo. Os atletas remam de pé sobre uma prancha larga, competindo em corridas, surf e sprint. O Brasil tem se destacado no APP World Tour com talentos como Vinnicius Martins e Guilherme Bragança em ascensão constante.
        </p>
      </div>

      {/* Standings */}
      <Card>
        <CardHeader title="APP World Tour 2026" sub="Classificação Geral — Top 10" accentColor="#3b82f6" badge="APP TOUR" badgeColor="#3b82f6" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Atleta', 'País', 'Pontos'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i === 3 ? 'center' : 'left', color: i === 3 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APP_STANDINGS.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>
                    {row.highlight && '🇧🇷 '}{row.athlete}
                  </td>
                  <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#3b82f6' }}>{row.pts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader title="📅 Próximos Eventos APP World Tour" accentColor="#333" />
        <div style={{ padding: '16px 20px' }}>
          {[
            { event: 'APP SUP World Series — Maldives', date: '12–16 Jul 2026', local: '🇲🇻 Malé, Maldivas' },
            { event: 'APP Surfing World Series — Fiji', date: '2–6 Ago 2026', local: '🇫🇯 Cloudbreak, Fiji' },
            { event: 'APP SUP World Series — Copenhagen', date: '20–24 Ago 2026', local: '🇩🇰 Copenhague, Dinamarca' },
          ].map((ev, i) => (
            <div key={i} style={{ ...S.upcomingItem, marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', margin: '0 0 2px' }}>{ev.event}</p>
                <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{ev.local}</p>
              </div>
              <span style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(59,130,246,0.1)', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>{ev.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SkiTab() {
  return (
    <div>
      <SectionHeader title="🏔️ Ski & Snowboard" sub="FIS World Cup 2026 — Com Luca Braathen pelo Brasil" color="#7dd3fc" />

      {/* Braathen Feature */}
      <div style={{ ...S.featureCard('rgba(0,100,200,0.2)', 'rgba(0,180,80,0.1)'), marginBottom: 24 }}>
        <div style={S.featureInner}>
          <div style={S.featureEmoji}>⛷️</div>
          <div>
            <span style={{ ...S.badge('rgba(0,160,80,0.2)', '#00c97a'), border: '1px solid rgba(0,160,80,0.4)', marginBottom: 8, display: 'inline-block' }}>🇧🇷 Braathen pelo Brasil</span>
            <h3 style={S.featureH3}>Lucas / Luca Braathen</h3>
            <p style={{ color: '#7dd3fc', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 10px' }}>Ski Alpino — Slalom & Giant Slalom</p>
            <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 520 }}>
              Nascido em Oslo de pai norueguês e mãe brasileira de São Paulo, Lucas Braathen optou em 2023 por competir pelo Brasil. Renomeado "Luca" para a nova fase, tornou-se o maior representante do Brasil na neve, conquistando pódios no Circuito Mundial FIS e histórico para o esporte brasileiro.
            </p>
            <div style={S.tagRow}>
              {['Oslo / São Paulo', '2× Top 3 FIS World Cup', 'Slalom Especialista', 'Competindo pelo 🇧🇷 desde 2023'].map((t) => (
                <span key={t} style={S.tag}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FIS standings */}
      <Card>
        <CardHeader title="FIS Alpine World Cup — Slalom/GS" sub="Classificação 2025/2026 — Top 5" accentColor="#7dd3fc" badge="FIS 2026" badgeColor="#7dd3fc" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Atleta', 'País', 'Especialidade', 'PTS'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i === 4 ? 'center' : 'left', color: i === 4 ? '#fff' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIS_STANDINGS.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : row.pos <= 3 ? 'rgba(125,211,252,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.athlete}</td>
                  <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                  <td style={{ ...S.td, color: '#888', fontSize: '0.8rem' }}>{row.disc}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 900, color: '#7dd3fc' }}>{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Braathen results */}
      <Card>
        <CardHeader title="🏆 Resultados Recentes — Luca Braathen 🇧🇷" accentColor="#333" />
        <div style={{ padding: '16px 20px' }}>
          {[
            { race: 'Slalom — Schladming', result: '🥈 2º Lugar', date: 'Jan 2026', pts: '+250' },
            { race: 'Giant Slalom — Adelboden', result: '🥉 3º Lugar', date: 'Jan 2026', pts: '+200' },
            { race: 'Slalom — Wengen', result: '4º Lugar', date: 'Jan 2026', pts: '+160' },
            { race: 'Slalom — Madonna di Campiglio', result: '🥇 1º Lugar', date: 'Dez 2025', pts: '+100' },
          ].map((r, i) => (
            <div key={i} style={{ ...S.upcomingItem, marginBottom: 8 }}>
              <div>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem', margin: '0 0 2px' }}>{r.race}</p>
                <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{r.date} · 🇧🇷 Luca Braathen</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 800, color: '#fff', fontSize: '0.875rem', margin: '0 0 2px' }}>{r.result}</p>
                <p style={{ color: '#7dd3fc', fontSize: '0.72rem', margin: 0 }}>{r.pts} pts</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function MMATab() {
  return (
    <div>
      <SectionHeader title="🥊 MMA & UFC" sub="Brasileiros Dominam o Octagon" color="#f97316" />

      {/* Fighter cards grid */}
      <div style={S.gridTwo}>
        {UFC_FIGHTERS.map((f, i) => (
          <div key={i} style={S.fighterCard(f.color)}>
            <div style={S.fighterAccent(f.color)} />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '1.5rem' }}>🇧🇷</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: `${f.color}22`, color: f.color, border: `1px solid ${f.color}44` }}>
                      {f.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{f.fighter}</h3>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>{f.division}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#555', fontSize: '0.7rem', margin: '0 0 2px' }}>Cartel</p>
                  <p style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', margin: 0 }}>{f.record}</p>
                </div>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {f.highlights.map((h, j) => (
                  <li key={j} style={{ display: 'flex', gap: 8, fontSize: '0.83rem', color: '#aaa', marginBottom: 5 }}>
                    <span style={{ color: f.color, flexShrink: 0, marginTop: 1 }}>▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming fights */}
      <Card>
        <CardHeader title="📅 Próximos Combates Brasileiros" accentColor="#333" />
        <div style={{ padding: '16px 20px' }}>
          {[
            { event: 'UFC 317', f1: 'Alex Pereira 🇧🇷', f2: 'Magomed Ankalaev', date: '5 Jul 2026', type: 'DISPUTA DE CINTURÃO' },
            { event: 'UFC Fight Night', f1: 'Charles Oliveira 🇧🇷', f2: 'A definir', date: '19 Jul 2026', type: 'MAIN EVENT' },
            { event: 'UFC 319', f1: 'Caio Borralho 🇧🇷', f2: 'Sean Strickland', date: '2 Ago 2026', type: 'DISPUTA DE CINTURÃO' },
          ].map((fight, i) => (
            <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', padding: '2px 10px', borderRadius: 20 }}>{fight.type}</span>
                <span style={{ color: '#666', fontSize: '0.75rem' }}>{fight.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{fight.f1}</span>
                <span style={{ fontSize: '0.7rem', color: '#666', background: '#2a2a2a', padding: '4px 10px', borderRadius: 8, fontWeight: 800, margin: '0 8px' }}>VS</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', textAlign: 'right' }}>{fight.f2}</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.72rem', margin: '6px 0 0' }}>{fight.event}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function TenisTab() {
  return (
    <div>
      <SectionHeader title="🎾 Tênis" sub="ATP & WTA Rankings 2026" color="#84cc16" />

      {/* Bia Feature */}
      <div style={{ ...S.featureCard('rgba(0,150,60,0.2)', 'rgba(200,200,0,0.1)'), marginBottom: 24 }}>
        <div style={S.featureInner}>
          <div style={S.featureEmoji}>🎾</div>
          <div>
            <span style={{ ...S.badge('rgba(0,160,80,0.2)', '#00c97a'), border: '1px solid rgba(0,160,80,0.4)', marginBottom: 8, display: 'inline-block' }}>🇧🇷 Orgulho Brasileiro</span>
            <h3 style={S.featureH3}>Beatriz Haddad Maia</h3>
            <p style={{ color: '#84cc16', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 10px' }}>WTA #14 · São Paulo, Brasil</p>
            <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 520 }}>
              "Bia" Haddad Maia é a melhor tenista brasileira da história moderna. Com ranking WTA #14 (career high), é referência para toda uma geração de atletas brasileiros. Vencedora de torneios WTA em diversas superfícies, representa o Brasil com técnica e garra no circuito mundial.
            </p>
            <div style={S.tagRow}>
              {['WTA #14 career high', '5 títulos WTA', 'Saibro & piso duro', 'Melhor brasileira na história'].map((t) => (
                <span key={t} style={S.tag}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ATP & WTA tables */}
      <div style={S.gridTwoLarge}>
        <Card>
          <CardHeader title="ATP — Ranking Masculino" sub="Destaques 2026" accentColor="#3b82f6" />
          <div style={{ overflowX: 'auto' }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {['#', 'Tenista', 'País', 'Pts'].map((h, i) => (
                    <th key={h} style={{ ...S.th, textAlign: i === 3 ? 'center' : 'left', color: i === 3 ? '#fff' : '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATP.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                    <td style={{ ...S.td, width: 40 }}>
                      <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : row.highlight ? 'rgba(0,180,80,0.3)' : 'rgba(80,80,80,0.4)' }}>
                        {row.pos}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.player}</td>
                    <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                    <td style={{ ...S.td, textAlign: 'center', fontWeight: 800, color: '#3b82f6' }}>{row.pts.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="WTA — Ranking Feminino" sub="Destaques 2026" accentColor="#ec4899" />
          <div style={{ overflowX: 'auto' }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {['#', 'Tenista', 'País', 'Pts'].map((h, i) => (
                    <th key={h} style={{ ...S.th, textAlign: i === 3 ? 'center' : 'left', color: i === 3 ? '#fff' : '#555' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WTA.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.highlight ? 'rgba(0,180,80,0.07)' : 'transparent' }}>
                    <td style={{ ...S.td, width: 40 }}>
                      <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos === 1 ? 'rgba(255,210,0,0.3)' : row.highlight ? 'rgba(0,180,80,0.3)' : 'rgba(80,80,80,0.4)' }}>
                        {row.pos}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.player}</td>
                    <td style={{ ...S.td, fontSize: '1.1rem' }}>{row.country}</td>
                    <td style={{ ...S.td, textAlign: 'center', fontWeight: 800, color: '#ec4899' }}>{row.pts.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Tournaments */}
      <Card>
        <CardHeader title="📅 Próximos Torneios Importantes" accentColor="#333" />
        <div style={{ padding: '16px 20px' }}>
          {[
            { name: 'Wimbledon', local: '🇬🇧 Londres, Inglaterra', date: '30 Jun – 13 Jul 2026', surface: 'Grama', tier: 'Grand Slam' },
            { name: 'Rogers Cup — Toronto', local: '🇨🇦 Toronto, Canadá', date: '3–10 Ago 2026', surface: 'Piso Duro', tier: 'Masters 1000 / WTA 1000' },
            { name: 'US Open', local: '🇺🇸 Nova York, EUA', date: '31 Ago – 13 Set 2026', surface: 'Piso Duro', tier: 'Grand Slam' },
          ].map((t, i) => (
            <div key={i} style={{ ...S.upcomingItem, alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', margin: 0 }}>{t.name}</p>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'rgba(132,204,22,0.12)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.25)', padding: '2px 8px', borderRadius: 20 }}>{t.tier}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{t.local} · {t.surface}</p>
              </div>
              <span style={{ color: '#84cc16', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(132,204,22,0.08)', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>{t.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function OutrosTab() {
  return (
    <div>
      <SectionHeader title="🏆 Outros Esportes" sub="Vôlei, Basquete, Atletismo, Natação" color="#a855f7" />

      {/* Volei */}
      <Card>
        <CardHeader title="🏐 Vôlei — Superliga 2025/2026" sub="Masculino — Fase Regular" accentColor="#f97316" />
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['#', 'Time', 'Cidade', 'V', 'D'].map((h, i) => (
                  <th key={h} style={{ ...S.th, textAlign: i >= 3 ? 'center' : 'left', color: i === 3 ? '#4ade80' : i === 4 ? '#f87171' : '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUPERLIGA.map((row) => (
                <tr key={row.pos} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ ...S.td, width: 40 }}>
                    <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: row.pos <= 4 ? 'rgba(249,115,22,0.3)' : 'rgba(80,80,80,0.4)' }}>
                      {row.pos}
                    </span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#fff' }}>{row.team}</td>
                  <td style={{ ...S.td, color: '#888', fontSize: '0.83rem' }}>{row.cidade}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 800, color: '#4ade80' }}>{row.v}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 800, color: '#f87171' }}>{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
          <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', margin: '0 0 4px' }}>🏅 Seleção Brasileira</p>
          <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Brasil se prepara para a Liga das Nações 2026 — Feminino e Masculino buscam o ouro em Los Angeles 2028.</p>
        </div>
      </Card>

      {/* Basquete */}
      <Card>
        <CardHeader title="🏀 Basquete" sub="NBB & Brasileiros na NBA" accentColor="#ef4444" />
        <div style={{ padding: '20px' }}>
          <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>🇧🇷 Brasileiros na NBA — 2025/2026</p>
          {[
            { player: 'Gui Santos', team: 'Golden State Warriors', pos: 'Ala', avg: '14.2 ppg' },
            { player: 'Bruno Caboclo', team: 'Charlotte Hornets', pos: 'Ala-Pivô', avg: '8.7 ppg' },
            { player: 'Cristiano Felício', team: 'Utah Jazz', pos: 'Pivô', avg: '5.1 ppg' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.5rem' }}>🇧🇷</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', margin: 0 }}>{p.player}</p>
                  <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>{p.team} · {p.pos}</p>
                </div>
              </div>
              <span style={{ color: '#f97316', fontWeight: 900, fontSize: '0.9rem' }}>{p.avg}</span>
            </div>
          ))}
          <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 12px' }}>NBB — Brasileirão de Basquete</p>
          {[
            { pos: 1, team: 'Flamengo', record: '28-6' },
            { pos: 2, team: 'Minas Tênis', record: '25-9' },
            { pos: 3, team: 'Franca', record: '23-11' },
            { pos: 4, team: 'São Paulo FC', record: '21-13' },
          ].map((row) => (
            <div key={row.pos} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 6 }}>
              <span style={{ color: '#666', fontSize: '0.8rem', width: 18 }}>{row.pos}</span>
              <span style={{ color: '#fff', fontWeight: 600, flex: 1, fontSize: '0.875rem' }}>{row.team}</span>
              <span style={{ color: '#f97316', fontWeight: 800, fontSize: '0.875rem' }}>{row.record}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Atletismo & Natacao */}
      <div style={S.gridTwo}>
        {/* Atletismo */}
        <Card>
          <CardHeader title="🏃 Atletismo" accentColor="#eab308" />
          <div style={{ padding: '16px 20px' }}>
            {[
              { name: 'Alison dos Santos "Piu"', event: '400m com barreiras', ach: 'Campeão Mundial 2022 · Top 3 mundial 2026' },
              { name: 'Anderson Henriques', event: 'Decatlo', ach: 'Recorde Sul-Americano 2025' },
              { name: 'Darlan Romani', event: 'Arremesso de Peso', ach: 'Medalhista olímpico · Recordista sul-americano' },
            ].map((a, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>🇧🇷</span>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', margin: 0 }}>{a.name}</p>
                </div>
                <p style={{ color: '#eab308', fontSize: '0.78rem', fontWeight: 600, margin: '0 0 2px' }}>{a.event}</p>
                <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{a.ach}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Natacao */}
        <Card>
          <CardHeader title="🏊 Natação" accentColor="#3b82f6" />
          <div style={{ padding: '16px 20px' }}>
            {/* Cielo Legacy */}
            <div style={{ padding: '12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '1.1rem' }}>🇧🇷</span>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', margin: 0 }}>César Cielo</p>
                <span style={{ fontSize: '0.68rem', background: '#ffdf0020', color: '#ffdf00', border: '1px solid #ffdf0040', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>LEGADO</span>
              </div>
              <p style={{ color: '#3b82f6', fontSize: '0.78rem', fontWeight: 600, margin: '0 0 2px' }}>50m e 100m Livre</p>
              <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>Maior nadador brasileiro · Campeão Mundial e Olímpico · Recordista mundial 50m livre (20s91)</p>
            </div>
            {[
              { name: 'Guilherme Costa "Cachorrão"', event: '400m e 800m Livre', ach: 'Recorde Sul-Americano 2025 · Olímpico Paris 2024' },
              { name: 'Nicholas Santos', event: '50m Mariposa', ach: 'Medalhista Mundial · Ativo aos 43 anos' },
              { name: 'Ana Carolina Vieira', event: 'Costas', ach: 'Campeã Pan-Americana 2025' },
            ].map((a, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: '1.1rem' }}>🇧🇷</span>
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem', margin: 0 }}>{a.name}</p>
                </div>
                <p style={{ color: '#3b82f6', fontSize: '0.78rem', fontWeight: 600, margin: '0 0 2px' }}>{a.event}</p>
                <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>{a.ach}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function EsportesPage() {
  const [activeTab, setActiveTab] = useState('futebol')

  const renderTab = () => {
    switch (activeTab) {
      case 'futebol': return <FutebolTab />
      case 'f1': return <F1Tab />
      case 'surfe': return <SurfeTab />
      case 'sup': return <SUPTab />
      case 'ski': return <SkiTab />
      case 'mma': return <MMATab />
      case 'tenis': return <TenisTab />
      case 'outros': return <OutrosTab />
      default: return <FutebolTab />
    }
  }

  return (
    <>
      {/* Hero */}
      <div style={S.hero}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,200,100,0.03) 0, rgba(0,200,100,0.03) 1px, transparent 0, transparent 50%)', backgroundSize: '28px 28px' }} />
        <div style={S.heroInner}>
          <div style={S.heroBadge}>
            <span>🏆</span>
            <span>PORTAL DE ESPORTES</span>
          </div>
          <h1 style={S.heroH1}>
            Esportes{' '}
            <span style={S.heroSpan}>Brasileiros</span>
          </h1>
          <p style={S.heroP}>
            Brasileirão, Fórmula 1, Surfe, SUP, Ski, MMA e mais — com destaque para os atletas brasileiros que dominam o mundo
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabNav}>
        <div style={S.tabScroll}>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={S.content}>
        {renderTab()}
      </div>

      {/* Footer note */}
      <div style={{ borderTop: '1px solid var(--border)', textAlign: 'center', padding: '16px 24px', color: '#444', fontSize: '0.75rem' }}>
        Portal de Esportes Miami Brasileira · Dados atualizados em Junho 2026 · Resultados podem variar conforme competições em andamento
      </div>

      <Footer />
    </>
  )
}
