"use client";

import { useMemo } from 'react';
import { getDaysBetween, getColorForMode } from '@/utils/calendar-utils';
import { getEventsForDate, isHolidayEvent, CalendarEvent } from '@/hooks/use-calendar-events';
import type { CalendarMode } from '@/hooks/use-calendar-mode';

interface CalendarDayData {
  day: number;
  isToday: boolean;
  colors: { bg: string; text: string };
  isHoliday: boolean;
  holidayName?: string;
  holidayEmoji?: string;
  isBirthday?: boolean;
  birthdayName?: string;
  specialEmojiName?: string;
  specialEmojiIcon?: string;
  isWeekend: boolean;
}

interface UseCalendarDataProps {
  month: number;
  year: number;
  today: Date;
  mode?: CalendarMode;
  calendarEvents?: CalendarEvent[];
}

export const useCalendarData = ({ month, year, today, mode = '24x48', calendarEvents = [] }: UseCalendarDataProps) => {
  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (CalendarDayData | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isTodayCheck = date.toDateString() === today.toDateString();
      const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;

      // Busca eventos do banco
      const dayEvents = getEventsForDate(calendarEvents, date);

      // Verifica feriado
      const holidayEvent = dayEvents.find(e => e.type === 'holiday' && e.color_mode === 'holiday');
      const isHolidayDay = !!holidayEvent;
      const holidayName = holidayEvent?.title;
      const holidayEmoji = holidayEvent?.emoji || undefined;

      const colors = getColorForMode(date, mode, isHolidayDay);

      // Verifica aniversário
      const birthdayEvent = dayEvents.find(e => e.type === 'birthday');
      const isBirthdayDay = !!birthdayEvent;
      const birthdayName = birthdayEvent?.title;

      // Verifica evento especial (event_only - não pinta mas mostra emoji)
      const specialEvent = dayEvents.find(e => e.color_mode === 'event_only' && e.type !== 'birthday');
      const specialEmojiName = specialEvent?.title;
      const specialEmojiIcon = specialEvent?.emoji || undefined;

      // Para o modo adm: feriado que pinta
      const effectiveIsHoliday = mode === 'adm' ? isHolidayDay : isHolidayDay;

      days.push({
        day,
        isToday: isTodayCheck,
        colors,
        isHoliday: effectiveIsHoliday,
        holidayName,
        holidayEmoji,
        isBirthday: isBirthdayDay,
        birthdayName,
        specialEmojiName,
        specialEmojiIcon,
        isWeekend: isWeekendDay,
      });
    }

    while (days.length < 42) {
      days.push(null);
    }

    return days;
  }, [month, year, today, mode, calendarEvents]);

  const todayColors = getColorForMode(today, mode);
  const todayDayOfWeek = today.getDay();
  const isCurrentMonthAndYear = month === today.getMonth() && year === today.getFullYear();

  return {
    calendarData,
    todayDayOfWeek,
    todayColors,
    isCurrentMonthAndYear,
  };
};