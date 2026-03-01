"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, LoginInput } from '@/modules/auth/schemas';
import { Toaster } from 'sonner';

const AuthPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, from]);

    const loginForm = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleLogin = async (data: LoginInput) => {
        const { error } = await signIn(data.email, data.password);
        if (error) {
            toast.error(error.includes('Invalid login credentials')
                ? 'Email ou senha incorretos'
                : error
            );
        } else {
            toast.success('Login realizado com sucesso!');
            navigate(from, { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1221] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-[#0B1221] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">

            {/* Logo lateral esquerda superior como botão link */}
            <div className="absolute top-6 left-6 z-[60]">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 group transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <img src="/logo-bombeiros.png" alt="Brasão" className="w-10 h-10 object-contain drop-shadow-md" />
                    <div className="flex items-center gap-2 text-blue-900 md:text-white">
                        <span className="font-black text-sm md:text-base uppercase tracking-[3px] leading-none whitespace-nowrap">Bombeiros Agudos</span>
                    </div>
                </button>
            </div>

            <div className="w-full max-w-[390px] relative z-10">
                {/* Card de Login - No Mobile fundo branco direto, no Desktop com Card */}
                <div className="bg-white md:bg-[#F8FAFC] md:rounded-[40px] md:shadow-2xl overflow-hidden px-4 md:px-8 pt-8 md:pt-6 pb-6 md:pb-5 flex flex-col items-center md:border md:border-white/10">

                    {/* Logo Original */}
                    <img
                        src="/logo.png"
                        alt="Calendário"
                        className="w-20 md:w-20 h-20 md:h-20 drop-shadow-[0_10px_30px_rgba(37,99,235,0.3)] object-contain filter brightness-[1.1] mb-6 md:mb-3 transform hover:scale-105 transition-transform duration-500"
                    />

                    {/* Títulos com Gradiente Premium */}
                    <div className="text-center mb-8 md:mb-5">
                        <h1
                            className="font-black text-xl uppercase tracking-[2px] leading-tight"
                            style={{
                                background: 'linear-gradient(to bottom, #FF4D4D 0%, #D32F2F 50%, #8B0000 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Calendário de Prontidão
                        </h1>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="w-full space-y-5 md:space-y-3">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-slate-500 md:text-slate-700 text-xs font-black uppercase tracking-wider ml-1 opacity-70">Email</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                                <input
                                    {...loginForm.register('email')}
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full h-12 md:h-12 pl-12 pr-4 rounded-2xl bg-[#E8F0FE] border border-slate-300 md:border-slate-300/50 text-slate-800 placeholder-slate-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            {loginForm.formState.errors.email && (
                                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-tighter italic">
                                    {loginForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Senha */}
                        <div className="space-y-2">
                            <label className="text-slate-500 md:text-slate-700 text-xs font-black uppercase tracking-wider ml-1 opacity-70">Senha</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔐</span>
                                <input
                                    {...loginForm.register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full h-12 md:h-12 pl-12 pr-12 rounded-2xl bg-[#E8F0FE] border border-slate-300 md:border-slate-300/50 text-slate-800 placeholder-slate-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {loginForm.formState.errors.password && (
                                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase tracking-tighter italic">
                                    {loginForm.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Botão Entrar Anterior (Texto e Ícones) */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loginForm.formState.isSubmitting}
                                className="w-full h-12 md:h-12 rounded-2xl bg-gradient-to-b from-[#E53935] to-[#B71C1C] hover:from-[#EF5350] hover:to-[#C62828] text-white font-black text-sm md:text-base uppercase tracking-widest shadow-[0_5px_0_#991B1B,0_10px_20px_rgba(183,28,28,0.25)] active:translate-y-[4px] active:shadow-[0_1px_0_#991B1B] transition-all duration-150 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 border border-white/10"
                            >
                                {loginForm.formState.isSubmitting ? (
                                    <><Loader2 size={24} className="animate-spin" /> Entrando...</>
                                ) : (
                                    <>🚀 Entrar</>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Esqueci a Senha */}
                    <button
                        type="button"
                        className="mt-8 text-slate-400 md:text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-[#E53935] transition-all"
                        onClick={() => toast.info('Entre em contato com o administrador para resetar sua senha.')}
                    >
                        Esqueceu sua senha?
                    </button>

                    {/* Rodapé Atualizado */}
                    <div className="mt-8 md:mt-5 text-slate-600 md:text-slate-500 text-[10px] font-black uppercase tracking-wider">
                        © 2026 - Calendário Prontidão -  by Vagner
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
