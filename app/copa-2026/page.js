'use client';
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer';

const GRUPOS = [
{ nome: 'Grupo A', times: [
{ p: 'Estados Unidos', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 },
{ p: 'Panama', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
{ p: 'Bolivia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 4 },
{ p: 'Canada', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
]},
{ nome: 'Grupo B', times: [
{ p: 'Argentina', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 6, ga: 0 },
{ p: 'Chile', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
{ p: 'Peru', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 },
{ p: 'Australia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 5 },
]},
{ nome: 'Grupo C', times: [
{ p: 'Mexico', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
{ p: 'Equador', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 2, ga: 1 },
{ p: 'Venezuela', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 },
{ p: 'Jamaica', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 0, ga: 2 },
]},
{ nome: 'Grupo D -- BRASIL', brasil: true, times: [
{ p: 'BRASIL', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 7, ga: 1, dest: true },
{ p: 'Costa Rica', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 4 },
{ p: 'Paraguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
{ p: 'Uruguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 5 },
]},
{ nome: 'Grupo E', times: [
{ p: 'Portugal', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 },
{ p: 'Espanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
{ p: 'Turquia', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
{ p: 'Rep. Tcheca', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 4 },
]},
{ nome: 'Grupo F', times: [
{ p: 'Franca', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 },
{ p: 'Marrocos', pts: 3, pj: 1, v: 1, e: 0, d: 0, gf: 2, ga: 0 },
{ p: 'Georgia', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 5 },
{ p: 'Polonia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 1, ga: 2 },
]},
{ nome: 'Grupo G', times: [
{ p: 'Inglaterra', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 4, ga: 0 },
{ p: 'Paises Baixos', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 2 },
{ p: 'Serbia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
{ p: 'Zambia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 },
]},
{ nome: 'Grupo H', times: [
{ p: 'Alemanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 },
{ p: 'Japao', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 2 },
{ p: 'Colombia', pts: 1, pj: 1, v: 0, e: 1, d: 0, gf: 0, ga: 0 },
{ p: 'Senegal', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 },
]},
];

const JOGADORES = [
{ nome: 'Alisson Becker', pos: 'Goleiro', clube: 'Liverpool', num: 1, nasc: '02/10/1992', caps: 82, gols: 0, bio: 'Considerado um dos melhores goleiros do mundo. Multicampeao com o Liverpool, incluindo Premier League e Champions League.', carreira: ['Internacional (2013-2016)', 'Roma (2016-2018)', 'Liverpool (2018-presente)'], titulos: ['Champions League 2018/19', 'Premier League 2019/20'] },
{ nome: 'Ederson Moraes', pos: 'Goleiro', clube: 'Manchester City', num: 12, nasc: '17/08/1993', caps: 44, gols: 0, bio: 'Goleiro moderno e seguro, reconhecido pelo jogo com os pes. Fundamental no Manchester City de Guardiola.', carreira: ['Benfica (2012-2017)', 'Manchester City (2017-presente)'], titulos: ['Premier League x6', 'Champions League 2022/23'] },
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
{ nome: 'Richarlison', pos: 'Atacante', clube: 'Tottenham', num: 13, nasc: '10/05/1997', caps: 64, gols: 22, bio: 'Centroavante racudo e goleador. Heroi do Brasil nas Olimpiadas.', carreira: ['America-MG (2015)', 'Fluminense (2016-2017)', 'Watford (2017-2018)', 'Everton (2018-2022)', 'Tottenham (2022-presente)'], titulos: ['Ouro Olimpico 2020 (Tokyo)'] },
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

function playerPhotoUrl(nome) {
const encoded = encodeURIComponent(nome);
return 'https://ui-avatars.com/api/?name=' + encoded + '&background=009c3b&color=fff&size=128&bold=true&rounded=true';
}

export default function Copa2026Page() {
const [tab, setTab] = useState('jogos');
const [jogador, setJogador] = useState(null);
const [jogosHoje, setJogosHoje] = useState([]);
const [loadingJogos, setLoadingJogos] = useState(true);

useEffect(() => {
async function fetchJogos() {
try {
const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard');
const data = await res.json();
const events = data.events || [];
const jogos = events.map((ev) => {
const comp = ev.competitions && ev.competitions[0];
const competitors = comp ? comp.competitors : [];
const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
const status = comp && comp.status;
const statusType = status && status.type && status.type.name;
const clock = status && status.displayClock;
const venue = comp && comp.venue;
const notes = comp && comp.notes && comp.notes[0];
let placar = null;
let statusLabel = '';
if (statusType === 'STATUS_FINAL') {
placar = (home.score || '0') + ' x ' + (away.score || '0');
statusLabel = 'Encerrado';
} else if (statusType === 'STATUS_IN_PROGRESS') {
placar = (home.score || '0') + ' x ' + (away.score || '0');
statusLabel = 'Ao Vivo ' + (clock || '');
} else {
const d = new Date(ev.date);
const hh = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
statusLabel = hh + ' BRT';
}
return {
time1: home.team ? home.team.displayName : 'Time A',
flag1: home.team ? home.team.abbreviation : '?',
time2: away.team ? away.team.displayName : 'Time B',
flag2: away.team ? away.team.abbreviation : '?',
placar,
status: statusLabel,
estadio: venue ? venue.fullName : '',
cidade: venue ? (venue.address ? venue.address.city + (venue.address.state ? ', ' + venue.address.state : '') : '') : '',
grupo: notes ? notes.headline : (ev.season && ev.season.slug ? ev.season.slug : 'Copa 2026'),
};
});
if (jogos.length > 0) {
setJogosHoje(jogos);
} else {
setJogosHoje([]);
}
} catch (err) {
setJogosHoje([]);
} finally {
setLoadingJogos(false);
}
}
fetchJogos();
}, []);

const tabStyle = (active) => ({
padding: '10px 22px',
background: active ? '#009c3b' : 'transparent',
color: active ? '#fff' : '#999',
border: 'none',
borderRadius: '8px 8px 0 0',
cursor: 'pointer',
fontWeight: active ? 700 : 400,
fontSize: '14px',
whiteSpace: 'nowrap',
transition: 'all 0.2s',
});

const sg = (gf, ga) => { const s = gf - ga; return (s > 0 ? '+' : '') + s; };

return (
<div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

<div style={{ background: 'linear-gradient(135deg, #009c3b, #006828, #002d12)', padding: '48px 24px 32px', textAlign: 'center' }}>
<div style={{ fontSize: '16px', background: 'rgba(255,223,0,0.15)', color: '#ffdf00', display: 'inline-block', padding: '6px 16px', borderRadius: '20px', marginBottom: '16px', fontWeight: 700, letterSpacing: '2px' }}>FIFA WORLD CUP 2026</div>
<h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, margin: '0 0 8px', color: '#ffdf00' }}>Copa do Mundo 2026</h1>
<p style={{ color: '#a8e6c1', fontSize: '17px', margin: 0 }}>EUA - Canada - Mexico -- Rumo ao Hexa! Brasil 2026</p>
</div>

<div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0', background: '#111', overflowX: 'auto', borderBottom: '2px solid #222' }}>
<button style={tabStyle(tab === 'jogos')} onClick={() => setTab('jogos')}>Jogos de Hoje</button>
<button style={tabStyle(tab === 'grupos')} onClick={() => setTab('grupos')}>Grupos</button>
<button style={tabStyle(tab === 'analise')} onClick={() => setTab('analise')}>Analise Brasil</button>
<button style={tabStyle(tab === 'jogadores')} onClick={() => setTab('jogadores')}>Jogadores</button>
</div>

<div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

{tab === 'jogos' && (
<div>
<h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '8px' }}>Jogos de Hoje</h2>
<p style={{ color: '#888', marginBottom: '24px' }}>Dados ao vivo via ESPN API -- Horarios em BRT (Brasilia, UTC-3)</p>
{loadingJogos ? (
<div style={{ textAlign: 'center', color: '#888', padding: '48px 0', fontSize: '18px' }}>Carregando jogos...</div>
) : jogosHoje.length === 0 ? (
<div style={{ textAlign: 'center', padding: '48px 0' }}>
<div style={{ color: '#555', fontSize: '48px', marginBottom: '16px' }}>-</div>
<div style={{ color: '#888', fontSize: '18px' }}>Nenhum jogo da Copa hoje</div>
<div style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>Verifique novamente mais tarde</div>
</div>
) : (
<div style={{ display: 'grid', gap: '16px' }}>
{jogosHoje.map((j, i) => (
<div key={i} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
<div style={{ textAlign: 'center' }}>
<div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#009c3b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '13px', fontWeight: 900, color: '#fff' }}>{j.flag1}</div>
<div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time1}</div>
</div>
<div style={{ textAlign: 'center', minWidth: '200px' }}>
<div style={{ background: '#111', borderRadius: '8px', padding: '10px 20px', marginBottom: '8px' }}>
<div style={{ fontSize: '26px', fontWeight: 900, color: j.placar ? '#ffdf00' : '#fff', letterSpacing: '3px' }}>{j.placar || j.status}</div>
<div style={{ fontSize: '12px', color: j.placar ? '#4ade80' : '#f59e0b', fontWeight: 600, marginTop: '2px' }}>{j.status}</div>
</div>
<div style={{ fontSize: '11px', color: '#009c3b', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>{j.grupo}</div>
{j.estadio && (
<div style={{ background: '#0d2a0d', borderRadius: '8px', padding: '10px 14px', border: '1px solid #1a4a1a' }}>
<div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{j.estadio}</div>
{j.cidade && <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>{j.cidade}</div>}
</div>
)}
</div>
<div style={{ textAlign: 'center' }}>
<div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '13px', fontWeight: 900, color: '#fff' }}>{j.flag2}</div>
<div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time2}</div>
</div>
</div>
))}
</div>
)}
</div>
)}

{tab === 'grupos' && (
<div>
<h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>Classificacao dos Grupos -- Copa 2026</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '20px' }}>
{GRUPOS.map((g, gi) => (
<div key={gi} style={{ background: '#1a1a1a', border: g.brasil ? '1px solid #009c3b' : '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
<div style={{ background: g.brasil ? '#006828' : '#222', padding: '12px 16px', fontWeight: 700, fontSize: '15px', color: g.brasil ? '#ffdf00' : '#fff' }}>{g.nome}</div>
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
<thead>
<tr style={{ background: '#111', color: '#666' }}>
<th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500 }}>Selecao</th>
{['Pts','PJ','V','E','D','GF','GA','SG'].map(h => <th key={h} style={{ padding: '8px 6px', fontWeight: 500 }}>{h}</th>)}
</tr>
</thead>
<tbody>
{g.times.map((t, ti) => (
<tr key={ti} style={{ background: t.dest ? 'rgba(0,156,59,0.15)' : ti%2===0 ? '#1a1a1a' : '#161616', borderLeft: ti < 2 ? '3px solid #009c3b' : '3px solid transparent' }}>
<td style={{ padding: '9px 12px', fontWeight: t.dest ? 700 : 400, color: t.dest ? '#ffdf00' : '#fff' }}>{t.p}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', fontWeight: 700, color: '#ffdf00' }}>{t.pts}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#ccc' }}>{t.pj}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#4ade80' }}>{t.v}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#ccc' }}>{t.e}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#f87171' }}>{t.d}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#ccc' }}>{t.gf}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: '#ccc' }}>{t.ga}</td>
<td style={{ padding: '9px 6px', textAlign: 'center', color: t.gf-t.ga >= 0 ? '#4ade80' : '#f87171' }}>{sg(t.gf, t.ga)}</td>
</tr>
))}
</tbody>
</table>
<div style={{ padding: '6px 12px', background: '#111', fontSize: '11px', color: '#444' }}>Borda verde = classificado para oitavas</div>
</div>
))}
</div>
</div>
)}

{tab === 'analise' && (
<div style={{ maxWidth: '800px' }}>
<h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>Brasil rumo ao Hexa -- Analise do Caminho</h2>
<div style={{ display: 'grid', gap: '20px' }}>
{[
{ fase: 'Fase de Grupos -- Grupo D', cor: '#009c3b', txt: 'O Brasil lidera o Grupo D com aproveitamento de 100%: 2 vitorias em 2 jogos, 7 gols marcados e apenas 1 sofrido. Vinicius Jr., Rodrygo e Endrick formam um trio ofensivo letal que tem aterrorizado as defesas adversarias. A classificacao antecipada as oitavas e praticamente certa, e o Brasil deve terminar o grupo na lideranca com folga.' },
{ fase: 'Oitavas de Final (28 jun)', cor: '#3b82f6', txt: 'Classificando como lider do Grupo D, o Brasil enfrentara o segundo colocado do Grupo C -- atualmente um duelo acirrado entre Mexico e Equador. A partida deve ser disputada no MetLife Stadium (Nova York) ou AT&T Stadium (Dallas). O Brasil chega como favorito claro gracas ao seu poder ofensivo e experiencia internacional.' },
{ fase: 'Quartas de Final (5 jul)', cor: '#f59e0b', txt: 'A chave do Brasil aponta para um possivel confronto com os Estados Unidos (lider do Grupo A) ou Argentina (lider do Grupo B). Brasil x Argentina nas quartas seria o jogo mais esperado da Copa. Tambem possivel cruzamento com Espanha ou Portugal vindos do outro lado da chave.' },
{ fase: 'Semifinal e Final (11-19 jul)', cor: '#ef4444', txt: 'Na semifinal, o Brasil pode cruzar com potencias europeias como Franca, Inglaterra ou Alemanha. A grande final esta marcada para 19 de julho no MetLife Stadium em Nova York (82.500 torcedores). Com Vinicius Jr. em forma olimpica, Bruno Guimaraes controlando o meio e Marquinhos liderando a defesa, o Brasil esta montado para conquistar o tao esperado Hexa.' },
].map((item, i) => (
<div key={i} style={{ background: '#1a1a1a', borderLeft: '4px solid ' + item.cor, borderRadius: '0 12px 12px 0', padding: '20px 24px', border: '1px solid #2a2a2a', borderLeftColor: item.cor }}>
<h3 style={{ color: item.cor, fontSize: '17px', margin: '0 0 10px', fontWeight: 700 }}>{item.fase}</h3>
<p style={{ color: '#ccc', lineHeight: '1.7', margin: 0, fontSize: '15px' }}>{item.txt}</p>
</div>
))}
</div>
</div>
)}

{tab === 'jogadores' && (
<div>
<h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '8px' }}>Selecao Brasileira -- Copa 2026</h2>
<p style={{ color: '#888', marginBottom: '24px' }}>Clique em um jogador para ver sua carreira completa</p>
{POSICOES.map(({ label, filtro }) => {
const lista = JOGADORES.filter(j => filtro.includes(j.pos));
return (
<div key={label} style={{ marginBottom: '32px' }}>
<h3 style={{ color: '#009c3b', fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #222', paddingBottom: '8px' }}>{label}</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
{lista.map((j, ji) => (
<button key={ji} onClick={() => setJogador(j)}
style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '16px 10px', cursor: 'pointer', textAlign: 'center', color: '#fff', transition: 'all 0.2s' }}
onMouseEnter={e => { e.currentTarget.style.background = '#0d2a0d'; e.currentTarget.style.borderColor = '#009c3b'; }}
onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#2a2a2a'; }}>
<img
src={playerPhotoUrl(j.nome)}
alt={j.nome}
style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'block', margin: '0 auto 10px', border: '2px solid #ffdf00', objectFit: 'cover' }}
/>
<div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '3px', lineHeight: '1.3' }}>{j.nome}</div>
<div style={{ color: '#009c3b', fontSize: '10px', fontWeight: 600 }}>{j.pos}</div>
<div style={{ color: '#666', fontSize: '10px', marginTop: '3px' }}>{j.clube}</div>
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
<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setJogador(null)}>
<div style={{ background: '#1a1a1a', borderRadius: '16px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
<div style={{ background: 'linear-gradient(135deg, #009c3b, #006828)', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
<img
src={playerPhotoUrl(jogador.nome)}
alt={jogador.nome}
style={{ width: '68px', height: '68px', borderRadius: '50%', border: '3px solid #ffdf00', flexShrink: 0, objectFit: 'cover' }}
/>
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '3px' }}>{jogador.nome}</div>
<div style={{ color: '#a8e6c1', fontSize: '13px' }}>{jogador.pos} -- {jogador.clube}</div>
<div style={{ color: '#a8e6c1', fontSize: '12px', marginTop: '2px' }}>Nascimento: {jogador.nasc}</div>
</div>
<button onClick={() => setJogador(null)} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>X</button>
</div>
<div style={{ padding: '24px' }}>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
{[['Caps pela Selecao', jogador.caps], ['Gols pela Selecao', jogador.gols], ['Camisa', '#' + jogador.num], ['Status', 'Convocado']].map(([l, v]) => (
<div key={l} style={{ background: '#111', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
<div style={{ color: '#555', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</div>
<div style={{ fontWeight: 700, fontSize: '18px', color: '#ffdf00' }}>{v}</div>
</div>
))}
</div>
<div style={{ marginBottom: '16px' }}>
<div style={{ color: '#009c3b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Perfil</div>
<p style={{ color: '#ccc', lineHeight: '1.65', margin: 0, fontSize: '14px' }}>{jogador.bio}</p>
</div>
<div style={{ marginBottom: '16px' }}>
<div style={{ color: '#009c3b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Carreira</div>
{jogador.carreira.map((c, ci) => <div key={ci} style={{ color: '#ccc', fontSize: '13px', marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #009c3b' }}>{c}</div>)}
</div>
{jogador.titulos.length > 0 && (
<div>
<div style={{ color: '#009c3b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Titulos</div>
{jogador.titulos.map((t, ti) => <div key={ti} style={{ color: '#ccc', fontSize: '13px', marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #ffdf00' }}>{t}</div>)}
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