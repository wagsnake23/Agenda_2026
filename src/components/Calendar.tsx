"use client";

import { useState, useMemo, useEffect } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarHeader from './calendar/CalendarHeader';
import TodayButton from './calendar/TodayButton';
import HolidayMessages from './calendar/HolidayMessages';
import BirthdayMessages from './calendar/BirthdayMessages';
import MoonPhasesDisplay from './calendar/MoonPhasesDisplay';
import { useCalendarData } from '@/hooks/use-calendar-data';
import { useCalendarMode } from '@/hooks/use-calendar-mode';
import { useHolidayMessages } from '@/hooks/use-holiday-messages';
import { useMoonPhases } from '@/hooks/use-moon-phases';
import CalendarCard from './calendar/CalendarCard';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CalendarProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  goToToday: () => void;
  formatToday: () => string;
}

const Calendar = ({ month, year, onMonthChange, onYearChange, goToToday, formatToday }: CalendarProps) => {
  const today = new Date();
  const [isYearPopoverOpen, setIsYearPopoverOpen] = useState(false);
  const [highlightedDay, setHighlightedDay] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { mode, setMode } = useCalendarMode();

  // Array otimizado para cobrir a faixa de anos do seletor (6 anos = 72 meses)
  const baseDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear() - 2, 0, 1);
  }, []);

  const monthsArray = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) =>
      addMonths(baseDate, i)
    );
  }, [baseDate]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const monthsToRender = useMemo(() => {
    if (isMobile) {
      return [
        subMonths(new Date(year, month, 1), 1),
        new Date(year, month, 1),
        addMonths(new Date(year, month, 1), 1)
      ];
    }
    return monthsArray;
  }, [isMobile, monthsArray, month, year]);

  const { todayColors } = useCalendarData({
    month: today.getMonth(),
    year: today.getFullYear(),
    today,
    mode
  });

  const holidayMessages = useHolidayMessages(month, year);
  const moonPhases = useMoonPhases(month, year);

  useEffect(() => {
    setHighlightedDay(null);
  }, [month, year]);

  // Sincronizar carrossel quando o estado mudar (via Header)
  // Sincronizar carrossel quando o estado mudar (via Header)
  useEffect(() => {
    if (!api) return;

    if (isMobile) {
      // No mobile, o mês atual é sempre o índice 1 (central) do monthsToRender
      if (api.selectedScrollSnap() !== 1) {
        api.scrollTo(1, true); // true para pular animação se necessário
      }
      return;
    }

    const targetIndex = monthsArray.findIndex(
      (d) => d.getMonth() === month && d.getFullYear() === year
    );

    if (targetIndex !== -1) {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const desiredIndex = isDesktop ? Math.max(0, targetIndex - 1) : targetIndex;

      const currentIndex = api.selectedScrollSnap();
      if (desiredIndex !== currentIndex) {
        api.scrollTo(desiredIndex);
      }
    }
  }, [api, month, year, monthsArray, isMobile]);

  // Atualizar estado quando o carrossel mudar (via drag/setas)
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentSlide(index); // Rastrear slide atual

      const scrollArray = isMobile ? monthsToRender : monthsArray;
      const isDesktop = !isMobile;
      const effectiveIndex = isDesktop ? Math.min(scrollArray.length - 1, index + 1) : index;

      const selectedDate = scrollArray[effectiveIndex];

      if (!selectedDate) return;

      const newMonth = selectedDate.getMonth();
      const newYear = selectedDate.getFullYear();

      if (newMonth !== month || newYear !== year) {
        onMonthChange(newMonth);
        onYearChange(newYear);
      }
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, monthsArray, monthsToRender, month, year, isMobile]);

  const yearOptions = useMemo(() => {
    const currentYearRef = new Date().getFullYear();
    const years = [];
    for (let i = currentYearRef - 2; i <= currentYearRef + 3; i++) {
      years.push(i);
    }
    return years;
  }, []);

  const handlePrevMonth = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      const prevDate = subMonths(new Date(year, month, 1), 1);
      onMonthChange(prevDate.getMonth());
      onYearChange(prevDate.getFullYear());
    } else {
      api?.scrollPrev();
    }
  };

  const handleNextMonth = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      const nextDate = addMonths(new Date(year, month, 1), 1);
      onMonthChange(nextDate.getMonth());
      onYearChange(nextDate.getFullYear());
    } else {
      api?.scrollNext();
    }
  };

  const handleGoToToday = () => {
    goToToday();
  };

  const handleDayClick = (day: number) => {
    setHighlightedDay(day);
  };

  return (
    <div className="w-full antialiased [font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale] transition-all duration-500 relative">
      <div className="w-full max-w-[1600px] mx-auto px-0 md:p-4 relative">
        <CalendarHeader
          month={month}
          year={year}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          yearOptions={yearOptions}
          isYearPopoverOpen={isYearPopoverOpen}
          setIsYearPopoverOpen={setIsYearPopoverOpen}
          goToToday={handleGoToToday}
          formatToday={formatToday}
          todayColors={todayColors}
          scaleType={mode}
          setScaleType={setMode}
        />

        <div className="w-full relative overflow-visible pt-0 pb-0 md:pb-6 mt-0 lg:mt-0 lg:py-7">
          <Carousel
            setApi={setApi}
            opts={{
              align: typeof window !== 'undefined' && window.innerWidth < 1024 ? "center" : "start",
              containScroll: "trimSnaps",
              dragFree: false,
              slidesToScroll: 1,
              duration: 22
            }}
            className="w-full relative px-0"
          >
            <CarouselContent className="w-full flex items-stretch cursor-grab active:cursor-grabbing">
              {monthsToRender.map((date, idx) => {
                const m = date.getMonth();
                const y = date.getFullYear();
                const isCurrent = m === month && y === year;

                // Detectar posição do card em relação ao centro visível
                const centerIndex = isMobile ? 1 : currentSlide + 1;
                const position = idx === centerIndex ? 'center' : idx === centerIndex - 1 ? 'left' : idx === centerIndex + 1 ? 'right' : 'far';

                return (
                  <CarouselItem
                    key={`${y}-${m}`}
                    className={cn(
                      "w-full basis-full shrink-0 grow-0 lg:basis-1/3 lg:pl-8",
                      // Transições de opacidade mantidas, mas sem transforms que causem blur
                      "transition-opacity duration-450 ease-out",
                      position === 'center' ? "opacity-100 z-20" : "opacity-100 z-[5]"
                    )}
                    style={{
                      opacity: 1,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <CalendarCard
                      month={m}
                      year={y}
                      today={today}
                      onDayClick={isCurrent ? handleDayClick : () => { }}
                      goToToday={goToToday}
                      formatToday={formatToday}
                      isCenter={position === 'center'}
                      position={position}
                      mode={mode}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              onClick={() => api?.scrollPrev()}
              className="hidden lg:flex -left-16 h-12 w-12 border-none bg-white shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            />
            <CarouselNext
              onClick={() => api?.scrollNext()}
              className="hidden lg:flex -right-16 h-12 w-12 border-none bg-white shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            />
          </Carousel>

          {/* Indicadores de bolinhas */}
          <div className="hidden lg:flex justify-center gap-3 mt-6 lg:mt-6 mb-4">
            {[-1, 0, 1].map((offset) => {
              const date = addMonths(new Date(year, month, 1), offset);
              return (
                <button
                  key={offset}
                  onClick={() => {
                    onMonthChange(date.getMonth());
                    onYearChange(date.getFullYear());
                  }}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    offset === 0
                      ? "w-12 bg-[#C62828] shadow-[0_4px_12px_rgba(198,40,40,0.3)]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  )}
                />
              );
            })}
          </div>
        </div>



        <div className="max-w-[1600px] mx-auto w-full mt-4 lg:mt-[-20px] flex flex-col gap-4 lg:pb-16">
          <div className="flex flex-col lg:flex-row gap-2 md:gap-4 lg:gap-6 items-stretch justify-center">
            <div className={`w-full lg:flex-1 lg:min-w-[370px] order-1 lg:order-2 ${holidayMessages.length === 0 ? 'hidden md:block' : ''}`}>
              <HolidayMessages messages={holidayMessages} highlightedDay={highlightedDay} month={month} />
            </div>
            <div className="w-full lg:flex-1 lg:min-w-[370px] order-2 lg:order-3">
              <BirthdayMessages month={month} year={year} highlightedDay={highlightedDay} />
            </div>
            <div className="w-full lg:flex-1 lg:min-w-[370px] order-3 lg:order-1">
              <MoonPhasesDisplay moonPhases={moonPhases} month={month} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
