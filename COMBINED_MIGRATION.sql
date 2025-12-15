-- =====================================================
-- DEVSERA STORE - COMPLETE DATABASE MIGRATION SCRIPT
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  admin_role TEXT CHECK (admin_role IN ('super_admin', 'admin', 'moderator')),
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  original_price INTEGER NOT NULL,
  sale_price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  features TEXT[] NOT NULL,
  category TEXT NOT NULL,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  has_variants BOOLEAN DEFAULT FALSE,
  low_stock_alert INTEGER DEFAULT 5,
  delivery_type TEXT DEFAULT 'MANUAL',
  cost_price DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
  payment_screenshot TEXT,
  credentials JSONB,
  cancellation_reason TEXT,
  fulfillment_method TEXT DEFAULT 'MANUAL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  max_slots INTEGER NOT NULL DEFAULT 5,
  used_slots INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'expired')),
  expiry_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  upi_id TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  telegram_link TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PRODUCT VARIANTS & STOCK
-- =====================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  stock_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  requires_password BOOLEAN DEFAULT FALSE,
  delivery_type TEXT DEFAULT 'MANUAL',
  cost_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_stock_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL DEFAULT 'LICENSE_KEY',
  key_value TEXT NOT NULL,
  username TEXT,
  password TEXT,
  additional_data JSONB,
  status TEXT NOT NULL DEFAULT 'AVAILABLE',
  assigned_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BUNDLES
-- =====================================================

CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- =====================================================
-- SUPPORT TICKETS
-- =====================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LOYALTY & REFERRAL SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  code TEXT UNIQUE NOT NULL,
  uses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reward_given BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_id)
);

-- =====================================================
-- COUPONS
-- =====================================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 100,
  points_used INTEGER NOT NULL DEFAULT 5000,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  email_order_updates BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT true,
  push_order_updates BOOLEAN DEFAULT true,
  push_promotions BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PREMIUM SYSTEM
-- =====================================================

DO $$ BEGIN
  CREATE TYPE premium_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE premium_plan AS ENUM ('5_year', '10_year', 'lifetime');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE premium_content_type AS ENUM ('trick', 'guide', 'offer', 'resource');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS premium_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type premium_plan NOT NULL,
  price_paid decimal(10,2) NOT NULL,
  payment_proof_url text,
  payment_method text NOT NULL,
  transaction_id text,
  status premium_status DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES public.profiles(id),
  expires_at timestamptz,
  rejection_reason text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS premium_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  is_free_for_premium boolean DEFAULT false,
  premium_discount_percent integer DEFAULT 0,
  premium_only boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

CREATE TABLE IF NOT EXISTS premium_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content_type premium_content_type NOT NULL,
  content_url text,
  content_body text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS premium_coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  coupon_code TEXT NOT NULL,
  discount_applied DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_code)
);

-- =====================================================
-- ADMIN PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  can_manage_products BOOLEAN DEFAULT false,
  can_manage_orders BOOLEAN DEFAULT false,
  can_manage_customers BOOLEAN DEFAULT false,
  can_manage_bundles BOOLEAN DEFAULT false,
  can_manage_flash_sales BOOLEAN DEFAULT false,
  can_manage_premium BOOLEAN DEFAULT false,
  can_manage_rewards BOOLEAN DEFAULT false,
  can_manage_community BOOLEAN DEFAULT false,
  can_manage_tickets BOOLEAN DEFAULT false,
  can_manage_settings BOOLEAN DEFAULT false,
  can_manage_admins BOOLEAN DEFAULT false,
  can_delete_data BOOLEAN DEFAULT false,
  can_edit_data BOOLEAN DEFAULT true,
  can_view_reports BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(admin_id)
);

-- =====================================================
-- BANNER POSTS
-- =====================================================

CREATE TABLE IF NOT EXISTS banner_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  button_text VARCHAR(100) DEFAULT 'Shop Now',
  button_link VARCHAR(500) DEFAULT '/',
  gradient VARCHAR(255) DEFAULT 'from-teal-600 via-teal-700 to-emerald-800',
  icon_type VARCHAR(50) DEFAULT 'sparkles',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FLASH SALE CONFIG
-- =====================================================

CREATE TABLE IF NOT EXISTS flash_sale_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN DEFAULT true,
  discount_percentage INTEGER DEFAULT 20,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  title TEXT DEFAULT 'Flash Sale',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY LIKES TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_accounts_product_id ON accounts(product_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_keys_product_id ON product_stock_keys(product_id);
CREATE INDEX IF NOT EXISTS idx_product_stock_keys_status ON product_stock_keys(status);
CREATE INDEX IF NOT EXISTS idx_product_stock_keys_variant_id ON product_stock_keys(variant_id);
CREATE INDEX IF NOT EXISTS idx_products_scheduled ON products(scheduled_start, scheduled_end);
CREATE INDEX IF NOT EXISTS idx_bundle_products_bundle ON bundle_products(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_products_product ON bundle_products(product_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupons_user ON coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_premium_memberships_user ON premium_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_memberships_status ON premium_memberships(status);
CREATE INDEX IF NOT EXISTS idx_premium_products_product ON premium_products(product_id);
CREATE INDEX IF NOT EXISTS idx_banner_posts_active ON banner_posts(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_banner_posts_dates ON banner_posts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_community_likes_post ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user ON community_likes(user_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stock_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert products" ON products;
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can update products" ON products;
CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can delete products" ON products;
CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Accounts policies (admin only)
DROP POLICY IF EXISTS "Only admins can view accounts" ON accounts;
CREATE POLICY "Only admins can view accounts" ON accounts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can insert accounts" ON accounts;
CREATE POLICY "Only admins can insert accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can update accounts" ON accounts;
CREATE POLICY "Only admins can update accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Community posts policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON community_posts;
CREATE POLICY "Posts are viewable by everyone" ON community_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete posts" ON community_posts;
CREATE POLICY "Admins can delete posts" ON community_posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
CREATE POLICY "Authenticated users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Settings policies
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert settings" ON settings;
CREATE POLICY "Only admins can insert settings" ON settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Only admins can update settings" ON settings;
CREATE POLICY "Only admins can update settings" ON settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Product variants policies
DROP POLICY IF EXISTS "Anyone can view product variants" ON product_variants;
CREATE POLICY "Anyone can view product variants" ON product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage product variants" ON product_variants;
CREATE POLICY "Admins can manage product variants" ON product_variants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Product stock keys policies
DROP POLICY IF EXISTS "Admins can manage stock keys" ON product_stock_keys;
CREATE POLICY "Admins can manage stock keys" ON product_stock_keys
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Bundles policies
DROP POLICY IF EXISTS "Anyone can view active bundles" ON bundles;
CREATE POLICY "Anyone can view active bundles" ON bundles
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage bundles" ON bundles;
CREATE POLICY "Admins can manage bundles" ON bundles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Anyone can view bundle products" ON bundle_products;
CREATE POLICY "Anyone can view bundle products" ON bundle_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage bundle products" ON bundle_products;
CREATE POLICY "Admins can manage bundle products" ON bundle_products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Support tickets policies
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all tickets" ON support_tickets;
CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update tickets" ON support_tickets;
CREATE POLICY "Admins can update tickets" ON support_tickets
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete tickets" ON support_tickets;
CREATE POLICY "Admins can delete tickets" ON support_tickets
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Loyalty points policies
DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
CREATE POLICY "Users can view own loyalty points" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage loyalty points" ON loyalty_points;
CREATE POLICY "System can manage loyalty points" ON loyalty_points
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all loyalty data" ON loyalty_points;
CREATE POLICY "Admins can view all loyalty data" ON loyalty_points
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Point transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON point_transactions;
CREATE POLICY "Users can view own transactions" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create transactions" ON point_transactions;
CREATE POLICY "System can create transactions" ON point_transactions
  FOR INSERT WITH CHECK (true);

-- Referral codes policies
DROP POLICY IF EXISTS "Anyone can view referral codes" ON referral_codes;
CREATE POLICY "Anyone can view referral codes" ON referral_codes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "System can manage referral codes" ON referral_codes;
CREATE POLICY "System can manage referral codes" ON referral_codes
  FOR ALL USING (true);

-- Referrals policies
DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "System can manage referrals" ON referrals;
CREATE POLICY "System can manage referrals" ON referrals
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view all referrals" ON referrals;
CREATE POLICY "Admins can view all referrals" ON referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Push subscriptions policies
DROP POLICY IF EXISTS "Users can manage own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Notification preferences policies
DROP POLICY IF EXISTS "Users can manage own preferences" ON notification_preferences;
CREATE POLICY "Users can manage own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Coupons policies
DROP POLICY IF EXISTS "Users can view own coupons" ON coupons;
CREATE POLICY "Users can view own coupons" ON coupons
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create coupons" ON coupons;
CREATE POLICY "Users can create coupons" ON coupons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own coupons" ON coupons;
CREATE POLICY "Users can update own coupons" ON coupons
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all coupons" ON coupons;
CREATE POLICY "Admins can view all coupons" ON coupons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Premium memberships policies
DROP POLICY IF EXISTS "Users can view own memberships" ON premium_memberships;
CREATE POLICY "Users can view own memberships" ON premium_memberships
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own memberships" ON premium_memberships;
CREATE POLICY "Users can insert own memberships" ON premium_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all memberships" ON premium_memberships;
CREATE POLICY "Admins can view all memberships" ON premium_memberships
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update memberships" ON premium_memberships;
CREATE POLICY "Admins can update memberships" ON premium_memberships
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Premium products policies
DROP POLICY IF EXISTS "Anyone can view premium products" ON premium_products;
CREATE POLICY "Anyone can view premium products" ON premium_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage premium products" ON premium_products;
CREATE POLICY "Admins can manage premium products" ON premium_products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Premium content policies
DROP POLICY IF EXISTS "Premium users can view content" ON premium_content;
CREATE POLICY "Premium users can view content" ON premium_content
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM premium_memberships 
      WHERE user_id = auth.uid() 
      AND status = 'approved' 
      AND (expires_at IS NULL OR expires_at > now())
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can manage premium content" ON premium_content;
CREATE POLICY "Admins can manage premium content" ON premium_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Premium coupon usage policies
DROP POLICY IF EXISTS "Users can view own coupon usage" ON premium_coupon_usage;
CREATE POLICY "Users can view own coupon usage" ON premium_coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert coupon usage" ON premium_coupon_usage;
CREATE POLICY "Users can insert coupon usage" ON premium_coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin permissions policies
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON admin_permissions;
CREATE POLICY "Super admins can manage all permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND admin_role = 'super_admin')
  );

DROP POLICY IF EXISTS "Admins can view own permissions" ON admin_permissions;
CREATE POLICY "Admins can view own permissions" ON admin_permissions
  FOR SELECT USING (admin_id = auth.uid());

-- Banner posts policies
DROP POLICY IF EXISTS "Anyone can view active banners" ON banner_posts;
CREATE POLICY "Anyone can view active banners" ON banner_posts
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage banners" ON banner_posts;
CREATE POLICY "Admins can manage banners" ON banner_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Flash sale config policies
DROP POLICY IF EXISTS "Anyone can view flash sale config" ON flash_sale_config;
CREATE POLICY "Anyone can view flash sale config" ON flash_sale_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage flash sale config" ON flash_sale_config;
CREATE POLICY "Admins can manage flash sale config" ON flash_sale_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Community likes policies
DROP POLICY IF EXISTS "Anyone can view likes" ON community_likes;
CREATE POLICY "Anyone can view likes" ON community_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own likes" ON community_likes;
CREATE POLICY "Users can manage own likes" ON community_likes
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get available stock count
CREATE OR REPLACE FUNCTION get_product_stock_count(p_product_id UUID, p_variant_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;

-- Function to assign a stock key to an order
CREATE OR REPLACE FUNCTION assign_stock_key_to_order(p_order_id UUID, p_product_id UUID, p_variant_id UUID DEFAULT NULL)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert sample products
INSERT INTO products (name, description, image, original_price, sale_price, duration, features, category) VALUES
('Canva Pro', 'Access premium design tools, templates, and features', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', 1299, 199, '1 Month', ARRAY['Unlimited premium templates', 'Brand kit & fonts', 'Background remover', 'Magic resize', 'Team collaboration'], 'Design'),
('LinkedIn Premium', 'Unlock career opportunities with premium features', 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80', 1999, 299, '1 Month', ARRAY['InMail messages', 'See who viewed your profile', 'LinkedIn Learning access', 'Applicant insights', 'Premium badge'], 'Professional'),
('Netflix Premium', 'Stream unlimited movies and TV shows in 4K', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80', 649, 149, '1 Month', ARRAY['4K Ultra HD streaming', '4 screens at once', 'Download on 6 devices', 'No ads', 'Unlimited content'], 'Entertainment'),
('Spotify Premium', 'Ad-free music streaming with offline downloads', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80', 119, 79, '1 Month', ARRAY['Ad-free listening', 'Offline downloads', 'High quality audio', 'Unlimited skips', 'Play any song'], 'Entertainment'),
('ChatGPT Plus', 'Access GPT-4 and advanced AI features', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 1600, 399, '1 Month', ARRAY['GPT-4 access', 'Faster response times', 'Priority access', 'Advanced data analysis', 'DALL-E 3 integration'], 'AI Tools'),
('YouTube Premium', 'Ad-free videos, background play, and downloads', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80', 129, 89, '1 Month', ARRAY['Ad-free videos', 'Background playback', 'Offline downloads', 'YouTube Music Premium', 'Picture-in-picture'], 'Entertainment')
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (upi_id, qr_code_url, telegram_link, contact_email, contact_phone) VALUES
('devsera@paytm', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80', 'https://t.me/devserasupport', 'support@devsera.store', '+91 98765 43210')
ON CONFLICT DO NOTHING;

-- Insert default banner posts
INSERT INTO banner_posts (title, subtitle, description, button_text, button_link, gradient, icon_type, display_order, is_active)
VALUES 
  ('Premium Services', 'Unbeatable Prices', 'Get instant access to Canva Pro, LinkedIn Premium, Netflix, and more at up to 85% off!', 'Shop Now', '/', 'from-teal-600 via-teal-700 to-emerald-800', 'sparkles', 1, true),
  ('Bundle & Save', 'Up to 50% Extra Off', 'Combine multiple subscriptions and unlock exclusive bundle discounts!', 'View Bundles', '/bundles', 'from-purple-600 via-pink-600 to-purple-800', 'gift', 2, true),
  ('Fast Delivery', 'Within 2 Hours', 'Get your credentials delivered instantly after payment verification.', 'Learn More', '/contact', 'from-amber-500 via-orange-500 to-red-600', 'clock', 3, true),
  ('100% Secure', 'Verified Accounts', 'All accounts are verified and come with replacement guarantee.', 'Contact Support', '/support', 'from-blue-600 via-indigo-600 to-purple-700', 'shield', 4, true)
ON CONFLICT DO NOTHING;

-- Insert premium content
INSERT INTO premium_content (title, description, content_type, content_body, is_active) VALUES
('Free Netflix Trick', 'Get Netflix premium for free using this method', 'trick', 'Step 1: Visit the official Netflix website...', true),
('Amazon Prime Hack', 'Extended trial method for Amazon Prime', 'trick', 'Follow these steps carefully...', true),
('Exclusive Discount Codes', 'Monthly updated discount codes for premium members', 'offer', 'Use code PREMIUM50 for 50% off...', true),
('Complete Guide to Digital Products', 'Master guide for all digital subscriptions', 'guide', 'This comprehensive guide covers...', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('community-images', 'community-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true) ON CONFLICT DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can read payment screenshots" ON storage.objects;
CREATE POLICY "Anyone can read payment screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-screenshots');

DROP POLICY IF EXISTS "Authenticated users can upload payment screenshots" ON storage.objects;
CREATE POLICY "Authenticated users can upload payment screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can read product images" ON storage.objects;
CREATE POLICY "Anyone can read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can manage product images" ON storage.objects;
CREATE POLICY "Admins can manage product images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'product-images' AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Anyone can read community images" ON storage.objects;
CREATE POLICY "Anyone can read community images" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-images');

DROP POLICY IF EXISTS "Authenticated users can upload community images" ON storage.objects;
CREATE POLICY "Authenticated users can upload community images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'community-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can read payment proofs" ON storage.objects;
CREATE POLICY "Anyone can read payment proofs" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Authenticated users can upload payment proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload payment proofs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Migration completed successfully!' as status;
