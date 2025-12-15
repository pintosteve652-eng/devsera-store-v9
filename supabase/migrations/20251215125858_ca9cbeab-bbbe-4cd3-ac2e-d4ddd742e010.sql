-- Add text alignment columns to banner_posts table
ALTER TABLE public.banner_posts 
ADD COLUMN IF NOT EXISTS text_align_h TEXT DEFAULT 'center',
ADD COLUMN IF NOT EXISTS text_align_v TEXT DEFAULT 'center';