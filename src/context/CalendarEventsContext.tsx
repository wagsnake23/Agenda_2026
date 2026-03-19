"use client";

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useCalendarEvents, CalendarEvent } from '@/hooks/use-calendar-events';
import { supabase } from '@/lib/supabase';

interface CalendarEventsContextType {
    events: CalendarEvent[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const CalendarEventsContext = createContext<CalendarEventsContextType>({
    events: [],
    loading: true,
    error: null,
    refetch: () => { },
    setEvents: () => { },
});

export const CalendarEventsProvider = ({ children }: { children: ReactNode }) => {
    const { events, loading, error, refetch, setEvents } = useCalendarEvents();

    useEffect(() => {
        const channel = supabase.channel("calendar-events-realtime-global");

        async function handleRealtimeChanges(payload: any) {
            if (payload.eventType === "DELETE") {
                setEvents((prev) => prev.filter((e) => e.id !== payload.old.id));
                return;
            }

            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                const { data, error: fetchError } = await supabase
                    .from("calendar_events")
                    .select("*")
                    .eq("id", payload.new.id)
                    .single();

                if (fetchError || !data) {
                    console.error("Erro ao buscar evento completo pro realtime contexto:", fetchError);
                    return;
                }

                const newEvent = { ...data, is_system: false } as CalendarEvent;

                if (payload.eventType === "INSERT") {
                    setEvents((prev) => {
                        if (prev.some((e) => e.id === newEvent.id)) return prev;
                        return [...prev, newEvent];
                    });
                }
                if (payload.eventType === "UPDATE") {
                    setEvents((prev) => prev.map((e) => (e.id === newEvent.id ? newEvent : e)));
                }
            }
        }

        channel
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "calendar_events" },
                (payload) => {
                    handleRealtimeChanges(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [setEvents]);

    return (
        <CalendarEventsContext.Provider value={{ events, loading, error, refetch, setEvents }}>
            {children}
        </CalendarEventsContext.Provider>
    );
};


export const useCalendarEventsContext = () => useContext(CalendarEventsContext);
