'use client';
import { useState, useEffect } from 'react';
import Footer from '../../components/Footer';

const HOJE_JOGOS_FALLBACK = [
  {
    time1: 'Portugal', flag1: '🇵🇹',
    time2: 'República Tcheca', flag2: '🇨🇿',
    estadio: "Levi's Stadium", cidade: 'Santa Clara, CA',
    placar: '2 x 1', status: 'Encerrado', grupo: 'Grupo E',
  },
  {
    time1: 'Turquia', flag1: '🇹🇷',
    time2: 'Geórgia', flag2: '🇬🇪',
    estadio: 'AT&T Stadium', cidade: 'Arlington, TX',
    placar: '3 x 1', status: 'Encerrado', grupo: 'Grupo F',
  },
  {
    time1: 'Marrocos', flag1: '🇲🇦',
    time2: 'Zâmbia', flag2: '🇿🇲',
    estadio: 'SoFi Stadium', cidade: 'Inglewood, CA',
    placar: null, status: 'Hoje 19h BRT', grupo: 'Grupo G',
  },
  {
    time1: 'Colômbia', flag1: '🇨🇴',
    time2: 'Senegal', flag2: '🇸🇳',
    estadio: 'Hard Rock Stadium', cidade: 'Miami Gardens, FL',
    placar: null, status: 'Hoje 19h BRT', grupo: 'Grupo H',
  },
];

const GRUPOS = [
  {
    nome: 'Grupo A',
    times: [
      { pais: '🇺🇸 Estados Unidos', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 },
      { pais: '🇵🇦 Panamá', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
      { pais: '🇧🇴 Bolívia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 4 },
      { pais: '🇨🇦 Canadá', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
    ],
  },
  {
    nome: 'Grupo B',
    times: [
      { pais: '🇦🇷 Argentina', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 6, ga: 0 },
      { pais: '🇨🇱 Chile', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
      { pais: '🇵🇪 Peru', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 },
      { pais: '🇦🇺 Austrália', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 5 },
    ],
  },
  {
    nome: 'Grupo C',
    times: [
      { pais: '🇲🇽 México', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
      { pais: '🇪🇨 Equador', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 2, ga: 1 },
      { pais: '🇻🇪 Venezuela', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 },
      { pais: '🇯🇲 Jamaica', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 0, ga: 2 },
    ],
  },
  {
    nome: 'Grupo D — 🇧🇷',
    times: [
      { pais: '🇧🇷 Brasil', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 7, ga: 1, destaque: true },
      { pais: '🇨🇷 Costa Rica', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 4 },
      { pais: '🇵🇾 Paraguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
      { pais: '🇺🇾 Uruguai', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 2, ga: 5 },
    ],
  },
  {
    nome: 'Grupo E',
    times: [
      { pais: '🇵🇹 Portugal', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 },
      { pais: '🇪🇸 Espanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
      { pais: '🇹🇷 Turquia', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
      { pais: '🇨🇿 Rep. Tcheca', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 4 },
    ],
  },
  {
    nome: 'Grupo F',
    times: [
      { pais: '🇫🇷 França', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 },
      { pais: '🇲🇦 Marrocos', pts: 3, pj: 1, v: 1, e: 0, d: 0, gf: 2, ga: 0 },
      { pais: '🇬🇪 Geórgia', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 5 },
      { pais: '🇵🇱 Polônia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 1, ga: 2 },
    ],
  },
  {
    nome: 'Grupo G',
    times: [
      { pais: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 4, ga: 0 },
      { pais: '🇳🇱 Países Baixos', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 2 },
      { pais: '🇷🇸 Sérvia', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
      { pais: '🇿🇲 Zâmbia', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 },
    ],
  },
  {
    nome: 'Grupo H',
    times: [
      { pais: '🇩🇪 Alemanha', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 4, ga: 2 },
      { pais: '🇯🇵 Japão', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 2 },
      { pais: '🇨🇴 Colômbia', pts: 1, pj: 1, v: 0, e: 1, d: 0, gf: 0, ga: 0 },
      { pais: '🇸🇳 Senegal', pts: 0, pj: 1, v: 0, e: 0, d: 1, gf: 0, ga: 1 },
    ],
  },
];

const JOGADORES = [
  { nome: 'Alisson Becker', foto: 'https://img.sofascore.com/api/v1/player/78830/image', pos: 'Goleiro', clube: 'Liverpool', num: 1, nascimento: '02/10/1992', caps: 82, gols: 0, bio: 'Considerado um dos melhores goleiros do mundo. Multicampeão com o Liverpool, incluindo Premier League e Champions League. Defesas decisivas em momentos cruciais tornam Alisson indispensável para a Seleção.', carreira: ['Internacional (2013–2016)', 'Roma (2016–2018)', 'Liverpool (2018–presente)'], titulos: ['Champions League 2018/19', 'Premier League 2019/20', 'Copa do Mundo Sub-20 2011'] },
  { nome: 'Ederson Moraes', foto: 'https://img.sofascore.com/api/v1/player/190854/image', pos: 'Goleiro', clube: 'Manchester City', num: 12, nascimento: '17/08/1993', caps: 44, gols: 0, bio: 'Goleiro moderno e seguro, reconhecido pelo jogo com os pés. Peça fundamental no domínio do Manchester City na Premier League sob Guardiola.', carreira: ['Ribeirão (2011)', 'Benfica (2012–2017)', 'Manchester City (2017–presente)'], titulos: ['Premier League x6', 'Champions League 2022/23', 'Copa do Brasil 2011'] },
  { nome: 'Bento', foto: 'https://img.sofascore.com/api/v1/player/870259/image', pos: 'Goleiro', clube: 'Al-Nassr', num: 23, nascimento: '30/03/2000', caps: 8, gols: 0, bio: 'Jovem promessa que se destacou no Athletico Paranaense antes de dar o salto para o futebol árabe. Reserva de luxo na Seleção.', carreira: ['Athletico-PR (2019–2023)', 'Al-Nassr (2023–presente)'], titulos: ['Copa Sudamericana 2021'] },
  { nome: 'Marquinhos', foto: 'https://img.sofascore.com/api/v1/player/116461/image', pos: 'Zagueiro', clube: 'PSG', num: 4, nascimento: '14/05/1994', caps: 97, gols: 9, bio: 'Capitão da Seleção Brasileira. Um dos zagueiros mais completos do mundo, liderança dentro e fora de campo. Multicampeão com o PSG há mais de uma década.', carreira: ['Corinthians (2011–2013)', 'Roma (2013)', 'PSG (2013–presente)'], titulos: ['Ligue 1 x9', 'Copa da França x7', 'Copa do Brasil Sub-17'] },
  { nome: 'Gabriel Magalhães', foto: 'https://img.sofascore.com/api/v1/player/818652/image', pos: 'Zagueiro', clube: 'Arsenal', num: 5, nascimento: '19/12/1997', caps: 31, gols: 3, bio: 'Zagueiro imponente, excelente nas bolas aéreas e na saída de bola. Destaque do Arsenal de Arteta nas últimas temporadas.', carreira: ['Avai (2016–2017)', 'Lille (2017–2020)', 'Arsenal (2020–presente)'], titulos: ['Finalista Premier League 2022/23'] },
  { nome: 'Bremer', foto: 'https://img.sofascore.com/api/v1/player/728006/image', pos: 'Zagueiro', clube: 'Juventus', num: 3, nascimento: '18/03/1997', caps: 22, gols: 1, bio: 'Zagueiro agressivo e forte no corpo a corpo. Revelado pelo São Paulo, brilhou no Torino antes de chegar à Juventus.', carreira: ['São Paulo (2016–2018)', 'Torino (2018–2022)', 'Juventus (2022–presente)'], titulos: ['Série A Italiana 2024/25'] },
  { nome: 'Beraldo', foto: 'https://img.sofascore.com/api/v1/player/1191558/image', pos: 'Zagueiro', clube: 'PSG', num: 15, nascimento: '18/11/2003', caps: 6, gols: 0, bio: 'Jovem zagueiro revelado pelo São Paulo. Transferido ao PSG em 2024, é uma das promessas da nova geração da Seleção.', carreira: ['São Paulo (2022–2024)', 'PSG (2024–presente)'], titulos: ['Campeonato Paulista 2022'] },
  { nome: 'Danilo', foto: 'https://img.sofascore.com/api/v1/player/68245/image', pos: 'Lateral Direito', clube: 'Juventus', num: 2, nascimento: '15/07/1991', caps: 89, gols: 6, bio: 'Experiente lateral com passagens por Real Madrid, Manchester City e Juventus. Referência em experiência internacional para a Seleção.', carreira: ['Santos (2010–2012)', 'Porto (2012–2015)', 'Real Madrid (2015–2017)', 'Manchester City (2017–2019)', 'Juventus (2019–presente)'], titulos: ['Champions League 2015/16 e 2016/17', 'Premier League 2018/19'] },
  { nome: 'Vanderson', foto: 'https://img.sofascore.com/api/v1/player/898756/image', pos: 'Lateral Direito', clube: 'Monaco', num: 22, nascimento: '21/06/2001', caps: 18, gols: 1, bio: 'Lateral veloz e ofensivo, revelado pelo Grêmio. Está se consolidando no Monaco e é uma das maiores promessas da posição.', carreira: ['Grêmio (2020–2022)', 'Monaco (2022–presente)'], titulos: ['Série A Brasileira Sub-20 2020'] },
  { nome: 'Alex Telles', foto: 'https://img.sofascore.com/api/v1/player/196695/image', pos: 'Lateral Esquerdo', clube: 'Sevilla', num: 6, nascimento: '15/12/1992', caps: 30, gols: 3, bio: 'Lateral esquerdo com excelente cruzamento e forte presença ofensiva. Retornou ao futebol europeu após passagem pelo Manchester United.', carreira: ['Internacional (2011–2014)', 'Porto (2016–2020)', 'Manchester United (2020–2022)', 'Sevilla (2022–presente)'], titulos: ['Liga Portuguesa x4 com Porto'] },
  { nome: 'Guilherme Arana', foto: 'https://img.sofascore.com/api/v1/player/640026/image', pos: 'Lateral Esquerdo', clube: 'Atlético Mineiro', num: 16, nascimento: '14/04/1997', caps: 24, gols: 1, bio: 'Lateral esquerdo criativo e forte na marcação. Revelado no Corinthians, voltou ao Brasil para ser protagonista no Atlético Mineiro.', carreira: ['Corinthians (2015–2017)', 'Sevilla (2017–2021)', 'Atlético Mineiro (2021–presente)'], titulos: ['Copa Libertadores 2021', 'Campeonato Brasileiro 2021'] },
  { nome: 'Casemiro', foto: 'https://img.sofascore.com/api/v1/player/75920/image', pos: 'Volante', clube: 'Manchester United', num: 5, nascimento: '23/02/1992', caps: 90, gols: 7, bio: 'Um dos melhores volantes da história do futebol. Peça crucial na conquista de 3 Champions League pelo Real Madrid. Liderança absoluta no meio-campo da Seleção.', carreira: ['São Paulo (2010–2013)', 'Real Madrid (2013–2022)', 'Manchester United (2022–presente)'], titulos: ['Champions League x5', 'La Liga x3', 'Copa do Mundo 2022 (3o lugar)'] },
  { nome: 'Bruno Guimarães', foto: 'https://img.sofascore.com/api/v1/player/858976/image', pos: 'Meio-campista', clube: 'Newcastle', num: 8, nascimento: '16/11/1997', caps: 42, gols: 5, bio: 'Meio-campista completo, eleito o melhor da Premier League em 2024/25. Motor do jogo do Newcastle e da Seleção Brasileira.', carreira: ['Athletico-PR (2017–2020)', 'Lyon (2020–2022)', 'Newcastle (2022–presente)'], titulos: ['Copa Sudamericana 2018', 'Finalista Copa da França 2021'] },
  { nome: 'Gerson', foto: 'https://img.sofascore.com/api/v1/player/336498/image', pos: 'Meio-campista', clube: 'Flamengo', num: 18, nascimento: '20/05/1997', caps: 25, gols: 2, bio: 'Meia criativo e de muita qualidade técnica. Após passagem pela Europa, retornou ao Flamengo onde é figura central.', carreira: ['Fluminense (2013–2016)', 'Roma (2016–2019)', 'Marseille (2019–2021)', 'Flamengo (2021–presente)'], titulos: ['Copa Libertadores 2022', 'Campeonato Brasileiro 2019 e 2020'] },
  { nome: 'Lucas Paquetá', foto: 'https://img.sofascore.com/api/v1/player/723213/image', pos: 'Meia', clube: 'West Ham', num: 10, nascimento: '27/08/1997', caps: 58, gols: 11, bio: 'Meia de grande talento e criatividade. Camisa 10 da Seleção, combina passes, dribles e gols com naturalidade.', carreira: ['Flamengo (2015–2019)', 'AC Milan (2019–2021)', 'Lyon (2021–2022)', 'West Ham (2022–presente)'], titulos: ['Copa Libertadores 2019', 'Campeonato Brasileiro 2019 e 2020'] },
  { nome: 'Andreas Pereira', foto: 'https://img.sofascore.com/api/v1/player/198267/image', pos: 'Meia', clube: 'Fulham', num: 20, nascimento: '01/01/1996', caps: 15, gols: 2, bio: 'Meia versátil de origem belgo-brasileira. Revelado no Manchester United, encontrou sua melhor fase no Fulham da Premier League.', carreira: ['Manchester United (2014–2021)', 'Lazio (2021–2022)', 'Fulham (2022–presente)'], titulos: ['UEFA Europa League 2016/17'] },
  { nome: 'Vinícius Jr.', foto: 'https://img.sofascore.com/api/v1/player/874655/image', pos: 'Atacante', clube: 'Real Madrid', num: 7, nascimento: '12/07/2000', caps: 55, gols: 14, bio: 'Um dos melhores jogadores do mundo. Vencedor da Bola de Ouro 2024. Veloz, habilidoso e decisivo, é o grande ídolo da nova geração brasileira.', carreira: ['Flamengo (2017–2018)', 'Real Madrid (2018–presente)'], titulos: ['Champions League 2021/22 e 2023/24', 'La Liga x3', 'Bola de Ouro 2024'] },
  { nome: 'Rodrygo', foto: 'https://img.sofascore.com/api/v1/player/890580/image', pos: 'Atacante', clube: 'Real Madrid', num: 11, nascimento: '09/01/2001', caps: 47, gols: 12, bio: 'Atacante habilidoso e decisivo em grandes momentos. Marcou gols históricos na Champions League pelo Real Madrid.', carreira: ['Santos (2017–2019)', 'Real Madrid (2019–presente)'], titulos: ['Champions League 2021/22 e 2023/24', 'La Liga x2'] },
  { nome: 'Raphinha', foto: 'https://img.sofascore.com/api/v1/player/833173/image', pos: 'Atacante', clube: 'Barcelona', num: 17, nascimento: '14/12/1996', caps: 43, gols: 15, bio: 'Extremo versátil e explosivo. No Barcelona, é um dos principais destaques, com ótima temporada 2024/25. Muito importante na Seleção.', carreira: ['Vitória (2015–2018)', 'Rennes (2019–2021)', 'Leeds (2020–2022)', 'Barcelona (2022–presente)'], titulos: ['La Liga 2022/23', 'Finalista Champions League 2024/25'] },
  { nome: 'Endrick', foto: 'https://img.sofascore.com/api/v1/player/1179077/image', pos: 'Atacante', clube: 'Real Madrid', num: 9, nascimento: '21/07/2006', caps: 18, gols: 6, bio: 'Prodígio do futebol brasileiro. Com apenas 19 anos, já joga pelo Real Madrid e é a grande esperança da Seleção para o futuro. Gols decisivos pela seleção principal aos 17 anos.', carreira: ['Palmeiras (2022–2024)', 'Real Madrid (2024–presente)'], titulos: ['Campeonato Brasileiro 2022 e 2023', 'Copa do Brasil 2023'] },
  { nome: 'Gabriel Martinelli', foto: 'https://img.sofascore.com/api/v1/player/858942/image', pos: 'Atacante', clube: 'Arsenal', num: 19, nascimento: '18/06/2001', caps: 30, gols: 9, bio: 'Atacante veloz e goleador, um dos principais jogadores do Arsenal. Destaque nas últimas temporadas da Premier League.', carreira: ['Ituano (2019)', 'Arsenal (2019–presente)'], titulos: ['Finalista Premier League 2022/23'] },
  { nome: 'Richarlison', foto: 'https://img.sofascore.com/api/v1/player/641360/image', pos: 'Atacante', clube: 'Tottenham', num: 13, nascimento: '10/05/1997', caps: 64, gols: 22, bio: 'Centroavante raçudo e goleador. Herói do Brasil nas últimas Olimpíadas, com hat-trick memorável. Garra e determinação são suas marcas.', carreira: ['América-MG (2015)', 'Fluminense (2016–2017)', 'Watford (2017–2018)', 'Everton (2018–2022)', 'Tottenham (2022–presente)'], titulos: ['Ouro Olímpico 2020 (Tokyo)'] },
  { nome: 'Gabriel Jesus', foto: 'https://img.sofascore.com/api/v1/player/335733/image', pos: 'Atacante', clube: 'Arsenal', num: 14, nascimento: '03/04/1997', caps: 68, gols: 19, bio: 'Atacante completo com grande movimentação. Ouro olímpico, é um dos jogadores mais queridos da torcida brasileira.', carreira: ['Palmeiras (2015–2017)', 'Manchester City (2017–2022)', 'Arsenal (2022–presente)'], titulos: ['Campeonato Brasileiro 2016', 'Premier League x4 com City', 'Ouro Olímpico 2020'] },
  { nome: 'Savinho', foto: 'https://img.sofascore.com/api/v1/player/1181614/image', pos: 'Atacante', clube: 'Manchester City', num: 21, nascimento: '10/04/2004', caps: 10, gols: 2, bio: 'Jovem extrema de grande potencial, revelado pelo Atlético Mineiro e formado nas categorias do City Football Group.', carreira: ['Atlético Mineiro (2022)', 'Troyes (2022–2023)', 'Girona (2023–2024)', 'Manchester City (2024–presente)'], titulos: ['La Liga 2023/24 com Girona'] },
  { nome: 'Antony', foto: 'https://img.sofascore.com/api/v1/player/858948/image', pos: 'Atacante', clube: 'Manchester United', num: 24, nascimento: '24/02/2000', caps: 23, gols: 5, bio: 'Atacante habilidoso e criativo, conhecido pelos dribles. Transferido por 95 milhões ao United em 2022, busca reconquistar seu melhor futebol.', carreira: ['São Paulo (2017–2020)', 'Ajax (2020–2022)', 'Manchester United (2022–presente)'], titulos: ['Eredivisie 2020/21 e 2021/22', 'Ouro Olímpico 2020'] },
  { nome: 'Gabigol', foto: 'https://img.sofascore.com/api/v1/player/374268/image', pos: 'Atacante', clube: 'Cruzeiro', num: 25, nascimento: '11/08/1996', caps: 30, gols: 8, bio: 'Ídolo do Flamengo e herói de Copa Libertadores. Artilheiro e decisivo em momentos de pressão.', carreira: ['Santos (2014–2016)', 'Inter Milão (2016–2019)', 'Flamengo (2019–2024)', 'Cruzeiro (2024–presente)'], titulos: ['Copa Libertadores 2019 e 2022', 'Campeonato Brasileiro 2019 e 2020'] },
];

function avatarUrl(nome) {
  return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nome) + '&background=009c3b&color=fff&size=128&bold=true&rounded=true';
}


const ALPHA2 = {
  'USA':'us','MEX':'mx','CAN':'ca','PAN':'pa','BRA':'br',
  'ARG':'ar','CHL':'cl','ECU':'ec','PER':'pe','COL':'co',
  'PAR':'py','URU':'uy','BOL':'bo','VEN':'ve','CRC':'cr',
  'JAM':'jm','HON':'hn','SLV':'sv',
  'FRA':'fr','ENG':'gb-eng','ESP':'es','POR':'pt','GER':'de',
  'ITA':'it','NED':'nl','BEL':'be','CRO':'hr','SRB':'rs',
  'DEN':'dk','AUT':'at','SUI':'ch','POL':'pl','HUN':'hu',
  'ALB':'al','ROU':'ro','SVK':'sk','TUR':'tr','UKR':'ua',
  'GRE':'gr','SCO':'gb-sct','WAL':'gb-wls','NOR':'no','CZE':'cz',
  'GEO':'ge','SRB':'rs','SLO':'si','MNE':'me','MKD':'mk',
  'MAR':'ma','NGA':'ng','SEN':'sn','CMR':'cm','CIV':'ci',
  'GHA':'gh','EGY':'eg','TUN':'tn','MLI':'ml','ALG':'dz',
  'ZAF':'za','BEN':'bj','TAN':'tz','GUI':'gn','ANG':'ao',
  'JPN':'jp','KOR':'kr','AUS':'au','IRN':'ir','SAU':'sa',
  'QAT':'qa','IRQ':'iq','UAE':'ae','JOR':'jo','UZB':'uz',
  'KAZ':'kz','OMA':'om','CHN':'cn','NZL':'nz','THA':'th',
  'VNM':'vn','IDN':'id','PHL':'ph','IND':'in',
}
function countryFlag(code) { return code ? 'https://flagcdn.com/40x30/' + (ALPHA2[code] || 'xx') + '.png' : '' }

export default function Copa2026Page() {
  const [tab, setTab] = useState('jogos');
  const [jogador, setJogador] = useState(null);
  const [liveJogos, setLiveJogos] = useState(null);
  const [liveStatus, setLiveStatus] = useState('carregando');

  useEffect(() => {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard')
      .then(r => r.json())
      .then(data => {
        if (data.events && data.events.length > 0) {
          const jogos = data.events.map(ev => {
            const comp = ev.competitions[0];
            const home = comp.competitors.find(c => c.homeAway === 'home') || comp.competitors[0];
            const away = comp.competitors.find(c => c.homeAway === 'away') || comp.competitors[1];
            const st = comp.status;
            const venue = comp.venue;
            let placar = null;
            let statusText = '';
            if (st.type.completed) {
              placar = (home.score || '0') + ' x ' + (away.score || '0');
              statusText = 'Encerrado';
            } else if (st.type.state === 'in') {
              placar = (home.score || '0') + ' x ' + (away.score || '0');
              statusText = (st.displayClock || '') + ' ' + (st.period ? st.period + 'T' : '');
            } else {
              const gd = new Date(comp.date);
              const hr = gd.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
              statusText = 'Hoje ' + hr + ' BRT';
            }
            const groupNote = ev.shortName || ev.name || '';
            return {
              time1: home.team ? home.team.displayName : 'Time 1',
              flag1: home.team ? countryFlag(home.team.abbreviation) : '',
              time2: away.team ? away.team.displayName : 'Time 2',
              flag2: away.team ? countryFlag(away.team.abbreviation) : '',
              estadio: venue ? (venue.fullName || venue.name || 'Estadio') : 'A definir',
              cidade: venue ? ((venue.city || '') + (venue.state ? ', ' + venue.state : '')) : '',
              placar,
              status: statusText,
              grupo: groupNote,
            };
          });
          setLiveJogos(jogos);
          setLiveStatus('ok');
        } else {
          setLiveJogos([]);
          setLiveStatus('vazio');
        }
      })
      .catch(() => {
        setLiveJogos([]);
        setLiveStatus('erro');
      });
  }, []);

  const jogosExibidos = liveJogos && liveJogos.length > 0 ? liveJogos : HOJE_JOGOS_FALLBACK;
  const isLive = liveJogos && liveJogos.length > 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #009c3b 0%, #006828 50%, #002d12 100%)', padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, margin: '0 0 8px', color: '#ffdf00', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>Copa do Mundo 2026</h1>
        <p style={{ color: '#a8e6c1', fontSize: '18px', margin: 0 }}>🇺🇸 EUA · 🇨🇦 Canadá · 🇲🇽 México — Rumo ao Hexa!</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', padding: '16px 24px 0', background: '#111', overflowX: 'auto', borderBottom: '2px solid #222' }}>
        {[
          { key: 'jogos', label: '📅 Jogos de Hoje' },
          { key: 'grupos', label: '📊 Grupos' },
          { key: 'analise', label: '🇧🇷 Análise' },
          { key: 'jogadores', label: '👥 Jogadores' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 20px',
              background: tab === t.key ? '#009c3b' : 'transparent',
              color: tab === t.key ? '#fff' : '#999',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: tab === t.key ? 700 : 400,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>

        {/* JOGOS DE HOJE */}
        {tab === 'jogos' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ color: '#ffdf00', fontSize: '24px', margin: 0 }}>📅 Jogos de Hoje</h2>
              {liveStatus === 'carregando' && <span style={{ color: '#888', fontSize: '13px' }}>⏳ Carregando...</span>}
              {isLive && <span style={{ background: '#009c3b', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700 }}>🔴 AO VIVO</span>}
              {liveStatus === 'erro' && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠️ Usando dados locais</span>}
            </div>
            <p style={{ color: '#888', marginBottom: '24px' }}>Horários em BRT (Brasília, UTC-3)</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {jogosExibidos.map((j, i) => (
                <div key={i} style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    {j.flag1 ? <img src={j.flag1} alt={j.time1} style={{height:'42px',width:'auto',marginBottom:'6px',borderRadius:'3px',boxShadow:'0 1px 4px rgba(0,0,0,0.4)'}} /> : <span style={{fontSize:'36px',marginBottom:'6px',display:'block'}}>🏳️</span>}
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time1}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ background: '#111', borderRadius: '8px', padding: '8px 16px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: j.placar ? '#ffdf00' : '#fff', letterSpacing: '2px' }}>
                        {j.placar || 'vs'}
                      </div>
                      <div style={{ fontSize: '12px', color: j.placar ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
                        {j.placar ? '✅ ' + j.status : '⏰ ' + j.status}
                      </div>
                    </div>
                    {j.grupo && <div style={{ fontSize: '12px', color: '#009c3b', fontWeight: 600 }}>{j.grupo}</div>}
                    <div style={{ marginTop: '8px', background: '#0d2a0d', borderRadius: '6px', padding: '8px 12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>🏟️ {j.estadio}</div>
                      {j.cidade && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>📍 {j.cidade}</div>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {j.flag2 ? <img src={j.flag2} alt={j.time2} style={{height:'42px',width:'auto',marginBottom:'6px',borderRadius:'3px',boxShadow:'0 1px 4px rgba(0,0,0,0.4)'}} /> : <span style={{fontSize:'36px',marginBottom:'6px',display:'block'}}>🏳️</span>}
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{j.time2}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRUPOS */}
        {tab === 'grupos' && (
          <div>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>📊 Classificação dos Grupos — Copa 2026</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '24px' }}>
              {GRUPOS.map((g, gi) => (
                <div key={gi} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ background: g.nome.includes('🇧🇷') ? '#006828' : '#222', padding: '12px 16px', fontWeight: 700, fontSize: '15px' }}>
                    {g.nome}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#111', color: '#888' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600 }}>Seleção</th>
                        {['Pts','PJ','V','E','D','GF','GA','SG'].map(h => (
                          <th key={h} style={{ padding: '8px 6px', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.times.map((t, ti) => (
                        <tr key={ti} style={{
                          background: t.destaque ? 'rgba(0,156,59,0.15)' : ti % 2 === 0 ? '#1a1a1a' : '#161616',
                          borderLeft: ti < 2 ? '3px solid #009c3b' : ti === 2 ? '3px solid #f59e0b' : '3px solid transparent',
                        }}>
                          <td style={{ padding: '10px 12px', fontWeight: t.destaque ? 700 : 400 }}>{t.pais}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 700, color: '#ffdf00' }}>{t.pts}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center' }}>{t.pj}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center', color: '#4ade80' }}>{t.v}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center' }}>{t.e}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center', color: '#f87171' }}>{t.d}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center' }}>{t.gf}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center' }}>{t.ga}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center', color: t.gf - t.ga > 0 ? '#4ade80' : '#f87171' }}>{t.gf - t.ga > 0 ? '+' : ''}{t.gf - t.ga}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '8px 12px', background: '#111', fontSize: '11px', color: '#555', display: 'flex', gap: '16px' }}>
                    <span>🟢 Oitavas de final</span>
                    <span>🟡 3a rodada</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANÁLISE */}
        {tab === 'analise' && (
          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '24px' }}>🇧🇷 Caminho do Brasil Rumo ao Hexa</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                {
                  fase: '🏆 Fase de Grupos — Grupo D',
                  cor: '#009c3b',
                  texto: 'O Brasil lidera o Grupo D com aproveitamento de 100%: 2 vitórias em 2 jogos, 7 gols marcados e apenas 1 sofrido. Vinicius Jr., Rodrygo e Endrick formam um trio ofensivo letal que tem aterrorizado as defesas adversárias. A classificação antecipada às oitavas é praticamente certa, e o Brasil deve terminar o grupo na liderança.',
                },
                {
                  fase: '⚡ Oitavas de Final (28 jun)',
                  cor: '#3b82f6',
                  texto: 'Classificando como líder do Grupo D, o Brasil enfrentará o segundo colocado do Grupo C — atualmente um duelo acirrado entre México e Equador. A partida deve ser realizada no MetLife Stadium (Nova York/NJ) ou no AT&T Stadium (Dallas). Ambas as seleções têm qualidade, mas o Brasil chega como favorito claro graças ao seu poder ofensivo e experiência.',
                },
                {
                  fase: '🔥 Quartas de Final (5 jul)',
                  cor: '#f59e0b',
                  texto: 'A chave do Brasil aponta para um possível confronto com os Estados Unidos (Grupo A) ou Argentina (Grupo B) nas quartas de final. Um Brasil x Argentina nas quartas seria o jogo mais esperado da Copa — Vinicius Jr. vs Messi seria o confronto dos astros. Os EUA, como país anfitrião, vieram com elenco renovado e seriam uma partida de altíssima pressão em solo americano.',
                },
                {
                  fase: '🌟 Semifinal e Final (11–19 jul)',
                  cor: '#ef4444',
                  texto: 'Na semifinal, o Brasil pode cruzar com potências europeias como França, Espanha ou Inglaterra. A grande final está marcada para 19 de julho no MetLife Stadium (82.500 torcedores), em Nova York. Com Vinicius Jr. em forma olímpica, Bruno Guimarães controlando o meio, e Marquinhos liderando a defesa, o Brasil está montado para conquistar o tão esperado Hexa. A geração 2026 tem tudo para encerrar o jejum de mais de 24 anos sem título mundial.',
                },
              ].map((item, i) => (
                <div key={i} style={{ background: '#1a1a1a', border: `1px solid ${item.cor}44`, borderLeft: `4px solid ${item.cor}`, borderRadius: '12px', padding: '20px' }}>
                  <h3 style={{ color: item.cor, fontSize: '18px', margin: '0 0 12px', fontWeight: 700 }}>{item.fase}</h3>
                  <p style={{ color: '#ccc', lineHeight: '1.7', margin: 0, fontSize: '15px' }}>{item.texto}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOGADORES */}
        {tab === 'jogadores' && (
          <div>
            <h2 style={{ color: '#ffdf00', fontSize: '24px', marginBottom: '8px' }}>👥 Seleção Brasileira — Copa 2026</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Clique em um jogador para ver sua carreira completa</p>

            {['Goleiros', 'Zagueiros', 'Laterais', 'Meio-campistas', 'Atacantes'].map(pos => {
              const posMap = {
                'Goleiros': 'Goleiro',
                'Zagueiros': 'Zagueiro',
                'Laterais': ['Lateral Direito', 'Lateral Esquerdo'],
                'Meio-campistas': ['Volante', 'Meio-campista', 'Meia'],
                'Atacantes': 'Atacante',
              };
              const filtro = posMap[pos];
              const lista = JOGADORES.filter(j => Array.isArray(filtro) ? filtro.includes(j.pos) : j.pos === filtro);
              return (
                <div key={pos} style={{ marginBottom: '32px' }}>
                  <h3 style={{ color: '#009c3b', fontSize: '16px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>{pos}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                    {lista.map((j, ji) => (
                      <button
                        key={ji}
                        onClick={() => setJogador(j)}
                        style={{
                          background: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '12px',
                          padding: '16px 12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          color: '#fff',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0d2a0d'; e.currentTarget.style.borderColor = '#009c3b'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333'; }}
                      >
                        <img
                          src={j.foto || avatarUrl(j.nome)}
                          alt={j.nome}
                          onError={(e)=>{e.currentTarget.src=avatarUrl(j.nome)}} style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px solid #ffdf00', margin: '0 auto 12px', display: 'block', objectFit: 'cover', objectPosition: 'top' }}
                        />
                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', lineHeight: '1.2' }}>{j.nome}</div>
                        <div style={{ color: '#009c3b', fontSize: '11px', fontWeight: 600 }}>{j.pos}</div>
                        <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>{j.clube}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL JOGADOR */}
      {jogador && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setJogador(null)}
        >
          <div
            style={{ background: '#1a1a1a', borderRadius: '16px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ background: 'linear-gradient(135deg, #009c3b, #006828)', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={avatarUrl(jogador.nome)}
                alt={jogador.nome}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #ffdf00', flexShrink: 0, objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 900, fontSize: '22px', marginBottom: '4px' }}>{jogador.nome}</div>
                <div style={{ color: '#a8e6c1', fontSize: '14px' }}>{jogador.pos} · {jogador.clube}</div>
                <div style={{ color: '#a8e6c1', fontSize: '13px', marginTop: '2px' }}>Nascimento: {jogador.nascimento}</div>
              </div>
              <button onClick={() => setJogador(null)} style={{ marginLeft: 'auto', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>x</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[['Caps', jogador.caps], ['Gols', jogador.gols], ['Camisa', '#' + jogador.num], ['Copa 2026', 'Convocado']].map(([label, val]) => (
                  <div key={label} style={{ background: '#111', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: '20px', color: '#ffdf00' }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Perfil</h4>
                <p style={{ color: '#ccc', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>{jogador.bio}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Carreira</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {jogador.carreira.map((c, ci) => (
                    <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px' }}>
                      <span style={{ color: '#009c3b', fontWeight: 700, flexShrink: 0 }}>▶</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#009c3b', margin: '0 0 8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Títulos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {jogador.titulos.map((t, ti) => (
                    <div key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#ccc', fontSize: '14px' }}>
                      <span style={{ color: '#ffdf00', flexShrink: 0 }}>★</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
