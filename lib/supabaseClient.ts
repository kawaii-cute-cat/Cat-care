import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined

// Create a dummy client if env vars are missing to prevent crashes
const createDummyClient = () => ({
  from: () => ({
    select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
    update: () => ({ eq: () => ({ data: null, error: null }) }),
    delete: () => ({ eq: () => ({ data: null, error: null }) }),
    upsert: () => ({ eq: () => ({ data: null, error: null }) })
  })
})

const client = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient()

// eslint-disable-next-line no-console
console.log('[Supabase] URL present:', Boolean(supabaseUrl), 'Key present:', Boolean(supabaseAnonKey))

export const supabase = client as any

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
