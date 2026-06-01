import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseServerClient(request, response) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  return client;
}

export { supabaseUrl, supabaseAnonKey };