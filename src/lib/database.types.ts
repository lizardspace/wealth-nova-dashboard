export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ia_recommendations: {
        Row: {
          id: number
          client: string
          date: string
          description: string
          status: "En attente" | "Acceptée" | "Rejetée"
          product?: string
          productAdopted?: boolean
        }
        Insert: {
          id?: number
          client: string
          date: string
          description: string
          status: "En attente" | "Acceptée" | "Rejetée"
          product?: string
          productAdopted?: boolean
        }
        Update: {
          id?: number
          client?: string
          date?: string
          description?: string
          status?: "En attente" | "Acceptée" | "Rejetée"
          product?: string
          productAdopted?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
