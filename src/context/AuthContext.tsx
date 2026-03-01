import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/modules/auth/types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signUp: (email: string, password: string, nome: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => void;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false);

    /**
     * Limpeza total de estado e persistência local
     */
    const clearAuthState = useCallback(() => {
        setSession(null);
        setUser(null);
        setProfile(null);
        // Opcional: Limpar caches específicos se houver
    }, []);

    /**
     * Busca perfil do banco de dados de forma segura
     */
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('[Auth] Erro ao buscar perfil (usuário pode não ter perfil ainda):', error.message);
                return null;
            }
            return data as Profile;
        } catch (err) {
            console.error('[Auth] Erro inesperado ao buscar perfil:', err);
            return null;
        }
    }, []);

    /**
     * Sincroniza o estado do React com os dados do Supabase
     */
    const syncAuthState = useCallback(async (currentSession: Session | null) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            const p = await fetchProfile(currentUser.id);
            setProfile(p);

            // Verificação de segurança: se o usuário logado estiver inativo, forçar logout
            if (p && !p.ativo) {
                console.warn('[Auth] Usuário inativo detectado. Forçando logout.');
                await supabase.auth.signOut();
                clearAuthState();
            }
        } else {
            setProfile(null);
        }
    }, [fetchProfile, clearAuthState]);

    /**
     * Efeito de inicialização e monitoramento global de sessão
     */
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const initAuth = async () => {
            try {
                setLoading(true);

                // getUser() é mais seguro que getSession() pois valida o token no servidor
                const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

                if (userError || !currentUser) {
                    console.log('[Auth] Nenhuma sessão ativa ou sessão inválida detectada.');
                    const { data: { session: currentSession } } = await supabase.auth.getSession();
                    if (currentSession) {
                        // Se existe sessão mas getUser falhou, a sessão é provavelmente inválida (troca de projeto)
                        console.warn('[Auth] Sessão inconsistente detectada. Limpando...');
                        await supabase.auth.signOut();
                    }
                    clearAuthState();
                } else {
                    const { data: { session: currentSession } } = await supabase.auth.getSession();
                    await syncAuthState(currentSession);
                }
            } catch (err) {
                console.error('[Auth] Erro crítico na inicialização do Auth:', err);
                clearAuthState();
            } finally {
                setLoading(false);
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log(`[Auth] Evento detectado: ${event}`);

            if (event === 'SIGNED_OUT') {
                clearAuthState();
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                await syncAuthState(newSession);
            }

            setLoading(false);
        });

        initAuth();

        return () => {
            subscription.unsubscribe();
        };
    }, [syncAuthState, clearAuthState]);

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        try {
            console.log('[Auth] Tentando login para:', email);
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('[Auth] Erro no signInWithPassword:', error.message);
                return { error: error.message };
            }

            if (data.user) {
                console.log('[Auth] Login bem-sucedido, sincronizando usuário:', data.user.id);
                await syncAuthState(data.session);

                const p = await fetchProfile(data.user.id);
                if (p && !p.ativo) {
                    console.warn('[Auth] Usuário desativado, deslogando...');
                    await supabase.auth.signOut();
                    clearAuthState();
                    return { error: 'Sua conta foi desativada. Entre em contato com o administrador.' };
                }
            }

            console.log('[Auth] Processo de login concluído com sucesso');
            return { error: null };
        } catch (err: any) {
            console.error('[Auth] Erro crítico no processo de login:', err);
            return { error: err.message || 'Erro inesperado ao entrar' };
        }
    };

    const signUp = async (email: string, password: string, nome: string): Promise<{ error: string | null }> => {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) return { error: error.message };

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        nome,
                        email,
                        perfil: 'conferente',
                        ativo: true,
                    });

                if (profileError) {
                    console.error('[Auth] Erro ao criar perfil:', profileError);
                    return { error: 'Erro ao criar perfil. Tente novamente.' };
                }
            }
            return { error: null };
        } catch (err: any) {
            return { error: err.message || 'Erro ao cadastrar' };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('[Auth] Erro ao deslogar do Supabase:', err);
        } finally {
            clearAuthState();
            // Redirecionamento é tratado nos componentes protegidos ou via ProtectedRoute
        }
    };

    const refreshProfile = useCallback(async () => {
        if (!user) return;
        const p = await fetchProfile(user.id);
        setProfile(p);
    }, [user, fetchProfile]);

    const updateProfile = (updates: Partial<Profile>) => {
        setProfile(prev => prev ? { ...prev, ...updates } : prev);
    };

    const isAdmin = profile?.perfil === 'administrador';
    const isAuthenticated = !!user; // focado no usuário validado

    return (
        <AuthContext.Provider value={{
            session,
            user,
            profile,
            loading,
            signIn,
            signUp,
            signOut,
            refreshProfile,
            updateProfile,
            isAdmin,
            isAuthenticated,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
