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
      accounts: {
        Row: {
          created_at: string
          expiry_date: string
          id: string
          max_slots: number
          password: string
          product_id: string
          status: string
          updated_at: string
          used_slots: number
          username: string
        }
        Insert: {
          created_at?: string
          expiry_date: string
          id?: string
          max_slots?: number
          password: string
          product_id: string
          status?: string
          updated_at?: string
          used_slots?: number
          username: string
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: string
          max_slots?: number
          password?: string
          product_id?: string
          status?: string
          updated_at?: string
          used_slots?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          admin_id: string
          can_delete_data: boolean | null
          can_edit_data: boolean | null
          can_manage_admins: boolean | null
          can_manage_bundles: boolean | null
          can_manage_community: boolean | null
          can_manage_customers: boolean | null
          can_manage_flash_sales: boolean | null
          can_manage_orders: boolean | null
          can_manage_premium: boolean | null
          can_manage_products: boolean | null
          can_manage_rewards: boolean | null
          can_manage_settings: boolean | null
          can_manage_tickets: boolean | null
          can_view_reports: boolean | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          can_delete_data?: boolean | null
          can_edit_data?: boolean | null
          can_manage_admins?: boolean | null
          can_manage_bundles?: boolean | null
          can_manage_community?: boolean | null
          can_manage_customers?: boolean | null
          can_manage_flash_sales?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_premium?: boolean | null
          can_manage_products?: boolean | null
          can_manage_rewards?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_tickets?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          can_delete_data?: boolean | null
          can_edit_data?: boolean | null
          can_manage_admins?: boolean | null
          can_manage_bundles?: boolean | null
          can_manage_community?: boolean | null
          can_manage_customers?: boolean | null
          can_manage_flash_sales?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_premium?: boolean | null
          can_manage_products?: boolean | null
          can_manage_rewards?: boolean | null
          can_manage_settings?: boolean | null
          can_manage_tickets?: boolean | null
          can_view_reports?: boolean | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_permissions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_posts: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          gradient: string | null
          icon_type: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          start_date: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          gradient?: string | null
          icon_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          gradient?: string | null
          icon_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bundle_products: {
        Row: {
          bundle_id: string | null
          created_at: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          bundle_id?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bundle_products_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          original_price: number
          sale_price: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          original_price: number
          sale_price: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          original_price?: number
          sale_price?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments: number
          content: string
          created_at: string
          id: string
          likes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comments?: number
          content: string
          created_at?: string
          id?: string
          likes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comments?: number
          content?: string
          created_at?: string
          id?: string
          likes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          admin_response: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          responded_at: string | null
          responded_by: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_amount: number
          expires_at: string | null
          id: string
          is_used: boolean | null
          order_id: string | null
          points_used: number
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_amount?: number
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          order_id?: string | null
          points_used?: number
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_amount?: number
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          order_id?: string | null
          points_used?: number
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flash_sale_config: {
        Row: {
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          end_time: string
          id: string
          is_enabled: boolean | null
          start_time: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_time: string
          id?: string
          is_enabled?: boolean | null
          start_time: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          end_time?: string
          id?: string
          is_enabled?: boolean | null
          start_time?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          lifetime_points: number | null
          tier: string | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lifetime_points?: number | null
          tier?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lifetime_points?: number | null
          tier?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_order_updates: boolean | null
          email_promotions: boolean | null
          id: string
          push_order_updates: boolean | null
          push_promotions: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          id?: string
          push_order_updates?: boolean | null
          push_promotions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          id?: string
          push_order_updates?: boolean | null
          push_promotions?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          created_at: string
          credentials: Json | null
          fulfillment_method: string | null
          id: string
          payment_screenshot: string | null
          product_id: string
          status: string
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          created_at?: string
          credentials?: Json | null
          fulfillment_method?: string | null
          id?: string
          payment_screenshot?: string | null
          product_id: string
          status?: string
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          created_at?: string
          credentials?: Json | null
          fulfillment_method?: string | null
          id?: string
          payment_screenshot?: string | null
          product_id?: string
          status?: string
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_content: {
        Row: {
          content_body: string | null
          content_type: Database["public"]["Enums"]["premium_content_type"]
          content_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_body?: string | null
          content_type: Database["public"]["Enums"]["premium_content_type"]
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_body?: string | null
          content_type?: Database["public"]["Enums"]["premium_content_type"]
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      premium_coupon_usage: {
        Row: {
          coupon_code: string
          discount_applied: number
          id: string
          product_id: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code: string
          discount_applied: number
          id?: string
          product_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code?: string
          discount_applied?: number
          id?: string
          product_id?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_coupon_usage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "premium_coupon_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_memberships: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          notes: string | null
          payment_method: string
          payment_proof_url: string | null
          plan_type: Database["public"]["Enums"]["premium_plan"]
          price_paid: number
          rejection_reason: string | null
          requested_at: string | null
          status: Database["public"]["Enums"]["premium_status"] | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          payment_method: string
          payment_proof_url?: string | null
          plan_type: Database["public"]["Enums"]["premium_plan"]
          price_paid: number
          rejection_reason?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["premium_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string
          payment_proof_url?: string | null
          plan_type?: Database["public"]["Enums"]["premium_plan"]
          price_paid?: number
          rejection_reason?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["premium_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_memberships_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "premium_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_products: {
        Row: {
          created_at: string | null
          id: string
          is_free_for_premium: boolean | null
          premium_discount_percent: number | null
          premium_only: boolean | null
          product_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_free_for_premium?: boolean | null
          premium_discount_percent?: number | null
          premium_only?: boolean | null
          product_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_free_for_premium?: boolean | null
          premium_discount_percent?: number | null
          premium_only?: boolean | null
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock_keys: {
        Row: {
          additional_data: Json | null
          assigned_order_id: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          key_type: string
          key_value: string
          password: string | null
          product_id: string
          status: string
          updated_at: string | null
          username: string | null
          variant_id: string | null
        }
        Insert: {
          additional_data?: Json | null
          assigned_order_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          key_type?: string
          key_value: string
          password?: string | null
          product_id: string
          status?: string
          updated_at?: string | null
          username?: string | null
          variant_id?: string | null
        }
        Update: {
          additional_data?: Json | null
          assigned_order_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          key_type?: string
          key_value?: string
          password?: string | null
          product_id?: string
          status?: string
          updated_at?: string | null
          username?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_keys_assigned_order_id_fkey"
            columns: ["assigned_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_keys_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_keys_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          cost_price: number | null
          created_at: string | null
          delivery_type: string | null
          duration: string
          features: string[] | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          original_price: number
          product_id: string
          requires_password: boolean | null
          sale_price: number
          sort_order: number | null
          stock_count: number | null
          updated_at: string | null
        }
        Insert: {
          cost_price?: number | null
          created_at?: string | null
          delivery_type?: string | null
          duration: string
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          original_price: number
          product_id: string
          requires_password?: boolean | null
          sale_price: number
          sort_order?: number | null
          stock_count?: number | null
          updated_at?: string | null
        }
        Update: {
          cost_price?: number | null
          created_at?: string | null
          delivery_type?: string | null
          duration?: string
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          original_price?: number
          product_id?: string
          requires_password?: boolean | null
          sale_price?: number
          sort_order?: number | null
          stock_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          cost_price: number | null
          created_at: string
          custom_requirements_label: string | null
          custom_user_sees_label: string | null
          customer_requirement_message: string | null
          delivery_instructions: string | null
          delivery_type: string | null
          description: string
          duration: string
          features: string[]
          fulfillment_details: string | null
          fulfillment_method: string | null
          has_variants: boolean | null
          id: string
          image: string
          is_active: boolean | null
          low_stock_alert: number | null
          manual_stock_count: number | null
          name: string
          original_price: number
          post_purchase_message: string | null
          requires_password: boolean | null
          requires_user_input: boolean | null
          sale_price: number
          scheduled_end: string | null
          scheduled_start: string | null
          updated_at: string
          use_manual_stock: boolean | null
          user_input_label: string | null
        }
        Insert: {
          category: string
          cost_price?: number | null
          created_at?: string
          custom_requirements_label?: string | null
          custom_user_sees_label?: string | null
          customer_requirement_message?: string | null
          delivery_instructions?: string | null
          delivery_type?: string | null
          description: string
          duration: string
          features: string[]
          fulfillment_details?: string | null
          fulfillment_method?: string | null
          has_variants?: boolean | null
          id?: string
          image: string
          is_active?: boolean | null
          low_stock_alert?: number | null
          manual_stock_count?: number | null
          name: string
          original_price: number
          post_purchase_message?: string | null
          requires_password?: boolean | null
          requires_user_input?: boolean | null
          sale_price: number
          scheduled_end?: string | null
          scheduled_start?: string | null
          updated_at?: string
          use_manual_stock?: boolean | null
          user_input_label?: string | null
        }
        Update: {
          category?: string
          cost_price?: number | null
          created_at?: string
          custom_requirements_label?: string | null
          custom_user_sees_label?: string | null
          customer_requirement_message?: string | null
          delivery_instructions?: string | null
          delivery_type?: string | null
          description?: string
          duration?: string
          features?: string[]
          fulfillment_details?: string | null
          fulfillment_method?: string | null
          has_variants?: boolean | null
          id?: string
          image?: string
          is_active?: boolean | null
          low_stock_alert?: number | null
          manual_stock_count?: number | null
          name?: string
          original_price?: number
          post_purchase_message?: string | null
          requires_password?: boolean | null
          requires_user_input?: boolean | null
          sale_price?: number
          scheduled_end?: string | null
          scheduled_start?: string | null
          updated_at?: string
          use_manual_stock?: boolean | null
          user_input_label?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_role: string | null
          created_at: string
          created_by: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          admin_role?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          admin_role?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string | null
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string | null
          user_id: string | null
        }
        Insert: {
          auth?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh?: string | null
          user_id?: string | null
        }
        Update: {
          auth?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          user_id: string | null
          uses: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
          uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          reward_given: boolean | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_given?: boolean | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_given?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          product_id: string
          rating: number
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          qr_code_url: string
          telegram_link: string
          updated_at: string
          upi_id: string
        }
        Insert: {
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          qr_code_url: string
          telegram_link: string
          updated_at?: string
          upi_id: string
        }
        Update: {
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          qr_code_url?: string
          telegram_link?: string
          updated_at?: string
          upi_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          order_id: string | null
          priority: string | null
          responded_at: string | null
          responded_by: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_response?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          order_id?: string | null
          priority?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_response?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          order_id?: string | null
          priority?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_stock_key_to_order: {
        Args: {
          p_order_id: string
          p_product_id: string
          p_variant_id?: string
        }
        Returns: string
      }
      get_product_stock_count: {
        Args: { p_product_id: string; p_variant_id?: string }
        Returns: number
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      premium_content_type: "trick" | "guide" | "offer" | "resource"
      premium_plan: "5_year" | "10_year" | "lifetime"
      premium_status: "pending" | "approved" | "rejected" | "expired"
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
      premium_content_type: ["trick", "guide", "offer", "resource"],
      premium_plan: ["5_year", "10_year", "lifetime"],
      premium_status: ["pending", "approved", "rejected", "expired"],
    },
  },
} as const
