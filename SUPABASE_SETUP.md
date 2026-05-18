# Supabase Setup Guide

Here is exactly what you need to do to create your own Supabase database and link it to this project:

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account or sign in.
2. Click **"New Project"**.
3. Choose your organization, give the project a name (like `bijoux-elegance`), set a strong database password, and select a region close to your users.
4. Wait a few minutes for the project to finish setting up.

## Step 2: Run the SQL Setup Script

1. In your new Supabase project dashboard, click on the **"SQL Editor"** on the left menu.
2. Click **"New query"**.
3. **Copy and paste the entire SQL code below** into the editor and click **"Run"**.

```sql
-- 1. Create the Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  old_price NUMERIC(10,2) CHECK (old_price IS NULL OR old_price >= 0),
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- 2. Create the Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place a valid order"
  ON public.orders FOR INSERT
  WITH CHECK (
    length(customer_name) BETWEEN 2 AND 100
    AND length(phone) BETWEEN 6 AND 20
    AND length(address) BETWEEN 5 AND 300
    AND length(city) BETWEEN 2 AND 80
    AND (notes IS NULL OR length(notes) <= 500)
    AND total > 0 AND total < 100000
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) BETWEEN 1 AND 50
    AND status = 'pending'
  );

-- 3. Setup Updated_At Trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Setup Roles and Admin Permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- View Policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin Product Policies
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin Order Policies
CREATE POLICY "Admins view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
```

## Step 3: Link Your New Supabase to the Project

Once the database is set up, you need to get your connection details.

1. In your Supabase Dashboard, click on the **Gear icon (Project Settings)** on the bottom left.
2. Click on **"API"**.
3. Under "Project URL", copy the **URL**.
4. Under "Project API keys", copy the **anon / public** key.

Open the `.env` file in this project folder (it's located at `c:\Users\asus\Desktop\projet\lun-ra-bijoux-elegance-main\.env`) and replace the old values with your new ones:

```env
SUPABASE_URL="YOUR_NEW_PROJECT_URL_HERE"
SUPABASE_PUBLISHABLE_KEY="YOUR_NEW_ANON_KEY_HERE"

VITE_SUPABASE_PROJECT_ID="your_new_project_id_from_url"
VITE_SUPABASE_URL="YOUR_NEW_PROJECT_URL_HERE"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_NEW_ANON_KEY_HERE"
```

## Step 4: Add Products (Using Images)

Once you've done this, tell me here in the chat! You can upload your pictures to me, and since we just connected your new database, I can write the SQL for you to copy and paste to quickly add all your pictures as products!
