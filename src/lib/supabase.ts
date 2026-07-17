import { createClient } from '@supabase/supabase-js';

// Helper to validate if a string is a valid HTTP/HTTPS URL
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

// Get environment variables with fallback values to prevent crashes if not set yet
const metaEnv = (import.meta as any).env || {};
const rawSupabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseUrl = isValidUrl(rawSupabaseUrl) ? rawSupabaseUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Logging a clear warning if env vars are missing
export const isSupabaseConfigured = 
  !!metaEnv.VITE_SUPABASE_URL && 
  isValidUrl(rawSupabaseUrl) &&
  rawSupabaseUrl !== 'https://placeholder-project.supabase.co' &&
  !rawSupabaseUrl.includes('your-supabase-project');

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing or set to defaults. ' +
    'Backend submissions will operate in fallback/simulation mode.'
  );
}

// Create a single Supabase client for client-side use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
