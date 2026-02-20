"use client";

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import { CalendarModeProvider } from '@/hooks/use-calendar-mode';
import { format } from 'date-fns';
import { Toaster } from 'sonner';
import InstallPWAButton from '@/components/InstallPWAButton';
import { useCalendarMode } from '@/hooks/use-calendar-mode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MobileScaleSelector = () => {
  const { mode, setMode } = useCalendarMode();

  const modeMap = {
    '24x48': '24H',
    '12x36': '12H',
    'adm': '8H'
  };

  return (
    <Select
      value={mode}
      onValueChange={(val) => setMode(val as any)}
    >
      <SelectTrigger
        className="w-12 h-10 flex items-center justify-center font-black text-[11px] transition-all p-0
                   bg-white border-gray-200 shadow-sm border text-red-600
                   focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none rounded-lg"
      >
        <span className="leading-none">{modeMap[mode]}</span>
      </SelectTrigger>
      <SelectContent className="backdrop-blur-xl bg-white/95 border border-gray-200 z-[101] min-w-[60px] w-[60px] p-1">
        <SelectItem value="24x48" className="font-sans font-bold text-[12px] text-slate-900 focus:!bg-red-500 hover:!bg-red-500 focus:!text-white py-1.5 pl-0 pr-0 [&>span:first-child]:hidden justify-center transition-colors cursor-pointer">24H</SelectItem>
        <SelectItem value="12x36" className="font-sans font-bold text-[12px] text-slate-900 focus:!bg-red-500 hover:!bg-red-500 focus:!text-white py-1.5 pl-0 pr-0 [&>span:first-child]:hidden justify-center transition-colors cursor-pointer">12H</SelectItem>
        <SelectItem value="adm" className="font-sans font-bold text-[12px] text-slate-900 focus:!bg-red-500 hover:!bg-red-500 focus:!text-white py-1.5 pl-0 pr-0 [&>span:first-child]:hidden justify-center transition-colors cursor-pointer">8H</SelectItem>
      </SelectContent>
    </Select>
  );
};

const Index = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const formatToday = () => {
    return format(today, 'dd/MM/yyyy');
  };

  return (
    <CalendarModeProvider>
      <div className="min-h-screen bg-[#EFF3F6] lg:bg-[linear-gradient(135deg,#F0F4F8_0%,#E2E8F0_100%)] flex flex-col items-center justify-start p-2 lg:p-0 gap-y-2 overflow-x-hidden md:overflow-visible">

        {/* Barra de Título Institucional - Desktop Apenas */}
        <header className="hidden lg:flex sticky top-0 w-full h-[74px] bg-[#0B1221] items-center px-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-[100] select-none">
          <div className="absolute left-1/2 -translate-x-1/2 text-center w-full flex items-center justify-center gap-6 pointer-events-none">
            <img
              src="/logo-bombeiros.png"
              alt="Brasão Bombeiros"
              className="w-12 h-12 drop-shadow-lg object-contain pointer-events-auto"
            />
            <h1
              className="font-black tracking-[2px] text-white uppercase leading-none inline-flex items-center gap-4 pointer-events-auto"
              style={{
                fontFamily: 'Inter, sans-serif',
                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3)) drop-shadow(0px 4px 12px rgba(0,0,0,0.5))',
              }}
            >
              <span className="text-[1.6rem]">BOMBEIROS AGUDOS</span>
              <span className="text-[#E53935] text-2xl drop-shadow-md">•</span>
              <span className="text-[1.6rem] opacity-90">CALENDÁRIO</span>
            </h1>
            <img
              src="/logo.png"
              alt="Logo Secundário"
              className="w-12 h-12 drop-shadow-lg object-contain pointer-events-auto"
            />
          </div>
        </header>

        {/* Wrapper de Escala apenas para Desktop - Ajustado items-center para centralizar no mobile */}
        <div className="w-full flex flex-col items-center justify-start md:transition-transform md:duration-500 md:scale-[0.85] md:origin-top md:-mb-[7%]">

          {/* Header Mobile/Tablet - Alinhado à esquerda com Seletor de Escala à direita */}
          <header className="sticky top-0 z-50 w-full h-[60px] bg-[#EFF3F6] flex flex-row items-center justify-between mt-0 md:mt-0 mb-1 pl-2 pr-2 select-none lg:hidden md:relative md:z-auto md:h-auto">
            <div className="flex items-center gap-1">
              <img
                src="/logo-bombeiros.png"
                alt="Brasão Bombeiros"
                className="w-12 h-12 md:w-14 md:h-14 drop-shadow-xl object-contain relative -left-1 transition-transform duration-300 hover:scale-105"
              />
              <h1
                className="text-[1.35rem] md:text-[2rem] font-black tracking-tight uppercase leading-none flex flex-row gap-1.5 select-none relative -left-[3px] md:-left-0"
                style={{
                  background: 'linear-gradient(to bottom, #FF4D4D 0%, #D32F2F 50%, #8B0000 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  filter: 'drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.1))',
                }}
              >
                <span>BOMBEIROS</span>
                <span>AGUDOS</span>
              </h1>
            </div>

            <div className="flex items-center relative -mr-1">
              <MobileScaleSelector />
            </div>
          </header>

          <main className="w-full lg:max-w-[1600px] flex flex-col items-center">
            <Calendar
              month={currentMonth}
              year={currentYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              goToToday={goToToday}
              formatToday={formatToday}
            />
          </main>

          <Toaster richColors position="bottom-center" />
          <InstallPWAButton />
        </div>

        <footer className="w-full mt-auto bg-[#0F172A] py-8 border-t border-gray-800 shadow-2xl relative z-10">
          <div className="w-full max-w-[1600px] mx-auto px-0 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Lado Esquerdo */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 opacity-90 drop-shadow-md" />
                <h3
                  className="font-black text-base md:text-lg tracking-wider uppercase whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(to bottom, #ffffff 40%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                  }}
                >
                  CALENDÁRIO PRONTIDÃO
                </h3>
              </div>
              <p className="text-gray-400 text-xs md:text-sm font-medium opacity-80 max-w-[300px]">
                Calendário digital de organização de escala operacional
              </p>
            </div>

            {/* Lado Direito */}
            <div className="flex flex-col items-center md:items-end gap-1.5">
              <span className="text-gray-400 text-xs font-semibold tracking-wide uppercase">
                © 2026 — CALENDÁRIO PRONTIDÃO
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                <span>Design by</span>
                <a
                  href="https://api.whatsapp.com/send?phone=5514991188921&text=Olá!%20Tenho%20interesse%20no%20Calendário%20Prontidão.%20Podemos%20conversar?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  style={{ color: '#25D366' }}
                >
                  BM Vagner
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CalendarModeProvider>
  );
};

export default Index;