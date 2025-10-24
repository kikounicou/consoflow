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
      meter_types: {
        Row: {
          id: string
          name: string
          unit: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          unit: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          unit?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meters: {
        Row: {
          id: string
          user_id: string
          location_id: string | null
          meter_type_id: string
          name: string
          serial_number: string | null
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location_id?: string | null
          meter_type_id: string
          name: string
          serial_number?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location_id?: string | null
          meter_type_id?: string
          name?: string
          serial_number?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      readings: {
        Row: {
          id: string
          meter_id: string
          reading_date: string
          value: number
          notes: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meter_id: string
          reading_date: string
          value: number
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meter_id?: string
          reading_date?: string
          value?: number
          notes?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      consumption_stats: {
        Row: {
          meter_id: string | null
          user_id: string | null
          meter_name: string | null
          meter_type: string | null
          unit: string | null
          current_date: string | null
          current_value: number | null
          previous_date: string | null
          previous_value: number | null
          consumption: number | null
          days_diff: number | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}
