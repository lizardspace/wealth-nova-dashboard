// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour TypeScript
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          title: string
          client: string
          advisor: string
          type: 'consultation' | 'suivi' | 'signature' | 'prospection' | 'formation'
          date: string
          time: string
          duration: number
          status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client: string
          advisor: string
          type: 'consultation' | 'suivi' | 'signature' | 'prospection' | 'formation'
          date: string
          time: string
          duration: number
          status?: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          client?: string
          advisor?: string
          type?: 'consultation' | 'suivi' | 'signature' | 'prospection' | 'formation'
          date?: string
          time?: string
          duration?: number
          status?: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}