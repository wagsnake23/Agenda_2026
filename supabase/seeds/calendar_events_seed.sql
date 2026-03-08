-- ============================================================
-- SEED: calendar_events
-- Estrutura confirmada da tabela:
--   id, title, description, type (enum), date (DATE), is_active,
--   is_fixed, color_mode (enum), emoji, created_by, created_at, updated_at
--
-- Para eventos is_fixed=true (anuais):
--   Usamos ano 2000 como referência — a lógica compara só mês/dia.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. FERIADOS FIXOS (type='holiday', is_fixed=true, color_mode='holiday')
-- ────────────────────────────────────────────────────────────

INSERT INTO calendar_events (title, "date", type, is_fixed, color_mode, emoji, is_active)
SELECT v_title, v_date::date, v_type::calendar_event_type, v_fixed, v_color::calendar_color_mode, v_emoji, v_active
FROM (VALUES
  ('Ano Novo',                     '2000-01-01', 'holiday', true,  'holiday',    '🍾',   true),
  ('Tiradentes',                   '2000-04-21', 'holiday', true,  'holiday',    '⚔️',  true),
  ('Dia do Trabalho',              '2000-05-01', 'holiday', true,  'holiday',    '💼',   true),
  ('Independência do Brasil',      '2000-09-07', 'holiday', true,  'holiday',    '🇧🇷', true),
  ('Nossa Senhora Aparecida',      '2000-10-12', 'holiday', true,  'holiday',    '🙏',   true),
  ('Dia do Servidor Público',      '2000-10-28', 'holiday', true,  'holiday',    '👨‍💻', true),
  ('Finados',                      '2000-11-02', 'holiday', true,  'holiday',    '💀',   true),
  ('Proclamação da República',     '2000-11-15', 'holiday', true,  'holiday',    '🏛️',  true),
  ('Dia da Consciência Negra',     '2000-11-20', 'holiday', true,  'holiday',    '✊🏿', true),
  ('Natal',                        '2000-12-25', 'holiday', true,  'holiday',    '🎄',   true),
  ('Revolução Constitucionalista', '2000-07-09', 'holiday', true,  'holiday',    '⚔️',  true),
  ('Aniversário de São Paulo',     '2000-01-25', 'holiday', true,  'holiday',    '🎉',   true),
  ('Aniversário de Agudos',        '2000-07-27', 'holiday', true,  'holiday',    '🎉',   true)
) AS t(v_title, v_date, v_type, v_fixed, v_color, v_emoji, v_active);

-- ────────────────────────────────────────────────────────────
-- 2. DATAS MÓVEIS - 2025 (is_fixed=false)
-- ────────────────────────────────────────────────────────────

INSERT INTO calendar_events (title, "date", type, is_fixed, color_mode, emoji, is_active)
SELECT v_title, v_date::date, v_type::calendar_event_type, v_fixed, v_color::calendar_color_mode, v_emoji, v_active
FROM (VALUES
  ('Carnaval',               '2025-03-03', 'holiday', false, 'holiday',    '🎭', true),
  ('Quarta-feira de Cinzas', '2025-03-05', 'holiday', false, 'event_only', '⚱️', true),
  ('Sexta-feira Santa',      '2025-04-18', 'holiday', false, 'holiday',    '✝️', true),
  ('Páscoa',                 '2025-04-20', 'holiday', false, 'holiday',    '🥚', true),
  ('Corpus Christi',         '2025-06-19', 'holiday', false, 'holiday',    '⛪', true),
  ('Dia das Mães',           '2025-05-11', 'event',   false, 'event_only', '🤱', true),
  ('Dia dos Pais',           '2025-08-10', 'event',   false, 'event_only', '👨‍👦', true)
) AS t(v_title, v_date, v_type, v_fixed, v_color, v_emoji, v_active);

-- ────────────────────────────────────────────────────────────
-- 2. DATAS MÓVEIS - 2026 (is_fixed=false)
-- ────────────────────────────────────────────────────────────

INSERT INTO calendar_events (title, "date", type, is_fixed, color_mode, emoji, is_active)
SELECT v_title, v_date::date, v_type::calendar_event_type, v_fixed, v_color::calendar_color_mode, v_emoji, v_active
FROM (VALUES
  ('Carnaval',               '2026-02-16', 'holiday', false, 'holiday',    '🎭', true),
  ('Quarta-feira de Cinzas', '2026-02-18', 'holiday', false, 'event_only', '⚱️', true),
  ('Sexta-feira Santa',      '2026-04-03', 'holiday', false, 'holiday',    '✝️', true),
  ('Páscoa',                 '2026-04-05', 'holiday', false, 'holiday',    '🥚', true),
  ('Corpus Christi',         '2026-06-04', 'holiday', false, 'holiday',    '⛪', true),
  ('Dia das Mães',           '2026-05-10', 'event',   false, 'event_only', '🤱', true),
  ('Dia dos Pais',           '2026-08-09', 'event',   false, 'event_only', '👨‍👦', true)
) AS t(v_title, v_date, v_type, v_fixed, v_color, v_emoji, v_active);

-- ────────────────────────────────────────────────────────────
-- 3. ESTAÇÕES DO ANO (type='event', is_fixed=true, color_mode='event_only')
-- ────────────────────────────────────────────────────────────

INSERT INTO calendar_events (title, "date", type, is_fixed, color_mode, emoji, is_active)
SELECT v_title, v_date::date, v_type::calendar_event_type, v_fixed, v_color::calendar_color_mode, v_emoji, v_active
FROM (VALUES
  ('Início do Verão',     '2000-12-21', 'event', true, 'event_only', '🌞', true),
  ('Início do Outono',    '2000-03-20', 'event', true, 'event_only', '🍂', true),
  ('Início do Inverno',   '2000-06-21', 'event', true, 'event_only', '❄️', true),
  ('Início da Primavera', '2000-09-22', 'event', true, 'event_only', '🌸', true)
) AS t(v_title, v_date, v_type, v_fixed, v_color, v_emoji, v_active);

-- ────────────────────────────────────────────────────────────
-- 4. DIAS ESPECIAIS (type='event', is_fixed=true, color_mode='event_only')
-- ────────────────────────────────────────────────────────────

INSERT INTO calendar_events (title, "date", type, is_fixed, color_mode, emoji, is_active)
SELECT v_title, v_date::date, v_type::calendar_event_type, v_fixed, v_color::calendar_color_mode, v_emoji, v_active
FROM (VALUES
  ('Dia Internacional da Mulher', '2000-03-08', 'event', true, 'event_only', '🌹', true),
  ('Dia dos Namorados',           '2000-06-12', 'event', true, 'event_only', '❤️', true),
  ('Dia do Bombeiro',             '2000-07-02', 'event', true, 'event_only', '👨‍🚒', true)
) AS t(v_title, v_date, v_type, v_fixed, v_color, v_emoji, v_active);

-- ============================================================
-- Verificação final
-- ============================================================
SELECT type, count(*) as total FROM calendar_events GROUP BY type ORDER BY type;
