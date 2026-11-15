import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Kredensial Publik Supabase (SEC-02 Compliant)
const defaultUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const defaultAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const getSupabaseClient = (): SupabaseClient | null => {
  if (typeof window === 'undefined') {
    if (defaultUrl && defaultAnonKey && !defaultUrl.includes('your-project-id')) {
      return createClient(defaultUrl, defaultAnonKey);
    }
    return null;
  }

  // Sisi browser: Utamakan LocalStorage jika user menginput via UI Settings
  const localUrl = localStorage.getItem('ST_SUPABASE_URL') || defaultUrl;
  const localAnonKey = localStorage.getItem('ST_SUPABASE_ANON_KEY') || defaultAnonKey;

  if (localUrl && localAnonKey && !localUrl.includes('your-project-id')) {
    try {
      return createClient(localUrl, localAnonKey);
    } catch (e) {
      console.warn('Gagal membuat Supabase Client:', e);
      return null;
    }
  }

  return null;
};
