import { createClient } from '@supabase/supabase-js'

// Si falta el .env (p. ej. al compilar en otra PC), no rompemos la app:
// usamos una URL de ejemplo y la app entra en MODO DEMO (ver lib/demoBackend.js).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
