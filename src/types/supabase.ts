export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      business_contacts: {
        Row: {
          business_id: string | null
          created_at: string | null
          created_by: string | null
          designation: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          location_id: string | null
          name: string
          phone: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          location_id?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          location_id?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_contacts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address_line1: string
          address_line2: string | null
          business_id: string | null
          city: string
          coordinates: unknown | null
          country: string
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          operating_hours: Json | null
          phone: string | null
          postal_code: string | null
          state: string
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          business_id?: string | null
          city: string
          coordinates?: unknown | null
          country: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          state: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          business_id?: string | null
          city?: string
          coordinates?: unknown | null
          country?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_users: {
        Row: {
          business_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          role: string
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_code: string
          business_type: string
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          has_parent: boolean
          id: string
          logo_full_url: string | null
          logo_short_url: string | null
          logo_url: string | null
          name: string
          parent_business_id: string | null
          registered_name: string | null
          slug: string
          state: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_code: string
          business_type: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          has_parent?: boolean
          id?: string
          logo_full_url?: string | null
          logo_short_url?: string | null
          logo_url?: string | null
          name: string
          parent_business_id?: string | null
          registered_name?: string | null
          slug: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_code?: string
          business_type?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          has_parent?: boolean
          id?: string
          logo_full_url?: string | null
          logo_short_url?: string | null
          logo_url?: string | null
          name?: string
          parent_business_id?: string | null
          registered_name?: string | null
          slug?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      client_users: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          entity_type_id: string | null
          gstin: string | null
          id: string
          industry_id: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string
          parent_organization_id: string | null
          pin_code: string | null
          registered_name: string | null
          short_code: string
          slug: string
          state: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_type_id?: string | null
          gstin?: string | null
          id?: string
          industry_id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          parent_organization_id?: string | null
          pin_code?: string | null
          registered_name?: string | null
          short_code: string
          slug: string
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          entity_type_id?: string | null
          gstin?: string | null
          id?: string
          industry_id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          parent_organization_id?: string | null
          pin_code?: string | null
          registered_name?: string | null
          short_code?: string
          slug?: string
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_parent_organization_id_fkey"
            columns: ["parent_organization_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      division_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          division_id: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          division_id: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          division_id?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "division_users_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "division_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      divisions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          organization_id: string
          parent_division_id: string | null
          short_code: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          organization_id: string
          parent_division_id?: string | null
          short_code: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          organization_id?: string
          parent_division_id?: string | null
          short_code?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "divisions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone_number: string | null
          updated_at: string | null
          updated_by: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_business_with_location: {
        Args: {
          business_data: Json
          location_data: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
