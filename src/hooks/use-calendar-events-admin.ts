"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
import { useCalendarEventsContext } from '@/context/CalendarEventsContext';
import type { CalendarEvent, CalendarEventType, ColorMode } from './use-calendar-events';

export const useCalendarEventsAdmin = () => {
    const { user, isAdmin, checkSession } = useAuth();
    const { showSuccessToast, showErrorToast } = useToast();
    const { refetch } = useCalendarEventsContext();
    const [loading, setLoading] = useState(false);

    const criar = async (form: {
        title: string;
        description?: string | null;
        date: string;
        type: CalendarEventType;
        is_fixed: boolean;
        color_mode: ColorMode;
        emoji?: string | null;
        is_active: boolean;
    }) => {
        const session = await checkSession();
        if (!session || !user) {
            return { error: 'Sua sessão expirou. Por favor, faça login novamente.' };
        }

        setLoading(true);
        try {
            const payload = {
                title: form.title.trim(),
                description: form.description?.trim() || null,
                date: form.is_fixed ? (form.date.includes('T') ? form.date.split('T')[0] : form.date) : form.date.replace('T', ' '),
                type: form.type,
                is_fixed: form.is_fixed,
                color_mode: form.color_mode,
                emoji: form.emoji?.trim() || null,
                is_active: form.is_active,
                created_by: user.id,
            };

            const { data, error } = await supabase.from('calendar_events').insert(payload).select().single();
            if (error) throw error;

            showSuccessToast('Evento criado com sucesso!');
            refetch();
            return { data, error: null };
        } catch (err: any) {
            console.error('Error creating event:', err);
            return { error: err.message || 'Erro ao criar evento' };
        } finally {
            setLoading(false);
        }
    };

    const atualizar = async (id: string, form: {
        title: string;
        description?: string | null;
        date: string;
        type: CalendarEventType;
        is_fixed: boolean;
        color_mode: ColorMode;
        emoji?: string | null;
        is_active: boolean;
    }) => {
        const session = await checkSession();
        if (!session || !user) {
            return { error: 'Sua sessão expirou. Por favor, faça login novamente.' };
        }

        setLoading(true);
        try {
            const payload = {
                title: form.title.trim(),
                description: form.description?.trim() || null,
                date: form.is_fixed ? (form.date.includes('T') ? form.date.split('T')[0] : form.date) : form.date.replace('T', ' '),
                type: form.type,
                is_fixed: form.is_fixed,
                color_mode: form.color_mode,
                emoji: form.emoji?.trim() || null,
                is_active: form.is_active,
            };

            const { data, error } = await supabase.from('calendar_events').update(payload).eq('id', id).select().single();
            if (error) throw error;

            showSuccessToast('Evento atualizado com sucesso!');
            refetch();
            return { data, error: null };
        } catch (err: any) {
            console.error('Error updating event:', err);
            return { error: err.message || 'Erro ao atualizar evento' };
        } finally {
            setLoading(false);
        }
    };

    const excluir = async (id: string) => {
        const session = await checkSession();
        if (!session || !user) {
            return { error: 'Sua sessão expirou. Por favor, faça login novamente.' };
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('calendar_events').delete().eq('id', id);
            if (error) throw error;

            showSuccessToast('Evento excluído!');
            refetch();
            return { error: null };
        } catch (err: any) {
            console.error('Error deleting event:', err);
            return { error: err.message || 'Erro ao excluir evento' };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        criar,
        atualizar,
        excluir,
    };
};
