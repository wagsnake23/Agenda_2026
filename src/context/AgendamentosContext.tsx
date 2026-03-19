"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Agendamento } from '@/modules/auth/types';
import { useAuth } from '@/context/AuthContext';
import { dedupeById } from '@/utils/dedupeById';

interface AgendamentosContextType {
    agendamentos: Agendamento[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    setAgendamentos: React.Dispatch<React.SetStateAction<Agendamento[]>>;
}

const AgendamentosContext = createContext<AgendamentosContextType | undefined>(undefined);

export const AgendamentosProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgendamentos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('agendamentos')
                .select(`
                    *,
                    profiles:user_id (
                        id, nome, apelido, email, foto_url, cargo, matricula, perfil
                    )
                `)
                .order('data_inicial', { ascending: true });

            if (fetchError) throw fetchError;

            setAgendamentos(dedupeById((data as Agendamento[]) || []));
        } catch (err: any) {
            console.error('Error fetching agendamentos:', err);
            setError(err.message || 'Erro ao carregar agendamentos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAgendamentos();
    }, [fetchAgendamentos]);

    // Realtime Integration
    useEffect(() => {
        const channel = supabase.channel("agendamentos-realtime-global");

        async function handleRealtimeChanges(payload: any) {
            if (payload.eventType === "DELETE") {
                setAgendamentos((prev) => prev.filter((a) => a.id !== payload.old.id));
                return;
            }

            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                const { data, error } = await supabase
                    .from("agendamentos")
                    .select(`
                        *,
                        profiles:user_id (
                            id, nome, apelido, email, foto_url, cargo, matricula, perfil
                        )
                    `)
                    .eq("id", payload.new.id)
                    .single();

                if (error || !data) {
                    console.error("Erro ao buscar agendamento completo pro realtime contexto:", error);
                    return;
                }

                if (payload.eventType === "INSERT") {
                    setAgendamentos((prev) =>
                        dedupeById([...prev, data as Agendamento]).sort(
                            (a, b) => new Date(a.data_inicial).getTime() - new Date(b.data_inicial).getTime()
                        )
                    );
                }
                if (payload.eventType === "UPDATE") {
                    setAgendamentos((prev) =>
                        dedupeById(prev.map((a) => (a.id === data.id ? (data as Agendamento) : a)))
                    );
                }
            }
        }

        channel
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "agendamentos" },
                (payload) => {
                    handleRealtimeChanges(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <AgendamentosContext.Provider value={{ agendamentos, loading, error, refetch: fetchAgendamentos, setAgendamentos }}>
            {children}
        </AgendamentosContext.Provider>
    );
};

export const useAgendamentosContext = () => {
    const context = useContext(AgendamentosContext);
    if (!context) {
        throw new Error('useAgendamentosContext must be used within an AgendamentosProvider');
    }
    return context;
};
