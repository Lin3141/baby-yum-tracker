export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      babies: {
        Row: {
          created_at: string
          date_of_birth: string
          id: string
          known_allergies: string[] | null
          name: string
          pediatrician_contact: string | null
          suspected_allergies: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          id?: string
          known_allergies?: string[] | null
          name: string
          pediatrician_contact?: string | null
          suspected_allergies?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          id?: string
          known_allergies?: string[] | null
          name?: string
          pediatrician_contact?: string | null
          suspected_allergies?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exposures: {
        Row: {
          allergen: string
          baby_id: string
          created_at: string
          exposure_date: string
          id: string
          notes: string | null
          reaction: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergen: string
          baby_id: string
          created_at?: string
          exposure_date: string
          id?: string
          notes?: string | null
          reaction?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergen?: string
          baby_id?: string
          created_at?: string
          exposure_date?: string
          id?: string
          notes?: string | null
          reaction?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exposures_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          allergens: string[] | null
          category: string
          choking_form_notes: string | null
          created_at: string
          id: string
          iron_mg_per_100g: number | null
          name: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category: string
          choking_form_notes?: string | null
          created_at?: string
          id: string
          iron_mg_per_100g?: number | null
          name: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category?: string
          choking_form_notes?: string | null
          created_at?: string
          id?: string
          iron_mg_per_100g?: number | null
          name?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      meals: {
        Row: {
          baby_id: string
          created_at: string
          id: string
          items: Json
          meal_date: string
          meal_time: string
          meal_type: string | null
          notes: string | null
          reactions: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          id?: string
          items?: Json
          meal_date: string
          meal_time: string
          meal_type?: string | null
          notes?: string | null
          reactions?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          id?: string
          items?: Json
          meal_date?: string
          meal_time?: string
          meal_type?: string | null
          notes?: string | null
          reactions?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rules: {
        Row: {
          age_max_months: number
          age_min_months: number
          created_at: string
          direct_quote: string
          id: string
          last_verified_at: string
          published_at: string
          publisher: string
          rule_key: string
          severity: string
          short_text: string
          tags: string[] | null
          updated_at: string
          url: string
        }
        Insert: {
          age_max_months?: number
          age_min_months?: number
          created_at?: string
          direct_quote: string
          id?: string
          last_verified_at: string
          published_at: string
          publisher: string
          rule_key: string
          severity?: string
          short_text: string
          tags?: string[] | null
          updated_at?: string
          url: string
        }
        Update: {
          age_max_months?: number
          age_min_months?: number
          created_at?: string
          direct_quote?: string
          id?: string
          last_verified_at?: string
          published_at?: string
          publisher?: string
          rule_key?: string
          severity?: string
          short_text?: string
          tags?: string[] | null
          updated_at?: string
          url?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
