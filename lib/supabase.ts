// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase configuration')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export type Todo = {
  id: string
  user_id: string
  title: string
  description?: string
  is_complete: boolean
  created_at: string
  updated_at: string
}

// Custom hook for Supabase auth state
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

// Todo CRUD operations
export const todoApi = {
  async getAllTodos(userId: string) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Todo[]
  },

  async createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('todos')
      .insert(todo)
      .select()
      .single()

    if (error) throw error
    return data as Todo
  },

  async updateTodo(id: string, updates: Partial<Todo>) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Todo
  },

  async deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}