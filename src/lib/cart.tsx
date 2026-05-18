import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageKey: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "lunera-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (error) {
      console.warn("Unable to load cart from localStorage:", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Unable to save cart to localStorage:", error);
    }
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      items,
      count,
      total,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (item, qty = 1) =>
        setItems((cur) => {
          const idx = cur.findIndex((c) => c.id === item.id);
          if (idx >= 0) {
            const next = [...cur];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
            return next;
          }
          return [...cur, { ...item, quantity: qty }];
        }),
      remove: (id) => setItems((cur) => cur.filter((c) => c.id !== id)),
      setQty: (id, qty) =>
        setItems((cur) =>
          cur
            .map((c) => (c.id === id ? { ...c, quantity: Math.max(1, Math.min(99, qty)) } : c))
            .filter((c) => c.quantity > 0),
        ),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
