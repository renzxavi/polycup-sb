import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server', // SSR necesario para Supabase auth en Vercel
  // Para Vercel: instalar @astrojs/vercel y descomentar:
  // adapter: vercel(),
});
