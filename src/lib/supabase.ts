import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback values to prevent crashes if not set yet
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Logging a clear warning if env vars are missing
export const isSupabaseConfigured = 
  !!metaEnv.VITE_SUPABASE_URL && 
  !!metaEnv.VITE_SUPABASE_ANON_KEY &&
  metaEnv.VITE_SUPABASE_URL !== 'https://placeholder-project.supabase.co';

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing or set to defaults. ' +
    'Backend submissions will operate in fallback/simulation mode.'
  );
}

// Create a single Supabase client for client-side use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
