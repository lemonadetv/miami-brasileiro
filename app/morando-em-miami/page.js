'use client'
import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const BAIRROS = [
  {
    id: 'brickell',
    nome: 'Brickell',
    subtitulo: 'O Manhattan de Miami',
    emoji: '🏙️',
    vibe: 'Cosmopolita & Executivo',
    aluguel: '$$$$$',
    alugelFaixa: 'R$ 15.000–35.000/mês',
    score: { comunidade: 3, custo: 1, familia: 3, transporte: 5, agito: 5 },
    foto: 'photo-1533929736458-ca588d08c8be',
    cor: '#2563EB',
    descricao: 'O coração financeiro de Miami. Torres de vidro, restaurantes estrelados e uma vida noturna vibrante. Ideal para profissionais liberais e jovens executivos que querem estar no centro de tudo.',
    pros: ['Metro acessível (Brickell City Centre)', 'Restaurantes de alta gastronomia', 'Tudo a pé ou de Uber', 'Vista para a Baía de Biscayne'],
    contras: ['Um dos mais caros de Miami', 'Barulhento e agitado', 'Menos verde e familiar'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Profissionais 25–40 anos sem filhos',
    pontos: ['Brickell City Centre', 'Mary Brickell Village', 'Simpson Park', 'Metrorail Station'],
    mapX: 52, mapY: 48,
  },
  {
    id: 'wynwood',
    nome: 'Wynwood',
    subtitulo: 'O Bairro da Arte',
    emoji: '🎨',
    vibe: 'Artístico & Trendy',
    aluguel: '$$$$',
    alugelFaixa: 'R$ 10.000–22.000/mês',
    score: { comunidade: 4, custo: 2, familia: 2, transporte: 3, agito: 5 },
    foto: 'photo-1596422846543-75c6fc197f07',
    cor: '#7C3AED',
    descricao: 'Capital mundial do street art. Wynwood Walls, galerias, cafés artesanais e uma vibe jovem e criativa. Muito amado pelos brasileiros do setor criativo.',
    pros: ['Wynwood Walls (cartão-postal)', 'Restaurantes e bares únicos', 'Comunidade artística vibrante', 'Muitos brasileiros no setor criativo'],
    contras: ['Trânsito pesado nos fins de semana', 'Ainda em gentrificação', 'Poucas opções para família'],
    brasileiros: '★★★★☆',
    destaque: 'Melhor para: Criativos, artistas e empreendedores',
    pontos: ['Wynwood Walls', 'The Yard', 'Margot', 'Oasis Wynwood'],
    mapX: 45, mapY: 40,
  },
  {
    id: 'miami-beach',
    nome: 'Miami Beach',
    subtitulo: 'Praia, Sol e Art Déco',
    emoji: '🏖️',
    vibe: 'Turístico & Glamour',
    aluguel: '$$$$$',
    alugelFaixa: 'R$ 12.000–40.000/mês',
    score: { comunidade: 3, custo: 1, familia: 3, transporte: 3, agito: 5 },
    foto: 'photo-1514525253161-7a46d19cd819',
    cor: '#0891B2',
    descricao: 'Lar da Ocean Drive, Art Déco e uma das praias mais famosas do mundo. Um sonho para quem quer acordar a 5 minutos do Atlântico. Alta temporada é cara e movimentada.',
    pros: ['Praia na porta de casa', 'Arquitetura Art Déco única', 'Vida noturna world class', 'Lincoln Road para compras'],
    contras: ['Trânsito caótico para sair', 'Cheio de turistas', 'Aluguéis altíssimos', 'Risco de furacão maior'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Amantes da praia e vida noturna',
    pontos: ['Ocean Drive', 'Lincoln Road Mall', 'Lummus Park', 'South Pointe Park'],
    mapX: 65, mapY: 55,
  },
  {
    id: 'coral-gables',
    nome: 'Coral Gables',
    subtitulo: 'Elegância e Boas Escolas',
    emoji: '🌴',
    vibe: 'Residencial & Sofisticado',
    aluguel: '$$$$',
    alugelFaixa: 'R$ 12.000–30.000/mês',
    score: { comunidade: 4, custo: 2, familia: 5, transporte: 3, agito: 2 },
    foto: 'photo-1512917774080-9991f1c4c750',
    cor: '#059669',
    descricao: 'A cidade mais elegante de Miami. Ruas arborizadas, arquitetura mediterrânea, as melhores escolas públicas e o famoso Biltmore Hotel. Muito popular entre famílias brasileiras estabelecidas.',
    pros: ['Melhores escolas do condado', 'Ruas seguras e arborizadas', 'Miracle Mile (compras)', 'Universidade de Miami'],
    contras: ['Caro para o nível de vida "quieto"', 'Trânsito na Miracle Mile', 'Menos agitado para jovens'],
    brasileiros: '★★★★★',
    destaque: 'Melhor para: Famílias com filhos em idade escolar',
    pontos: ['Biltmore Hotel', 'Venetian Pool', 'Miracle Mile', 'UM Campus'],
    mapX: 42, mapY: 58,
  },
  {
    id: 'coconut-grove',
    nome: 'Coconut Grove',
    subtitulo: 'Natureza e Boemia',
    emoji: '🌿',
    vibe: 'Boêmio & Histórico',
    aluguel: '$$$$',
    alugelFaixa: 'R$ 10.000–25.000/mês',
    score: { comunidade: 3, custo: 2, familia: 4, transporte: 2, agito: 3 },
    foto: 'photo-1501854140801-50d01698950b',
    cor: '#16A34A',
    descricao: 'O bairro mais antigo de Miami. Cheio de árvores, cafés charmosos, marinas e uma vibe relaxada. Muito amado por artistas e famílias que querem sair do caos mas ficar perto da cidade.',
    pros: ['Atmosphere de pequena cidade', 'Parques e natureza exuberante', 'Peacock Park na beira da baía', 'Ótimo para ciclismo'],
    contras: ['Transporte público limitado', 'Fica isolado à noite', 'Opções de restaurante mais limitadas'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Artistas, aposentados e famílias tranquilas',
    pontos: ['CocoWalk', 'Peacock Park', 'Ermita de la Caridad', 'Vizcaya Museum'],
    mapX: 46, mapY: 60,
  },
  {
    id: 'doral',
    nome: 'Doral',
    subtitulo: 'Capital dos Brasileiros',
    emoji: '🇧🇷',
    vibe: 'Familiar & Brasileiro',
    aluguel: '$$$',
    alugelFaixa: 'R$ 7.000–15.000/mês',
    score: { comunidade: 5, custo: 3, familia: 5, transporte: 2, agito: 2 },
    foto: 'photo-1486325212027-8081e485255e',
    cor: '#DC2626',
    descricao: 'Doral é o coração da comunidade brasileira em Miami. Restaurantes brasileiros, igrejas brasileiras, escolas com muitos brasileiros. Muitas famílias escolhem Doral por ser mais acessível e pela comunidade.',
    pros: ['Maior concentração de brasileiros', 'Escolas excelentes (AB-rated)', 'Supermercados e restaurantes brasileiros', 'Mais acessível que Miami Beach'],
    contras: ['Longe do mar (30 min)', 'Depende muito de carro', 'Menos diversidade cultural'],
    brasileiros: '★★★★★',
    destaque: 'Melhor para: Famílias brasileiras que querem comunidade',
    pontos: ['CityPlace Doral', 'Walmart Supercenter', 'Doral Central Park', 'Trump National Doral'],
    mapX: 32, mapY: 45,
  },
  {
    id: 'aventura',
    nome: 'Aventura',
    subtitulo: 'Luxo ao Norte',
    emoji: '🛍️',
    vibe: 'Luxuoso & Internacional',
    aluguel: '$$$$',
    alugelFaixa: 'R$ 9.000–22.000/mês',
    score: { comunidade: 4, custo: 2, familia: 4, transporte: 3, agito: 3 },
    foto: 'photo-1577495508326-19a1b3cf65b9',
    cor: '#9333EA',
    descricao: 'Lar do Aventura Mall (um dos maiores dos EUA), comunidade internacional forte e muitos brasileiros. Localização estratégica entre Miami e Fort Lauderdale. Condomínios de luxo com toda infraestrutura.',
    pros: ['Aventura Mall gigante', 'Comunidade internacional forte', 'Segurança alta', 'Meio do caminho entre Miami e FLL'],
    contras: ['Depende totalmente do carro', 'Trânsito na I-95', 'Caro para o que oferece'],
    brasileiros: '★★★★☆',
    destaque: 'Melhor para: Famílias internacionais e executivos',
    pontos: ['Aventura Mall', 'Founders Park', 'Turnberry Isle', 'Waterways Shoppes'],
    mapX: 55, mapY: 22,
  },
  {
    id: 'little-havana',
    nome: 'Little Havana',
    subtitulo: 'Cultura, Ritmo e Sabor',
    emoji: '🎺',
    vibe: 'Cultural & Autêntico',
    aluguel: '$$',
    alugelFaixa: 'R$ 5.000–11.000/mês',
    score: { comunidade: 3, custo: 4, familia: 3, transporte: 3, agito: 4 },
    foto: 'photo-1564013799919-ab600027ffc6',
    cor: '#EA580C',
    descricao: 'O bairro mais cultural de Miami. Calle Ocho, dominó no Maximo Gomez Park, cafés cubanos e murais vibrantes. Uma das opções mais acessíveis perto do centro. Vizinhança em gentrificação.',
    pros: ['Muito acessível no preço', 'Cultura rica e autêntica', 'Perto do Downtown', 'Calle Ocho e festivais'],
    contras: ['Gentrificação acelerada', 'Menos infraestrutura moderna', 'Segurança variável por bloco'],
    brasileiros: '★★☆☆☆',
    destaque: 'Melhor para: Aventureiros, artistas e quem quer economizar',
    pontos: ['Calle Ocho', 'Maximo Gomez Park', 'Tower Theater', 'Marlins Park'],
    mapX: 44, mapY: 50,
  },
  {
    id: 'edgewater',
    nome: 'Edgewater',
    subtitulo: 'À Beira da Baía',
    emoji: '🌊',
    vibe: 'Moderno & Em Alta',
    aluguel: '$$$',
    alugelFaixa: 'R$ 8.000–18.000/mês',
    score: { comunidade: 3, custo: 3, familia: 3, transporte: 4, agito: 4 },
    foto: 'photo-1506905925346-21bda4d32df4',
    cor: '#0EA5E9',
    descricao: 'O bairro mais "em alta" de Miami. Vista espetacular da Baía de Biscayne, novos prédios de luxo e preços ainda menores que Brickell. Fica entre Wynwood e Downtown — perfeito para jovens profissionais.',
    pros: ['Vista para a baía', 'Preços melhores que Brickell', 'Perto do Wynwood e Downtown', 'Novos empreendimentos modernos'],
    contras: ['Ainda poucos restaurantes locais', 'Em transição (obras constantes)', 'Transporte público limitado'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Jovens profissionais que querem vista e modernidade',
    pontos: ['Margaret Pace Park', 'Bayside Marketplace', 'Midtown Miami', 'Museum Park'],
    mapX: 52, mapY: 42,
  },
  {
    id: 'kendall',
    nome: 'Kendall',
    subtitulo: 'Suburbia Familiar',
    emoji: '🏡',
    vibe: 'Familiar & Tranquilo',
    aluguel: '$$$',
    alugelFaixa: 'R$ 6.000–14.000/mês',
    score: { comunidade: 4, custo: 4, familia: 5, transporte: 2, agito: 1 },
    foto: 'photo-1570129477492-45c003edd2be',
    cor: '#65A30D',
    descricao: 'O subúrbio clássico de Miami. Casas com quintal, boas escolas e um ritmo de vida tranquilo. Muito popular entre famílias brasileiras que querem espaço e privacidade com preço mais razoável.',
    pros: ['Casas com quintal', 'Boas escolas', 'Mais acessível', 'Vizinhanças seguras'],
    contras: ['Muito dependente de carro', '30–45 min do Downtown', 'Menos agitado'],
    brasileiros: '★★★★☆',
    destaque: 'Melhor para: Famílias com crianças que querem casa própria',
    pontos: ['The Falls Shopping', 'Dadeland Mall', 'Zoo Miami', 'Baptist Health'],
    mapX: 38, mapY: 70,
  },
  {
    id: 'downtown',
    nome: 'Downtown Miami',
    subtitulo: 'O Centro de Tudo',
    emoji: '🌆',
    vibe: 'Urbano & Dinâmico',
    aluguel: '$$$',
    alugelFaixa: 'R$ 8.000–18.000/mês',
    score: { comunidade: 3, custo: 3, familia: 2, transporte: 5, agito: 5 },
    foto: 'photo-1533929736458-ca588d08c8be',
    cor: '#4F46E5',
    descricao: 'O coração pulsante de Miami com Bayside Marketplace, Pérez Art Museum, Adrienne Arsht Center e acesso direto ao Metromover (gratuito!). Muitos arranha-céus novos com aluguel competitivo.',
    pros: ['Metromover gratuito', 'Bayside Marketplace na beira da baía', 'Acesso a tudo', 'Preços competitivos vs. Brickell'],
    contras: ['Barulhento 24h', 'Menos residencial/familiar', 'Trânsito intenso'],
    brasileiros: '★★☆☆☆',
    destaque: 'Melhor para: Solteiros e casais sem filhos que amam a cidade',
    pontos: ['Bayside Marketplace', 'Pérez Art Museum', 'Adrienne Arsht Center', 'Freedom Tower'],
    mapX: 52, mapY: 45,
  },
  {
    id: 'hialeah',
    nome: 'Hialeah',
    subtitulo: 'Acessível e Vibrante',
    emoji: '🏘️',
    vibe: 'Acessível & Multicultural',
    aluguel: '$$',
    alugelFaixa: 'R$ 4.500–9.000/mês',
    score: { comunidade: 3, custo: 5, familia: 4, transporte: 3, agito: 3 },
    foto: 'photo-1449824913935-59a10b8d2000',
    cor: '#D97706',
    descricao: 'A cidade mais acessível perto de Miami. Muito latina, animada e com forte comércio local. Para quem está chegando e quer economizar sem se afastar da área metropolitana.',
    pros: ['Muito acessível', 'Comunidade latina forte', 'Acesso ao Tri-Rail', 'Boa infraestrutura local'],
    contras: ['Menos glamour que outros bairros', 'Trânsito intenso nas principais', 'Longe das praias (45 min)'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Quem está chegando e quer economizar',
    pontos: ['Westland Mall', 'Amelia Earhart Park', 'Hialeah Park Racing', 'Tri-Rail Station'],
    mapX: 38, mapY: 36,
  },
]

function StarScore({ value, max = 5 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? '#FACC15' : '#4B5563', fontSize: '0.85em' }}>★</span>
      ))}
    </span>
  )
}

function ScoreBar({ label, value }) {
  const colors = { 5: '#10B981', 4: '#34D399', 3: '#FBBF24', 2: '#F87171', 1: '#EF4444' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ width: 90, fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${(value / 5) * 100}%`, background: colors[value] || '#FBBF24', height: '100%', borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors[value], width: 14 }}>{value}</span>
    </div>
  )
}

const ALUGUEL_COLORS = { '$': '#10B981', '$$': '#34D399', '$$$': '#FBBF24', '$$$$': '#F97316', '$$$$$': '#EF4444' }

export default function MorandoEmMiami() {
  const [selected, setSelected] = useState(null)
  const [hoveredMap, setHoveredMap] = useState(null)
  const bairro = selected ? BAIRROS.find(b => b.id === selected) : null

  return (
    <>
      <Header articles={[]} />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>

        {/* HERO */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0C1445 0%, #1a1f5e 40%, #0d3b6e 100%)',
          overflow: 'hidden',
          padding: '60px 24px 80px',
          textAlign: 'center',
        }}>
          {/* Decorative circles */}
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              width: [300, 200, 150, 250, 180, 120][i],
              height: [300, 200, 150, 250, 180, 120][i],
              top: ['10%', '60%', '20%', '-20%', '70%', '30%'][i],
              left: ['5%', '80%', '70%', '40%', '20%', '90%'][i],
              pointerEvents: 'none',
            }} />
          ))}
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏙️🌴🏖️</div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 16px',
              lineHeight: 1.1,
            }}>
              Morando em Miami
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: 'rgba(255,255,255,0.75)',
              margin: '0 0 32px',
              lineHeight: 1.6,
            }}>
              Guia completo dos bairros de Miami para brasileiros.<br />
              Encontre o lugar perfeito para sua família.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['12 Bairros', 'Fotos Reais', 'Preços 2026', 'Para Brasileiros'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  padding: '6px 16px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* FILTRO RÁPIDO por tipo */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '32px 0 8px' }}>
            {[
              { label: 'Todos', id: null },
              { label: '🇧🇷 + Brasileiros', id: 'br' },
              { label: '💰 Mais Barato', id: 'barato' },
              { label: '👨‍👩‍👧 Para Família', id: 'familia' },
              { label: '🌊 Perto da Praia', id: 'praia' },
            ].map(f => (
              <button
                key={f.label}
                onClick={() => setSelected(null)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '8px 18px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >{f.label}</button>
            ))}
          </div>

          {/* MAPA VISUAL + GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: 32,
            alignItems: 'start',
            margin: '32px 0',
          }}>

            {/* MAPA ESTILIZADO */}
            <div style={{
              position: 'sticky',
              top: 90,
              background: 'var(--bg-card)',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Mapa dos Bairros</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clique num ponto para ver detalhes</p>
                </div>
                <span style={{ fontSize: '1.5rem' }}>🗺️</span>
              </div>

              <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', background: 'linear-gradient(160deg, #1a4a7a 0%, #0f3460 30%, #1a3a5c 60%, #0d2b47 100%)' }}>
                {/* Ocean / Water elements */}
                <div style={{ position: 'absolute', right: 0, top: 0, width: '35%', height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.25) 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', right: 0, bottom: '30%', width: '20%', height: '40%', background: 'rgba(14,165,233,0.15)', borderRadius: '50% 0 0 50%', pointerEvents: 'none' }} />

                {/* Water label */}
                <div style={{ position: 'absolute', right: '5%', top: '40%', color: 'rgba(14,165,233,0.6)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: 2, transform: 'rotate(15deg)', pointerEvents: 'none' }}>ATLÂNTICO</div>
                <div style={{ position: 'absolute', right: '15%', top: '50%', color: 'rgba(14,165,233,0.5)', fontSize: '0.65rem', fontWeight: 600, pointerEvents: 'none' }}>Miami Beach</div>

                {/* Highway lines */}
                <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

                {/* Direction labels */}
                <div style={{ position: 'absolute', left: '5%', top: '5%', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', fontWeight: 700, pointerEvents: 'none' }}>NORTH ↑</div>

                {/* Neighborhood pins */}
                {BAIRROS.map(b => {
                  const isActive = selected === b.id
                  const isHovered = hoveredMap === b.id
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelected(isActive ? null : b.id)}
                      onMouseEnter={() => setHoveredMap(b.id)}
                      onMouseLeave={() => setHoveredMap(null)}
                      style={{
                        position: 'absolute',
                        left: `${b.mapX}%`,
                        top: `${b.mapY}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isActive || isHovered ? 10 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Pulse ring */}
                      {(isActive) && (
                        <div style={{
                          position: 'absolute',
                          inset: -8,
                          borderRadius: '50%',
                          border: `2px solid ${b.cor}`,
                          animation: 'ping 1.5s ease-in-out infinite',
                          opacity: 0.5,
                        }} />
                      )}
                      <div style={{
                        width: isActive ? 40 : isHovered ? 34 : 28,
                        height: isActive ? 40 : isHovered ? 34 : 28,
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        background: isActive ? b.cor : isHovered ? b.cor + 'cc' : 'rgba(255,255,255,0.15)',
                        border: `2px solid ${isActive || isHovered ? b.cor : 'rgba(255,255,255,0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? `0 0 20px ${b.cor}88` : 'none',
                        transition: 'all 0.25s',
                      }}>
                        <span style={{ transform: 'rotate(45deg)', fontSize: isActive ? '1.1rem' : '0.85rem' }}>{b.emoji}</span>
                      </div>
                      {/* Tooltip */}
                      {(isHovered || isActive) && (
                        <div style={{
                          position: 'absolute',
                          bottom: '110%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(0,0,0,0.9)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          border: `1px solid ${b.cor}44`,
                          pointerEvents: 'none',
                          zIndex: 20,
                        }}>
                          {b.nome}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legenda */}
              <div style={{ padding: '12px 16px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['$-$$', 'Acessível', '#10B981'], ['$$$', 'Médio', '#FBBF24'], ['$$$$-$$$$$', 'Caro', '#EF4444']].map(([range, label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span>{range} {label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LISTA DE BAIRROS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BAIRROS.map(b => {
                const isActive = selected === b.id
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelected(isActive ? null : b.id)}
                    style={{
                      background: 'var(--bg-card)',
                      border: `2px solid ${isActive ? b.cor : 'var(--border)'}`,
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      boxShadow: isActive ? `0 4px 20px ${b.cor}33` : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 10,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: b.cor + '22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                      }}>
                        {b.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-bright)' }}>{b.nome}</h3>
                          <span style={{ fontSize: '0.75rem', color: b.cor, fontWeight: 600 }}>{b.subtitulo}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: ALUGUEL_COLORS[b.aluguel] || '#fff',
                            background: (ALUGUEL_COLORS[b.aluguel] || '#fff') + '18',
                            padding: '2px 8px',
                            borderRadius: 4,
                          }}>{b.aluguel} {b.alugelFaixa}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🇧🇷 {b.brasileiros}</span>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        color: isActive ? b.cor : 'var(--text-muted)',
                        transform: isActive ? 'rotate(180deg)' : 'none',
                        transition: 'all 0.25s',
                        flexShrink: 0,
                      }}>▼</div>
                    </div>

                    {/* Expanded detail */}
                    {isActive && (
                      <div style={{ borderTop: `1px solid ${b.cor}33` }}>
                        {/* Photo hero */}
                        <div style={{
                          height: 200,
                          backgroundImage: `url(https://images.unsplash.com/${b.foto}?w=800&auto=format&fit=crop&q=80)`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(to top, ${b.cor}cc 0%, transparent 60%)`,
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: 12,
                            left: 16,
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                          }}>{b.emoji} {b.nome}</div>
                          <div style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 16,
                            background: 'rgba(0,0,0,0.6)',
                            color: '#fff',
                            fontSize: '0.72rem',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontWeight: 600,
                          }}>{b.vibe}</div>
                        </div>

                        <div style={{ padding: '16px' }}>
                          <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.descricao}</p>

                          {/* Scores */}
                          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Avaliação</div>
                            <ScoreBar label="Comunidade 🇧🇷" value={b.score.comunidade} />
                            <ScoreBar label="Custo de vida" value={b.score.custo} />
                            <ScoreBar label="Para família" value={b.score.familia} />
                            <ScoreBar label="Transporte" value={b.score.transporte} />
                            <ScoreBar label="Agito / Lazer" value={b.score.agito} />
                          </div>

                          {/* Pros e Contras */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                            <div style={{ background: '#10B98110', border: '1px solid #10B98130', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#10B981', marginBottom: 8 }}>✅ Pontos positivos</div>
                              {b.pros.map(p => (
                                <div key={p} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {p}</div>
                              ))}
                            </div>
                            <div style={{ background: '#EF444410', border: '1px solid #EF444430', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#EF4444', marginBottom: 8 }}>⚠️ Pontos negativos</div>
                              {b.contras.map(c => (
                                <div key={c} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {c}</div>
                              ))}
                            </div>
                          </div>

                          {/* Destaque */}
                          <div style={{
                            background: `${b.cor}15`,
                            border: `1px solid ${b.cor}40`,
                            borderRadius: 8,
                            padding: '10px 14px',
                            marginBottom: 14,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: b.cor,
                          }}>
                            🎯 {b.destaque}
                          </div>

                          {/* Pontos de referência */}
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📍 Referências</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {b.pontos.map(p => (
                                <span key={p} style={{
                                  background: 'var(--bg-secondary)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 6,
                                  padding: '4px 10px',
                                  fontSize: '0.75rem',
                                  color: 'var(--text-secondary)',
                                }}>{p}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* TABELA COMPARATIVA */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            margin: '0 0 48px',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-bright)' }}>📊 Comparativo Geral</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clique num bairro acima para ver detalhes completos</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Bairro', 'Preço', '🇧🇷 Brasileiros', '👨‍👩‍👧 Família', '🚌 Transporte', '🎉 Agito', 'Ideal Para'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BAIRROS.map((b, i) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b.id)}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-bright)' }}>
                        <span style={{ marginRight: 6 }}>{b.emoji}</span>{b.nome}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ fontWeight: 700, color: ALUGUEL_COLORS[b.aluguel] }}>{b.aluguel}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}><StarScore value={b.score.comunidade} /></td>
                      <td style={{ padding: '10px 14px' }}><StarScore value={b.score.familia} /></td>
                      <td style={{ padding: '10px 14px' }}><StarScore value={b.score.transporte} /></td>
                      <td style={{ padding: '10px 14px' }}><StarScore value={b.score.agito} /></td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.destaque.replace('Melhor para: ', '')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
            borderRadius: 16,
            border: '1px solid var(--border)',
            marginBottom: 48,
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🇧🇷</div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--text-bright)', fontSize: '1.4rem', fontWeight: 800 }}>
              Precisa de ajuda para escolher?
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', maxWidth: 500, marginInline: 'auto', lineHeight: 1.6 }}>
              Nossa comunidade pode te ajudar a decidir o melhor bairro para sua família, orçamento e estilo de vida.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contato" style={{
                background: 'linear-gradient(135deg, #009C3B, #00C44F)',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}>Fale com a comunidade</Link>
              <Link href="/categoria/imigracao" style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.9rem',
                border: '1px solid var(--border)',
              }}>Ver guias de imigração</Link>
            </div>
          </div>

        </div>
      </main>
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @media (max-width: 768px) {
          .morando-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Footer />
    </>
  )
}
