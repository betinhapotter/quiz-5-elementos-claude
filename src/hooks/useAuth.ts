'use client';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;

    // Verifica usuário atual
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Auth error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseRef.current.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}