'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HOJE_JOGOS = [
  { time1: 'Portugal', flag1: 'ðµð¹', time2: 'Rep. Tcheca', flag2: 'ð¨ð¿', horario: '15:00', estadio: "Levi's Stadium", cidade: 'Santa Clara, CA', placar: '2 x 1', status: 'Encerrado', grupo: 'Grupo E' },
  { time1: 'Turquia', flag1: 'ð¹ð·', time2: 'Georgia', flag2: 'ð¬ðª', horario: '15:00', estadio: 'AT&T Stadium', cidade: 'Arlington, TX', placar: '3 x 1', status: 'Encerrado', grupo: 'Grupo F' },
  { time1: 'Marrocos', flag1: 'ð²ð¦', time2: 'Zambia', flag2: 'ð¿ð²', horario: '19:00', estadio: 'SoFi Stadium', cidade: 'Inglewood, CA', placar: null, status: 'Hoje 19h BRT', grupo: 'Grupo G' },
  { time1: 'Colombia', flag1: 'ð¨ð´', time2: 'Senegal', flag2: 'ð¸ð³', horario: '19:00', estadio: 'Hard Rock Stadium', cidade: 'Miami Gardens, FL', placar: null, status: 'Hoje 19h BRT', grupo: 'Grupo H' },
];

const GRUPOS = [
  { nome: 'Grupo A', times: [{ p: 'ðºð¸ EUA', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 }, { p: 'ðµð¦ Panama', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 }, { p: 'ð§ð´ Bolivia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 4 }, { p: 'ð¨ð¦ Canada', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 }] },
  { nome: 'Grupo B', times: [{ p: 'ð¦ð· Argentina', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 6, ga: 0 }, { p: 'ð¨ð± Chile', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 }, { p: 'ðµðª Peru', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 }, { p: 'ð¦ðº Australia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 5 }] },
  { nome: 'Grupo C', times: [{ p: 'ð²ð½ Mexico', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 }, { p: 'ðªð¨ Equador', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 2, ga: 1 }, { p: 'ð»ðª Venezuela', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 }, { p: 'ð¯ð² Jamaica', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 0, ga: 2 }] },
  { nome: 'Grupo D â BRASIL', brasil: true, times: [{ p: 'ð§ð· Brasil', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 7, ga: 1, d2: true }, { p: 'ð¨ð· Costa Rica', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 4 }, { p: 'ðµð¾ Paraguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 }, { p: 'ðºð¾ Uruguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 5 }] },
  { nome: 'Grupo E', times: [{ p: 'ðµð¹ Portugal', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 }, { p: 'ðªð¸ Espanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 }, { p: 'ð¹ð· Turquia', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 }, { p: 'ð¨ð¿ Rep. Tcheca', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 4 }] },
  { nome: 'Grupo F', times: [{ p: 'ð«ð· Franca', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 }, { p: 'ð²ð¦ Marrocos', pts: 3, pj: 1, v: 1, e: 0, d: 0, gf: 2, ga: 0 }, { p: 'ð¬ðª Georgia', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 5 }, { p: 'ðµð± Polonia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 1, ga: 2 }] },
  { nome: 'Grupo G', times: [{ p: 'Inglaterra', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 4, ga: 0 }, { p: 'ð³ð± Paises Baixos', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 2 }, { p: 'ð·ð¸ Serbia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 }, { p: 'ð¿ð² Zambia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 }] },
  { nome: 'Grupo H', times: [{ p: 'ð©ðª Alemanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 }, { p: 'ð¯ðµ Japao', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 2 }, { p: 'ð¨ð´ Colombia', pts: 1, pj: 1, v: 0, e: 1, d: 0, gf: 0, ga: 0 }, { p: 'ð¸ð³ Senegal', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 }] },
];

const JOGADORES = [
  { nome: 'Alisson Becker', pos: 'Goleiro', clube: 'Liverpool', num: 1, nasc: '02/10/1992', caps: 82, gols: 0, bio: 'Considerado um dos melhores goleiros do mundo. Multicampeao com o Liverpool, incluindo Premier League e Champions League.', carreira: ['Internacional (2013-2016)', 'Roma (2016-2018)', 'Liverpool (2018-presente)'], titulos: ['Champions League 2018/19', 'Premier League 2019/20'] },
  { nome: 'Ederson Moraes', pos: 'Goleiro', clube: 'Manchester City', num: 12, nasc: '17/08/1993', caps: 44, gols: 0, bio: 'Goleiro moderno e seguro, reconhecido pelo jogo com os pes. Peca fundamental no Manchester City de Guardiola.', carreira: ['Benfica (2012-2017)', 'Manchester City (2017-presente)'], titulos: ['Premier League x6', 'Champions League 2022/23'] },
  { nome: 'Bento', pos: 'Goleiro', clube: 'Al-Nassr', num: 23, nasc: '30/03/2000', caps: 8, gols: 0, bio: 'Jovem promessa revelada no Athletico Paranaense. Reserva de luxo na Selecao.', carreira: ['Athletico-PR (2019-2023)', 'Al-Nassr (2023-presente)'], titulos: ['Copa Sudamericana 2021'] },
  { nome: 'Marquinhos', pos: 'Zagueiro', clube: 'PSG', num: 4, nasc: '14/05/1994', caps: 97, gols: 9, bio: 'Capitao da Selecao Brasileira. Um dos zagueiros mais completos do mundo, lideranca dentro e fora de campo.', carreira: ['Corinthians (2011-2013)', 'Roma (2013)', 'PSG (2013-presente)'], titulos: ['Ligue 1 x9', 'Copa da Franca x7'] },
  { nome: 'Gabriel Magalhaes', pos: 'Zagueiro', clube: 'Arsenal', num: 5, nasc: '19/12/1997', caps: 31, gols: 3, bio: 'Zagueiro imponente, excelente nas bolas aereas. Destaque do Arsenal de Arteta.', carreira: ['Avai (2016-2017)', 'Lille (2017-2020)', 'Arsenal (2020-presente)'], titulos: ['Finalista Premier League 2022/23'] },
  { nome: 'Bremer', pos: 'Zagueiro', clube: 'Juventus', num: 3, nasc: '18/03/1997', caps: 22, gols: 1, bio: 'Zagueiro agressivo e forte no corpo a corpo. Brilhou no Torino antes de chegar a Juventus.', carreira: ['Sao Paulo (2016-2018)', 'Torino (2018-2022)', 'Juventus (2022-presente)'], titulos: ['Serie A 2024/25'] },
  { nome: 'Beraldo', pos: 'Zagueiro', clube: 'PSG', num: 15, nasc: '18/11/2003', caps: 6, gols: 0, bio: 'Jovem zagueiro revelado pelo Sao Paulo. Parte da nova geracao da Selecao.', carreira: ['Sao Paulo (2022-2024)', 'PSG (2024-presente)'], titulos: ['Campeonato Paulista 2022'] },
  { nome: 'Danilo', pos: 'Lateral Direito', clube: 'Juventus', num: 2, nasc: '15/07/1991', caps: 89, gols: 6, bio: 'Experiente lateral com passagens por Real Madrid, Manchester City e Juventus.', carreira: ['Santos (2010-2012)', 'Porto (2012-2015)', 'Real Madrid (2015-2017)', 'Manchester City (2017-2019)', 'Juventus (2019-presente)'], titulos: ['Champions League x2', 'Premier League 2018/19'] },
  { nome: 'Vanderson', pos: 'Lateral Direito', clube: 'Monaco', num: 22, nasc: '21/06/2001', caps: 18, gols: 1, bio: 'Lateral veloz e ofensivo, revelado pelo Gremio. Uma das maiores promessas da posicao.', carreira: ['Gremio (2020-2022)', 'Monaco (2022-presente)'], titulos: [] },
  { nome: 'Alex Telles', pos: 'Lateral Esquerdo', clube: 'Sevilla', num: 6, nasc: '15/12/1992', caps: 30, gols: 3, bio: 'Lateral esquerdo com excelente cruzamento e forte presenca ofensiva.', carreira: ['Internacional (2011-2014)', 'Porto (2016-2020)', 'Manchester United (2020-2022)', 'Sevilla (2022-presente)'], titulos: ['Liga Portuguesa x4 com Porto'] },
  { nome: 'Guilherme Arana', pos: 'Lateral Esquerdo', clube: 'Atletico MG', num: 16, nasc: '14/04/1997', caps: 24, gols: 1, bio: 'Lateral esquerdo criativo. Protagonista no Atletico Mineiro.', carreira: ['Corinthians (2015-2017)', 'Sevilla (2017-2021)', 'Atletico MG (2021-presente)'], titulos: ['Copa Libertadores 2021', 'Campeonato Brasileiro 2021'] },
  { nome: 'Casemiro', pos: 'Volante', clube: 'Manchester United', num: 5, nasc: '23/02/1992', caps: 90, gols: 7, bio: 'Um dos melhores volantes da historia. Peca crucial nas 3 Champions League do Real Madrid.', carreira: ['Sao Paulo (2010-2013)', 'Real Madrid (2013-2022)', 'Manchester United (2022-presente)'], titulos: ['Champions League x5', 'La Liga x3'] },
  { nome: 'Bruno Guimaraes', pos: 'Meio-campista', clube: 'Newcastle', num: 8, nasc: '16/11/1997', caps: 42, gols: 5, bio: 'Meio-campista completo, eleito o melhor da Premier League em 2024/25.', carreira: ['Athletico-PR (2017-2020)', 'Lyon (2020-2022)', 'Newcastle (2022-presente)'], titulos: ['Copa Sudamericana 2018'] },
  { nome: 'Gerson', pos: 'Meio-campista', clube: 'Flamengo', num: 18, nasc: '20/05/1997', caps: 25, gols: 2, bio: 'Meia criativo de muita qualidade tecnica. Figura central no Flamengo.', carreira: ['Fluminense (2013-2016)', 'Roma (2016-2019)', 'Marseille (2019-2021)', 'Flamengo (2021-presente)'], titulos: ['Copa Libertadores 2022', 'Campeonato Brasileiro 2019 e 2020'] },
  { nome: 'Lucas Paqueta', pos: 'Meia', clube: 'West Ham', num: 10, nasc: '27/08/1997', caps: 58, gols: 11, bio: 'Meia de grande talento e criatividade. Camisa 10 da Selecao.', carreira: ['Flamengo (2015-2019)', 'AC Milan (2019-2021)', 'Lyon (2021-2022)', 'West Ham (2022-presente)'], titulos: ['Copa Libertadores 2019', 'Campeonato Brasileiro 2019 e 2020'] },
  { nome: 'Andreas Pereira', pos: 'Meia', clube: 'Fulham', num: 20, nasc: '01/01/1996', caps: 15, gols: 2, bio: 'Meia versatil de origem belgo-brasileira. Melhor fase no Fulham da Premier League.', carreira: ['Manchester United (2014-2021)', 'Lazio (2021-2022)', 'Fulham (2022-presente)'], titulos: ['UEFA Europa League 2016/17'] },
  { nome: 'Vinicius Jr.', pos: 'Atacante', clube: 'Real Madrid', num: 7, nasc: '12/07/2000', caps: 55, gols: 14, bio: 'Um dos melhores jogadores do mundo. Vencedor da Bola de Ouro 2024. Veloz, habilidoso e decisivo.', carreira: ['Flamengo (2017-2018)', 'Real Madrid (2018-presente)'], titulos: ['Champions League 2021/22 e 2023/24', 'La Liga x3', 'Bola de Ouro 2024'] },
  { nome: 'Rodrygo', pos: 'Atacante', clube: 'Real Madrid', num: 11, nasc: '09/01/2001', caps: 47, gols: 12, bio: 'Atacante habilidoso e decisivo em grandes momentos. Gols historicos na Champions League.', carreira: ['Santos (2017-2019)', 'Real Madrid (2019-presente)'], titulos: ['Champions League 2021/22 e 2023/24', 'La Liga x2'] },
  { nome: 'Raphinha', pos: 'Atacante', clube: 'Barcelona', num: 17, nasc: '14/12/1996', caps: 43, gols: 15, bio: 'Extremo versatil e explosivo. Um dos principais destaques do Barcelona.', carreira: ['Vitoria (2015-2018)', 'Rennes (2019-2021)', 'Leeds (2020-2022)', 'Barcelona (2022-presente)'], titulos: ['La Liga 2022/23'] },
  { nome: 'Endrick', pos: 'Atacante', clube: 'Real Madrid', num: 9, nasc: '21/07/2006', caps: 18, gols: 6, bio: 'Prodigio do futebol brasileiro. Com apenas 19 anos, ja joga pelo Real Madrid.', carreira: ['Palmeiras (2022-2024)', 'Real Madrid (2024-presente)'], titulos: ['Campeonato Brasileiro 2022 e 2023', 'Copa do Brasil 2023'] },
  { nome: 'Gabriel Martinelli', pos: 'Atacante', clube: 'Arsenal', num: 19, nasc: '18/06/2001', caps: 30, gols: 9, bio: 'Atacante veloz e goleador, um dos principais jogadores do Arsenal.', carreira: ['Ituano (2019)', 'Arsenal (2019-presente)'], titulos: ['Finalista Premier League 2022/23'] },
  { nome: 'Richarlison', pos: 'Atacante', clube: 'Tottenham', num: 13, nasc: '10/05/1997', caps: 64, gols: 22, bio: 'Centroavante racudo e goleador. Heroi do Brasil nas Olimpiadas (hat-trick memorable).', carreira: ['America-MG (2015)', 'Fluminense (2016-2017)', 'Watford (2017-2018)', 'Everton (2018-2022)', 'Tottenham (2022-presente)'], titulos: ['Ouro Olimpico 2020 (Tokyo)'] },
  { nome: 'Gabriel Jesus', pos: 'Atacante', clube: 'Arsenal', num: 14, nasc: '03/04/1997', caps: 68, gols: 19, bio: 'Atacante completo com grande movimentacao. Ouro olimpico, querido da torcida brasileira.', carreira: ['Palmeiras (2015-2017)', 'Manchester City (2017-2022)', 'Arsenal (2022-presente)'], titulos: ['Campeonato Brasileiro 2016', 'Premier League x4', 'Ouro Olimpico 2020'] },
  { nome: 'Savinho', pos: 'Atacante', clube: 'Manchester City', num: 21, nasc: '10/04/2004', caps: 10, gols: 2, bio: 'Jovem extrema de grande potencial, revelado pelo Atletico Mineiro.', carreira: ['Atletico MG (2022)', 'Troyes (2022-2023)', 'Girona (2023-2024)', 'Manchester City (2024-presente)'], titulos: [] },
  { nome: 'Antony', pos: 'Atacante', clube: 'Manchester United', num: 24, nasc: '24/02/2000', caps: 23, gols: 5, bio: 'Atacante habilidoso e criativo, conhecido pelos dribles.', carreira: ['Sao Paulo (2017-2020)', 'Ajax (2020-2022)', 'Manchester United (2022-presente)'], titulos: ['Eredivisie 2020/21 e 2021/22', 'Ouro Olimpico 2020'] },
  { nome: 'Gabigol', pos: 'Atacante', clube: 'Cruzeiro', num: 25, nasc: '11/08/1996', caps: 30, gols: 8, bio: 'Idolo do Flamengo e heroi de Copa Libertadores. Artilheiro e decisivo em momentos de pressao.', carreira: ['Santos (2014-2016)', 'Inter Milao (2016-2019)', 'Flamengo (2019-2024)', 'Cruzeiro (2024-presente)'], titulos: ['Copa Libertadores 2019 e 2022', 'Campeonato Brasileiro 2019 e 2020'] },
];

const POSICOES = [
  { label: 'Goleiros', filtro: ['Goleiro'] },
  { label: 'Zagueiros', filtro: ['Zagueiro'] },
  { label: 'Laterais', filtro: ['Lateral Direito', 'Lateral Esquerdo'] },
  { label: 'Meio-campistas', filtro: ['Volante', 'Meio-campista', 'Meia'] },
  { label: 'Atacantes', filtro: ['Atacante'] },
];

const s = { card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px' }, tab: (a) => ({ padding: '10px 20px', background: a ? '#009c3b' : 'transparent', color: a ? '#fff' : '#999', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: a ? 700 : 400, fontSize: '14px', whiteSpace: 'nowrap' }) };

export default function Copa2026Page() {
  const [tab, setTab] = useState('jogos');
  const [jogador, setJogador] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <Header />

      <div style={{ background: 'linear-gradient(135deg, #009c3b, #006828, #002d12)', padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>ð</div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, margin: '0 0 8px', color: '#ffdf00' }}>Copa do Mundo 2026</h1>
        <p style={{ color: '#a8e6c1', fontSize: '17px', margin: 0 }}>EUA Â· Canada Â· Mexico â Rumo ao Hexa! ð§ð·</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0', background: '#111', overflowX: 'auto', borderBottom: '2px solid #222' }}>
        {[['jogos','ð Jogos de Hoje'], ['grupos','ð Grupos'], ['analise','ð§ð· Analise'], ['jogadores','ð¥ Jogadores']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={s.tab(tab===k)}>{l}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

        {tab === 'jogos' && (
          <div>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '8px' }}>ð Jogos de Hoje â 23 de Junho de 2026</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Horarios em BRT (Brasilia, UTC-3)</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {HOJE_JOGOS.map((j, i) => (
                <div key={i} style={{ ...s.card, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '44px', marginBottom: '6px' }}>{j.flag1}</div>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time1}</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '180px' }}>
                    <div style={{ background: '#111', borderRadius: '8px', padding: '8px 16px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: j.placar ? '#ffdf00' : '#fff', letterSpacing: '2px' }}>{j.placar || j.horario}</div>
                      <div style={{ fontSize: '12px', color: j.placar ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>{j.placar ? 'Encerrado' : 'Hoje ' + j.horario + ' BRT'}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#009c3b', fontWeight: 600, marginBottom: '8px' }}>{j.grupo}</div>
                    <div style={{ background: '#0d2a0d', borderRadius: '8px', padding: '10px 14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>ð {j.estadio}</div>
                      <div style={{ fontSize: '13px', color: '#888', marginTop: '3px' }}>ð {j.cidade}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '44px', marginBottom: '6px' }}>{j.flag2}</div>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time2}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'grupos' && (
          <div>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>ð Grupos â Copa 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '20px' }}>
              {GRUPOS.map((g, gi) => (
                <div key={gi} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: g.brasil ? '#006828' : '#222', padding: '12px 16px', fontWeight: 700 }}>{g.nome}</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead><tr style={{ background: '#111', color: '#777' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>Selecao</th>
                      {['Pts','PJ','V','E','D','GF','GA','SG'].map(h => <th key={h} style={{ padding: '8px 6px' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {g.times.map((t, ti) => (
                        <tr key={ti} style={{ background: t.d2 ? 'rgba(0,156,59,0.15)' : ti%2===0 ? '#1a1a1a' : '#161616', borderLeft: ti < 2 ? '3px solid #009c3b' : '3px solid transparent' }}>
                          <td style={{ padding: '9px 12px', fontWeight: t.d2 ? 700 : 400 }}>{t.p}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center', fontWeight: 700, color: '#ffdf00' }}>{t.pts}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center' }}>{t.pj}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center', color: '#4ade80' }}>{t.v}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center' }}>{t.e}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center', color: '#f87171' }}>{t.d}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center' }}>{t.gf}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center' }}>{t.ga}</td>
                          <td style={{ padding: '9px 6px', textAlign: 'center', color: t.gf-t.ga >= 0 ? '#4ade80' : '#f87171' }}>{(t.gf-t.ga > 0 ? '+' : '') + (t.gf-t.ga)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'analise' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>ð§ð· Caminho do Brasil Rumo ao Hexa</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                { fase: 'Fase de Grupos â Grupo D', cor: '#009c3b', txt: 'O Brasil lidera o Grupo D com aproveitamento de 100%: 2 vitorias em 2 jogos, 7 gols marcados e apenas 1 sofrido. Vinicius Jr., Rodrygo e Endrick formam um trio ofensivo letal que tem aterrorizado as defesas adversarias. A classificacao antecipada as oitavas e praticamente certa, e o Brasil deve terminar o grupo na lideranca.' },
                { fase: 'Oitavas de Final (28 jun)', cor: '#3b82f6', txt: 'Classificando como lider do Grupo D, o Brasil enfrentara o segundo colocado do Grupo C â atualmente um duelo acirrado entre Mexico e Equador. Ambas as selecoes tem qualidade, mas o Brasil chega como favorito claro gracas ao seu poder ofensivo e experiencia.' },
                { fase: 'Quartas de Final (5 jul)', cor: '#f59e0b', txt: 'A chave do Brasil aponta para um possivel confronto com os Estados Unidos (Grupo A) ou Argentina (Grupo B). Brasil x Argentina nas quartas seria o jogo mais esperado da Copa â Vinicius Jr. vs Messi seria o confronto dos astros.' },
                { fase: 'Semifinal e Final (11-19 jul)', cor: '#ef4444', txt: 'Na semifinal, o Brasil pode cruzar com potencias europeias como Franca, Espanha ou Inglaterra. A grande final esta marcada para 19 de julho no MetLife Stadium (82.500 torcedores). Com Vinicius Jr. em forma olimpica, Bruno Guimaraes controlando o meio e Marquinhos liderando a defesa, o Brasil esta montado para o Hexa.' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#1a1a1a', borderLeft: '4px solid ' + item.cor, borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ color: item.cor, fontSize: '18px', margin: '0 0 10px', fontWeight: 700 }}>{item.fase}</h3>
                  <p style={{ color: '#ccc', lineHeight: '1.7', margin: 0, fontSize: '15px' }}>{item.txt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'jogadores' && (
          <div>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '8px' }}>ð¥ Selecao Brasileira â Copa 2026</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Clique em um jogador para ver sua carreira completa</p>
            {POSICOES.map(({ label, filtro }) => {
              const lista = JOGADORES.filter(j => filtro.includes(j.pos));
              return (
                <div key={label} style={{ marginBottom: '32px' }}>
                  <h3 style={{ color: '#009c3b', fontSize: '15px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>{label}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                    {lista.map((j, ji) => (
                      <button key={ji} onClick={() => setJogador(j)}
                        style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px 10px', cursor: 'pointer', textAlign: 'center', color: '#fff' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0d2a0d'; e.currentTarget.style.borderColor = '#009c3b'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333'; }}>
                        <div style={{ width: '62px', height: '62px', borderRadius: '50%', background: 'linear-gradient(135deg, #009c3b, #006828)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '20px', fontWeight: 900, color: '#ffdf00', border: '2px solid #ffdf00' }}>{j.num}</div>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '3px', lineHeight: '1.2' }}>{j.nome}</div>
                        <div style={{ color: '#009c3b', fontSize: '11px', fontWeight: 600 }}>{j.pos}</div>
                        <div style={{ color: '#888', fontSize: '11px', marginTop: '3px' }}>{j.clube}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {jogador && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setJogador(null)}>
          <div style={{ background: '#1a1a1a', borderRadius: '16px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #444' }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, #009c3b, #006828)', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, color: '#ffdf00', border: '3px solid #ffdf00', flexShrink: 0 }}>{jogador.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '3px' }}>{jogador.nome}</div>
                <div style={{ color: '#a8e6c1', fontSize: '14px' }}>{jogador.pos} Â· {jogador.clube}</div>
                <div style={{ color: '#a8e6c1', fontSize: '13px' }}>Nasc: {jogador.nasc}</div>
              </div>
              <button onClick={() => setJogador(null)} style={{ background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', flexShrink: 0 }}>x</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[['Caps pela Selecao', jogador.caps], ['Gols pela Selecao', jogador.gols], ['Camisa', '#' + jogador.num], ['Status', 'Convocado']].map(([l, v]) => (
                  <div key={l} style={{ background: '#111', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#ffdf00' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Perfil</h4>
                <p style={{ color: '#ccc', lineHeight: '1.65', margin: 0, fontSize: '14px' }}>{jogador.bio}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Carreira</h4>
                {jogador.carreira.map((c, ci) => <div key={ci} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px', paddingLeft: '8px' }}>{'> ' + c}</div>)}
              </div>
              {jogador.titulos.length > 0 && (
                <div>
                  <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Titulos</h4>
                  {jogador.titulos.map((t, ti) => <div key={ti} style={{ color: '#ccc', fontSize: '13px', marginBottom: '4px' }}>{'ð ' + t}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}