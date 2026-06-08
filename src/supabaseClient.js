import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Kunci API Supabase tidak ditemukan! Periksa kembali file .env.local kamu.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
