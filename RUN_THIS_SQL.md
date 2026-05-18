# Run this SQL in your Supabase SQL Editor

# https://supabase.com/dashboard/project/eeipkcmponipjorrsmnr/sql/new

```sql
-- Step 1: Add user_id column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 2: Allow clients to see their own orders
CREATE POLICY "Users view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 3: Allow clients to update user_id on their own just-placed orders
CREATE POLICY "Users link own orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```
