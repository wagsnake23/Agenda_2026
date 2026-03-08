-- ============================================================
-- SQL: Atualização de RLS e Acesso para Calendar Events
-- ============================================================

-- 1. Garantir que a coluna 'created_by' existe na tabela 'calendar_events'
ALTER TABLE public.calendar_events 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Habilitar RLS na tabela
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 3. Limpeza de políticas existentes (se houver)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "calendar_events_select_authenticated" ON public.calendar_events;
    DROP POLICY IF EXISTS "calendar_events_insert_authenticated" ON public.calendar_events;
    DROP POLICY IF EXISTS "calendar_events_update" ON public.calendar_events;
    DROP POLICY IF EXISTS "calendar_events_delete" ON public.calendar_events;
END $$;

-- 4. Criação das novas políticas

-- VISIBILIDADE: Qualquer usuário autenticado pode ver todos os eventos
CREATE POLICY "calendar_events_select_authenticated"
  ON public.calendar_events FOR SELECT
  TO authenticated
  USING (true);

-- CRIAÇÃO: Qualquer usuário autenticado pode criar eventos
CREATE POLICY "calendar_events_insert_authenticated"
  ON public.calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Supabase preenche created_by automaticamente pelo DEFAULT se não for enviado

-- EDIÇÃO: Admin pode tudo, outros apenas os que criaram
CREATE POLICY "calendar_events_update"
  ON public.calendar_events FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = created_by) OR 
    (public.get_my_perfil() = 'administrador')
  )
  WITH CHECK (
    (auth.uid() = created_by) OR 
    (public.get_my_perfil() = 'administrador')
  );

-- EXCLUSÃO: Admin pode tudo, outros apenas os que criaram
CREATE POLICY "calendar_events_delete"
  ON public.calendar_events FOR DELETE
  TO authenticated
  USING (
    (auth.uid() = created_by) OR 
    (public.get_my_perfil() = 'administrador')
  );
