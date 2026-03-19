import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Agendamento } from '@/modules/auth/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
import { dedupeById } from '@/utils/dedupeById';
import { useAgendamentosContext } from '@/context/AgendamentosContext';

export const useAgendamentos = () => {
    const { user, isAdmin, checkSession } = useAuth();
    const { showSuccessToast, showErrorToast } = useToast();
    const { agendamentos, setAgendamentos, loading, error, refetch } = useAgendamentosContext();

    const criar = async (input: {
        data_inicial: string;
        data_final: string;
        tipo_agendamento: string;
        observacao?: string | null;
    }) => {
        const isSessionValid = await checkSession();
        if (!isSessionValid || !user) return { error: 'Sua sessão expirou. Por favor, saia e entre novamente.' };

        const start = new Date(input.data_inicial);
        const end = new Date(input.data_final);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end < start) {
            return { error: 'Data final não pode ser anterior à data inicial' };
        }

        const dias = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        try {
            const { data, error: insertError } = await supabase
                .from('agendamentos')
                .insert({
                    user_id: user.id,
                    data_inicial: input.data_inicial,
                    data_final: input.data_final,
                    dias,
                    tipo_agendamento: input.tipo_agendamento,
                    observacao: input.observacao || null,
                    status: 'pendente',
                })
                .select(`
          *,
          profiles:user_id (
            id, nome, apelido, email, foto_url, cargo, matricula, perfil
          )
        `)
                .single();

            if (insertError) throw insertError;

            // Deduplicação centralizada: evita duplicatas pelo Realtime vs insert otimista
            setAgendamentos(prev =>
                dedupeById([...prev, data as Agendamento]).sort(
                    (a, b) => new Date(a.data_inicial).getTime() - new Date(b.data_inicial).getTime()
                )
            );

            return { error: null, data };
        } catch (err: any) {
            console.error('Error creating agendamento:', err);
            return { error: err.message || 'Erro ao criar agendamento' };
        }
    };

    const atualizar = async (id: string, updates: Partial<Agendamento>) => {
        const isSessionValid = await checkSession();
        if (!isSessionValid || !user) return { error: 'Sua sessão expirou. Por favor, saia e entre novamente.' };

        try {
            // Nova regra de negócio: Se o criador mudar as datas, status volta para pendente
            const { data: currentAg } = await supabase
                .from('agendamentos')
                .select('user_id, status, data_inicial, data_final')
                .eq('id', id)
                .single();

            let finalUpdates = { ...updates };

            if (currentAg && user) {
                const isOwner = currentAg.user_id === user.id;
                const isAdminUser = isAdmin; // isAdmin do hook auth

                // Se as datas mudaram
                const dateChanged = (updates.data_inicial && updates.data_inicial !== currentAg.data_inicial) ||
                    (updates.data_final && updates.data_final !== currentAg.data_final);

                if (dateChanged && isOwner && !isAdminUser) {
                    finalUpdates.status = 'pendente';
                }
            }

            // Injetar data de alteração do status se ele mudou e for aprovado/cancelado/recusado
            if (finalUpdates.status !== undefined && finalUpdates.status !== currentAg?.status) {
                const now = new Date().toISOString();
                if (finalUpdates.status === 'aprovado') {
                    finalUpdates.approved_at = now;
                } else if (finalUpdates.status === 'cancelado') {
                    finalUpdates.cancelled_at = now;
                } else if (finalUpdates.status === 'recusado') {
                    finalUpdates.rejected_at = now;
                }
            }

            const { data, error: updateError } = await supabase
                .from('agendamentos')
                .update(finalUpdates)
                .eq('id', id)
                .select(`
          *,
          profiles:user_id (
            id, nome, apelido, email, foto_url, cargo, matricula, perfil
          )
        `)
                .single();

            if (updateError) throw updateError;

            // Garante que um UPDATE nunca introduza duplicatas
            setAgendamentos(prev =>
                dedupeById(prev.map(a => a.id === id ? (data as Agendamento) : a))
            );

            return { error: null, data };
        } catch (err: any) {
            console.error('Error updating agendamento:', err);
            return { error: err.message || 'Erro ao atualizar agendamento' };
        }
    };

    const excluir = async (id: string) => {
        const isSessionValid = await checkSession();
        if (!isSessionValid || !user) return { error: 'Sua sessão expirou. Por favor, saia e entre novamente.' };

        try {
            const { error: deleteError } = await supabase
                .from('agendamentos')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setAgendamentos(prev => prev.filter(a => a.id !== id));
            return { error: null };
        } catch (err: any) {
            console.error('Error deleting agendamento:', err);
            return { error: err.message || 'Erro ao excluir agendamento' };
        }
    };

    const alterarStatus = async (id: string, status: 'pendente' | 'aprovado' | 'recusado' | 'cancelado') => {
        const result = await atualizar(id, { status });
        if (result.error) {
            showErrorToast('Erro ao alterar status');
        } else {
            showSuccessToast('Status alterado com sucesso!');
        }
        return result;
    };

    return {
        agendamentos,
        loading,
        error,
        refetch,
        criar,
        atualizar,
        excluir,
        alterarStatus,
        setAgendamentos,
    };
};

