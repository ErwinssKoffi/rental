import { createClient } from "@supabase/supabase-js";

// Client Supabase anonyme SANS gestion de session/cookies, destiné aux lectures
// publiques du catalogue dans les Server Components. Comme il n'accède pas aux
// cookies, les pages restent prégénérables (SSG/ISR). La sécurité des données
// reste garantie par les politiques RLS du rôle `anon`.
let cachedClient;

export function getAnonClient() {
  if (!cachedClient) {
    cachedClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return cachedClient;
}
