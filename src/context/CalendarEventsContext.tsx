"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useCalendarEvents, CalendarEvent } from '@/hooks/use-calendar-events';

interface CalendarEventsContextType {
    events: CalendarEvent[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

const CalendarEventsContext = createContext<CalendarEventsContextType>({
    events: [],
    loading: true,
    error: null,
    refetch: () => { },
});

export const CalendarEventsProvider = ({ children }: { children: ReactNode }) => {
    const { events, loading, error, refetch } = useCalendarEvents();

    return (
        <CalendarEventsContext.Provider value={{ events, loading, error, refetch }}>
            {children}
        </CalendarEventsContext.Provider>
    );
};

export const useCalendarEventsContext = () => useContext(CalendarEventsContext);
