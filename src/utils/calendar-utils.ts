"use client";

export const MONTHS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
];

export const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export const REFERENCE_DATE = new Date(2024, 0, 1); // Data de referência: 1º de janeiro de 2024 (cor 0 - amarelo)

export const SWIPE_THRESHOLD = 50; // Pixels para considerar um swipe

export const holidayEmojis: Record<string, string> = {
  'Ano Novo': '🍾', // Emoji atualizado aqui
  'Carnaval': '🎭',
  'Sexta-feira Santa': '✝️',
  'Páscoa': '🥚',
  'Tiradentes': '⚔️',
  'Dia do Trabalho': '💼',
  'Independência do Brasil': '🇧🇷',
  'Nossa Senhora Aparecida': '🙏',
  'Finados': '💀',
  'Proclamação da República': '🏛️',
  'Natal': '🎄',
  'Corpus Christi': '⛪',
  'Aniversário de São Paulo': '🎉',
  'Aniversário de Agudos': '🎉',
  'Dia da Consciência Negra': '✊🏿',
  'Dia do Servidor Público': '👨‍💻',
  'Revolução Constitucionalista': '⚔️',
  'Dia das Mães': '🤱',
  'Dia dos Pais': '👨‍👦',
  'Dia dos Namorados': '❤️',
  'Dia do Bombeiro': '👨‍🚒',
  'Quarta-feira de Cinzas': '⚱️'
};

export const BIRTHDAYS = [
  { month: 0, day: 14, name: 'Comandante Dias' }, // Janeiro (0)
  { month: 2, day: 2, name: 'Bombeiro Soares' },   // Março (2)
  { month: 2, day: 18, name: 'Bombeiro Eduardo' },  // Março (2)
  { month: 3, day: 19, name: 'Bombeiro Fabiano' },  // Abril (3)
  { month: 4, day: 16, name: 'Bombeiro Wolber' },   // Maio (4)
  { month: 5, day: 12, name: 'Bombeiro Rivabene' }, // Junho (5)
  { month: 6, day: 15, name: 'Bombeiro Vagner' },   // Julho (6)
  { month: 6, day: 23, name: 'Bombeiro Júlio Cesar' }, // Julho (6)
  { month: 8, day: 7, name: 'Bombeiro Andreotti' }, // Setembro (8)
  { month: 8, day: 28, name: 'Bombeiro Custódio' }, // Setembro (8)
  { month: 10, day: 11, name: 'Bombeiro Oliveira' },// Novembro (10)
  { month: 11, day: 10, name: 'Bombeiro Vieira' },  // Dezembro (11)
  { month: 11, day: 12, name: 'Bombeiro Sabino' },  // Dezembro (11)
];

// Nova lista para dias com emojis especiais que não são feriados
export const SPECIAL_EMOJI_DAYS = [
  { month: 2, day: 8, name: 'Dia Internacional da Mulher', emoji: '🌹' }, // Março (2)
  { month: 5, day: 12, name: 'Dia dos Namorados', emoji: '❤️' }, // Junho (5)
  { month: 6, day: 2, name: 'Dia do Bombeiro', emoji: '👨‍🚒' }, // Julho (6)
];

export const getDaysBetween = (date1: Date, date2: Date): number => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

// Configuração das Estações (Hemisfério Sul)
export const SEASONS = [
  { name: 'Verão', emoji: '🌞', month: 11, day: 21 }, // Dezembro
  { name: 'Outono', emoji: '🍂', month: 2, day: 20 },  // Março
  { name: 'Inverno', emoji: '❄️', month: 5, day: 21 },  // Junho
  { name: 'Primavera', emoji: '🌸', month: 8, day: 22 }, // Setembro
];

export const getSeasonDataForDate = (month: number, day: number) => {
  // Ordenar estações pelo mês/dia para facilitar a comparação
  // Dezembro é o início do Verão, mas cobre Janeiro e Fevereiro também.

  if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day < 20)) {
    return { name: 'Verão', emoji: '🌞' };
  }
  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
    return { name: 'Outono', emoji: '🍂' };
  }
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 22)) {
    return { name: 'Inverno', emoji: '❄️' };
  }
  return { name: 'Primavera', emoji: '🌸' };
};

export const getSeasonStartEvent = (month: number) => {
  const season = SEASONS.find(s => s.month === month);
  if (season) {
    return {
      day: season.day,
      name: `Início d${season.name === 'Primavera' ? 'a' : 'o'} ${season.name}`,
      emoji: season.emoji
    };
  }
  return null;
};

export const getHolidays = (year: number): Map<string, string> => {
  const holidays = new Map<string, string>();

  holidays.set(`${year}-01-01`, 'Ano Novo');
  holidays.set(`${year}-04-21`, 'Tiradentes');
  holidays.set(`${year}-05-01`, 'Dia do Trabalho');
  holidays.set(`${year}-09-07`, 'Independência do Brasil');
  holidays.set(`${year}-10-12`, 'Nossa Senhora Aparecida');
  holidays.set(`${year}-10-28`, 'Dia do Servidor Público');
  holidays.set(`${year}-11-02`, 'Finados');
  holidays.set(`${year}-11-15`, 'Proclamação da República');
  holidays.set(`${year}-11-20`, 'Dia da Consciência Negra');
  holidays.set(`${year}-12-25`, 'Natal');
  holidays.set(`${year}-07-09`, 'Revolução Constitucionalista');
  holidays.set(`${year}-01-25`, 'Aniversário de São Paulo');
  holidays.set(`${year}-07-27`, 'Aniversário de Agudos');

  const easter = calculateEaster(year);
  holidays.set(
    `${easter.getFullYear()}-${String(easter.getMonth() + 1).padStart(2, '0')}-${String(easter.getDate()).padStart(2, '0')}`,
    'Páscoa'
  );

  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);
  holidays.set(
    `${carnival.getFullYear()}-${String(carnival.getMonth() + 1).padStart(2, '0')}-${String(carnival.getDate()).padStart(2, '0')}`,
    'Carnaval'
  );

  const ashWednesday = new Date(carnival);
  ashWednesday.setDate(carnival.getDate() + 1);
  holidays.set(
    `${ashWednesday.getFullYear()}-${String(ashWednesday.getMonth() + 1).padStart(2, '0')}-${String(ashWednesday.getDate()).padStart(2, '0')}`,
    'Quarta-feira de Cinzas'
  );

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  holidays.set(
    `${goodFriday.getFullYear()}-${String(goodFriday.getMonth() + 1).padStart(2, '0')}-${String(goodFriday.getDate()).padStart(2, '0')}`,
    'Sexta-feira Santa'
  );

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);
  holidays.set(
    `${corpusChristi.getFullYear()}-${String(corpusChristi.getMonth() + 1).padStart(2, '0')}-${String(corpusChristi.getDate()).padStart(2, '0')}`,
    'Corpus Christi'
  );

  const mothersDay = new Date(year, 4, 1);
  while (mothersDay.getDay() !== 0) mothersDay.setDate(mothersDay.getDate() + 1);
  mothersDay.setDate(mothersDay.getDate() + 7);
  holidays.set(
    `${mothersDay.getFullYear()}-${String(mothersDay.getMonth() + 1).padStart(2, '0')}-${String(mothersDay.getDate()).padStart(2, '0')}`,
    'Dia das Mães'
  );

  const fathersDay = new Date(year, 7, 1);
  while (fathersDay.getDay() !== 0) fathersDay.setDate(fathersDay.getDate() + 1);
  fathersDay.setDate(fathersDay.getDate() + 7);
  holidays.set(
    `${fathersDay.getFullYear()}-${String(fathersDay.getMonth() + 1).padStart(2, '0')}-${String(fathersDay.getDate()).padStart(2, '0')}`,
    'Dia dos Pais'
  );

  return holidays;
};

export const isHoliday = (date: Date): { isHoliday: boolean; holidayName?: string } => {
  const year = date.getFullYear();
  const holidays = getHolidays(year);
  const dateKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const holidayName = holidays.get(dateKey);
  return {
    isHoliday: !!holidayName,
    holidayName
  };
};

export const getColorForDate = (date: Date): { bg: string; text: string } => {
  const daysDiff = getDaysBetween(REFERENCE_DATE, date);
  const colorIndex = daysDiff % 3;

  const colors = [
    { bg: 'bg-calendar-yellow', text: 'text-calendar-yellowText' },
    { bg: 'bg-calendar-blue', text: 'text-calendar-blueText' },
    { bg: 'bg-calendar-green', text: 'text-calendar-greenText' },
  ];

  return colors[colorIndex < 0 ? (3 + colorIndex) : colorIndex];
};

// Clean mode (Escala Adm): white background with soft red for weekends/holidays
export const getColorForDateClean = (date: Date): { bg: string; text: string } => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const holidayCheck = isHoliday(date);

  // Lista de feriados que devem ser tratados apenas como eventos (não pintados de vermelho)
  const isEventOnly = holidayCheck.holidayName === 'Quarta-feira de Cinzas';

  if (isWeekend || (holidayCheck.isHoliday && !isEventOnly)) {
    return { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' };
  }

  return { bg: 'bg-white', text: 'text-black' };
};

// TwoTone mode (Escala 12x36): alternating blue and yellow
export const getColorForDateTwoTone = (date: Date): { bg: string; text: string } => {
  const daysDiff = getDaysBetween(REFERENCE_DATE, date);
  // Alterna entre 0 (azul) e 1 (amarelo)
  const colorIndex = daysDiff % 2;

  const colors = [
    { bg: 'bg-calendar-blue', text: 'text-calendar-blueText' },
    { bg: 'bg-calendar-yellow', text: 'text-calendar-yellowText' },
  ];

  return colors[colorIndex < 0 ? (2 + colorIndex) : colorIndex];
};

// Unified color getter that handles different modes/scales
export const getColorForMode = (
  date: Date,
  mode: '24x48' | '12x36' | 'adm' = '24x48'
): { bg: string; text: string } => {
  switch (mode) {
    case 'adm':
      return getColorForDateClean(date);
    case '12x36':
      return getColorForDateTwoTone(date);
    case '24x48':
    default:
      return getColorForDate(date);
  }
};

export const getMoonPhase = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) +
    Math.floor(275 * month / 9) + day + 1721013.5;

  const daysSinceNew = jd - 2451549.5;
  const newMoons = daysSinceNew / 29.53058867;
  const phase = (newMoons - Math.floor(newMoons)) * 29.53058867;

  if (phase < 1.84566) return 0; // Lua Nova
  if (phase < 9.22831) return 1; // Quarto Crescente
  if (phase < 16.61096) return 2; // Lua Cheia
  if (phase < 23.99361) return 3; // Quarto Minguante
  return 0; // Lua Nova
};