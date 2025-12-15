-- Add bundle_id column to orders table to track bundle purchases
ALTER TABLE public.orders 
ADD COLUMN bundle_id uuid REFERENCES public.bundles(id) ON DELETE SET NULL;

-- Add index for faster bundle order lookups
CREATE INDEX idx_orders_bundle_id ON public.orders(bundle_id) WHERE bundle_id IS NOT NULL;