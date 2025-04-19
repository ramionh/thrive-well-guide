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
      daily_health_tracking: {
        Row: {
          calories: number | null
          created_at: string
          date: string
          exercise_adherence: string | null
          exercise_minutes: number | null
          goals_adherence: string | null
          id: string
          mood: number | null
          notes: string | null
          nutrition_adherence: string | null
          protein: number | null
          sleep_adherence: string | null
          sleep_hours: number | null
          steps: number | null
          updated_at: string
          user_id: string
          water: number | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          date?: string
          exercise_adherence?: string | null
          exercise_minutes?: number | null
          goals_adherence?: string | null
          id?: string
          mood?: number | null
          notes?: string | null
          nutrition_adherence?: string | null
          protein?: number | null
          sleep_adherence?: string | null
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string
          user_id: string
          water?: number | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          date?: string
          exercise_adherence?: string | null
          exercise_minutes?: number | null
          goals_adherence?: string | null
          id?: string
          mood?: number | null
          notes?: string | null
          nutrition_adherence?: string | null
          protein?: number | null
          sleep_adherence?: string | null
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string
          user_id?: string
          water?: number | null
        }
        Relationships: []
      }
      habits: {
        Row: {
          category: Database["public"]["Enums"]["habit_category"]
          category_description: string
          created_at: string
          description: string
          habit_number: number
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["habit_category"]
          category_description: string
          created_at?: string
          description: string
          habit_number: number
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["habit_category"]
          category_description?: string
          created_at?: string
          description?: string
          habit_number?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          height_feet: number | null
          height_inches: number | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
          weight_lbs: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          height_feet?: number | null
          height_inches?: number | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          weight_lbs?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          height_feet?: number | null
          height_inches?: number | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          weight_lbs?: number | null
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
      habit_category:
        | "SLEEP"
        | "CALORIE_INTAKE"
        | "PROTEIN_INTAKE"
        | "ADAPTIVE_TRAINING"
        | "LIFESTYLE_GUARDRAILS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      habit_category: [
        "SLEEP",
        "CALORIE_INTAKE",
        "PROTEIN_INTAKE",
        "ADAPTIVE_TRAINING",
        "LIFESTYLE_GUARDRAILS",
      ],
    },
  },
} as const
