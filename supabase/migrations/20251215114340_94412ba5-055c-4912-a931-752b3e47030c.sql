-- Add missing columns to products table for full CSV import
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS delivery_instructions text,
ADD COLUMN IF NOT EXISTS requires_user_input boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS user_input_label text,
ADD COLUMN IF NOT EXISTS requires_password boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS use_manual_stock boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS manual_stock_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS fulfillment_method text,
ADD COLUMN IF NOT EXISTS fulfillment_details text,
ADD COLUMN IF NOT EXISTS custom_requirements_label text,
ADD COLUMN IF NOT EXISTS custom_user_sees_label text;