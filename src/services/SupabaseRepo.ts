import { supabase } from '../../lib/supabaseClient'
import type { Cat, Reminder } from '../types'

function hasSupabaseEnv(): boolean {
  return Boolean((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY)
}

function getDeviceUserId(): string {
  const key = 'catcare_user_id'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(key, id)
  return id
}

export const SupabaseRepo = {
  isEnabled(): boolean {
    return hasSupabaseEnv()
  },

  async upsertProfile(email?: string | null) {
    if (!this.isEnabled()) return
    const id = getDeviceUserId()
    await supabase.from('profiles').upsert({ id, email: email ?? null }).eq('id', id)
  },

  async listCats(): Promise<Cat[]> {
    if (!this.isEnabled()) return []
    const owner_id = getDeviceUserId()
    const { data, error } = await supabase
      .from('cats')
      .select('*')
      .eq('owner_id', owner_id)
      .order('created_at', { ascending: true })
    if (error || !data) { console.warn('[Supabase] listCats error:', error); return [] }
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      breed: row.breed ?? '',
      age: Number(row.age ?? 0),
      weight: Number(row.weight_kg ?? 0),
      color: row.color ?? '',
      photos: [],
      microchip: row.microchip ?? undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at)
    }))
  },

  async addCat(cat: Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cat | null> {
    if (!this.isEnabled()) return null
    const owner_id = getDeviceUserId()
    const insert = {
      owner_id,
      name: cat.name,
      breed: cat.breed ?? null,
      weight_kg: cat.weight ?? null,
      color: cat.color ?? null,
      microchip: cat.microchip ?? null
    }
    let data: any = null; let error: any = null
    try {
      const resp: any = await (supabase as any).from('cats').insert(insert).select('*').single()
      data = resp.data; error = resp.error
    } catch (e) { error = e }
    if (error || !data) { console.warn('[Supabase] addCat error:', error); return null }
    return {
      id: data.id,
      name: data.name,
      breed: data.breed ?? '',
      age: cat.age,
      weight: Number(data.weight_kg ?? 0),
      color: data.color ?? '',
      microchip: data.microchip ?? undefined,
      photos: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at)
    }
  },

  async updateCat(cat: Cat): Promise<void> {
    if (!this.isEnabled()) return
    try { await supabase.from('cats').update({
      name: cat.name,
      breed: cat.breed,
      weight_kg: cat.weight,
      color: cat.color,
      microchip: cat.microchip ?? null
    }).eq('id', cat.id) } catch (e) { console.warn('[Supabase] updateCat error:', e) }
  },

  async deleteCat(id: string): Promise<void> {
    if (!this.isEnabled()) return
    try { await supabase.from('cats').delete().eq('id', id) } catch (e) { console.warn('[Supabase] deleteCat error:', e) }
  },

  async listReminders(): Promise<Reminder[]> {
    if (!this.isEnabled()) return []
    const owner_id = getDeviceUserId()
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('owner_id', owner_id)
      .order('created_at', { ascending: true })
    if (error || !data) { console.warn('[Supabase] listReminders error:', error); return [] }
    return data.map((row: any) => ({
      id: row.id,
      catId: row.cat_id ?? row.catId ?? '',
      title: row.title,
      description: row.description ?? undefined,
      type: row.type,
      scheduledTime: new Date(row.due_at),
      frequency: row.frequency ?? 'once',
      isActive: row.is_active ?? true,
      isCompleted: row.completed ?? false,
      notificationEnabled: row.notification_enabled ?? true,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.created_at)
    }))
  },

  async addReminder(rem: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder | null> {
    if (!this.isEnabled()) return null
    const owner_id = getDeviceUserId()
    const insert = {
      owner_id,
      cat_id: rem.catId,
      title: rem.title,
      description: rem.description ?? null,
      type: rem.type,
      due_at: rem.scheduledTime.toISOString(),
      frequency: rem.frequency,
      completed: rem.isCompleted ?? false,
      is_active: rem.isActive ?? true,
      notification_enabled: rem.notificationEnabled ?? true
    }
    let data: any = null; let error: any = null
    try {
      const resp: any = await (supabase as any).from('reminders').insert(insert).select('*').single()
      data = resp.data; error = resp.error
    } catch (e) { error = e }
    if (error || !data) { console.warn('[Supabase] addReminder error:', error); return null }
    return {
      id: data.id,
      catId: data.cat_id,
      title: data.title,
      description: data.description ?? undefined,
      type: data.type,
      scheduledTime: new Date(data.due_at),
      frequency: data.frequency ?? 'once',
      isActive: Boolean(data.is_active),
      isCompleted: Boolean(data.completed),
      notificationEnabled: Boolean(data.notification_enabled),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.created_at)
    }
  },

  async updateReminder(rem: Reminder): Promise<void> {
    if (!this.isEnabled()) return
    try { await supabase.from('reminders').update({
      title: rem.title,
      description: rem.description ?? null,
      type: rem.type,
      due_at: rem.scheduledTime.toISOString(),
      frequency: rem.frequency,
      completed: rem.isCompleted,
      is_active: rem.isActive,
      notification_enabled: rem.notificationEnabled
    }).eq('id', rem.id) } catch (e) { console.warn('[Supabase] updateReminder error:', e) }
  },

  async deleteReminder(id: string): Promise<void> {
    if (!this.isEnabled()) return
    try { await supabase.from('reminders').delete().eq('id', id) } catch (e) { console.warn('[Supabase] deleteReminder error:', e) }
  }
}

export function getLocalUserId() {
  return getDeviceUserId()
}

