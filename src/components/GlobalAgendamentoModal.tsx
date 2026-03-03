"use client";

import { useState, useEffect } from 'react';
import DrawerAgendamento from './calendar/DrawerAgendamento';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const GlobalAgendamentoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { criar, refetch } = useAgendamentos();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleOpen = () => {
            if (!isAuthenticated) {
                toast.error('Você precisa estar logado para agendar');
                return;
            }
            setIsOpen(true);
        };

        window.addEventListener('open-global-agendamento-modal', handleOpen);
        return () => window.removeEventListener('open-global-agendamento-modal', handleOpen);
    }, [isAuthenticated]);

    const handleSave = async (novo: any) => {
        const { error } = await criar({
            data_inicial: novo.dataInicio,
            data_final: novo.dataFim,
            tipo_agendamento: novo.tipo,
            observacao: novo.observacao || null,
        });

        if (error) {
            toast.error(error);
        } else {
            toast.success('Agendamento criado com sucesso!');
            setIsOpen(false);
            // O refetch já é chamado dentro do hook criar (atualizando o estado local), 
            // mas disparar um evento pode ajudar outros componentes
            window.dispatchEvent(new CustomEvent('agendamento-criado'));
        }
    };

    return (
        <DrawerAgendamento
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            mode="create"
            variant="modal"
            onSave={handleSave}
            anchorRef={null as any}
        />
    );
};

export default GlobalAgendamentoModal;
