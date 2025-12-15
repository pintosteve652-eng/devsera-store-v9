-- 1. Create security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = 'admin'
  )
$$;

-- 2. Fix profiles SELECT policy - restrict to own profile + admins
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- 3. Fix settings SELECT policy - restrict to authenticated users only
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;

CREATE POLICY "Authenticated users can view settings"
ON public.settings
FOR SELECT
TO authenticated
USING (true);

-- 4. Fix loyalty_points policies - remove overly permissive "System can manage"
DROP POLICY IF EXISTS "System can manage loyalty points" ON public.loyalty_points;

CREATE POLICY "Users can insert own loyalty points"
ON public.loyalty_points
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loyalty points"
ON public.loyalty_points
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all loyalty points"
ON public.loyalty_points
FOR ALL
USING (public.is_admin(auth.uid()));

-- 5. Fix referral_codes policies - remove overly permissive "System can manage"
DROP POLICY IF EXISTS "System can manage referral codes" ON public.referral_codes;

CREATE POLICY "Users can insert own referral code"
ON public.referral_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral code"
ON public.referral_codes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all referral codes"
ON public.referral_codes
FOR ALL
USING (public.is_admin(auth.uid()));

-- 6. Fix referrals policies - remove overly permissive "System can manage"
DROP POLICY IF EXISTS "System can manage referrals" ON public.referrals;

CREATE POLICY "Users can insert referrals"
ON public.referrals
FOR INSERT
WITH CHECK (auth.uid() = referred_id);

CREATE POLICY "Users can update own referrals"
ON public.referrals
FOR UPDATE
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Admins can manage all referrals"
ON public.referrals
FOR ALL
USING (public.is_admin(auth.uid()));

-- 7. Fix database functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_product_stock_count(p_product_id uuid, p_variant_id uuid DEFAULT NULL::uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_variant_id IS NOT NULL THEN
    RETURN (SELECT COUNT(*) FROM product_stock_keys 
            WHERE product_id = p_product_id 
            AND variant_id = p_variant_id 
            AND status = 'AVAILABLE');
  ELSE
    RETURN (SELECT COUNT(*) FROM product_stock_keys 
            WHERE product_id = p_product_id 
            AND status = 'AVAILABLE');
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_stock_key_to_order(p_order_id uuid, p_product_id uuid, p_variant_id uuid DEFAULT NULL::uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key_id UUID;
BEGIN
  IF p_variant_id IS NOT NULL THEN
    SELECT id INTO v_key_id FROM product_stock_keys 
    WHERE product_id = p_product_id 
    AND variant_id = p_variant_id 
    AND status = 'AVAILABLE'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
  ELSE
    SELECT id INTO v_key_id FROM product_stock_keys 
    WHERE product_id = p_product_id 
    AND status = 'AVAILABLE'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
  END IF;
  
  IF v_key_id IS NOT NULL THEN
    UPDATE product_stock_keys 
    SET status = 'ASSIGNED', 
        assigned_order_id = p_order_id,
        updated_at = NOW()
    WHERE id = v_key_id;
  END IF;
  
  RETURN v_key_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;