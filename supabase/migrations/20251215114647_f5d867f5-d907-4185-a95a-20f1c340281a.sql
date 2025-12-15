-- Add missing columns to product_variants table for CSV import
ALTER TABLE public.product_variants
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS features text[];