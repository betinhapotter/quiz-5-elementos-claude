-- =====================================================
-- QUIZ DOS 5 ELEMENTOS - DATABASE SETUP
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. Tabela de resultados do quiz
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Scores de cada elemento (2-8)
  terra_score INTEGER NOT NULL CHECK (terra_score >= 2 AND terra_score <= 8),
  agua_score INTEGER NOT NULL CHECK (agua_score >= 2 AND agua_score <= 8),
  ar_score INTEGER NOT NULL CHECK (ar_score >= 2 AND ar_score <= 8),
  fogo_score INTEGER NOT NULL CHECK (fogo_score >= 2 AND fogo_score <= 8),
  eter_score INTEGER NOT NULL CHECK (eter_score >= 2 AND eter_score <= 8),
  
  -- Elemento identificado como mais baixo
  lowest_element TEXT NOT NULL CHECK (lowest_element IN ('terra', 'agua', 'ar', 'fogo', 'eter')),
  lowest_score INTEGER NOT NULL,
  
  -- Segundo elemento mais baixo (opcional)
  second_lowest_element TEXT CHECK (second_lowest_element IN ('terra', 'agua', 'ar', 'fogo', 'eter')),
  
  -- Padrão identificado (opcional)
  pattern TEXT,
  
  -- Respostas brutas em JSON
  raw_answers JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de planners gerados
CREATE TABLE IF NOT EXISTS planners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE CASCADE,
  
  -- Elemento foco do planner
  element_focus TEXT NOT NULL CHECK (element_focus IN ('terra', 'agua', 'ar', 'fogo', 'eter')),
  
  -- Conteúdo do planner (Markdown gerado pela IA)
  content TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_planners_user_id ON planners(user_id);
CREATE INDEX IF NOT EXISTS idx_planners_quiz_result_id ON planners(quiz_result_id);

-- 4. Row Level Security (RLS) - IMPORTANTE!
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE planners ENABLE ROW LEVEL SECURITY;

-- Políticas para quiz_results
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz results"
  ON quiz_results FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para planners
CREATE POLICY "Users can view own planners"
  ON planners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planners"
  ON planners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para quiz_results
DROP TRIGGER IF EXISTS update_quiz_results_updated_at ON quiz_results;
CREATE TRIGGER update_quiz_results_updated_at
  BEFORE UPDATE ON quiz_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PRONTO! Agora configure o Google OAuth:
-- 
-- 1. Vá em Authentication > Providers > Google
-- 2. Ative o Google
-- 3. No Google Cloud Console (console.cloud.google.com):
--    - Crie credenciais OAuth 2.0
--    - Tipo: Web application
--    - URI de redirecionamento: 
--      https://gytyvacakzqofpnsutdk.supabase.co/auth/v1/callback
-- 4. Cole Client ID e Secret no Supabase
-- =====================================================
