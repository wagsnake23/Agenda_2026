"use client";

import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

export interface Agendamento {
    id: string;
    dataInicio: string;
    dataFim: string;
    tipo: string;
    totalDias: number;
    status: 'Pendente';
    observacao?: string;
    userName?: string;
    userPhoto?: string;
}

interface DrawerAgendamentoProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'view';
    initialDate?: string;
    agendamentosNoDia?: Agendamento[];
    onSave: (agendamento: Omit<Agendamento, 'id'>) => void;
    onDelete?: (id: string) => void;
    onUpdate?: (agendamento: Agendamento) => void;
    anchorRef: React.RefObject<HTMLDivElement>;
    selectedPeriod?: { start: string, end: string } | null;
    onSelectPeriod?: (period: { start: string, end: string } | null) => void;
}

const DrawerAgendamento: React.FC<DrawerAgendamentoProps> = ({
    isOpen,
    onClose,
    mode,
    initialDate,
    agendamentosNoDia = [],
    onSave,
    onDelete,
    onUpdate,
    anchorRef,
    selectedPeriod,
    onSelectPeriod,
}) => {
    const [dataInicio, setDataInicio] = useState(initialDate || '');
    const [dataFim, setDataFim] = useState(initialDate || '');
    const [tipo, setTipo] = useState<string>('');
    const [totalDias, setTotalDias] = useState(0);
    const [observacao, setObservacao] = useState('');

    // Estados de Edição
    const [modoEdicao, setModoEdicao] = useState(false);
    const [agendamentoEditando, setAgendamentoEditando] = useState<Agendamento | null>(null);

    useEffect(() => {
        if (mode === 'create') {
            setModoEdicao(false);
            setAgendamentoEditando(null);
            setDataInicio(initialDate || '');
            setDataFim(initialDate || '');
            setTipo('');
            setObservacao('');
        }
    }, [isOpen, mode, initialDate]);

    useEffect(() => {
        if (modoEdicao && agendamentoEditando) {
            setDataInicio(agendamentoEditando.dataInicio);
            setDataFim(agendamentoEditando.dataFim);
            setTipo(agendamentoEditando.tipo);
            setObservacao(agendamentoEditando.observacao || '');
        }
    }, [modoEdicao, agendamentoEditando]);

    useEffect(() => {
        if (dataInicio && dataFim) {
            const start = new Date(dataInicio);
            const end = new Date(dataFim);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTotalDias(diffDays > 0 ? diffDays : 0);
        } else {
            setTotalDias(0);
        }
    }, [dataInicio, dataFim]);

    if (!isOpen) return null;

    const isFormValid = dataInicio && dataFim && tipo && totalDias > 0;

    const handleAgendar = () => {
        if (isFormValid) {
            if (modoEdicao && agendamentoEditando && onUpdate) {
                onUpdate({
                    ...agendamentoEditando,
                    dataInicio,
                    dataFim,
                    tipo,
                    totalDias,
                    observacao: observacao.trim(),
                });
                setModoEdicao(false);
                setAgendamentoEditando(null);
                // Não chama onClose aqui para voltar para a lista (view mode)
            } else {
                onSave({
                    dataInicio,
                    dataFim,
                    tipo,
                    totalDias,
                    status: 'Pendente',
                    observacao: observacao.trim(),
                });
                onClose();
            }
        }
    };

    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full z-[60] flex flex-col items-center justify-start pointer-events-none p-0",
                "animate-in fade-in zoom-in-95 duration-300 md:relative md:animate-none"
            )}
        >
            <div
                className={cn(
                    "bg-white rounded-2xl md:rounded-[29px] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.04),0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-[#0F172A]/[0.05]",
                    "w-full h-full pointer-events-auto flex flex-col overflow-hidden"
                )}
            >
                {/* Header do Drawer */}
                <div className="flex items-center justify-between p-5 bg-[linear-gradient(135deg,#0f3c78,#1f5fa8,#2f80ed)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
                    <h2 className="text-[1.1rem] font-bold text-white uppercase tracking-[1px] flex items-center gap-2">
                        {modoEdicao ? (
                            <span>EDITAR AGENDAMENTO</span>
                        ) : mode === 'create' ? (
                            <span>NOVO AGENDAMENTO</span>
                        ) : (
                            <>
                                <span className="opacity-90">AGENDAMENTOS DO DIA</span>
                                <span className="font-black">
                                    {initialDate && (() => {
                                        const d = new Date(initialDate + 'T12:00:00');
                                        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
                                        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                                    })()}
                                </span>
                            </>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E53935] hover:bg-[#C62828] transition-all text-white shadow-lg active:scale-90"
                        title="Fechar"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6 md:pt-4 md:pb-8 flex flex-col gap-4">
                    {mode === 'create' || modoEdicao ? (
                        <>
                            <div className="space-y-4">
                                {/* Linha única para Datas e Total */}
                                <div className="flex flex-row items-end gap-3 w-full">
                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block truncate">Data Inicial</label>
                                        <Input
                                            type="date"
                                            value={dataInicio}
                                            onChange={(e) => setDataInicio(e.target.value)}
                                            className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all font-medium text-slate-700 text-xs px-2"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block truncate">Data Final</label>
                                        <Input
                                            type="date"
                                            value={dataFim}
                                            onChange={(e) => setDataFim(e.target.value)}
                                            className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all font-medium text-slate-700 text-xs px-2"
                                        />
                                    </div>

                                    <div className="w-[80px] space-y-1.5 shrink-0">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block truncate">Dias</label>
                                        <div className="h-11 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-black text-sm">{totalDias}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">Tipo de Agendamento</label>
                                    <Select value={tipo} onValueChange={setTipo}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all font-medium text-slate-700">
                                            <SelectValue placeholder="Selecione o tipo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="🛌 Abonada">🛌 Abonada</SelectItem>
                                            <SelectItem value="🏥 Atestado Médico">🏥 Atestado Médico</SelectItem>
                                            <SelectItem value="⏳ Desconto de Hora">⏳ Desconto de Hora</SelectItem>
                                            <SelectItem value="🩸 Doação de Sangue">🩸 Doação de Sangue</SelectItem>
                                            <SelectItem value="🌤️ Folga Mensal">🌤️ Folga Mensal</SelectItem>
                                            <SelectItem value="🗳️ Folga Eleitoral">🗳️ Folga Eleitoral</SelectItem>
                                            <SelectItem value="🎂 Folga Aniversário">🎂 Folga Aniversário</SelectItem>
                                            <SelectItem value="🏖️ Férias">🏖️ Férias</SelectItem>
                                            <SelectItem value="🏝️ Licença Prêmio">🏝️ Licença Prêmio</SelectItem>
                                            <SelectItem value="😷 Outros">😷 Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5 relative">
                                    <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">Observação</label>
                                    <textarea
                                        value={observacao}
                                        onChange={(e) => setObservacao(e.target.value.slice(0, 100))}
                                        placeholder="Alguma observação importante..."
                                        className="w-full min-h-[90px] p-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-700 text-sm resize-none outline-none"
                                    />
                                    <div className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-400">
                                        {observacao.length}/100
                                    </div>
                                </div>
                            </div>

                            <div className={cn(
                                "mt-auto pt-4 flex gap-4",
                                modoEdicao ? "flex-row" : "flex-col"
                            )}>
                                {modoEdicao && (
                                    <Button
                                        onClick={() => {
                                            setModoEdicao(false);
                                            setAgendamentoEditando(null);
                                        }}
                                        variant="outline"
                                        className="flex-1 h-12 rounded-2xl text-[1rem] font-black uppercase tracking-wider border-red-200 text-red-600 hover:text-red-900 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm"
                                    >
                                        Cancelar
                                    </Button>
                                )}
                                <Button
                                    onClick={handleAgendar}
                                    disabled={!isFormValid}
                                    className={cn(
                                        "h-12 rounded-2xl text-[1rem] font-black uppercase tracking-wider transition-all duration-300",
                                        modoEdicao ? "flex-1" : "w-full",
                                        isFormValid
                                            ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                            : "bg-slate-100 text-slate-400 border border-slate-200 grayscale opacity-60"
                                    )}
                                >
                                    {modoEdicao ? 'Salvar' : 'Agendar'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            {agendamentosNoDia.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 font-medium italic text-[14px]">Nenhum agendamento para este dia.</p>
                                </div>
                            ) : (
                                agendamentosNoDia.map((agenda) => {
                                    const emoji = agenda.tipo.split(' ')[0];
                                    const tipoNome = agenda.tipo.replace(emoji, '').trim();

                                    const formatDateAbbr = (dateStr: string, isStart: boolean) => {
                                        const d = new Date(dateStr + 'T12:00:00');
                                        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                                        const day = d.getDate();
                                        const month = months[d.getMonth()];
                                        // Mês inicial minúsculo, final maiúsculo (cap)
                                        const monthFormatted = isStart ? month : month.charAt(0).toUpperCase() + month.slice(1);
                                        return `${day}${monthFormatted}`;
                                    };

                                    const renderPeriod = () => {
                                        if (agenda.dataInicio === agenda.dataFim) {
                                            const d = new Date(agenda.dataInicio + 'T12:00:00');
                                            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                                            return `${d.getDate()}${months[d.getMonth()]}${d.getFullYear()}`;
                                        }
                                        const start = formatDateAbbr(agenda.dataInicio, true);
                                        const end = formatDateAbbr(agenda.dataFim, false);
                                        const year = new Date(agenda.dataFim + 'T12:00:00').getFullYear();
                                        return `${start} - ${end}${year}`;
                                    };

                                    const isSelected = selectedPeriod?.start === agenda.dataInicio && selectedPeriod?.end === agenda.dataFim;

                                    const handleCardClick = () => {
                                        if (onSelectPeriod) {
                                            onSelectPeriod({ start: agenda.dataInicio, end: agenda.dataFim });
                                        }
                                    };

                                    return (
                                        <div
                                            key={agenda.id}
                                            onClick={handleCardClick}
                                            className={cn(
                                                "p-3 rounded-2xl border bg-gradient-to-br from-[#ebf4ff] via-[#f0f7ff] to-[#e1effe] hover:from-[#e1effe] hover:to-[#ebf4ff] transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03),0_2px_4px_-2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.8)] group relative cursor-pointer",
                                                isSelected
                                                    ? "border-blue-500 ring-2 ring-blue-200 shadow-lg scale-[1.02]"
                                                    : "border-white/60 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)]"
                                            )}
                                        >
                                            <div className="grid grid-cols-[80px_1fr_auto_50px] grid-rows-[auto_auto_auto] gap-x-3.5 gap-y-1 items-center relative">
                                                {/* COLUNA 1: USUÁRIO */}
                                                <div className="col-start-1 row-start-1 row-span-3 flex flex-col items-center justify-center gap-1.5 pr-2 border-r border-black/[0.06] self-stretch my-0.5">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
                                                        {agenda.userPhoto ? (
                                                            <img src={agenda.userPhoto} alt={agenda.userName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                                                                <User size={22} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 leading-tight text-center break-words max-w-[70px] uppercase">
                                                        {agenda.userName || "Usuário"}
                                                    </span>
                                                </div>

                                                {/* COLUNA 2: CONTEÚDO */}
                                                <div className="col-start-2 row-start-1 flex items-center gap-2 overflow-hidden py-0.5">
                                                    <span className="text-[1.1rem] drop-shadow-sm leading-none shrink-0">{emoji}</span>
                                                    <span className="text-[clamp(12px,0.85vw,13.5px)] font-black text-slate-800 uppercase tracking-tight truncate">
                                                        {tipoNome}
                                                    </span>
                                                </div>
                                                <div className="col-start-2 row-start-2 flex items-center gap-1.5 overflow-hidden">
                                                    <span className="text-[12px] leading-none opacity-70">📅</span>
                                                    <span className="text-[clamp(11px,0.85vw,12px)] font-bold text-slate-700/80 whitespace-nowrap text-ellipsis block">
                                                        {renderPeriod()}
                                                    </span>
                                                </div>
                                                {agenda.observacao && (
                                                    <div className="col-start-2 col-span-2 row-start-3 italic text-[10.5px] text-slate-500 leading-tight py-0.5 pr-2 break-words">
                                                        "{agenda.observacao}"
                                                    </div>
                                                )}

                                                {/* COLUNA 3: STATUS / DURAÇÃO */}
                                                <div className="col-start-3 row-start-1 justify-self-end py-0.5">
                                                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700/90 text-[9.5px] font-bold uppercase tracking-tight shadow-sm border border-red-100/60">
                                                        {agenda.status}
                                                    </span>
                                                </div>
                                                <div className="col-start-3 row-start-2 justify-self-end mt-0.5">
                                                    <span className="text-[clamp(11.5px,0.85vw,12.5px)] font-black text-blue-700 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                                                        {agenda.totalDias} dias
                                                    </span>
                                                </div>

                                                {/* COLUNA 4: AÇÕES VERTICAL */}
                                                <div className="col-start-4 row-start-1 row-span-3 self-stretch border-l border-black/[0.06] bg-slate-50/40 -my-3 -mr-3 flex flex-col items-center justify-center gap-0 acoes rounded-r-2xl">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModoEdicao(true);
                                                            setAgendamentoEditando(agenda);
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all group/btn"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={15} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>

                                                    <div className="w-[50%] h-[1px] bg-black/[0.06] my-0.5" />

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm('Deseja realmente excluir este agendamento?')) {
                                                                onDelete?.(agenda.id);
                                                            }
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all group/btn"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={15} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrawerAgendamento;
