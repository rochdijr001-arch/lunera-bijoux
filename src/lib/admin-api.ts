import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type ProductInput = Omit<TablesInsert<"products">, "id" | "created_at" | "updated_at">;
export type ProductRow = Tables<"products">;
export type OrderRow = Tables<"orders">;

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageKey?: string;
};

export async function adminListProducts(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminCreateProduct(input: ProductInput): Promise<ProductRow> {
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateProduct(
  id: string,
  patch: TablesUpdate<"products">,
): Promise<ProductRow> {
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
