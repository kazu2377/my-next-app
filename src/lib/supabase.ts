import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type ReservationType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  time: string;
  date: string;
  created_at: string;
};