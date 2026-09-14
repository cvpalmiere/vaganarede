import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// client anonimo - respeita RLS, seguro pra logica que roda a partir do usuario autenticado
export const supabaseAnon = createClient(supabaseUrl, anonKey);

// client admin - ignora RLS, so pode ser importado em codigo server-side (route handlers, server actions)
// o import 'server-only' no topo quebra o build se algum componente client tentar importar este arquivo
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});