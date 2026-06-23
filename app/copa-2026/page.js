'use client';

import { useState } from 'react';

// ── DATA ─────────────────────────────────────────────────────────────────────

const TODAY_GAMES = [
  {
    id: 1,
    time: '15:00',
    home: { name: 'Portugal', flag: '🇵🇹' },
    away: { name: 'Rep. Tcheca', flag: '🇨🇿' },
    stadium: 'Levi\'s Stadium',
    city: 'Santa Clara, CA',
    score: null,
  },
  {
    id: 2,
    time: '15:00',
    home: { name: 'Turquia', flag: '🇹🇷' },
    away: { name: 'Geórgia', flag: '🇬🇪' },
    stadium: 'AT&T Stadium',
    city: 'Arlington, TX',
    score: null,
  },
  {
    id: 3,
    time: '19:00',
    home: { name: 'Marrocos', flag: '🇲🇦' },
    away: { name: 'Zâmbia', flag: '🇿🇲' },
    stadium: 'SoFi Stadium',
    city: 'Inglewood, CA',
    score: null,
  },
  {
    id: 4,
    time: '19:00',
    home: { name: 'Colômbia', flag: '🇨🇴' },
    away: { name: 'Senegal', flag: '🇸🇳' },
    stadium: 'Hard Rock Stadium',
    city: 'Miami, FL',
    score: null,
  },
];

const GROUPS = [
  {
    letter: 'A',
    teams: [
      { name: 'Estados Unidos', flag: '🇺🇸', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 1 },
      { name: 'Panamá',         flag: '🇵🇦', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
      { name: 'Bolívia',        flag: '🇧🇴', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 4 },
    ],
  },
  {
    letter: 'B',
    teams: [
      { name: 'México',   flag: '🇲🇽', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
      { name: 'Equador',  flag: '🇪🇨', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 2, ga: 1 },
      { name: 'Jamaica',  flag: '🇯🇲', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 3 },
    ],
  },
  {
    letter: 'C',
    teams: [
      { name: 'Argentina', flag: '🇦🇷', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 6, ga: 1 },
      { name: 'Canadá',    flag: '🇨🇦', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
      { name: 'Chile',     flag: '🇨🇱', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
      { name: 'Peru',      flag: '🇵🇪', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 5 },
    ],
  },
  {
    letter: 'D',
    teams: [
      { name: 'Brasil',    flag: '🇧🇷', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 0 },
      { name: 'Colômbia',  flag: '🇨🇴', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 2 },
      { name: 'Costa Rica',flag: '🇨🇷', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 1, ga: 2 },
      { name: 'Paraguai',  flag: '🇵🇾', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 4 },
    ],
  },
  {
    letter: 'E',
    teams: [
      { name: 'Espanha',     flag: '🇪🇸', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 7, ga: 1 },
      { name: 'Portugal',    flag: '🇵🇹', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 4, ga: 2 },
      { name: 'Turquia',     flag: '🇹🇷', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
      { name: 'Rep. Tcheca', flag: '🇨🇿', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 8 },
    ],
  },
  {
    letter: 'F',
    teams: [
      { name: 'França',   flag: '🇫🇷', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 5, ga: 0 },
      { name: 'Marrocos', flag: '🇲🇦', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 2 },
      { name: 'Polônia',  flag: '🇵🇱', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 2, ga: 3 },
      { name: 'Zâmbia',   flag: '🇿🇲', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 0, ga: 4 },
    ],
  },
  {
    letter: 'G',
    teams: [
      { name: 'Inglaterra',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 3, ga: 1 },
      { name: 'Países Baixos',flag: '🇳🇱', pts: 4, pj: 2, v: 1, e: 1, d: 0, gf: 2, ga: 1 },
      { name: 'Sérvia',      flag: '🇷🇸', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 2 },
      { name: 'Senegal',     flag: '🇸🇳', pts: 1, pj: 2, v: 0, e: 1, d: 1, gf: 1, ga: 3 },
    ],
  },
  {
    letter: 'H',
    teams: [
      { name: 'Alemanha',    flag: '🇩🇪', pts: 6, pj: 2, v: 2, e: 0, d: 0, gf: 6, ga: 1 },
      { name: 'Japão',       flag: '🇯🇵', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
      { name: 'Coreia do Sul',flag: '🇰🇷', pts: 3, pj: 2, v: 1, e: 0, d: 1, gf: 3, ga: 3 },
      { name: 'Gana',        flag: '🇬🇭', pts: 0, pj: 2, v: 0, e: 0, d: 2, gf: 1, ga: 6 },
    ],
  },
];

const BRAZIL_PLAYERS = [
  // Goleiros
  {
    id: 1, name: 'Alisson Becker', short: 'Alisson', position: 'Goleiro', club: 'Liverpool',
    number: 1, age: 33, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Alisson+Becker&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Internacional', years: '2013–2016' },
      { club: 'Roma', years: '2016–2018' },
      { club: 'Liverpool', years: '2018–presente' },
    ],
    caps: 72, goals: 0, copa2026: 2,
    trophies: ['Premier League 2020', 'Champions League 2019', 'Copa do Mundo 2022 (vice)'],
    bio: 'Considerado um dos maiores goleiros da história do futebol, Alisson combina reflexos excepcionais com bom jogo com os pés. Sua liderança e serenidade são fundamentais para a Seleção.'
  },
  {
    id: 2, name: 'Ederson Moraes', short: 'Ederson', position: 'Goleiro', club: 'Manchester City',
    number: 23, age: 31, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Ederson+Moraes&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Ribeirão', years: '2011–2012' },
      { club: 'Benfica', years: '2012–2017' },
      { club: 'Manchester City', years: '2017–presente' },
    ],
    caps: 41, goals: 0, copa2026: 1,
    trophies: ['Premier League (x7)', 'Champions League 2023', 'Treble 2023'],
    bio: 'Reserva de luxo, Ederson é reconhecido por sua habilidade com os pés, quase como um líbero extra. Peça vital no sistema de Guardiola no City por anos.'
  },
  {
    id: 3, name: 'Bento', short: 'Bento', position: 'Goleiro', club: 'Al-Nassr',
    number: 12, age: 25, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Bento&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Athletico Paranaense', years: '2019–2023' },
      { club: 'Al-Nassr', years: '2023–presente' },
    ],
    caps: 14, goals: 0, copa2026: 0,
    trophies: ['Copa Libertadores 2022'],
    bio: 'Goleiro jovem e talentoso que se destacou no Athletico-PR. No Al-Nassr aprimorou sua experiência internacional e chega como terceiro goleiro mas com grande potencial.'
  },
  // Zagueiros
  {
    id: 4, name: 'Marquinhos', short: 'Marquinhos', position: 'Zagueiro', club: 'PSG',
    number: 4, age: 30, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Marquinhos&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Corinthians', years: '2011–2013' },
      { club: 'Roma', years: '2012–2013' },
      { club: 'PSG', years: '2013–presente' },
    ],
    caps: 90, goals: 6, copa2026: 2,
    trophies: ['Ligue 1 (x8)', 'Copa da França (x7)', 'Vice Copa do Mundo 2022'],
    bio: 'Capitão da Seleção Brasileira, Marquinhos é um dos zagueiros mais completos do mundo. Liderança, posicionamento e leitura de jogo impecável são suas marcas registradas.'
  },
  {
    id: 5, name: 'Gabriel Magalhães', short: 'Gabriel', position: 'Zagueiro', club: 'Arsenal',
    number: 3, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Gabriel+Magalhaes&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Avaí', years: '2015–2017' },
      { club: 'Dinamo Zagreb', years: '2017–2019' },
      { club: 'Lille', years: '2019–2020' },
      { club: 'Arsenal', years: '2020–presente' },
    ],
    caps: 28, goals: 3, copa2026: 2,
    trophies: ['Copa do Brasil', 'FA Cup 2025'],
    bio: 'Zagueiro físico e agressivo, Gabriel Magalhães se firmou como titular no Arsenal e na Seleção. Sua força no duelo aéreo e capacidade de pressionar saem do padrão para a posição.'
  },
  {
    id: 6, name: 'Bremer', short: 'Bremer', position: 'Zagueiro', club: 'Juventus',
    number: 14, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Bremer&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Atlético MG', years: '2014–2021' },
      { club: 'Torino', years: '2018–2022' },
      { club: 'Juventus', years: '2022–presente' },
    ],
    caps: 21, goals: 1, copa2026: 2,
    trophies: ['Série A 2022-23', 'Copa Brasil 2021'],
    bio: 'Um dos melhores zagueiros da Serie A italiana, Bremer impressiona pela marcação individual, velocidade e qualidade no jogo aéreo. Chegou à Copa em excelente forma.'
  },
  {
    id: 7, name: 'Lucas Beraldo', short: 'Beraldo', position: 'Zagueiro', club: 'PSG',
    number: 24, age: 20, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Lucas+Beraldo&background=009c3b&color=fff&size=200',
    career: [
      { club: 'São Paulo', years: '2022–2024' },
      { club: 'PSG', years: '2024–presente' },
    ],
    caps: 8, goals: 0, copa2026: 1,
    trophies: ['Copa do Brasil 2023'],
    bio: 'Joia da nova geração brasileira, Beraldo transferiu-se para o PSG com apenas 20 anos. Zagueiro completo, tem ótima saída de bola e leitura de jogo avançada para a idade.'
  },
  // Laterais
  {
    id: 8, name: 'Danilo', short: 'Danilo', position: 'Lateral Direito', club: 'Juventus',
    number: 2, age: 33, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Danilo&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Santos', years: '2009–2012' },
      { club: 'Porto', years: '2012–2015' },
      { club: 'Real Madrid', years: '2015–2017' },
      { club: 'Manchester City', years: '2017–2019' },
      { club: 'Juventus', years: '2019–presente' },
    ],
    caps: 93, goals: 6, copa2026: 2,
    trophies: ['Champions League 2016, 2018', 'Premier League 2019', 'Copa América 2019'],
    bio: 'Danilo é um dos jogadores mais experientes da Seleção. Pode atuar como lateral-direito ou lateral-esquerdo, além de zagueiro em emergências. Sua experiência em grandes clubes é inestimável.'
  },
  {
    id: 9, name: 'Vanderson', short: 'Vanderson', position: 'Lateral Direito', club: 'Monaco',
    number: 22, age: 23, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Vanderson&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Grêmio', years: '2019–2022' },
      { club: 'Monaco', years: '2022–presente' },
    ],
    caps: 19, goals: 2, copa2026: 2,
    trophies: ['Série A 2022 (Monaco)'],
    bio: 'Lateral veloz e explosivo, Vanderson surgiu no Grêmio e rapidamente conquistou o Monaco com suas subidas pelo lado direito. Criativo e destemido, é o futuro da posição na Seleção.'
  },
  {
    id: 10, name: 'Alex Telles', short: 'Alex Telles', position: 'Lateral Esquerdo', club: 'Sevilla',
    number: 6, age: 33, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Alex+Telles&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Juventude', years: '2012–2014' },
      { club: 'Galatasaray', years: '2014–2016' },
      { club: 'Inter de Milão', years: '2016–2017' },
      { club: 'Porto', years: '2017–2020' },
      { club: 'Manchester United', years: '2020–2023' },
      { club: 'Sevilla', years: '2023–presente' },
    ],
    caps: 26, goals: 3, copa2026: 1,
    trophies: ['Liga NOS 2019-20', 'UEFA Europa League 2023'],
    bio: 'Alex Telles é conhecido por seus cruzamentos precisos e potência no chute. Veterano com passagem por grandes clubes europeus, aporta experiência e qualidade ofensiva na lateral esquerda.'
  },
  {
    id: 11, name: 'Guilherme Arana', short: 'Arana', position: 'Lateral Esquerdo', club: 'Atlético MG',
    number: 16, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Guilherme+Arana&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Corinthians', years: '2015–2018' },
      { club: 'Sevilla', years: '2017–2019' },
      { club: 'Atalanta', years: '2019–2021' },
      { club: 'Atlético MG', years: '2021–presente' },
    ],
    caps: 23, goals: 1, copa2026: 2,
    trophies: ['Brasileirão 2021', 'Copa do Brasil 2021'],
    bio: 'Arana retornou ao Brasil e se tornou um dos melhores laterais-esquerdos do continente. Versátil, combina bem no setor ofensivo e defensivo, e chega à Copa como titular consolidado.'
  },
  // Meio-campistas
  {
    id: 12, name: 'Casemiro', short: 'Casemiro', position: 'Volante', club: 'Manchester United',
    number: 5, age: 34, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Casemiro&background=009c3b&color=fff&size=200',
    career: [
      { club: 'São Paulo', years: '2011–2013' },
      { club: 'Real Madrid', years: '2013–2022' },
      { club: 'Manchester United', years: '2022–presente' },
    ],
    caps: 83, goals: 8, copa2026: 2,
    trophies: ['Champions League 2016, 2017, 2018, 2022', 'La Liga (x4)', 'Copa América 2019'],
    bio: 'Um dos maiores volantes da história do futebol mundial, Casemiro é a espinha dorsal do meio-campo brasileiro. Sua capacidade de recuperar a bola e distribuir com precisão o torna insubstituível.'
  },
  {
    id: 13, name: 'Bruno Guimarães', short: 'Bruno G.', position: 'Meio-campista', club: 'Newcastle',
    number: 15, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Bruno+Guimaraes&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Athletico Paranaense', years: '2018–2020' },
      { club: 'Lyon', years: '2020–2022' },
      { club: 'Newcastle United', years: '2022–presente' },
    ],
    caps: 42, goals: 6, copa2026: 2,
    trophies: ['Copa do Brasil 2019', 'Carabao Cup 2025'],
    bio: 'Bruno Guimarães tornou-se o coração do Newcastle e da Seleção. Combina garra, técnica e visão de jogo excepcionais. Está na melhor fase da carreira chegando a esta Copa.'
  },
  {
    id: 14, name: 'Gerson', short: 'Gerson', position: 'Meio-campista', club: 'Flamengo',
    number: 8, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Gerson&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Fluminense', years: '2014–2019' },
      { club: 'Fiorentina', years: '2016–2017' },
      { club: 'Roma', years: '2017–2019' },
      { club: 'Olympique de Marseille', years: '2019–2022' },
      { club: 'Flamengo', years: '2022–presente' },
    ],
    caps: 31, goals: 4, copa2026: 2,
    trophies: ['Brasileirão 2022, 2023', 'Copa Libertadores 2022'],
    bio: 'Gerson é o maestro do Flamengo e vem crescendo na Seleção. Seu passe longo, visão de jogo e capacidade de dominar o meio-campo o tornaram peça fundamental no esquema tático do treinador.'
  },
  {
    id: 15, name: 'Lucas Paquetá', short: 'Paquetá', position: 'Meia', club: 'West Ham',
    number: 10, age: 28, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Lucas+Paqueta&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Flamengo', years: '2016–2019' },
      { club: 'AC Milan', years: '2019–2020' },
      { club: 'Lyon', years: '2020–2022' },
      { club: 'West Ham', years: '2022–presente' },
    ],
    caps: 62, goals: 11, copa2026: 2,
    trophies: ['Brasileirão 2019', 'Copa América 2021'],
    bio: 'Com a camisa 10, Paquetá é a referência criativa do Brasil. Versátil, joga por dentro com elegância e cria desequilíbrio constante. Artilheiro e assistente ao mesmo tempo, é o cérebro do ataque.'
  },
  {
    id: 16, name: 'Andreas Pereira', short: 'Andreas', position: 'Meia', club: 'Fulham',
    number: 18, age: 29, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Andreas+Pereira&background=009c3b&color=fff&size=200',
    career: [
      { club: 'PSV', years: '2012–2014' },
      { club: 'Manchester United', years: '2014–2023' },
      { club: 'Lazio', years: '2018–2019' },
      { club: 'Flamengo', years: '2020–2022' },
      { club: 'Fulham', years: '2023–presente' },
    ],
    caps: 22, goals: 3, copa2026: 1,
    trophies: ['Brasileirão 2020', 'Copa do Brasil 2022'],
    bio: 'Andreas Pereira é a opção de luxo no meio. Com boa técnica e capacidade de jogar em diversas funções do meio-campo, é uma alternativa tática valiosa para o treinador.'
  },
  // Atacantes
  {
    id: 17, name: 'Vinícius Júnior', short: 'Vini Jr.', position: 'Ponta Esquerda', club: 'Real Madrid',
    number: 7, age: 25, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Vinicius+Junior&background=FFDF00&color=009c3b&size=200',
    career: [
      { club: 'Flamengo', years: '2016–2018' },
      { club: 'Real Madrid', years: '2018–presente' },
    ],
    caps: 71, goals: 25, copa2026: 2,
    trophies: ['Champions League 2022, 2024', 'La Liga (x3)', 'Copa América 2021', 'Ballon d\'Or 2024'],
    bio: 'Melhor jogador do mundo em 2024, Vinícius Júnior é o grande astro desta Copa. Sua velocidade, drible e instinto goleador são incomparáveis. Quando ele está em dia, o Brasil é invencível.'
  },
  {
    id: 18, name: 'Rodrygo Goes', short: 'Rodrygo', position: 'Ponta Direita', club: 'Real Madrid',
    number: 11, age: 25, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Rodrygo+Goes&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Santos', years: '2017–2019' },
      { club: 'Real Madrid', years: '2019–presente' },
    ],
    caps: 58, goals: 18, copa2026: 2,
    trophies: ['Champions League 2022, 2024', 'La Liga (x3)', 'Copa América 2021'],
    bio: 'Parceiro de Vini Jr. no Real Madrid e na Seleção, Rodrygo é o jogador dos grandes momentos. Frio, técnico e com capacidade de decidir partidas nas horas cruciais.'
  },
  {
    id: 19, name: 'Raphinha', short: 'Raphinha', position: 'Ponta', club: 'Barcelona',
    number: 26, age: 29, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Raphinha&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Vitória SC', years: '2015–2018' },
      { club: 'Rennes', years: '2018–2020' },
      { club: 'Leeds United', years: '2020–2022' },
      { club: 'Barcelona', years: '2022–presente' },
    ],
    caps: 49, goals: 15, copa2026: 2,
    trophies: ['La Liga 2023', 'Copa do Brasil 2019 (Vitória)'],
    bio: 'Raphinha chegou ao Barça e foi revelação da temporada. Dribla pela direita ou esquerda com facilidade, tem chute potente e assistência precisa. Peça chave no ataque multiface do Brasil.'
  },
  {
    id: 20, name: 'Endrick Felipe', short: 'Endrick', position: 'Centroavante', club: 'Real Madrid',
    number: 9, age: 18, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Endrick+Felipe&background=FFDF00&color=009c3b&size=200',
    career: [
      { club: 'Palmeiras', years: '2023–2024' },
      { club: 'Real Madrid', years: '2024–presente' },
    ],
    caps: 17, goals: 7, copa2026: 2,
    trophies: ['Brasileirão 2023, 2024', 'Supercopa 2025'],
    bio: 'A grande joia do futebol mundial, Endrick chegou ao Real Madrid aos 18 anos e já mostra seu talento excepcional. Na Seleção marca sempre em jogos grandes. Esta Copa pode ser a consagração de uma geração.'
  },
  {
    id: 21, name: 'Gabriel Martinelli', short: 'Martinelli', position: 'Ponta', club: 'Arsenal',
    number: 21, age: 24, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Gabriel+Martinelli&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Ituano', years: '2019' },
      { club: 'Arsenal', years: '2019–presente' },
    ],
    caps: 33, goals: 9, copa2026: 2,
    trophies: ['FA Cup 2025', 'Community Shield 2023'],
    bio: 'Martinelli é velocidade e gol. No Arsenal, tornou-se um dos mais consistentes atacantes da Premier League. Na Seleção, traz energia, pressão e faro do gol fundamental para o sistema do Brasil.'
  },
  {
    id: 22, name: 'Richarlison', short: 'Richarlison', position: 'Atacante', club: 'Tottenham',
    number: 19, age: 29, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Richarlison&background=009c3b&color=fff&size=200',
    career: [
      { club: 'América MG', years: '2015–2017' },
      { club: 'Watford', years: '2017–2018' },
      { club: 'Everton', years: '2018–2022' },
      { club: 'Tottenham', years: '2022–presente' },
    ],
    caps: 65, goals: 22, copa2026: 2,
    trophies: ['Copa América 2019', 'Olympic Gold 2021'],
    bio: 'Garra, entrega e gols — Richarlison personifica o espírito brasileiro. Herói em Tóquio 2021 e com gols memoráveis em Copas anteriores, é peça tática versátil que pode atuar em diversas posições ofensivas.'
  },
  {
    id: 23, name: 'Gabriel Jesus', short: 'G. Jesus', position: 'Centroavante', club: 'Arsenal',
    number: 13, age: 27, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Gabriel+Jesus&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Palmeiras', years: '2014–2017' },
      { club: 'Manchester City', years: '2017–2022' },
      { club: 'Arsenal', years: '2022–presente' },
    ],
    caps: 66, goals: 19, copa2026: 1,
    trophies: ['Copa América 2019', 'Premier League (x5)', 'Brasileirão 2016'],
    bio: 'Versátil, trabalha muito e sempre corre para a equipe. Gabriel Jesus é o 9 que todo técnico quer — pressiona, abre espaço e sabe finalizar. Sua experiência em grandes clubes é fundamental.'
  },
  {
    id: 24, name: 'Savinho', short: 'Savinho', position: 'Ponta Direita', club: 'Manchester City',
    number: 20, age: 21, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Savinho&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Atlético MG', years: '2022–2023' },
      { club: 'Girona', years: '2023–2024' },
      { club: 'Manchester City', years: '2024–presente' },
    ],
    caps: 12, goals: 3, copa2026: 1,
    trophies: ['Brasileirão 2021', 'Copa do Brasil 2021'],
    bio: 'Um dos jovens mais promissores do futebol mundial, Savinho brilhou no Girona antes de se transferir para o City. Extremo veloz e criativo, pode desequilibrar qualquer defesa com sua habilidade.'
  },
  {
    id: 25, name: 'Antony', short: 'Antony', position: 'Ponta Direita', club: 'Manchester United',
    number: 25, age: 25, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Antony&background=009c3b&color=fff&size=200',
    career: [
      { club: 'São Paulo', years: '2018–2020' },
      { club: 'Ajax', years: '2020–2022' },
      { club: 'Manchester United', years: '2022–presente' },
    ],
    caps: 34, goals: 7, copa2026: 1,
    trophies: ['Eredivisie 2021, 2022', 'Copa do Brasil 2019'],
    bio: 'Antony trouxe seu estilo único ao United. Dribla pelo lado direito com sua técnica característica de envolver o defensor. Quando em forma, é capaz de jogadas de altíssimo nível.'
  },
  {
    id: 26, name: 'Gabigol', short: 'Gabigol', position: 'Centroavante', club: 'Cruzeiro',
    number: 17, age: 30, flag: '🇧🇷',
    photo: 'https://ui-avatars.com/api/?name=Gabigol&background=009c3b&color=fff&size=200',
    career: [
      { club: 'Santos', years: '2013–2016' },
      { club: 'Internazionale', years: '2016–2019' },
      { club: 'Benfica', years: '2018' },
      { club: 'Flamengo', years: '2019–2024' },
      { club: 'Cruzeiro', years: '2024–presente' },
    ],
    caps: 38, goals: 10, copa2026: 2,
    trophies: ['Copa Libertadores 2019, 2022', 'Brasileirão 2019, 2020', 'Copa América 2019'],
    bio: 'Herói do Flamengo em duas Libertadores históricas, Gabigol é o jogador dos momentos decisivos. No Cruzeiro reencontrou o bom futebol e chega a esta Copa com sede de revanche e glória.'
  },
];

// ── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

function GameCard({ game }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a2f1a 0%, #0d3d22 100%)',
      border: '1px solid rgba(255, 223, 0, 0.3)',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,223,0,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Time badge */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{
          background: 'rgba(255,223,0,0.15)',
          border: '1px solid rgba(255,223,0,0.4)',
          color: '#FFDF00',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '1px',
        }}>
          ⏵ {game.time} BRT
        </span>
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        {/* Home */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>{game.home.flag}</div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{game.home.name}</div>
        </div>

        {/* Score or VS */}
        <div style={{ minWidth: '80px', textAlign: 'center' }}>
          {game.score ? (
            <div style={{ color: '#FFDF00', fontSize: '28px', fontWeight: '900' }}>{game.score}</div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '22px', fontWeight: '700' }}>vs</div>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '42px', marginBottom: '6px' }}>{game.away.flag}</div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>{game.away.name}</div>
        </div>
      </div>

      {/* Stadium */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '10px',
        textAlign: 'center',
      }}>
        <div style={{ color: '#FFDF00', fontSize: '13px', fontWeight: '600' }}>
          🏟 {game.stadium}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
          📍 {game.city}
        </div>
      </div>
    </div>
  );
}

function GroupTable({ group }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a2f1a 0%, #0d3d22 100%)',
      border: '1px solid rgba(255,223,0,0.2)',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #006400, #009c3b)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          background: '#FFDF00',
          color: '#006400',
          fontWeight: '900',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}>{group.letter}</span>
        <span style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Grupo {group.letter}</span>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 36px 36px 30px 30px 30px 36px 36px 36px',
        padding: '6px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.45)',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.5px',
      }}>
        <span>SELEÇÃO</span>
        <span style={{ textAlign: 'center' }}>Pts</span>
        <span style={{ textAlign: 'center' }}>PJ</span>
        <span style={{ textAlign: 'center' }}>V</span>
        <span style={{ textAlign: 'center' }}>E</span>
        <span style={{ textAlign: 'center' }}>D</span>
        <span style={{ textAlign: 'center' }}>GF</span>
        <span style={{ textAlign: 'center' }}>GA</span>
        <span style={{ textAlign: 'center' }}>SG</span>
      </div>

      {/* Rows */}
      {group.teams.map((t, i) => (
        <div key={t.name} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 36px 36px 30px 30px 30px 36px 36px 36px',
          padding: '10px 16px',
          alignItems: 'center',
          borderBottom: i < group.teams.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          background: i < 2 ? 'rgba(255,223,0,0.04)' : 'transparent',
          transition: 'background 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              color: i < 2 ? '#FFDF00' : 'rgba(255,255,255,0.3)',
              fontSize: '11px',
              fontWeight: '700',
              width: '16px',
            }}>{i + 1}</span>
            <span style={{ fontSize: '18px' }}>{t.flag}</span>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: i === 0 ? '700' : '500' }}>{t.name}</span>
          </div>
          <span style={{ textAlign: 'center', color: '#FFDF00', fontWeight: '800', fontSize: '14px' }}>{t.pts}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.pj}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.v}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.e}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.d}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.gf}</span>
          <span style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{t.ga}</span>
          <span style={{ textAlign: 'center', color: t.gf - t.ga > 0 ? '#4ade80' : t.gf - t.ga < 0 ? '#f87171' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>
            {t.gf - t.ga > 0 ? '+' : ''}{t.gf - t.ga}
          </span>
        </div>
      ))}
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  return (
    <div
      onClick={() => onClick(player)}
      style={{
        background: 'linear-gradient(135deg, #0a2f1a 0%, #0d3d22 100%)',
        border: '1px solid rgba(255,223,0,0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,223,0,0.2)';
        e.currentTarget.style.borderColor = 'rgba(255,223,0,0.6)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(255,223,0,0.2)';
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative' }}>
        <img
          src={player.photo}
          alt={player.name}
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(player.short) + '&background=009c3b&color=fff&size=200'; }}
        />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.7)',
          color: '#FFDF00',
          fontWeight: '900',
          fontSize: '13px',
          padding: '3px 8px',
          borderRadius: '8px',
          border: '1px solid rgba(255,223,0,0.3)',
        }}>
          #{player.number}
        </div>
      </div>

      {/* Info */}
      <div style={{ paddingn style={{ color: '#fff', fontSize: '13px' }}>{c.club}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{c.years}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trophies */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#FFDF00', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '12px' }}>
            CONQUISTAS
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {player.trophies.map((t, i) => (
              <div key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#FFDF00' }}>🏆</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,223,0,0.15)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <h4 style={{ color: '#FFDF00', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '8px' }}>
            PERFIL
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            {player.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function Copa2026Page() {
  const [activeTab, setActiveTab] = useState('jogos');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const tabs = [
    { id: 'jogos', label: '⚽ Jogos de Hoje' },
    { id: 'grupos', label: '📊 Grupos' },
    { id: 'analise', label: '🇧🇷 Análise' },
    { id: 'jogadores', label: '👥 Jogadores' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #051a0d 0%, #071f10 40%, #051a0d 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(180deg, #004d20 0%, #006400 50%, transparent 100%)',
        padding: '48px 24px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,223,0,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(0,156,59,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '16px', letterSpacing: '4px', color: 'rgba(255,223,0,0.7)', fontWeight: '700', marginBottom: '8px' }}>
            FIFA WORLD CUP 2026
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 72px)',
            fontWeight: '900',
            margin: '0 0 8px',
            background: 'linear-gradient(135deg, #FFDF00, #fff 50%, #FFDF00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}>
            COPA 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: '8px 0 0' }}>
            23 de junho de 2026 • Acompanhe ao vivo
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5,26,13,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,223,0,0.15)',
        padding: '0 24px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(255,223,0,0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #FFDF00' : '3px solid transparent',
              color: activeTab === tab.id ? '#FFDF00' : 'rgba(255,255,255,0.55)',
              padding: '16px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '700' : '500',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── JOGOS DE HOJE ── */}
        {activeTab === 'jogos' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ color: '#FFDF00', fontSize: '24px', fontWeight: '900', margin: '0 0 4px' }}>
                Jogos de Hoje
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                Segunda-feira, 23 de junho de 2026 • Horário de Brasília (BRT / UTC-3)
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {TODAY_GAMES.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* Live info note */}
            <div style={{
              marginTop: '28px',
              background: 'rgba(255,223,0,0.06)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '20px' }}>📡</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Todos os jogos de hoje são decisivos para a classificação. O grupo E define-se com Portugal x Rep. Tcheca e Turquia x Geórgia disputando as vagas. No grupo F, Marrocos e Colômbia buscam vantagem.
              </span>
            </div>
          </div>
        )}

        {/* ── GRUPOS ── */}
        {activeTab === 'grupos' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ color: '#FFDF00', fontSize: '24px', fontWeight: '900', margin: '0 0 4px' }}>
                Classificação dos Grupos
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                Copa do Mundo 2026 • 2ª Rodada completa
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '20px',
            }}>
              {GROUPS.map(group => (
                <GroupTable key={group.letter} group={group} />
              ))}
            </div>

            <div style={{
              marginTop: '20px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              padding: '16px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', background: 'rgba(255,223,0,0.2)', borderRadius: '2px' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Classificado para as oitavas</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ANÁLISE ── */}
        {activeTab === 'analise' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ color: '#FFDF00', fontSize: '24px', fontWeight: '900', margin: '0 0 4px' }}>
                Análise do Caminho do Brasil
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                Projeção baseada nos resultados até 23/06/2026
              </p>
            </div>

            {/* Brazil group position */}
            <div style={{
              background: 'linear-gradient(135deg, #006400 0%, #009c3b 100%)',
              borderRadius: '20px',
              padding: '28px',
              marginBottom: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                fontSize: '120px',
                opacity: 0.08,
              }}>🇧🇷</div>
              <h3 style={{ color: '#FFDF00', fontSize: '18px', fontWeight: '800', margin: '0 0 12px', position: 'relative' }}>
                🥇 Grupo D — Brasil na Liderança
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', margin: 0, position: 'relative' }}>
                Com duas vitórias e saldo de gols expressivo (+5), o Brasil domina o Grupo D com 6 pontos. A Seleção não sofreu gols sequer, demonstrando solidez defensiva impecável. Vinícius Jr. e Endrick brilharam nas duas partidas, confirmando o favoritismo da equipe. Com a classificação já garantida matematicamente, o técnico pode preservar titulares na última rodada.
              </p>
            </div>

            {/* Round of 16 */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                ⚔️ Oitavas de Final — Adversário Provável: Canadá
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                O Grupo C aponta o Canadá como segundo colocado atrás da Argentina. A seleção canadense é organizada taticamente, com Jesse Marsch montando um bloco compacto, mas não tem qualidade individual para deter a velocidade brasileira. Histórico recente favorece o Brasil com confortável vantagem. Espera-se vitória por 2 ou 3 gols de diferença, com Vini Jr. e Rodrygo sendo os grandes destaques da partida.
              </p>
            </div>

            {/* Quarterfinals */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                🏆 Quartas de Final — Possível Confronto com Argentina ou EUA
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                As quartas podem trazer o clássico Brasil vs. Argentina, um dos maiores confrontos do futebol mundial. Com a Argentina de Messi e Scaloni também voando na competição, seria um espetáculo sem igual. Alternativamente, uma seleção dos Estados Unidos motivada em casa poderia ser o adversário. Para o Brasil, a qualidade técnica e a experiência da equipe devem prevalecer em ambos os cenários. Casemiro e Bruno Guimarães precisarão neutralizar o meio-campo adversário com maestria.
              </p>
            </div>

            {/* Semi/Final */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                🌟 Semi e Final — Chave Potencial: Espanha ou França
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                Uma semifinal contra a Espanha seria um confronto de estilos: o jogo posicional espanhol contra a transição vertical brasileira. Já a França de Mbappé e Deschamps mantém-se como uma das favoritas absolutas. O caminho até a final passa pelo mais difícil, mas o elenco brasileiro 2026 é considerado o mais talentoso desde 2002. Uma possível final Brasil x Espanha ou Brasil x Alemanha seria o encerramento perfeito de uma Copa realizada no continente americano.
              </p>
            </div>

            {/* Overall */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,223,0,0.1), rgba(0,100,0,0.3))',
              border: '2px solid rgba(255,223,0,0.4)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                💛💚 Avaliação Final — O Brasil é o Favorito
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', margin: 0 }}>
                Esta é a Copa do Mundo mais equilibrada em anos, mas o Brasil chega 2026 como o time mais completo. Com o melhor jogador do mundo (Vinicius Jr.), uma revelação histórica (Endrick), um meio-campo de elite (Casemiro + Bruno Guimarães) e a mais sólida defesa do torneio, a Seleção tem todas as ferramentas para conquistar o inédito hexacampeonato. A sexta estrela aguarda — e o momento é agora.
              </p>
            </div>
          </div>
        )}

        {/* ── JOGADORES ── */}
        {activeTab === 'jogadores' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ color: '#FFDF00', fontSize: '24px', fontWeight: '900', margin: '0 0 4px' }}>
                Galeria da Seleção Brasileira
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                26 jogadores convocados • Clique em um jogador para ver o perfil completo
              </p>
            </div>

            {/* Positions */}
            {[
              { label: 'GOLEIROS', filter: 'Goleiro' },
              { label: 'ZAGUEIROS', filter: 'Zagueiro' },
              { label: 'LATERAIS', filter: t => t.includes('Lateral') },
              { label: 'MEIO-CAMPISTAS', filter: t => ['Volante','Meio-campista','Meia'].includes(t) },
              { label: 'ATACANTES', filter: t => ['Ponta Esquerda','Ponta Direita','Ponta','Centroavante','Atacante'].includes(t) },
            ].map(section => {
              const players = BRAZIL_PLAYERS.filter(p =>
                typeof section.filter === 'string'
                  ? p.position === section.filter
                  : section.filter(p.position)
  #olor: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                ⚔️ Oitavas de Final — Adversário Provável: Canadá
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                O Grupo C aponta o Canadá como segundo colocado atrás da Argentina. A seleção canadense é organizada taticamente, com Jesse Marsch montando um bloco compacto, mas não tem qualidade individual para deter a velocidade brasileira. Histórico recente favorece o Brasil com confortável vantagem. Espera-se vitória por 2 ou 3 gols de diferença, com Vini Jr. e Rodrygo sendo os grandes destaques da partida.
              </p>
            </div>

            {/* Quarterfinals */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                🏆 Quartas de Final — Possível Confronto com Argentina ou EUA
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                As quartas podem trazer o clássico Brasil vs. Argentina, um dos maiores confrontos do futebol mundial. Com a Argentina de Messi e Scaloni também voando na competição, seria um espetáculo sem igual. Alternativamente, uma seleção dos Estados Unidos motivada em casa poderia ser o adversário. Para o Brasil, a qualidade técnica e a experiência da equipe devem prevalecer em ambos os cenários. Casemiro e Bruno Guimarães precisarão neutralizar o meio-campo adversário com maestria.
              </p>
            </div>

            {/* Semi/Final */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,223,0,0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                🌟 Semi e Final — Chave Potencial: Espanha ou França
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0 }}>
                Uma semifinal contra a Espanha seria um confronto de estilos: o jogo posicional espanhol contra a transição vertical brasileira. Já a França de Mbappé e Deschamps mantém-se como uma das favoritas absolutas. O caminho até a final passa pelo mais difícil, mas o elenco brasileiro 2026 é considerado o mais talentoso desde 2002. Uma possível final Brasil x Espanha ou Brasil x Alemanha seria o encerramento perfeito de uma Copa realizada no continente americano.
              </p>
            </div>

            {/* Overall */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,223,0,0.1), rgba(0,100,0,0.3))',
              border: '2px solid rgba(255,223,0,0.4)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <h3 style={{ color: '#FFDF00', fontSize: '16px', fontWeight: '800', margin: '0 0 12px' }}>
                💛💚 Avaliação Final — O Brasil é o Favorito
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.7', margin: 0 }}>
                Esta é a Copa do Mundo mais equilibrada em anos, mas o Brasil chega 2026 como o time mais completo. Com o melhor jogador do mundo (Vinicius Jr.), uma revelação histórica (Endrick), um meio-campo de elite (Casemiro + Bruno Guimarães) e a mais sólida defesa do torneio, a Seleção tem todas as ferramentas para conquistar o inédito hexacampeonato. A sexta estrela aguarda — e o momento é agora.
              </p>
            </div>
          </div>
        )}

        {/* ── JOGADORES ── */}
        {activeTab === 'jogadores' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ color: '#FFDF00', fontSize: '24px', fontWeight: '900', margin: '0 0 4px' }}>
                Galeria da Seleção Brasileira
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
                26 jogadores convocados • Clique em um jogador para ver o perfil completo
              </p>
            </div>

            {/* Positions */}
            {[
              { label: 'GOLEIROS', filter: 'Goleiro' },
              { label: 'ZAGUEIROS', filter: 'Zagueiro' },
              { label: 'LATERAIS', filter: t => t.includes('Lateral') },
              { label: 'MEIO-CAMPISTAS', filter: t => ['Volante','Meio-campista','Meia'].includes(t) },
              { label: 'ATACANTES', filter: t => ['Ponta Esquerda','Ponta Direita','Ponta','Centroavante','Atacante'].includes(t) },
            ].map(section => {
              const players = BRAZIL_PLAYERS.filter(p =>
                typeof section.filter === 'string'
                  ? p.position === section.filter
                  : section.filter(p.position)
  #           );
              return (
                <div key={section.label} style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ height: '1px', flex: 0, width: '24px', background: '#FFDF00' }} />
                    <span style={{ color: '#FFDF00', fontSize: '12px', fontWeight: '800', letterSpacing: '2.5px' }}>
                      {section.label}
                    </span>
                    <div style={{ height: '1px', flex: 1, background: 'rgba(255,223,0,0.2)' }} />
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '16px',
                  }}>
                    {players.map(player => (
                      <PlayerCard key={player.id} player={player} onClick={setSelectedPlayer} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,223,0,0.1)',
        padding: '24px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '13px',
      }}>
        Copa do Mundo 2026 • Miami Brasileiro • Dados atualizados em 23/06/2026
      </div>

      {/* Player Modal */}
      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}
