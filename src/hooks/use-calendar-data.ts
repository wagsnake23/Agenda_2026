"use client";

import { useMemo } from 'react';
import { getDaysBetween, getColorForMode, isHoliday, BIRTHDAYS, SPECIAL_EMOJI_DAYS } from '@/utils/calendar-utils';
import type { CalendarMode } from '@/hooks/use-calendar-mode';

interface CalendarDayData {
  day: number;
  isToday: boolean;
  colors: { bg: string; text: string };
  isHoliday: boolean;
  holidayName?: string;
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
}

export const useCalendarData = ({ month, year, today, mode = '24x48' }: UseCalendarDataProps) => {
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
      const colors = getColorForMode(date, mode);
      const holidayInfo = isHoliday(date);
      const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;

      // Verifica se é um dia de aniversário
      const birthdayInfo = BIRTHDAYS.find(
        (b) => b.month === month && b.day === day
      );
      const isBirthdayCheck = !!birthdayInfo;
      const birthdayPersonName = birthdayInfo ? birthdayInfo.name : undefined;

      // Verifica se é um dia com emoji especial
      const specialEmojiInfo = SPECIAL_EMOJI_DAYS.find(
        (s) => s.month === month && s.day === day
      );
      const specialEmojiName = specialEmojiInfo ? specialEmojiInfo.name : undefined;
      const specialEmojiIcon = specialEmojiInfo ? specialEmojiInfo.emoji : undefined;

      days.push({
        day,
        isToday: isTodayCheck,
        colors,
        isHoliday: holidayInfo.isHoliday,
        holidayName: holidayInfo.holidayName,
        isBirthday: isBirthdayCheck,
        birthdayName: birthdayPersonName,
        specialEmojiName,
        specialEmojiIcon,
        isWeekend: isWeekendDay,
      });
    }

    while (days.length < 42) {
      days.push(null);
    }

    return days;
  }, [month, year, today]);

  const todayDayOfWeek = today.getDay();
  const todayColors = getColorForMode(today, mode);
  const isCurrentMonthAndYear = month === today.getMonth() && year === today.getFullYear();

  return {
    calendarData,
    todayDayOfWeek,
    todayColors,
    isCurrentMonthAndYear,
  };
};