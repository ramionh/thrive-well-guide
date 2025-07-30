export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      application_reset_requests: {
        Row: {
          created_at: string
          id: string
          requested_at: string
          status: string
          updated_at: string
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_at?: string
          status?: string
          updated_at?: string
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_at?: string
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      body_types: {
        Row: {
          bodyfat_range: string
          created_at: string
          gender: string
          id: string
          image_url: string
          name: string
          population_percentage: string
        }
        Insert: {
          bodyfat_range: string
          created_at?: string
          gender?: string
          id?: string
          image_url: string
          name: string
          population_percentage: string
        }
        Update: {
          bodyfat_range?: string
          created_at?: string
          gender?: string
          id?: string
          image_url?: string
          name?: string
          population_percentage?: string
        }
        Relationships: []
      }
      client_onboarding: {
        Row: {
          answer: string
          created_at: string
          id: string
          profile_id: string
          question_id: string
          question_text: string
          questionnaire_type: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          profile_id: string
          question_id: string
          question_text: string
          questionnaire_type: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          profile_id?: string
          question_id?: string
          question_text?: string
          questionnaire_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: number
          ip_address: unknown | null
          message: string
          name: string
          subject: string | null
          submitted_at: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          ip_address?: unknown | null
          message: string
          name: string
          subject?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          ip_address?: unknown | null
          message?: string
          name?: string
          subject?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
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
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      existing_habits_assessment: {
        Row: {
          category: string
          created_at: string
          id: string
          identified_habit: string
          question_1_answer: string
          question_2_answer: string
          question_3_answer: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          identified_habit: string
          question_1_answer: string
          question_2_answer: string
          question_3_answer?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          identified_habit?: string
          question_1_answer?: string
          question_2_answer?: string
          question_3_answer?: string | null
          updated_at?: string
          user_id?: string
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
      gender_body_type_ranges: {
        Row: {
          body_type_id: string
          bodyfat_range: string
          created_at: string
          gender: string
          id: string
          image_name: string
        }
        Insert: {
          body_type_id: string
          bodyfat_range: string
          created_at?: string
          gender: string
          id?: string
          image_name: string
        }
        Update: {
          body_type_id?: string
          bodyfat_range?: string
          created_at?: string
          gender?: string
          id?: string
          image_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "gender_body_type_ranges_body_type_id_fkey"
            columns: ["body_type_id"]
            isOneToOne: false
            referencedRelation: "body_types"
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
      habit_repurpose_environment: {
        Row: {
          created_at: string
          id: string
          make_bad_habit_harder: string
          make_good_habit_easier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          make_bad_habit_harder: string
          make_good_habit_easier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          make_bad_habit_harder?: string
          make_good_habit_easier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_goal_values: {
        Row: {
          created_at: string
          goal_values_text: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_values_text: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_values_text?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_goals: {
        Row: {
          created_at: string
          goal_text: string
          id: string
          is_learning_goal: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_text: string
          id?: string
          is_learning_goal?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_text?: string
          id?: string
          is_learning_goal?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_if_then_plans: {
        Row: {
          created_at: string
          good_habit_text: string
          id: string
          trigger_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          good_habit_text: string
          id?: string
          trigger_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          good_habit_text?: string
          id?: string
          trigger_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_replacements: {
        Row: {
          action_routine: string
          created_at: string
          id: string
          replacement_habit: string
          trigger_routine: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_routine: string
          created_at?: string
          id?: string
          replacement_habit: string
          trigger_routine: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_routine?: string
          created_at?: string
          id?: string
          replacement_habit?: string
          trigger_routine?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_simple_if_then: {
        Row: {
          created_at: string
          good_habit_phrase: string
          id: string
          trigger_phrase: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          good_habit_phrase: string
          id?: string
          trigger_phrase: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          good_habit_phrase?: string
          id?: string
          trigger_phrase?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_repurpose_unwanted_habits: {
        Row: {
          created_at: string
          habit_description: string
          habit_feeling: string
          habit_trigger: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_description: string
          habit_feeling: string
          habit_trigger: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_description?: string
          habit_feeling?: string
          habit_trigger?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      imessage: {
        Row: {
          FromPhone: string
          iMessageID: string
          IncomingOutgoing: string
          IncomingProcessed: boolean
          Message: string
          OutgoingProcessed: boolean
          ReceivedDateTime: string
          ToPhone: string
        }
        Insert: {
          FromPhone: string
          iMessageID?: string
          IncomingOutgoing: string
          IncomingProcessed?: boolean
          Message: string
          OutgoingProcessed?: boolean
          ReceivedDateTime: string
          ToPhone: string
        }
        Update: {
          FromPhone?: string
          iMessageID?: string
          IncomingOutgoing?: string
          IncomingProcessed?: boolean
          Message?: string
          OutgoingProcessed?: boolean
          ReceivedDateTime?: string
          ToPhone?: string
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
      motivation_activity_rewards: {
        Row: {
          activity_rewards: string[]
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_rewards?: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_rewards?: string[]
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_addressing_ambivalence: {
        Row: {
          coping_strategies: string[] | null
          created_at: string
          id: string
          mastery_pursuits: string[] | null
          positive_experiences: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string
          id?: string
          mastery_pursuits?: string[] | null
          positive_experiences?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string
          id?: string
          mastery_pursuits?: string[] | null
          positive_experiences?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_affirmations: {
        Row: {
          affirmations: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affirmations?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affirmations?: Json
          created_at?: string
          id?: string
          updated_at?: string
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
      motivation_be_consistent: {
        Row: {
          consistent_activities: string
          created_at: string
          daily_schedule: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consistent_activities?: string
          created_at?: string
          daily_schedule?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consistent_activities?: string
          created_at?: string
          daily_schedule?: Json
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
      motivation_big_picture_why: {
        Row: {
          big_picture_why: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          big_picture_why?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          big_picture_why?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_ceiling_floor: {
        Row: {
          best_outcome: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          worst_outcome: string
        }
        Insert: {
          best_outcome: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          worst_outcome: string
        }
        Update: {
          best_outcome?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          worst_outcome?: string
        }
        Relationships: []
      }
      motivation_change_plan: {
        Row: {
          action_steps: string | null
          created_at: string
          goals: string | null
          id: string
          monitoring_progress: string | null
          obstacles_plan: string | null
          rewards: string | null
          support_resources: string | null
          updated_at: string
          user_id: string
          vision_statement: string | null
        }
        Insert: {
          action_steps?: string | null
          created_at?: string
          goals?: string | null
          id?: string
          monitoring_progress?: string | null
          obstacles_plan?: string | null
          rewards?: string | null
          support_resources?: string | null
          updated_at?: string
          user_id: string
          vision_statement?: string | null
        }
        Update: {
          action_steps?: string | null
          created_at?: string
          goals?: string | null
          id?: string
          monitoring_progress?: string | null
          obstacles_plan?: string | null
          rewards?: string | null
          support_resources?: string | null
          updated_at?: string
          user_id?: string
          vision_statement?: string | null
        }
        Relationships: []
      }
      motivation_change_plan_adjustments: {
        Row: {
          created_at: string
          id: string
          plan_adjustments: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_adjustments?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_adjustments?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_characteristics: {
        Row: {
          characteristics: Json
          created_at: string
          examples: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          characteristics?: Json
          created_at?: string
          examples?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          characteristics?: Json
          created_at?: string
          examples?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_clarifying_values: {
        Row: {
          created_at: string
          goal_value_alignment: string | null
          id: string
          reasons_alignment: string | null
          selected_value_1: string
          selected_value_2: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_value_alignment?: string | null
          id?: string
          reasons_alignment?: string | null
          selected_value_1: string
          selected_value_2: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_value_alignment?: string | null
          id?: string
          reasons_alignment?: string | null
          selected_value_1?: string
          selected_value_2?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_confidence_scale: {
        Row: {
          confidence_scale: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_scale?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_scale?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_confidence_score: {
        Row: {
          created_at: string
          descriptor: string
          explanation: string
          id: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descriptor: string
          explanation: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descriptor?: string
          explanation?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_confidence_steps: {
        Row: {
          confidence_steps: Json
          created_at: string
          id: string
          selected_confidence_step: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_steps?: Json
          created_at?: string
          id?: string
          selected_confidence_step?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_steps?: Json
          created_at?: string
          id?: string
          selected_confidence_step?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_confidence_talk: {
        Row: {
          confidence_talk: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_talk?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_talk?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_control: {
        Row: {
          can_control: string
          cant_control: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_control?: string
          cant_control?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_control?: string
          cant_control?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_coping_mechanisms: {
        Row: {
          created_at: string
          current_techniques: Json
          explanation: string | null
          id: string
          new_techniques: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_techniques?: Json
          explanation?: string | null
          id?: string
          new_techniques?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_techniques?: Json
          explanation?: string | null
          id?: string
          new_techniques?: Json
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
      motivation_dealing_setbacks_recommit: {
        Row: {
          created_at: string
          id: string
          implementation_plan: string | null
          selected_coping_skills: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          implementation_plan?: string | null
          selected_coping_skills?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          implementation_plan?: string | null
          selected_coping_skills?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_dealing_setbacks_self_care: {
        Row: {
          created_at: string
          id: string
          interpersonal: string[]
          physical: string[]
          psychological: string[]
          spiritual: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interpersonal?: string[]
          physical?: string[]
          psychological?: string[]
          spiritual?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interpersonal?: string[]
          physical?: string[]
          psychological?: string[]
          spiritual?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_dealing_setbacks_stress_check: {
        Row: {
          created_at: string
          emotion_focused: string[]
          emotion_focused_other: string | null
          id: string
          implementation: string | null
          problem_focused: string[]
          problem_focused_other: string | null
          stress_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion_focused?: string[]
          emotion_focused_other?: string | null
          id?: string
          implementation?: string | null
          problem_focused?: string[]
          problem_focused_other?: string | null
          stress_level: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotion_focused?: string[]
          emotion_focused_other?: string | null
          id?: string
          implementation?: string | null
          problem_focused?: string[]
          problem_focused_other?: string | null
          stress_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_defining_confidence: {
        Row: {
          created_at: string
          id: string
          reflection: string
          selected_words: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reflection: string
          selected_words: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reflection?: string
          selected_words?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_defining_importance: {
        Row: {
          created_at: string
          descriptors: string[]
          goal_text: string
          id: string
          reflection: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descriptors: string[]
          goal_text: string
          id?: string
          reflection?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descriptors?: string[]
          goal_text?: string
          id?: string
          reflection?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_environmental_resources: {
        Row: {
          created_at: string
          environmental_resources: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          environmental_resources?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          environmental_resources?: string | null
          id?: string
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
      motivation_envisioning_change: {
        Row: {
          created_at: string
          how_it_worked: string | null
          id: string
          successful_change: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          how_it_worked?: string | null
          id?: string
          successful_change?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          how_it_worked?: string | null
          id?: string
          successful_change?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_exceptions_to_rule: {
        Row: {
          behavior: string
          created_at: string
          id: string
          thoughts_feelings: string
          updated_at: string
          user_id: string
          when_context: string
          where_what: string
          who: string
        }
        Insert: {
          behavior: string
          created_at?: string
          id?: string
          thoughts_feelings: string
          updated_at?: string
          user_id: string
          when_context: string
          where_what: string
          who: string
        }
        Update: {
          behavior?: string
          created_at?: string
          id?: string
          thoughts_feelings?: string
          updated_at?: string
          user_id?: string
          when_context?: string
          where_what?: string
          who?: string
        }
        Relationships: []
      }
      motivation_exploring_values: {
        Row: {
          created_at: string
          id: string
          selected_values: Json
          updated_at: string
          user_id: string
          value_descriptions: Json
        }
        Insert: {
          created_at?: string
          id?: string
          selected_values?: Json
          updated_at?: string
          user_id: string
          value_descriptions?: Json
        }
        Update: {
          created_at?: string
          id?: string
          selected_values?: Json
          updated_at?: string
          user_id?: string
          value_descriptions?: Json
        }
        Relationships: []
      }
      motivation_external_obstacles: {
        Row: {
          created_at: string
          id: string
          obstacle: string
          solution_1: string | null
          solution_1_attitude: string | null
          solution_2: string | null
          solution_2_attitude: string | null
          solutions: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          obstacle: string
          solution_1?: string | null
          solution_1_attitude?: string | null
          solution_2?: string | null
          solution_2_attitude?: string | null
          solutions: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          obstacle?: string
          solution_1?: string | null
          solution_1_attitude?: string | null
          solution_2?: string | null
          solution_2_attitude?: string | null
          solutions?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_family_strengths: {
        Row: {
          build_family: string | null
          created_at: string
          family_feelings: string | null
          family_strengths: string | null
          id: string
          perceived_strengths: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          build_family?: string | null
          created_at?: string
          family_feelings?: string | null
          family_strengths?: string | null
          id?: string
          perceived_strengths?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          build_family?: string | null
          created_at?: string
          family_feelings?: string | null
          family_strengths?: string | null
          id?: string
          perceived_strengths?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_final_word: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          plan_adjustments: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          plan_adjustments?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          plan_adjustments?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_financial_resources: {
        Row: {
          build_resources: string | null
          created_at: string
          financial_feelings: string | null
          flexible_schedule: string | null
          id: string
          income: string | null
          job_satisfaction: string | null
          job_stability: string | null
          updated_at: string
          user_id: string
          workplace_benefits: string | null
        }
        Insert: {
          build_resources?: string | null
          created_at?: string
          financial_feelings?: string | null
          flexible_schedule?: string | null
          id?: string
          income?: string | null
          job_satisfaction?: string | null
          job_stability?: string | null
          updated_at?: string
          user_id: string
          workplace_benefits?: string | null
        }
        Update: {
          build_resources?: string | null
          created_at?: string
          financial_feelings?: string | null
          flexible_schedule?: string | null
          id?: string
          income?: string | null
          job_satisfaction?: string | null
          job_stability?: string | null
          updated_at?: string
          user_id?: string
          workplace_benefits?: string | null
        }
        Relationships: []
      }
      motivation_finding_community: {
        Row: {
          appealing: string | null
          communities: Json
          created_at: string
          id: string
          steps: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appealing?: string | null
          communities?: Json
          created_at?: string
          id?: string
          steps?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appealing?: string | null
          communities?: Json
          created_at?: string
          id?: string
          steps?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_finding_hope: {
        Row: {
          change_hope: string | null
          created_at: string
          general_hope: string | null
          id: string
          personal_hope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          change_hope?: string | null
          created_at?: string
          general_hope?: string | null
          id?: string
          personal_hope?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          change_hope?: string | null
          created_at?: string
          general_hope?: string | null
          id?: string
          personal_hope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_finding_inspiration: {
        Row: {
          created_at: string
          id: string
          inspiration_sources: string | null
          inspirational_content: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspiration_sources?: string | null
          inspirational_content?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inspiration_sources?: string | null
          inspirational_content?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_get_organized: {
        Row: {
          created_at: string
          id: string
          organization_tasks: string[]
          plan_location: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_tasks?: string[]
          plan_location?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_tasks?: string[]
          plan_location?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_getting_ready: {
        Row: {
          created_at: string
          id: string
          self_persuasion: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          self_persuasion: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          self_persuasion?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_goal_objectives: {
        Row: {
          created_at: string
          id: string
          objectives: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          objectives?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          objectives?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_goal_scores: {
        Row: {
          created_at: string
          descriptor: string
          explanation: string
          id: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descriptor: string
          explanation: string
          id?: string
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descriptor?: string
          explanation?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_growth_mindset: {
        Row: {
          challenges: string | null
          created_at: string
          feedback: string | null
          id: string
          learning: string | null
          new_things: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenges?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          learning?: string | null
          new_things?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenges?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          learning?: string | null
          new_things?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_helpful_ideas: {
        Row: {
          created_at: string
          helpful_ideas: Json | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_ideas?: Json | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_ideas?: Json | null
          id?: string
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
      motivation_importance_confidence: {
        Row: {
          created_at: string
          id: string
          selected_quadrant: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          selected_quadrant: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          selected_quadrant?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_importance_scale: {
        Row: {
          created_at: string
          id: string
          ratings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ratings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ratings?: Json
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
      motivation_managing_stress: {
        Row: {
          created_at: string
          id: string
          impact: string | null
          stressors: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          impact?: string | null
          stressors?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          impact?: string | null
          stressors?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_measurable_goal: {
        Row: {
          created_at: string
          goal_bodyfat_percentage: number | null
          goal_weight_lbs: number | null
          id: string
          measurable_goal: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_bodyfat_percentage?: number | null
          goal_weight_lbs?: number | null
          id?: string
          measurable_goal: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_bodyfat_percentage?: number | null
          goal_weight_lbs?: number | null
          id?: string
          measurable_goal?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_mindfulness: {
        Row: {
          after_feelings: string | null
          body_reactions: string | null
          created_at: string
          feelings: string | null
          goal_application: string | null
          id: string
          thoughts: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          after_feelings?: string | null
          body_reactions?: string | null
          created_at?: string
          feelings?: string | null
          goal_application?: string | null
          id?: string
          thoughts?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          after_feelings?: string | null
          body_reactions?: string | null
          created_at?: string
          feelings?: string | null
          goal_application?: string | null
          id?: string
          thoughts?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_monitoring_progress: {
        Row: {
          compliments: string | null
          created_at: string
          id: string
          ratings: Json
          updated_at: string
          user_id: string
          working_well: string | null
        }
        Insert: {
          compliments?: string | null
          created_at?: string
          id?: string
          ratings?: Json
          updated_at?: string
          user_id: string
          working_well?: string | null
        }
        Update: {
          compliments?: string | null
          created_at?: string
          id?: string
          ratings?: Json
          updated_at?: string
          user_id?: string
          working_well?: string | null
        }
        Relationships: []
      }
      motivation_next_step_confidence: {
        Row: {
          created_at: string
          id: string
          new_descriptor: string
          new_explanation: string
          new_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_descriptor: string
          new_explanation: string
          new_score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_descriptor?: string
          new_explanation?: string
          new_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_obstacles_opportunities: {
        Row: {
          actions: string | null
          consequences: string | null
          coping_statements: string | null
          created_at: string
          feelings: string | null
          id: string
          likelihood: string | null
          opportunity_for_growth: string | null
          situation: string | null
          thoughts: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: string | null
          consequences?: string | null
          coping_statements?: string | null
          created_at?: string
          feelings?: string | null
          id?: string
          likelihood?: string | null
          opportunity_for_growth?: string | null
          situation?: string | null
          thoughts?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: string | null
          consequences?: string | null
          coping_statements?: string | null
          created_at?: string
          feelings?: string | null
          id?: string
          likelihood?: string | null
          opportunity_for_growth?: string | null
          situation?: string | null
          thoughts?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_partial_change_feelings: {
        Row: {
          created_at: string
          id: string
          progress_steps: string | null
          reward_ideas: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          progress_steps?: string | null
          reward_ideas?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          progress_steps?: string | null
          reward_ideas?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_past_success: {
        Row: {
          big_change: string
          change_approach: string
          change_steps: string
          created_at: string
          current_feelings: string
          help_achieve_goals: string
          id: string
          life_context: string
          updated_at: string
          user_id: string
        }
        Insert: {
          big_change: string
          change_approach: string
          change_steps: string
          created_at?: string
          current_feelings: string
          help_achieve_goals: string
          id?: string
          life_context: string
          updated_at?: string
          user_id: string
        }
        Update: {
          big_change?: string
          change_approach?: string
          change_steps?: string
          created_at?: string
          current_feelings?: string
          help_achieve_goals?: string
          id?: string
          life_context?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_past_successes_areas: {
        Row: {
          career: string | null
          created_at: string
          family_relationships: string | null
          friendships: string | null
          healthy_eating: string | null
          id: string
          intimate_relationships: string | null
          money_management: string | null
          organization: string | null
          other: string | null
          physical_activity: string | null
          reflection: string | null
          spiritual_life: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          career?: string | null
          created_at?: string
          family_relationships?: string | null
          friendships?: string | null
          healthy_eating?: string | null
          id?: string
          intimate_relationships?: string | null
          money_management?: string | null
          organization?: string | null
          other?: string | null
          physical_activity?: string | null
          reflection?: string | null
          spiritual_life?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          career?: string | null
          created_at?: string
          family_relationships?: string | null
          friendships?: string | null
          healthy_eating?: string | null
          id?: string
          intimate_relationships?: string | null
          money_management?: string | null
          organization?: string | null
          other?: string | null
          physical_activity?: string | null
          reflection?: string | null
          spiritual_life?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_people_rewards: {
        Row: {
          created_at: string
          id: string
          people_rewards: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          people_rewards?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          people_rewards?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_positive_information: {
        Row: {
          created_at: string
          id: string
          selected_source_types: string[]
          specific_sources: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          selected_source_types?: string[]
          specific_sources?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          selected_source_types?: string[]
          specific_sources?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_priorities: {
        Row: {
          created_at: string
          daily_tasks: string | null
          id: string
          important_not_urgent: string | null
          important_urgent: string | null
          not_important_not_urgent: string | null
          not_important_urgent: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_tasks?: string | null
          id?: string
          important_not_urgent?: string | null
          important_urgent?: string | null
          not_important_not_urgent?: string | null
          not_important_urgent?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_tasks?: string | null
          id?: string
          important_not_urgent?: string | null
          important_urgent?: string | null
          not_important_not_urgent?: string | null
          not_important_urgent?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_prioritizing_change: {
        Row: {
          created_at: string
          id: string
          new_activities: string | null
          prioritized_activities: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_activities?: string | null
          prioritized_activities?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_activities?: string | null
          prioritized_activities?: string | null
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
      motivation_realistic_change: {
        Row: {
          created_at: string
          id: string
          realistic_change: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          realistic_change?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          realistic_change?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_resource_development: {
        Row: {
          created_at: string
          helpful_resources: string | null
          id: string
          resource_development: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_resources?: string | null
          id?: string
          resource_development?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_resources?: string | null
          id?: string
          resource_development?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_revisit_values: {
        Row: {
          created_at: string
          id: string
          reflection: string | null
          updated_at: string
          user_id: string
          values: Json
        }
        Insert: {
          created_at?: string
          id?: string
          reflection?: string | null
          updated_at?: string
          user_id: string
          values?: Json
        }
        Update: {
          created_at?: string
          id?: string
          reflection?: string | null
          updated_at?: string
          user_id?: string
          values?: Json
        }
        Relationships: []
      }
      motivation_rewards_incentive: {
        Row: {
          created_at: string
          id: string
          rewards: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rewards?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rewards?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_self_observation: {
        Row: {
          created_at: string
          id: string
          observations: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          observations?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          observations?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_small_steps: {
        Row: {
          created_at: string
          id: string
          small_steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          small_steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          small_steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_social_boundaries: {
        Row: {
          boundaries: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          boundaries?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          boundaries?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_social_cultural_resources: {
        Row: {
          created_at: string
          cultural_beliefs: string | null
          cultural_customs: string | null
          id: string
          religious_beliefs: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultural_beliefs?: string | null
          cultural_customs?: string | null
          id?: string
          religious_beliefs?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultural_beliefs?: string | null
          cultural_customs?: string | null
          id?: string
          religious_beliefs?: string | null
          updated_at?: string
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
      motivation_social_support: {
        Row: {
          build_social: string | null
          created_at: string
          id: string
          social_feelings: string | null
          social_skills: string[]
          support_types: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          build_social?: string | null
          created_at?: string
          id?: string
          social_feelings?: string | null
          social_skills?: string[]
          support_types?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          build_social?: string | null
          created_at?: string
          id?: string
          social_feelings?: string | null
          social_skills?: string[]
          support_types?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_step_assessments: {
        Row: {
          created_at: string
          id: string
          selected_step: string | null
          steps: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          selected_step?: string | null
          steps?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          selected_step?: string | null
          steps?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_step_toward_change: {
        Row: {
          created_at: string
          id: string
          new_descriptor: string
          new_explanation: string
          new_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_descriptor: string
          new_explanation: string
          new_score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          new_descriptor?: string
          new_explanation?: string
          new_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_steps_progress: {
        Row: {
          available: boolean | null
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
          available?: boolean | null
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
          available?: boolean | null
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
      motivation_steps_to_goal: {
        Row: {
          actions: Json | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_strength_applications: {
        Row: {
          created_at: string
          id: string
          strength_applications: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          strength_applications?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          strength_applications?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_strengths_feedback: {
        Row: {
          created_at: string
          feedback_entries: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_entries?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_entries?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_stress_ratings: {
        Row: {
          created_at: string
          id: string
          stress_ratings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stress_ratings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stress_ratings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_stress_types: {
        Row: {
          created_at: string
          id: string
          stress_types: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stress_types?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stress_types?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_support_system_roles: {
        Row: {
          created_at: string
          id: string
          support_system: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          support_system?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          support_system?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_thinking_assertively: {
        Row: {
          boundary_needs: string
          boundary_request: string
          created_at: string
          id: string
          thought_challenge: string
          updated_at: string
          user_id: string
        }
        Insert: {
          boundary_needs: string
          boundary_request: string
          created_at?: string
          id?: string
          thought_challenge: string
          updated_at?: string
          user_id: string
        }
        Update: {
          boundary_needs?: string
          boundary_request?: string
          created_at?: string
          id?: string
          thought_challenge?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_time_management: {
        Row: {
          created_at: string
          current_schedule: string | null
          id: string
          impact: string | null
          quick_activities: string | null
          time_slots: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_schedule?: string | null
          id?: string
          impact?: string | null
          quick_activities?: string | null
          time_slots?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_schedule?: string | null
          id?: string
          impact?: string | null
          quick_activities?: string | null
          time_slots?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_top_rewards: {
        Row: {
          created_at: string
          id: string
          top_rewards: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          top_rewards?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          top_rewards?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_values_conflict: {
        Row: {
          created_at: string
          feelings_after: string | null
          id: string
          potential_conflicts: string | null
          priority_values: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feelings_after?: string | null
          id?: string
          potential_conflicts?: string | null
          priority_values?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feelings_after?: string | null
          id?: string
          potential_conflicts?: string | null
          priority_values?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_visualize_results: {
        Row: {
          created_at: string
          id: string
          one_year: string | null
          six_months: string | null
          three_months: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          one_year?: string | null
          six_months?: string | null
          three_months?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          one_year?: string | null
          six_months?: string | null
          three_months?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivation_where_are_you_now: {
        Row: {
          created_at: string
          id: string
          progress_summary: string | null
          readiness_rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          progress_summary?: string | null
          readiness_rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          progress_summary?: string | null
          readiness_rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      opt_in_submissions: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          ip_address: unknown | null
          last_name: string
          opted_in: boolean | null
          phone_number: string
          submitted_at: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          ip_address?: unknown | null
          last_name: string
          opted_in?: boolean | null
          phone_number: string
          submitted_at?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown | null
          last_name?: string
          opted_in?: boolean | null
          phone_number?: string
          submitted_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assigned_coach_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          height_feet: number | null
          height_inches: number | null
          id: string
          is_active: boolean | null
          last_name: string | null
          onboarding_completed: boolean | null
          phone: string | null
          phone_number: string | null
          preferred_name: string | null
          updated_at: string | null
          weight_lbs: number | null
        }
        Insert: {
          assigned_coach_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          height_feet?: number | null
          height_inches?: number | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          phone_number?: string | null
          preferred_name?: string | null
          updated_at?: string | null
          weight_lbs?: number | null
        }
        Update: {
          assigned_coach_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          height_feet?: number | null
          height_inches?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          phone_number?: string | null
          preferred_name?: string | null
          updated_at?: string | null
          weight_lbs?: number | null
        }
        Relationships: []
      }
      stress_management_reflections: {
        Row: {
          created_at: string
          id: string
          reflections: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reflections: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reflections?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          auth_code: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auth_code?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auth_code?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_body_types: {
        Row: {
          body_type_id: string
          bodyfat_percentage: number | null
          created_at: string
          height_inches: string | null
          id: string
          selected_date: string
          user_id: string
          weight_lbs: number | null
        }
        Insert: {
          body_type_id: string
          bodyfat_percentage?: number | null
          created_at?: string
          height_inches?: string | null
          id?: string
          selected_date: string
          user_id: string
          weight_lbs?: number | null
        }
        Update: {
          body_type_id?: string
          bodyfat_percentage?: number | null
          created_at?: string
          height_inches?: string | null
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
      user_habit_scoring: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          response: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          response: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          response?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_habit_scoring_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
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
      user_preferences: {
        Row: {
          created_at: string | null
          hide_habits_splash: boolean | null
          hide_motivation_splash: boolean | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hide_habits_splash?: boolean | null
          hide_motivation_splash?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          hide_habits_splash?: boolean | null
          hide_motivation_splash?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_checkins: {
        Row: {
          back_photo_url: string | null
          body_fat_percentage: number | null
          created_at: string
          estimated_bodyfat_percentage: number | null
          front_photo_url: string | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          weight_lbs: number
        }
        Insert: {
          back_photo_url?: string | null
          body_fat_percentage?: number | null
          created_at?: string
          estimated_bodyfat_percentage?: number | null
          front_photo_url?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          weight_lbs: number
        }
        Update: {
          back_photo_url?: string | null
          body_fat_percentage?: number | null
          created_at?: string
          estimated_bodyfat_percentage?: number | null
          front_photo_url?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          weight_lbs?: number
        }
        Relationships: []
      }
    }
    Views: {
      marketing_subscribers: {
        Row: {
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          opted_in: boolean | null
          submitted_at: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          opted_in?: boolean | null
          submitted_at?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          opted_in?: boolean | null
          submitted_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_gender_specific_body_fat_range: {
        Args: { p_body_type_id: string; p_gender?: string }
        Returns: string
      }
      get_next_better_body_type: {
        Args: { current_body_type_id: string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "client" | "coach" | "admin"
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
    Enums: {
      app_role: ["client", "coach", "admin"],
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
