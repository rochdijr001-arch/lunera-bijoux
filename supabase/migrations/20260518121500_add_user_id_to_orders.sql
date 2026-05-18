-- Link orders to authenticated customers so /mes-commandes can show their own orders.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'Users view own orders'
  ) THEN
    CREATE POLICY "Users view own orders"
      ON public.orders FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;
