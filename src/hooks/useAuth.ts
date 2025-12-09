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
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
