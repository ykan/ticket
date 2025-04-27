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
      farm: {
        Row: {
          created_at: string
          eletricity_fee: number | null
          id: number
          location: string
          name: string
          status: Database['public']['Enums']['farm_miner_status']
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          eletricity_fee?: number | null
          id?: number
          location: string
          name: string
          status: Database['public']['Enums']['farm_miner_status']
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          eletricity_fee?: number | null
          id?: number
          location?: string
          name?: string
          status?: Database['public']['Enums']['farm_miner_status']
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      miner: {
        Row: {
          created_at: string
          farm_id: number
          firmware: Json
          hostname: string | null
          id: number
          ip_address: string
          is_mining: boolean
          last_seen: string | null
          location: string | null
          mac_address: string | null
          manufacturer: string
          model: string
          notes: string | null
          serial_number: string | null
          status: Database['public']['Enums']['farm_miner_status']
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          farm_id: number
          firmware?: Json
          hostname?: string | null
          id?: never
          ip_address: string
          is_mining?: boolean
          last_seen?: string | null
          location?: string | null
          mac_address?: string | null
          manufacturer: string
          model: string
          notes?: string | null
          serial_number?: string | null
          status?: Database['public']['Enums']['farm_miner_status']
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          farm_id?: number
          firmware?: Json
          hostname?: string | null
          id?: never
          ip_address?: string
          is_mining?: boolean
          last_seen?: string | null
          location?: string | null
          mac_address?: string | null
          manufacturer?: string
          model?: string
          notes?: string | null
          serial_number?: string | null
          status?: Database['public']['Enums']['farm_miner_status']
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'miner_farm_id_fkey'
            columns: ['farm_id']
            isOneToOne: false
            referencedRelation: 'farm'
            referencedColumns: ['id']
          },
        ]
      }
      operate_log: {
        Row: {
          created_at: string | null
          data: Json
          id: number
          ticket_id: number
          type: Database['public']['Enums']['operate_log_type']
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: number
          ticket_id: number
          type: Database['public']['Enums']['operate_log_type']
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: number
          ticket_id?: number
          type?: Database['public']['Enums']['operate_log_type']
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'fk_ticket'
            columns: ['ticket_id']
            isOneToOne: false
            referencedRelation: 'ticket'
            referencedColumns: ['id']
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: number
          last_no: number
          short_name: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          last_no?: number
          short_name: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: never
          last_no?: number
          short_name?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      ticket: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string
          farm_id: number | null
          id: number
          level: Database['public']['Enums']['ticket_level']
          miner_ids: string[]
          no: number | null
          origin_level: Database['public']['Enums']['ticket_level']
          reporter_id: string | null
          status: Database['public']['Enums']['ticket_status']
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description: string
          farm_id?: number | null
          id?: number
          level: Database['public']['Enums']['ticket_level']
          miner_ids?: string[]
          no?: number | null
          origin_level: Database['public']['Enums']['ticket_level']
          reporter_id?: string | null
          status: Database['public']['Enums']['ticket_status']
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string
          farm_id?: number | null
          id?: number
          level?: Database['public']['Enums']['ticket_level']
          miner_ids?: string[]
          no?: number | null
          origin_level?: Database['public']['Enums']['ticket_level']
          reporter_id?: string | null
          status?: Database['public']['Enums']['ticket_status']
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ticket_farm_id_fkey'
            columns: ['farm_id']
            isOneToOne: false
            referencedRelation: 'farm'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      farm_miner_status: 'Online' | 'Error' | 'Partial' | 'Offline'
      miner_status: 'Disabled' | 'Enabled' | 'Maintenance' | 'Error' | 'Unknown'
      operate_log_type:
        | 'FarmSnapshot'
        | 'MinersSnapshot'
        | 'Remark'
        | 'LevelChange'
        | 'AssigneeChange'
        | 'StatusChange'
      ticket_level: 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
      ticket_status: 'Todo' | 'Doing' | 'Canceled' | 'Done'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      farm_miner_status: ['Online', 'Error', 'Partial', 'Offline'],
      miner_status: ['Disabled', 'Enabled', 'Maintenance', 'Error', 'Unknown'],
      operate_log_type: [
        'FarmSnapshot',
        'MinersSnapshot',
        'Remark',
        'LevelChange',
        'AssigneeChange',
        'StatusChange',
      ],
      ticket_level: ['P0', 'P1', 'P2', 'P3', 'P4'],
      ticket_status: ['Todo', 'Doing', 'Canceled', 'Done'],
    },
  },
} as const
