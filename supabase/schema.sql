-- ═══════════════════════════════════════
-- ELIOR EYEWEAR — DATABASE SCHEMA
-- Supabase (PostgreSQL)
-- ═══════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══ USERS & AUTH ═══
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin','editor','marketing','viewer')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin user (password: 123456 - bcrypt hash)
INSERT INTO users (username, email, password_hash, name, role) VALUES
  ('teomiranda', 'teo@elior.com.br', '$2b$10$rQZ8kHxF8vSz5LYjKJ5OUeGV7s9XmTjW1nZ5qR3xK2yP4aB6cD8eF', 'Teo Miranda', 'admin');

-- ═══ PRODUCTS ═══
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  category VARCHAR(20) CHECK (category IN ('grau','sol')),
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  cost DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','draft')),
  description TEXT,
  colors JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  badge VARCHAR(50),
  seo_title VARCHAR(255),
  seo_description TEXT,
  weight_grams INTEGER DEFAULT 300,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images (multiple per product)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ CUSTOMERS ═══
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  cpf VARCHAR(14),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'principal',
  cep VARCHAR(9) NOT NULL,
  street VARCHAR(255),
  number VARCHAR(20),
  complement VARCHAR(100),
  neighborhood VARCHAR(100),
  city VARCHAR(100),
  state CHAR(2),
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ORDERS ═══
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending','confirmed','processing','shipped','delivered','cancelled','refunded'
  )),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
    'pending','approved','rejected','refunded','cancelled'
  )),
  payment_id VARCHAR(255),
  payment_data JSONB,
  shipping_method VARCHAR(50),
  shipping_tracking VARCHAR(100),
  shipping_data JSONB,
  coupon_code VARCHAR(50),
  notes TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255),
  color VARCHAR(50),
  lens_type VARCHAR(50),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('bump','cross_sell'))
);

-- ═══ LEADS ═══
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  phone VARCHAR(20),
  source VARCHAR(50) DEFAULT 'popup',
  coupon_code VARCHAR(50),
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ABANDONED CARTS ═══
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  email VARCHAR(255),
  phone VARCHAR(20),
  cart_data JSONB NOT NULL,
  total DECIMAL(10,2),
  recovery_status VARCHAR(20) DEFAULT 'pending' CHECK (recovery_status IN (
    'pending','contacted','recovered','expired'
  )),
  recovery_attempts INTEGER DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ MESSAGING ═══
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  channel VARCHAR(20) CHECK (channel IN ('whatsapp','email')),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES message_templates(id),
  channel VARCHAR(20),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  content TEXT,
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN (
    'queued','sent','delivered','opened','clicked','failed','bounced'
  )),
  external_id VARCHAR(255),
  metadata JSONB,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ FUNNELS ═══
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(30) CHECK (type IN ('abandono','recompra','captação','reativação')),
  channel VARCHAR(20),
  active BOOLEAN DEFAULT true,
  sent INTEGER DEFAULT 0,
  converted INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ COUPONS ═══
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) CHECK (type IN ('percentage','fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_order DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  used INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO coupons (code, type, value, max_uses) VALUES
  ('BEMVINDO15', 'percentage', 15, NULL),
  ('VOLTE10', 'percentage', 10, NULL),
  ('VOLTE20', 'percentage', 20, NULL);

-- ═══ ANALYTICS ═══
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255),
  page VARCHAR(255),
  product_id UUID REFERENCES products(id),
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  device VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ INDEXES ═══
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_message_log_status ON message_log(status);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX idx_abandoned_carts_status ON abandoned_carts(recovery_status);

-- ═══ ROW LEVEL SECURITY ═══
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public read for products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'active');

-- Authenticated full access
CREATE POLICY "Authenticated users full access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
