import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o banco de dados
export interface QuizResult {
  id?: string;
  user_id: string;
  terra_score: number;
  agua_score: number;
  ar_score: number;
  fogo_score: number;
  eter_score: number;
  lowest_element: string;
  raw_answers: Record<string, number>;
  created_at?: string;
}

export interface Planner {
  id?: string;
  user_id: string;
  quiz_result_id: string;
  element_focus: string;
  content: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
}
