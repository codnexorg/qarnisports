/*
# Create Products Table

1. New Tables
   - `products`
     - `id` (uuid, primary key, auto-generated)
     - `name` (text, not null) — product display name
     - `sport` (text, not null) — sport category slug (football, cricket, etc.)
     - `price` (integer, not null) — sale price in PKR
     - `original_price` (integer, nullable) — original price for discount display
     - `image` (text) — product image URL
     - `badge` (text, nullable) — badge label like "Best Seller"
     - `rating` (numeric 3,1) — star rating
     - `reviews` (integer) — review count
     - `description` (text) — short description
     - `long_description` (text, nullable) — full product description
     - `features` (text[]) — bullet-point feature list
     - `colors` (jsonb) — [{label, hex}] color options
     - `sizes` (text[]) — available sizes
     - `sku` (text, nullable) — product SKU code
     - `in_stock` (boolean) — inventory status
     - `sale_end_time` (timestamptz, nullable) — when the sale ends; drives countdown timer
     - `is_featured` (boolean) — show in featured section on homepage
     - `created_at` (timestamptz) — creation timestamp
     - `updated_at` (timestamptz) — last update timestamp

2. Security
   - RLS enabled on `products`.
   - Full anon + authenticated CRUD — public storefront reads, admin panel writes.
     (Admin panel is protected by in-app password gate, not DB auth.)

3. Notes
   - `sale_end_time` drives the countdown timer on product cards and detail pages.
   - `is_featured` controls which products appear on the homepage featured section.
   - `colors` stored as JSONB array for flexible multi-color products.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL,
  price integer NOT NULL,
  original_price integer,
  image text NOT NULL DEFAULT '/product-football.webp',
  badge text,
  rating numeric(3,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  long_description text,
  features text[] DEFAULT '{}',
  colors jsonb DEFAULT '[]',
  sizes text[] DEFAULT '{}',
  sku text,
  in_stock boolean NOT NULL DEFAULT true,
  sale_end_time timestamptz,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);
