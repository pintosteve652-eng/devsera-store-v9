-- Issue #1: Add separate columns for customer requirement and post-purchase messages
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS customer_requirement_message text,
ADD COLUMN IF NOT EXISTS post_purchase_message text;

-- Issue #3: Create contact_requests table for Contact Us form
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'pending',
  admin_response text,
  responded_at timestamp with time zone,
  responded_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact requests (public form)
CREATE POLICY "Anyone can submit contact requests"
ON public.contact_requests
FOR INSERT
WITH CHECK (true);

-- Admins can view all contact requests
CREATE POLICY "Admins can view contact requests"
ON public.contact_requests
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Admins can update contact requests (respond)
CREATE POLICY "Admins can update contact requests"
ON public.contact_requests
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Admins can delete contact requests
CREATE POLICY "Admins can delete contact requests"
ON public.contact_requests
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));