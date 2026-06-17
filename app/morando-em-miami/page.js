'use client'
import { useState, useEffect, useRef } from 'react'
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
    foto: 'photo-1558951407-61704cdb0460',
    cor: '#2563EB',
    descricao: 'O coração financeiro de Miami. Torres de vidro, restaurantes estrelados e uma vida noturna vibrante. Ideal para profissionais liberais e jovens executivos que querem estar no centro de tudo.',
    pros: ['Metro acessível (Brickell City Centre)', 'Restaurantes de alta gastronomia', 'Tudo a pé ou de Uber', 'Vista para a Baía de Biscayne'],
    contras: ['Um dos mais caros de Miami', 'Barulhento e agitado', 'Menos verde e familiar'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Profissionais 25–40 anos sem filhos',
    pontos: ['Brickell City Centre', 'Mary Brickell Village', 'Simpson Park', 'Metrorail Station'],
    coords: [25.7452, -80.1939],
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
    pontos: ['Wynwood Walls', 'The Yard', 'Oasis Wynwood', 'NW 2nd Ave'],
    coords: [25.8004, -80.1998],
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
    foto: 'photo-1580650897134-f1de6c0f28b4',
    cor: '#0891B2',
    descricao: 'Lar da Ocean Drive, Art Déco e uma das praias mais famosas do mundo. Um sonho para quem quer acordar a 5 minutos do Atlântico. Alta temporada é cara e movimentada.',
    pros: ['Praia na porta de casa', 'Arquitetura Art Déco única', 'Vida noturna world class', 'Lincoln Road para compras'],
    contras: ['Trânsito caótico para sair', 'Cheio de turistas', 'Aluguéis altíssimos', 'Risco de furacão maior'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Amantes da praia e vida noturna',
    pontos: ['Ocean Drive', 'Lincoln Road Mall', 'Lummus Park', 'South Pointe Park'],
    coords: [25.7907, -80.1300],
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
    coords: [25.7215, -80.2684],
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
    foto: 'photo-1719265844062-c7f2f8e58e9b',
    cor: '#16A34A',
    descricao: 'O bairro mais antigo de Miami. Cheio de árvores, cafés charmosos, marinas e uma vibe relaxada. Muito amado por artistas e famílias que querem sair do caos mas ficar perto da cidade.',
    pros: ['Atmosphere de pequena cidade', 'Parques e natureza exuberante', 'Peacock Park na beira da baía', 'Ótimo para ciclismo'],
    contras: ['Transporte público limitado', 'Fica isolado à noite', 'Opções de restaurante mais limitadas'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Artistas, aposentados e famílias tranquilas',
    pontos: ['CocoWalk', 'Peacock Park', 'Ermita de la Caridad', 'Vizcaya Museum'],
    coords: [25.7285, -80.2399],
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
    coords: [25.8194, -80.3386],
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
    coords: [25.9565, -80.1398],
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
    foto: 'photo-1664078902716-b892032a61eb',
    cor: '#EA580C',
    descricao: 'O bairro mais cultural de Miami. Calle Ocho, dominó no Maximo Gomez Park, cafés cubanos e murais vibrantes. Uma das opções mais acessíveis perto do centro. Vizinhança em gentrificação.',
    pros: ['Muito acessível no preço', 'Cultura rica e autêntica', 'Perto do Downtown', 'Calle Ocho e festivais'],
    contras: ['Gentrificação acelerada', 'Menos infraestrutura moderna', 'Segurança variável por bloco'],
    brasileiros: '★★☆☆☆',
    destaque: 'Melhor para: Aventureiros, artistas e quem quer economizar',
    pontos: ['Calle Ocho', 'Maximo Gomez Park', 'Tower Theater', 'Ball & Chain'],
    coords: [25.7685, -80.2299],
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
    foto: 'photo-1558951387-a66e89fbf8df',
    cor: '#0EA5E9',
    descricao: 'O bairro mais "em alta" de Miami. Vista espetacular da Baía de Biscayne, novos prédios de luxo e preços ainda menores que Brickell. Fica entre Wynwood e Downtown — perfeito para jovens profissionais.',
    pros: ['Vista para a baía', 'Preços melhores que Brickell', 'Perto do Wynwood e Downtown', 'Novos empreendimentos modernos'],
    contras: ['Ainda poucos restaurantes locais', 'Em transição (obras constantes)', 'Transporte público limitado'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Jovens profissionais que querem vista e modernidade',
    pontos: ['Margaret Pace Park', 'Bayside Marketplace', 'Midtown Miami', 'Museum Park'],
    coords: [25.7882, -80.1904],
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
    coords: [25.6826, -80.3566],
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
    foto: 'photo-1595111571848-fdf33cfb6cff',
    cor: '#4F46E5',
    descricao: 'O coração pulsante de Miami com Bayside Marketplace, Pérez Art Museum, Adrienne Arsht Center e acesso direto ao Metromover (gratuito!). Muitos arranha-céus novos com aluguel competitivo.',
    pros: ['Metromover gratuito', 'Bayside Marketplace na beira da baía', 'Acesso a tudo', 'Preços competitivos vs. Brickell'],
    contras: ['Barulhento 24h', 'Menos residencial/familiar', 'Trânsito intenso'],
    brasileiros: '★★☆☆☆',
    destaque: 'Melhor para: Solteiros e casais sem filhos que amam a cidade',
    pontos: ['Bayside Marketplace', 'Pérez Art Museum', 'Adrienne Arsht Center', 'Freedom Tower'],
    coords: [25.7742, -80.1937],
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
    foto: 'photo-1563694983011-6f4d90358083',
    cor: '#D97706',
    descricao: 'A cidade mais acessível perto de Miami. Muito latina, animada e com forte comércio local. Para quem está chegando e quer economizar sem se afastar da área metropolitana.',
    pros: ['Muito acessível', 'Comunidade latina forte', 'Acesso ao Tri-Rail', 'Boa infraestrutura local'],
    contras: ['Menos glamour que outros bairros', 'Trânsito intenso nas principais', 'Longe das praias (45 min)'],
    brasileiros: '★★★☆☆',
    destaque: 'Melhor para: Quem está chegando e quer economizar',
    pontos: ['Westland Mall', 'Amelia Earhart Park', 'Hialeah Park Racing', 'Tri-Rail Station'],
    coords: [25.8576, -80.2781],
  },
]

const ALUGUEL_COLORS = { '$': '#10B981', '$$': '#34D399', '$$$': '#FBBF24', '$$$$': '#F97316', '$$$$$': '#EF4444' }

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
  const colors = { 5: '#10B981', 4: '#34D399', 3: '#FBBF24', 2: '#F97316', 1: '#EF4444' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <span style={{ width: 100, fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${(value / 5) * 100}%`, background: colors[value] || '#FBBF24', height: '100%', borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: colors[value], width: 14 }}>{value}</span>
    </div>
  )
}

function LeafletMap({ bairros, selected, onSelect }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstance.current) return

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link')
      css.id = 'leaflet-css'
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
    }

    // Load Leaflet JS
    const loadMap = () => {
      const L = window.L
      if (!L || !mapRef.current || mapInstance.current) return

      const map = L.map(mapRef.current, {
        center: [25.78, -80.24],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      bairros.forEach(b => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: 36px; height: 36px;
            background: ${b.cor};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            font-size: 14px;
            cursor: pointer;
          "><span style="transform:rotate(45deg)">${b.emoji}</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        })

        const marker = L.marker(b.coords, { icon })
          .addTo(map)
          .bindPopup(`<div style="font-family:sans-serif;min-width:140px">
            <div style="font-weight:800;font-size:1rem;margin-bottom:4px">${b.emoji} ${b.nome}</div>
            <div style="color:#888;font-size:0.8rem;margin-bottom:6px">${b.subtitulo}</div>
            <div style="font-size:0.78rem;color:${ALUGUEL_COLORS[b.aluguel]};font-weight:700">${b.aluguel} ${b.alugelFaixa}</div>
          </div>`, { maxWidth: 200 })

        marker.on('click', () => onSelect(b.id))
        markersRef.current[b.id] = marker
      })

      mapInstance.current = map
    }

    if (window.L) {
      loadMap()
    } else {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = loadMap
      document.head.appendChild(script)
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markersRef.current = {}
      }
    }
  }, [])

  // Pan to selected bairro
  useEffect(() => {
    if (!mapInstance.current || !selected) return
    const b = bairros.find(x => x.id === selected)
    if (b) {
      mapInstance.current.flyTo(b.coords, 13, { duration: 1 })
      const marker = markersRef.current[b.id]
      if (marker) setTimeout(() => marker.openPopup(), 800)
    }
  }, [selected])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: 480, borderRadius: '0 0 16px 16px', zIndex: 1 }}
    />
  )
}

export default function MorandoEmMiami() {
  const [selected, setSelected] = useState(null)
  const bairro = selected ? BAIRROS.find(b => b.id === selected) : null

  const handleSelect = (id) => {
    setSelected(prev => prev === id ? null : id)
    // Scroll to card on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      setTimeout(() => {
        const el = document.getElementById(`card-${id}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  return (
    <>
      <Header articles={[]} />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 80 }}>

        {/* HERO */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0C1445 0%, #1a1f5e 40%, #0d3b6e 100%)',
          overflow: 'hidden',
          padding: '56px 24px 72px',
          textAlign: 'center',
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
              width: [400, 250, 180, 300, 200][i], height: [400, 250, 180, 300, 200][i],
              top: ['-20%', '50%', '10%', '-10%', '60%'][i], left: ['60%', '5%', '80%', '30%', '70%'][i],
              pointerEvents: 'none',
            }} />
          ))}
          <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: 10 }}>🏙️🌴🏖️</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
              Morando em Miami
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.72)', margin: '0 0 28px', lineHeight: 1.65 }}>
              Guia completo dos bairros de Miami para brasileiros.<br />
              Clique num bairro no mapa ou na lista para ver tudo sobre ele.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['12 Bairros', 'Mapa Interativo', 'Preços 2026', 'Para Brasileiros'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 20, padding: '5px 14px', color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 20px' }}>

          {/* LAYOUT: MAPA + LISTA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 420px)',
            gap: 28,
            alignItems: 'start',
            margin: '32px 0 0',
          }}>

            {/* COLUNA ESQUERDA: LISTA DE BAIRROS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BAIRROS.map(b => {
                const isActive = selected === b.id
                return (
                  <div
                    key={b.id}
                    id={`card-${b.id}`}
                    onClick={() => handleSelect(b.id)}
                    style={{
                      background: 'var(--bg-card)',
                      border: `2px solid ${isActive ? b.cor : 'var(--border)'}`,
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.22s',
                      boxShadow: isActive ? `0 4px 24px ${b.cor}33` : '0 1px 6px rgba(0,0,0,0.12)',
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                        background: b.cor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem',
                      }}>{b.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-bright)' }}>{b.nome}</h3>
                          <span style={{ fontSize: '0.73rem', color: b.cor, fontWeight: 600 }}>{b.subtitulo}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700, color: ALUGUEL_COLORS[b.aluguel],
                            background: (ALUGUEL_COLORS[b.aluguel]) + '18', padding: '2px 8px', borderRadius: 4,
                          }}>{b.aluguel} {b.alugelFaixa}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🇧🇷 {b.brasileiros}</span>
                        </div>
                      </div>
                      <div style={{ color: isActive ? b.cor : 'var(--text-muted)', transform: isActive ? 'rotate(180deg)' : 'none', transition: 'all 0.22s', flexShrink: 0, fontSize: '1rem' }}>▼</div>
                    </div>

                    {/* Expanded detail */}
                    {isActive && (
                      <div style={{ borderTop: `1px solid ${b.cor}33` }}>
                        {/* Photo */}
                        <div style={{
                          height: 220, position: 'relative',
                          backgroundImage: `url(https://images.unsplash.com/${b.foto}?w=900&auto=format&fit=crop&q=80)`,
                          backgroundSize: 'cover', backgroundPosition: 'center',
                        }}>
                          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${b.cor}cc 0%, transparent 55%)` }} />
                          <div style={{ position: 'absolute', bottom: 12, left: 16, color: '#fff', fontWeight: 800, fontSize: '1.15rem', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                            {b.emoji} {b.nome}
                          </div>
                          <div style={{ position: 'absolute', bottom: 12, right: 16, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.72rem', padding: '4px 10px', borderRadius: 12, fontWeight: 600 }}>
                            {b.vibe}
                          </div>
                        </div>

                        <div style={{ padding: '16px' }}>
                          <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{b.descricao}</p>

                          {/* Scores */}
                          <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Avaliação</div>
                            <ScoreBar label="Comunidade 🇧🇷" value={b.score.comunidade} />
                            <ScoreBar label="Custo de vida" value={b.score.custo} />
                            <ScoreBar label="Para família" value={b.score.familia} />
                            <ScoreBar label="Transporte" value={b.score.transporte} />
                            <ScoreBar label="Agito / Lazer" value={b.score.agito} />
                          </div>

                          {/* Pros e Contras */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                            <div style={{ background: '#10B98110', border: '1px solid #10B98130', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#10B981', marginBottom: 8 }}>✅ Pontos positivos</div>
                              {b.pros.map(p => <div key={p} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {p}</div>)}
                            </div>
                            <div style={{ background: '#EF444410', border: '1px solid #EF444430', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#EF4444', marginBottom: 8 }}>⚠️ Pontos negativos</div>
                              {b.contras.map(c => <div key={c} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {c}</div>)}
                            </div>
                          </div>

                          <div style={{ background: `${b.cor}18`, border: `1px solid ${b.cor}40`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: '0.85rem', fontWeight: 700, color: b.cor }}>
                            🎯 {b.destaque}
                          </div>

                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📍 Referências</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {b.pontos.map(p => (
                                <span key={p} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p}</span>
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

            {/* COLUNA DIREITA: MAPA STICKY */}
            <div style={{ position: 'sticky', top: 90 }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-bright)' }}>Mapa de Miami</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clique em um pin para ver detalhes</p>
                  </div>
                  {selected && (
                    <button onClick={() => setSelected(null)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Limpar
                    </button>
                  )}
                </div>

                <LeafletMap bairros={BAIRROS} selected={selected} onSelect={handleSelect} />

                {/* Legenda de preços */}
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {[['$–$$', 'Acessível', '#10B981'], ['$$$', 'Médio', '#FBBF24'], ['$$$$–$$$$$', 'Premium', '#EF4444']].map(([r, l, c]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                      <span>{r} {l}</span>
                    </div>
                  ))}
                </div>

                {/* Se tem bairro selecionado: mini-summary */}
                {bairro && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: `${bairro.cor}0d` }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '1.6rem' }}>{bairro.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: bairro.cor, fontSize: '0.9rem' }}>{bairro.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{bairro.alugelFaixa}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TABELA COMPARATIVA */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginTop: 20 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-bright)' }}>📊 Ranking Rápido</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Bairro', '💰', '🇧🇷', '👨‍👩‍👧'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {BAIRROS.map((b, i) => (
                        <tr key={b.id} onClick={() => handleSelect(b.id)} style={{ background: selected === b.id ? `${b.cor}12` : i % 2 === 0 ? 'transparent' : 'var(--bg-secondary)', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: selected === b.id ? b.cor : 'var(--text-bright)', whiteSpace: 'nowrap' }}>{b.emoji} {b.nome}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: ALUGUEL_COLORS[b.aluguel] }}>{b.aluguel}</td>
                          <td style={{ padding: '8px 12px' }}><StarScore value={b.score.comunidade} /></td>
                          <td style={{ padding: '8px 12px' }}><StarScore value={b.score.familia} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '48px 24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%)', borderRadius: 16, border: '1px solid var(--border)', margin: '32px 0 48px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🇧🇷</div>
            <h2 style={{ margin: '0 0 10px', color: 'var(--text-bright)', fontSize: '1.3rem', fontWeight: 800 }}>Precisa de ajuda para escolher?</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 22px', maxWidth: 480, marginInline: 'auto', lineHeight: 1.65, fontSize: '0.9rem' }}>
              Nossa comunidade pode te ajudar a decidir o melhor bairro para sua família, orçamento e estilo de vida.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contato" style={{ background: 'linear-gradient(135deg, #009C3B, #00C44F)', color: '#fff', padding: '11px 26px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>Fale com a comunidade</Link>
              <Link href="/categoria/imigracao" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '11px 26px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem', border: '1px solid var(--border)' }}>Ver guias de imigração</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
