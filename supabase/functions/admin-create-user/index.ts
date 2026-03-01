import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceRole) {
            throw new Error("Erro de configuração: Faltam segredos (secrets) no servidor.")
        }

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Cabeçalho de autorização ausente.')

        // Criar cliente ADMIN para garantir que temos poder de verificação
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

        // Validar o Token do usuário que está chamando
        const token = authHeader.replace('Bearer ', '')
        const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !caller) {
            throw new Error("Sessão inválida. Tente sair e entrar no sistema novamente.")
        }

        // Verificar na tabela profiles se ele é admin
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('perfil')
            .eq('id', caller.id)
            .single()

        if (profileError || profile?.perfil !== 'administrador') {
            throw new Error('Acesso negado: Apenas administradores podem criar novos usuários.')
        }

        // Pegar dados para criação
        const { email, password, nome, cargo, matricula, perfil, ativo } = await req.json()

        console.log(`🔨 Criando conta para: ${email}`)

        const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nome }
        })

        if (createUserError) throw createUserError

        const { error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: authData.user.id,
                nome,
                email,
                cargo: cargo || null,
                matricula: matricula || null,
                perfil: perfil || 'conferente',
                ativo: ativo !== undefined ? ativo : true
            })

        if (insertError) {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            throw insertError
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (error) {
        console.error("❌ Erro:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        })
    }
})
