import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  adminListOrders,
  adminListProducts,
  type OrderRow,
  type ProductRow,
  type OrderItem,
} from "@/lib/admin-api";
import { Package, ShoppingCart, TrendingUp, Wallet, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const fmt = (n: number) => `${n.toFixed(2)} DT`;

export function AdminDashboard() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminListProducts(), adminListOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const lowStock = products.filter((p) => p.stock < 5).length;

    // group by category
    const byCat: Record<string, number> = {};
    products.forEach((p) => {
      byCat[p.category] = (byCat[p.category] ?? 0) + 1;
    });

    // best sellers
    const sold: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const items = (o.items as unknown as OrderItem[]) ?? [];
      items.forEach((it) => {
        const key = it.id ?? it.name;
        if (!sold[key]) sold[key] = { name: it.name, qty: 0, revenue: 0 };
        sold[key].qty += it.quantity;
        sold[key].revenue += it.quantity * it.price;
      });
    });
    const bestSellers = Object.values(sold)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // last 7 days revenue
    const days: { day: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const dayRev = orders
        .filter((o) => {
          const od = new Date(o.created_at);
          return od >= d && od < next && o.status !== "cancelled";
        })
        .reduce((s, o) => s + Number(o.total), 0);
      days.push({
        day: d.toLocaleDateString("fr-FR", { weekday: "short" }),
        revenue: dayRev,
      });
    }
    const maxDay = Math.max(...days.map((d) => d.revenue), 1);

    return { revenue, pending, delivered, lowStock, byCat, bestSellers, days, maxDay };
  }, [products, orders]);

  if (loading)
    return (
      <div className="p-16 eyebrow text-luxury-black/40 animate-pulse">
        Chargement de la Maison...
      </div>
    );

  return (
    <div className="p-6 sm:p-10 lg:p-16 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow text-rich-gold mb-3 text-[10px] sm:text-xs">Performance & Vision</p>
        <h1 className="font-serif text-4xl sm:text-5xl italic">Vue d'Ensemble</h1>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KPI label="Chiffre d'Affaires" value={fmt(stats.revenue)} icon={Wallet} accent />
        <KPI label="Commandes Totales" value={`${orders.length}`} icon={ShoppingCart} />
        <KPI label="Catalogue Produits" value={`${products.length}`} icon={Package} />
        <KPI label="En Attente" value={`${stats.pending}`} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-pure-white p-10 border border-soft-gray shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="eyebrow text-rich-gold mb-2">Trajectoire</p>
              <h3 className="font-serif text-2xl italic">Revenu Hebdomadaire</h3>
            </div>
            <TrendingUp className="size-6 text-rich-gold" />
          </div>
          <div className="flex items-end gap-3 h-64">
            {stats.days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="text-[10px] text-muted-foreground tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.revenue.toFixed(0)} DT
                </div>
                <div
                  className="w-full bg-soft-white border border-soft-gray group-hover:bg-rich-gold group-hover:border-rich-gold transition-all duration-700 relative overflow-hidden"
                  style={{ height: `${(d.revenue / stats.maxDay) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-pure-white/20 to-transparent" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 group-hover:text-rich-gold transition-colors">
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-pure-white p-10 border border-soft-gray shadow-sm">
          <p className="eyebrow text-rich-gold mb-2">Flux de Travail</p>
          <h3 className="font-serif text-2xl italic mb-10">Statuts Logistiques</h3>
          <div className="space-y-6">
            {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => {
              const c = orders.filter((o) => o.status === s).length;
              const pct = orders.length ? (c / orders.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold mb-3">
                    <span className="text-luxury-black/60">{s}</span>
                    <span className="text-rich-gold">{c}</span>
                  </div>
                  <div className="h-1 bg-soft-white border border-soft-gray overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-rich-gold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Best sellers */}
        <div className="bg-pure-white p-10 border border-soft-gray shadow-sm">
          <p className="eyebrow text-rich-gold mb-2">Prestige</p>
          <h3 className="font-serif text-2xl italic mb-10">Meilleures Ventes</h3>
          {stats.bestSellers.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Aucune donnée de vente disponible.
            </p>
          ) : (
            <ul className="space-y-6">
              {stats.bestSellers.map((b, i) => (
                <li key={i} className="flex items-center gap-6 group">
                  <span className="font-serif text-4xl italic text-soft-gray group-hover:text-rich-gold transition-colors duration-700 w-12">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 border-b border-soft-gray pb-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-luxury-black mb-1 truncate">
                      {b.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.qty} exemplaires vendus ·{" "}
                      <span className="text-rich-gold font-serif italic text-sm">
                        {fmt(b.revenue)}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Categories */}
        <div className="bg-pure-white p-10 border border-soft-gray shadow-sm">
          <p className="eyebrow text-rich-gold mb-2">Collection</p>
          <h3 className="font-serif text-2xl italic mb-10">Répartition Catalogue</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats.byCat).map(([cat, n]) => (
              <div
                key={cat}
                className="bg-soft-white border border-soft-gray p-6 hover:border-rich-gold transition-all duration-700 group"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-black/40 mb-2 group-hover:text-rich-gold transition-colors">
                  {cat}
                </p>
                <p className="font-serif text-3xl group-hover:scale-110 transition-transform duration-700 origin-left">
                  {n}
                </p>
              </div>
            ))}
          </div>
          {stats.lowStock > 0 && (
            <div className="mt-8 p-4 bg-red-50 border border-red-100 flex items-center gap-3">
              <div className="size-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-700">
                Alerte Stock: {stats.lowStock} bijoux en rupture imminente
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-pure-white border border-soft-gray shadow-sm">
        <div className="p-10 border-b border-soft-gray flex justify-between items-center">
          <div>
            <p className="eyebrow text-rich-gold mb-2">Historique</p>
            <h3 className="font-serif text-2xl italic">Dernières Commandes</h3>
          </div>
          <Link to="/admin/orders" className="btn-outline-luxury !px-8 !py-3 !text-[9px]">
            Tout Voir →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-sm text-muted-foreground italic text-center">
            Aucune commande enregistrée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 bg-soft-white/50">
                <tr>
                  <th className="text-left p-6">Client</th>
                  <th className="text-left p-6">Date</th>
                  <th className="text-left p-6">Statut</th>
                  <th className="text-right p-6">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-gray">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-soft-white/30 transition-colors">
                    <td className="p-6 font-medium text-luxury-black">{o.customer_name}</td>
                    <td className="p-6 text-muted-foreground text-[11px]">
                      {new Date(o.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-6">
                      <StatusBadge s={o.status} />
                    </td>
                    <td className="p-6 text-right font-serif text-lg italic text-rich-gold">
                      {fmt(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-8 border shadow-sm transition-all duration-700 hover:shadow-xl ${accent ? "bg-luxury-black text-pure-white border-luxury-black" : "bg-pure-white border-soft-gray"}`}
    >
      <div className="flex items-start justify-between mb-6">
        <p className={`eyebrow text-[10px] ${accent ? "text-rich-gold" : "text-luxury-black/40"}`}>
          {label}
        </p>
        <div className={`p-2 rounded-lg ${accent ? "bg-pure-white/5" : "bg-soft-white"}`}>
          <Icon
            className={`size-5 ${accent ? "text-rich-gold" : "text-rich-gold"}`}
            strokeWidth={1.5}
          />
        </div>
      </div>
      <p className="font-serif text-4xl tabular-nums italic">{value}</p>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-wider rounded ${map[s] ?? "bg-sand text-earth"}`}
    >
      {s === "delivered" && <CheckCircle2 className="size-3" />}
      {s}
    </span>
  );
}
