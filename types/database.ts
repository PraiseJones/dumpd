export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      monthly_dumps: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          month_year: string
          answers: Json
          theme: string
          generated_card_url: string | null
          card_square_url: string | null
          card_title: string | null
          narrative: string | null
          share_count: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          month_year: string
          answers?: Json
          theme?: string
          generated_card_url?: string | null
          card_square_url?: string | null
          card_title?: string | null
          narrative?: string | null
          share_count?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          month_year?: string
          answers?: Json
          theme?: string
          generated_card_url?: string | null
          card_square_url?: string | null
          card_title?: string | null
          narrative?: string | null
          share_count?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      card_templates: {
        Row: {
          id: string
          name: string
          theme: string
          config: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          theme: string
          config?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          theme?: string
          config?: Json
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      share_events: {
        Row: {
          id: string
          dump_id: string | null
          platform: string
          created_at: string
        }
        Insert: {
          id?: string
          dump_id?: string | null
          platform: string
          created_at?: string
        }
        Update: {
          id?: string
          dump_id?: string | null
          platform?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      increment_share_count: {
        Args: { dump_id: string }
        Returns: void
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
