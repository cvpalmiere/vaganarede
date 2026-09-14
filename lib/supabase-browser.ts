import { createClient } from '@supabase/supabase-js';

// client separado, sem 'server-only' - este e o unico seguro pra importar em componentes client
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);