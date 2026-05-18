import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminListOrders, type OrderRow } from "@/lib/admin-api";
import { User, Mail, ShoppingBag, Calendar } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminListOrders()
      .then((o) => setOrders(o))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate customers from orders
  const customersMap = new Map<
    string,
    {
      name: string;
      email: string;
      totalSpent: number;
      orderCount: number;
      lastOrder: string;
    }
  >();

  orders.forEach((o) => {
    const identifier = o.phone || o.customer_name || "anonymous";
    const existing = customersMap.get(identifier);
    if (existing) {
      existing.totalSpent += Number(o.total);
      existing.orderCount += 1;
      if (new Date(o.created_at) > new Date(existing.lastOrder)) {
        existing.lastOrder = o.created_at;
      }
    } else {
      customersMap.set(identifier, {
        name: o.customer_name,
        email: o.phone, // Using phone as identifier/contact
        totalSpent: Number(o.total),
        orderCount: 1,
        lastOrder: o.created_at,
      });
    }
  });

  const customers = Array.from(customersMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  if (loading)
    return (
      <div className="p-12 eyebrow text-luxury-black/40 animate-pulse">
        Chargement des clients...
      </div>
    );

  return (
    <div className="p-6 sm:p-10 lg:p-16 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow text-rich-gold mb-3">Gestion de la clientèle</p>
        <h1 className="font-serif text-4xl italic">Répertoire Clients</h1>
      </header>

      <div className="bg-pure-white border border-soft-gray shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soft-gray bg-soft-white/50">
                <th className="text-left p-6 font-bold text-[10px] uppercase tracking-widest text-luxury-black/60">
                  Client
                </th>
                <th className="text-left p-6 font-bold text-[10px] uppercase tracking-widest text-luxury-black/60">
                  Contact
                </th>
                <th className="text-center p-6 font-bold text-[10px] uppercase tracking-widest text-luxury-black/60">
                  Commandes
                </th>
                <th className="text-right p-6 font-bold text-[10px] uppercase tracking-widest text-luxury-black/60">
                  Total Dépensé
                </th>
                <th className="text-right p-6 font-bold text-[10px] uppercase tracking-widest text-luxury-black/60">
                  Dernier Achat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-gray">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-soft-white/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-soft-white rounded-full flex items-center justify-center border border-soft-gray">
                        <User className="size-5 text-rich-gold" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-luxury-black">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-muted-foreground font-mono text-[11px]">{c.email}</td>
                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-soft-white border border-soft-gray rounded-full text-[10px] font-bold">
                      <ShoppingBag className="size-3" /> {c.orderCount}
                    </span>
                  </td>
                  <td className="p-6 text-right font-serif text-lg italic text-rich-gold">
                    {c.totalSpent.toFixed(2)} DT
                  </td>
                  <td className="p-6 text-right text-muted-foreground text-[11px]">
                    <div className="flex items-center justify-end gap-2">
                      <Calendar className="size-3" />
                      {new Date(c.lastOrder).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
