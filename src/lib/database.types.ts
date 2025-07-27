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
      [_ in never]: never
    }
    Views: {
      documents_to_sign: {
        Row: {
          id: string
          document_name: string
          client_name: string
          sending_date: string
          document_type: string
          expiration_date: string
          status: "En attente"
        }
      }
      documents_archive: {
        Row: {
          id: string
          document_name: string
          client_name: string
          sending_date: string
          document_type: string
          expiration_date: string
          status: "Archivé"
        }
      }
      documents_signed: {
        Row: {
          id: string
          document_name: string
          client_name: string
          sending_date: string
          document_type: string
          expiration_date: string
          status: "Signé"
        }
      }
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
