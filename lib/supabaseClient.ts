import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

export type Tables = {
  profiles: {
    Row: { id: string; email: string | null; created_at: string }
    Insert: { id: string; email?: string | null }
    Update: { email?: string | null }
  }
  cats: {
    Row: { id: string; owner_id: string; name: string; breed: string | null; weight_kg: number | null; created_at: string }
    Insert: { id?: string; owner_id: string; name: string; breed?: string | null; weight_kg?: number | null }
    Update: { name?: string; breed?: string | null; weight_kg?: number | null }
  }
  reminders: {
    Row: { id: string; owner_id: string; title: string; due_at: string; created_at: string; completed: boolean }
    Insert: { id?: string; owner_id: string; title: string; due_at: string; completed?: boolean }
    Update: { title?: string; due_at?: string; completed?: boolean }
  }
}

export function getSupabase() {
  return supabase
}
