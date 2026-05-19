import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Cliente server-side para páginas Astro (SSR)
// Sin @supabase/ssr — manejo manual de cookies
export function createSupabaseServerClient(request, response) {
  const cookies = parseCookies(request.headers.get('cookie') || '');

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const accessToken = cookies['sb-access-token'];
  const refreshToken = cookies['sb-refresh-token'];

  if (accessToken && refreshToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return client;
}

function parseCookies(cookieHeader) {
  const cookies = {};
  cookieHeader.split(';').forEach(pair => {
    const [key, ...val] = pair.trim().split('=');
    if (key) cookies[key.trim()] = decodeURIComponent(val.join('='));
  });
  return cookies;
}

export function setAuthCookies(response, session) {
  if (!session) return;
  const opts = 'Path=/; HttpOnly; SameSite=Lax; Max-Age=604800';
  response.headers.append('Set-Cookie', `sb-access-token=${session.access_token}; ${opts}`);
  response.headers.append('Set-Cookie', `sb-refresh-token=${session.refresh_token}; ${opts}`);
}

export function clearAuthCookies(response) {
  response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; Max-Age=0');
  response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; Max-Age=0');
}

export { supabaseUrl, supabaseAnonKey };