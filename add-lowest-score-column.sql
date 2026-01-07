-- =====================================================
-- Adiciona coluna lowest_score na tabela leads
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Adiciona a coluna lowest_score se ela não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'leads' 
        AND column_name = 'lowest_score'
    ) THEN
        ALTER TABLE leads 
        ADD COLUMN lowest_score INTEGER;
        
        RAISE NOTICE 'Coluna lowest_score adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna lowest_score já existe.';
    END IF;
END $$;

-- =====================================================
-- PRONTO! A coluna lowest_score foi adicionada.
-- =====================================================

