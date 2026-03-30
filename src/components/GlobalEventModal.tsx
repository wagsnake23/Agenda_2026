"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
import { useCalendarEventsAdmin } from '@/hooks/use-calendar-events-admin';
import type { CalendarEvent, CalendarEventType, ColorMode } from '@/hooks/use-calendar-events';
import { X, Check, Loader2 } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const EMPTY_FORM = {
    title: '',
    description: '',
    date: '',
    type: 'event' as CalendarEventType,
    is_fixed: false,
    color_mode: 'event_only' as ColorMode,
    emoji: '',
    is_active: true,
};

const GlobalEventModal = () => {
    const { isAuthenticated, user } = useAuth();
    const { showSuccessToast, showErrorToast } = useToast();
    const { criar, atualizar, loading: saving } = useCalendarEventsAdmin();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        const handleOpen = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!isAuthenticated) return;

            if (customEvent.detail?.mode === 'edit' && customEvent.detail?.event) {
                const ev = customEvent.detail.event;
                setEditingId(ev.id);
                
                let formDate = ev.date;
                if (!ev.is_fixed) {
                    formDate = ev.date.substring(0, 16).replace(' ', 'T');
                }

                setForm({
                    title: ev.title,
                    description: ev.description || '',
                    date: formDate,
                    type: ev.type,
                    is_fixed: ev.is_fixed,
                    color_mode: ev.color_mode,
                    emoji: ev.emoji || '',
                    is_active: ev.is_active,
                });
            } else {
                setEditingId(null);
                setForm({
                    ...EMPTY_FORM,
                    date: customEvent.detail?.date || '',
                });
            }
            setIsOpen(true);
        };

        window.addEventListener('open-global-event-modal', handleOpen);
        return () => window.removeEventListener('open-global-event-modal', handleOpen);
    }, [isAuthenticated]);

    const handleTypeChange = (type: CalendarEventType) => {
        setForm(prev => ({
            ...prev,
            type,
            ...(type === 'birthday' ? { is_fixed: true, color_mode: 'event_only' as ColorMode } : {}),
            ...(type === 'holiday' ? { color_mode: 'holiday' as ColorMode } : {}),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.date) return;

        if (editingId) {
            const { error } = await atualizar(editingId, form);
            if (!error) setIsOpen(false);
            else showErrorToast(error);
        } else {
            const { error } = await criar(form);
            if (!error) setIsOpen(false);
            else showErrorToast(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-1 sm:p-3">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setIsOpen(false)} />
            <div className="relative bg-white rounded-[24px] shadow-2xl border-2 border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_0_2px_1px_white] w-[99%] max-w-lg z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 md:px-5 py-4 bg-gradient-to-b from-[#2a57b3] to-[#1a3a8a] shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-200 shadow-[0_2px_0_#93c5fd,inset_0_1.5px_1px_white] border border-blue-200/80 shrink-0">
                            <span className="text-lg drop-shadow-sm">
                                {editingId ? '✏️' : '➕'}
                            </span>
                        </div>
                        <h3 className="font-bold text-white text-[1.10rem] md:text-[1.20rem] tracking-tight">
                            {editingId ? 'Editar Evento' : 'Novo Evento'}
                        </h3>
                    </div>
                    <button
                        onClick={() => !saving && setIsOpen(false)}
                        className="w-7 h-7 md:w-[34px] md:h-[34px] flex items-center justify-center rounded-full bg-[#E53935] hover:bg-[#C62828] text-white shadow-lg active:scale-90 transition-all font-bold translate-x-[4px] -translate-y-[4px] md:translate-x-0 md:translate-y-0"
                    >
                        <X className="w-4 h-4 md:w-[22px] md:h-[22px]" strokeWidth={4} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div>
                        <label className="text-[13px] font-semibold text-slate-500 mb-1 block">Nome *</label>
                        <input
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="Ex: Natal"
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="text-[13px] font-semibold text-slate-500 mb-1 block">Descrição</label>
                        <input
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Opcional"
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-[13px] font-semibold text-slate-500 mb-1 block">Tipo *</label>
                        <select
                            value={form.type}
                            onChange={e => handleTypeChange(e.target.value as CalendarEventType)}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 transition-all"
                        >
                            <option value="holiday">🏁 Feriado</option>
                            <option value="event">📌 Evento</option>
                            <option value="birthday">🎂 Aniversário</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[13px] font-semibold text-slate-500 mb-1 block">
                                {form.is_fixed ? 'Data (Mês-Dia) *' : 'Data Completa *'}
                            </label>
                            {form.is_fixed ? (
                                <input
                                    value={form.date.slice(5)}
                                    onChange={e => {
                                        let val = e.target.value.replace(/\D/g, '');
                                        let m = val.slice(0, 2);
                                        if (m.length === 1 && parseInt(m) > 1) m = '0' + m;
                                        if (m.length === 2 && parseInt(m) > 12) m = '12';
                                        
                                        let d = val.slice(2, 4);
                                        if (d.length === 1 && parseInt(d) > 3) d = '0' + d;
                                        if (d.length === 2 && parseInt(d) > 31) d = '31';
                                        
                                        let formatted = m;
                                        if (val.length > 2) formatted += '-' + d;
                                        
                                        setForm(p => ({ ...p, date: `2000-${formatted.slice(0, 5)}` }));
                                    }}
                                    placeholder="MM-DD"
                                    maxLength={5}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                                />
                            ) : (
                                <input
                                    type="datetime-local"
                                    value={form.date}
                                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            )}
                        </div>
                        <div>
                            <label className="text-[13px] font-semibold text-slate-500 mb-1 block">Emoji</label>
                            <button
                                type="button"
                                onClick={() => setEmojiPickerOpen(true)}
                                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 transition-all flex items-center gap-2 hover:border-blue-400 hover:bg-blue-50 bg-slate-50"
                            >
                                {form.emoji ? (
                                    <>
                                        <span className="text-2xl">{form.emoji}</span>
                                        <span className="text-slate-500 text-xs">Trocar</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-slate-300 text-xl">😶</span>
                                        <span className="text-slate-400 text-xs">Incluir</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={saving}
                            className="flex-1 h-12 rounded-xl bg-white text-[#1a3a8a] font-bold text-[19px] border border-[#1a3a8a]/40 hover:bg-blue-50 transition-all disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 h-12 rounded-xl bg-gradient-to-b from-[#2a57b3] to-[#1a3a8a] text-white font-bold text-[19px] shadow-[0_4px_0_#0f2a6b] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>

                <EmojiPicker
                    open={emojiPickerOpen}
                    onClose={() => setEmojiPickerOpen(false)}
                    onSelect={emoji => setForm(p => ({ ...p, emoji }))}
                    currentEmoji={form.emoji}
                />
            </div>
        </div>
    );
};

export default GlobalEventModal;
