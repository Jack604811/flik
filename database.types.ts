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
      _ExtrasToSpot: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ExtrasToSpot_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ExtrasToSpot_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Spot"
            referencedColumns: ["id"]
          },
        ]
      }
      _OneTimeProductToUser: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_OneTimeProductToUser_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "OneTimeProduct"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_OneTimeProductToUser_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Booking: {
        Row: {
          createdAt: string
          deletedAt: string | null
          endDate: string | null
          extras: number | null
          customerId: string | null
          id: string
          spotId: string
          startDate: string | null
          status: Database["public"]["Enums"]["BookingStatus"]
          subtotal: number
          tax: number | null
          totalPrice: number
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          deletedAt?: string | null
          endDate?: string | null
          extras?: number | null
          customerId?: string | null
          id: string
          spotId: string
          startDate?: string | null
          status: Database["public"]["Enums"]["BookingStatus"]
          subtotal: number
          tax?: number | null
          totalPrice: number
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          endDate?: string | null
          extras?: number | null
          customerId?: string | null
          id?: string
          spotId?: string
          startDate?: string | null
          status?: Database["public"]["Enums"]["BookingStatus"]
          subtotal?: number
          tax?: number | null
          totalPrice?: number
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Booking_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_spotId_fkey"
            columns: ["spotId"]
            isOneToOne: false
            referencedRelation: "Spot"
            referencedColumns: ["id"]
          },
        ]
      }
      BookingExtras: {
        Row: {
          bookingId: string
          createdAt: string
          extraId: string
          id: string
          price: number
          quantity: number
          updatedAt: string | null
        }
        Insert: {
          bookingId: string
          createdAt?: string
          extraId: string
          id: string
          price: number
          quantity?: number
          updatedAt?: string | null
        }
        Update: {
          bookingId?: string
          createdAt?: string
          extraId?: string
          id?: string
          price?: number
          quantity?: number
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "BookingExtras_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "Booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BookingExtras_extraId_fkey"
            columns: ["extraId"]
            isOneToOne: false
            referencedRelation: "Extras"
            referencedColumns: ["id"]
          },
        ]
      }
      Category: {
        Row: {
          createdAt: string
          id: string
          name: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Category_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Extras: {
        Row: {
          categoryId: string | null
          createdAt: string
          description: string
          id: string
          name: string
          price: number
          status: Database["public"]["Enums"]["ExtrasStatus"]
          subCategoryId: string | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          categoryId?: string | null
          createdAt?: string
          description: string
          id: string
          name: string
          price: number
          status: Database["public"]["Enums"]["ExtrasStatus"]
          subCategoryId?: string | null
          updatedAt?: string | null
          userId: string
        }
        Update: {
          categoryId?: string | null
          createdAt?: string
          description?: string
          id?: string
          name?: string
          price?: number
          status?: Database["public"]["Enums"]["ExtrasStatus"]
          subCategoryId?: string | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Extras_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Extras_subCategoryId_fkey"
            columns: ["subCategoryId"]
            isOneToOne: false
            referencedRelation: "SubCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Extras_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ExtrasImages: {
        Row: {
          createdAt: string
          extraId: string
          id: string
          url: string
        }
        Insert: {
          createdAt?: string
          extraId: string
          id: string
          url: string
        }
        Update: {
          createdAt?: string
          extraId?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ExtrasImages_extraId_fkey"
            columns: ["extraId"]
            isOneToOne: false
            referencedRelation: "Extras"
            referencedColumns: ["id"]
          },
        ]
      }
      Customer: {
        Row: {
          address: string | null
          dni: string
          email: string
          id: string
          name: string
          note: string
          phone: string
        }
        Insert: {
          address?: string | null
          dni: string
          email: string
          id: string
          name: string
          note?: string
          phone: string
        }
        Update: {
          address?: string | null
          dni?: string
          email?: string
          id?: string
          name?: string
          note?: string
          phone?: string
        }
        Relationships: []
      }
      OneTimeProduct: {
        Row: {
          id: string
          name: string
          stripeProductId: string
        }
        Insert: {
          id: string
          name: string
          stripeProductId: string
        }
        Update: {
          id?: string
          name?: string
          stripeProductId?: string
        }
        Relationships: []
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Spot: {
        Row: {
          additionalGuestPrice: number | null
          allowAdditionalGuest: boolean
          amenities: string[] | null
          createdAt: string
          description: string
          duration: number | null
          durationType: string | null
          id: string
          maxGuest: number | null
          name: string
          path: string
          status: Database["public"]["Enums"]["SpotStatus"]
          units: number | null
          updatedAt: string | null
          userId: string
          workingHours: Json
        }
        Insert: {
          additionalGuestPrice?: number | null
          allowAdditionalGuest?: boolean
          amenities?: string[] | null
          createdAt?: string
          description: string
          duration?: number | null
          durationType?: string | null
          id: string
          maxGuest?: number | null
          name: string
          path?: string
          status: Database["public"]["Enums"]["SpotStatus"]
          units?: number | null
          updatedAt?: string | null
          userId: string
          workingHours?: Json
        }
        Update: {
          additionalGuestPrice?: number | null
          allowAdditionalGuest?: boolean
          amenities?: string[] | null
          createdAt?: string
          description?: string
          duration?: number | null
          durationType?: string | null
          id?: string
          maxGuest?: number | null
          name?: string
          path?: string
          status?: Database["public"]["Enums"]["SpotStatus"]
          units?: number | null
          updatedAt?: string | null
          userId?: string
          workingHours?: Json
        }
        Relationships: [
          {
            foreignKeyName: "Spot_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      SpotImages: {
        Row: {
          createdAt: string
          id: string
          spotId: string
          url: string
        }
        Insert: {
          createdAt?: string
          id: string
          spotId: string
          url: string
        }
        Update: {
          createdAt?: string
          id?: string
          spotId?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "SpotImages_spotId_fkey"
            columns: ["spotId"]
            isOneToOne: false
            referencedRelation: "Spot"
            referencedColumns: ["id"]
          },
        ]
      }
      SubCategory: {
        Row: {
          categoryId: string
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          categoryId: string
          createdAt?: string
          id: string
          name: string
        }
        Update: {
          categoryId?: string
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubCategory_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      Transaction: {
        Row: {
          allowEdit: boolean
          amount: number
          bookingId: string
          createdAt: string
          deletedAt: string | null
          description: string
          id: string
          paymentDate: string
          paymentType: string
          status: Database["public"]["Enums"]["TransactionStatus"]
          updatedAt: string | null
        }
        Insert: {
          allowEdit?: boolean
          amount: number
          bookingId: string
          createdAt?: string
          deletedAt?: string | null
          description: string
          id: string
          paymentDate: string
          paymentType?: string
          status?: Database["public"]["Enums"]["TransactionStatus"]
          updatedAt?: string | null
        }
        Update: {
          allowEdit?: boolean
          amount?: number
          bookingId?: string
          createdAt?: string
          deletedAt?: string | null
          description?: string
          id?: string
          paymentDate?: string
          paymentType?: string
          status?: Database["public"]["Enums"]["TransactionStatus"]
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Transaction_bookingId_fkey"
            columns: ["bookingId"]
            isOneToOne: false
            referencedRelation: "Booking"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          aboutUs: string | null
          country: string | null
          createdAt: string
          currency: string | null
          customDomain: string | null
          customerId: string | null
          defaultPaymentMethod: string | null
          email: string | null
          emailVerified: string | null
          favicon: string | null
          id: string
          image: string | null
          logo: string | null
          name: string | null
          siteName: string | null
          stripeAccountId: string | null
          subdomain: string | null
          subscriptionId: string | null
          wompiAccountId: Json | null
        }
        Insert: {
          aboutUs?: string | null
          country?: string | null
          createdAt?: string
          currency?: string | null
          customDomain?: string | null
          customerId?: string | null
          defaultPaymentMethod?: string | null
          email?: string | null
          emailVerified?: string | null
          favicon?: string | null
          id: string
          image?: string | null
          logo?: string | null
          name?: string | null
          siteName?: string | null
          stripeAccountId?: string | null
          subdomain?: string | null
          subscriptionId?: string | null
          wompiAccountId?: Json | null
        }
        Update: {
          aboutUs?: string | null
          country?: string | null
          createdAt?: string
          currency?: string | null
          customDomain?: string | null
          customerId?: string | null
          defaultPaymentMethod?: string | null
          email?: string | null
          emailVerified?: string | null
          favicon?: string | null
          id?: string
          image?: string | null
          logo?: string | null
          name?: string | null
          siteName?: string | null
          stripeAccountId?: string | null
          subdomain?: string | null
          subscriptionId?: string | null
          wompiAccountId?: Json | null
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
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
      BookingStatus:
        | "In_progress"
        | "Confirmed"
        | "Cancelled"
        | "Waiting_for_payment"
      ExtrasStatus: "Private" | "Public" | "Disabled"
      SpotStatus: "Private" | "Public" | "Disabled"
      TransactionStatus:
        | "Approved"
        | "Pending"
        | "Declined"
        | "Paid"
        | "Cancelled"
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
