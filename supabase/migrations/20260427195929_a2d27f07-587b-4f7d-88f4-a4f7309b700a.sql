-- Fix search_path on trigger function
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

-- Tighten order insert policy with sane length & item bounds (still allows guest checkout)
DROP POLICY "Anyone can place an order" ON public.orders;

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