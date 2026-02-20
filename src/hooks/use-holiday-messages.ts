"use client";

import { useState, useEffect } from 'react';
import { getHolidays, holidayEmojis, SPECIAL_EMOJI_DAYS, getSeasonStartEvent, SEASONS } from '@/utils/calendar-utils';

export const useHolidayMessages = (month: number, year: number) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const holidaysForYear = getHolidays(year);
    const monthHolidays: { day: number; name: string }[] = [];

    holidaysForYear.forEach((name, dateKey) => {
      const [y, m, d] = dateKey.split('-').map(Number);
      if (y === year && m - 1 === month) {
        monthHolidays.push({ day: d, name });
      }
    });

    // Adiciona o início da estação se for o mês correspondente
    const seasonStart = getSeasonStartEvent(month);
    if (seasonStart) {
      monthHolidays.push({ day: seasonStart.day, name: seasonStart.name });
    }

    // Adiciona os eventos especiais que não são feriados
    SPECIAL_EMOJI_DAYS.forEach(event => {
      if (event.month === month) {
        monthHolidays.push({ day: event.day, name: event.name });
      }
    });

    monthHolidays.sort((a, b) => a.day - b.day);

    const formattedMessages = monthHolidays.map(holiday => {
      // Para Independência do Brasil, não incluímos o emoji aqui pois usamos o BrasilFlagIcon no componente
      if (holiday.name === 'Independência do Brasil') {
        return `${String(holiday.day).padStart(2, '0')} - ${holiday.name}`;
      }

      // Busca emoji tanto na lista de feriados quanto na de eventos especiais
      let emoji = holidayEmojis[holiday.name] || '';
      if (!emoji) {
        const specialEvent = SPECIAL_EMOJI_DAYS.find(s => s.name === holiday.name);
        if (specialEvent) {
          emoji = specialEvent.emoji;
        } else if (holiday.name.startsWith('Início d')) {
          const seasonName = holiday.name.split(' ').pop();
          const season = SEASONS.find(s => s.name === seasonName);
          if (season) emoji = season.emoji;
        }
      }

      return `${String(holiday.day).padStart(2, '0')} - ${holiday.name} ${emoji}`;
    });
    setMessages(formattedMessages);
  }, [month, year]);

  return messages;
};