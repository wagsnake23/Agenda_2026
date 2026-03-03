"use client";

import { useState, useEffect } from 'react';
import { getEventsForMonth } from '@/hooks/use-calendar-events';
import type { CalendarEvent } from '@/hooks/use-calendar-events';

export const useHolidayMessages = (month: number, year: number, calendarEvents: CalendarEvent[] = []) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const monthEvents = getEventsForMonth(calendarEvents, month, year);

    const formattedMessages = monthEvents.map(event => {
      // Brasil flag - mostramos sem emoji aqui (componente visual trata)
      if (event.name === 'Independência do Brasil') {
        return `${String(event.day).padStart(2, '0')} - ${event.name}`;
      }
      const emoji = event.emoji ? ` ${event.emoji}` : '';
      return `${String(event.day).padStart(2, '0')} - ${event.name}${emoji}`;
    });

    setMessages(formattedMessages);
  }, [month, year, calendarEvents]);

  return messages;
};