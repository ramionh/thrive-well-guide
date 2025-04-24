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
      body_types: {
        Row: {
          bodyfat_range: string
          created_at: string
          id: string
          image_url: string
          name: string
          population_percentage: string
        }
        Insert: {
          bodyfat_range: string
          created_at?: string
          id?: string
          image_url: string
          name: string
          population_percentage: string
        }
        Update: {
          bodyfat_range?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          population_percentage?: string
        }
        Relationships: []
      }
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
      focused_habits: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focused_habits_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          current_body_type_id: string
          goal_body_type_id: string
          id: string
          started_date: string
          target_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_body_type_id: string
          goal_body_type_id: string
          id?: string
          started_date?: string
          target_date?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_body_type_id?: string
          goal_body_type_id?: string
          id?: string
          started_date?: string
          target_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_current_body_type_id_fkey"
            columns: ["current_body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_goal_body_type_id_fkey"
            columns: ["goal_body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
        ]
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
      internal_obstacles: {
        Row: {
          created_at: string | null
          excuse: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          excuse: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          excuse?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      motivation_attitude: {
        Row: {
          attitude_rating: string
          created_at: string
          explanation: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attitude_rating: string
          created_at?: string
          explanation?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attitude_rating?: string
          created_at?: string
          explanation?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_behaviors: {
        Row: {
          behavior: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          behavior: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          behavior?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_cultural_obstacles: {
        Row: {
          created_at: string
          id: string
          obstacle: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          obstacle: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          obstacle?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_environmental_stressors: {
        Row: {
          created_at: string
          id: string
          stressor: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stressor: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stressor?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_identifying_ambivalence: {
        Row: {
          ambivalence_statement: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ambivalence_statement: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ambivalence_statement?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_knowledge: {
        Row: {
          created_at: string
          id: string
          question: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_pros_cons: {
        Row: {
          created_at: string
          id: string
          text: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_social_network: {
        Row: {
          created_at: string
          id: string
          person_or_group: string
          support_rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          person_or_group: string
          support_rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          person_or_group?: string
          support_rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_steps_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          step_name: string
          step_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          step_name: string
          step_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          step_name?: string
          step_number?: number
          updated_at?: string
          user_id?: string
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
          gender: string | null
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
          gender?: string | null
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
          gender?: string | null
          height_feet?: number | null
          height_inches?: number | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          weight_lbs?: number | null
        }
        Relationships: []
      }
      user_body_types: {
        Row: {
          body_type_id: string
          bodyfat_percentage: number | null
          created_at: string
          id: string
          selected_date: string
          user_id: string
          weight_lbs: number | null
        }
        Insert: {
          body_type_id: string
          bodyfat_percentage?: number | null
          created_at?: string
          id?: string
          selected_date: string
          user_id: string
          weight_lbs?: number | null
        }
        Update: {
          body_type_id?: string
          bodyfat_percentage?: number | null
          created_at?: string
          id?: string
          selected_date?: string
          user_id?: string
          weight_lbs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_body_types_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_habits: {
        Row: {
          adherence: string
          created_at: string
          habit_id: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adherence: string
          created_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adherence?: string
          created_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_habits_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_better_body_type: {
        Args: { current_body_type_id: string }
        Returns: string
      }
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
