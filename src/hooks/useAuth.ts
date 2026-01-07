'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Verifica usuário atual
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log('🔐 Auth Check:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          error: error?.message
        });

        // Só considera autenticado se tiver sessão E usuário válido
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Auth error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, !!session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Faz logout no Supabase com scope global para limpar em todos os dispositivos
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
      }
      
      // Limpa o estado local imediatamente
      setUser(null);
      
      // Aguarda um pouco para garantir que o logout foi processado
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Limpa todos os cookies relacionados ao Supabase manualmente
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        // Remove cookies do Supabase
        if (name.startsWith('sb-') || name.includes('supabase')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });
      
      // Força recarregamento completo da página para limpar todos os estados
      // Usa replace para não manter histórico
      window.location.replace(window.location.origin);
    } catch (err) {
      console.error('Erro inesperado ao fazer logout:', err);
      // Mesmo com erro, força redirecionamento
      window.location.replace(window.location.origin);
    }
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
