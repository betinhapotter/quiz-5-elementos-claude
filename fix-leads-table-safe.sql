-- =====================================================
-- SCRIPT DE CORREÇÃO SEGURO: Adiciona coluna user_id na tabela leads
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. Adiciona a coluna user_id se ela não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE leads 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Coluna user_id adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna user_id já existe.';
    END IF;
END $$;

-- 2. Adiciona outras colunas se não existirem
DO $$ 
BEGIN
    -- Adiciona lowest_element se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'lowest_element'
    ) THEN
        ALTER TABLE leads 
        ADD COLUMN lowest_element TEXT CHECK (lowest_element IN ('terra', 'agua', 'ar', 'fogo', 'eter'));
    END IF;
    
    -- Adiciona pattern se não existir
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'pattern'
    ) THEN
        ALTER TABLE leads 
        ADD COLUMN pattern TEXT;
    END IF;
END $$;

-- 3. Cria os índices (IF NOT EXISTS já trata duplicatas)
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- 4. Habilita RLS se ainda não estiver habilitado
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 5. Cria as políticas (se já existirem, vai dar erro, mas é seguro ignorar)
-- Primeiro tenta criar, se der erro de "já existe", tudo bem
DO $$ 
BEGIN
    -- Tenta criar a política de INSERT
    BEGIN
        CREATE POLICY "Anyone can insert leads"
          ON leads FOR INSERT
          WITH CHECK (true);
        RAISE NOTICE 'Política de INSERT criada.';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Política de INSERT já existe.';
    END;
    
    -- Tenta criar a política de SELECT
    BEGIN
        CREATE POLICY "Users can view own leads"
          ON leads FOR SELECT
          USING (auth.uid() = user_id OR auth.uid() IS NULL);
        RAISE NOTICE 'Política de SELECT criada.';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Política de SELECT já existe.';
    END;
END $$;

-- =====================================================
-- PRONTO! A tabela leads agora está corrigida.
-- =====================================================

