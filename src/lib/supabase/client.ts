import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Debug: verifica se as variáveis estão definidas
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables missing:', {
      url: !!supabaseUrl,
      key: !!supabaseKey,
    });
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
