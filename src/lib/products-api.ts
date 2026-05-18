import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ProductRow = Tables<"products">;

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  imageKey: string;
  stock: number;
  featured: boolean;
};

const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  description: r.description,
  price: Number(r.price),
  oldPrice: r.old_price !== null ? Number(r.old_price) : null,
  imageKey: r.image_url,
  stock: r.stock,
  featured: r.featured,
});

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data) : null;
}

export const discountPct = (p: Pick<Product, "price" | "oldPrice">) =>
  p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

export const CATEGORY_LABELS: Record<string, string> = {
  series: "Séries",
  pack: "Pack",
  bangle: "Bangle Bracelet",
  collier: "Colliers",
  bague: "Bagues",
  bracelet: "Bracelets",
  montre: "Montres",
};
