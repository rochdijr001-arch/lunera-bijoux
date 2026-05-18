import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from "lucide-react";
import type { OrderItem } from "@/lib/admin-api";

export const Route = createFileRoute("/mes-commandes")({
  component: MyOrders,
  head: () => ({
    meta: [{ title: "Mes Commandes — Lunéra Bijoux" }],
  }),
});

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  notes: string | null;
  items: unknown;
  total: number;
  status: string;
  created_at: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "En attente",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmée",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Expédiée",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Livrée",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Annulée",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

const fmt = (n: number) => `${Number(n).toFixed(2)} DT`;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "text-earth/60",
    bg: "bg-sand/40 border-earth/10",
    icon: Package,
  };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium border rounded-sm ${cfg.color} ${cfg.bg}`}
    >
      <Icon className="size-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function MyOrders() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as OrderRow[]);
        setFetching(false);
      });
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-skin flex items-center justify-center">
        <p className="eyebrow text-earth/60 animate-pulse">Chargement de vos commandes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skin">
      <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow text-clay mb-2">★ Mon Espace</p>
          <h1 className="font-serif text-4xl lg:text-5xl italic mb-3">Mes Commandes</h1>
          <p className="text-sm text-earth/60">{user?.email}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-earth/10 p-12 text-center">
            <ShoppingBag className="size-12 text-earth/20 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-2xl italic text-earth/50 mb-2">Aucune commande</p>
            <p className="text-sm text-earth/40 mb-8">Vous n'avez pas encore passé de commande.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = (order.items as unknown as OrderItem[]) ?? [];
              const qty = items.reduce((s, it) => s + it.quantity, 0);
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="bg-white border border-earth/10 overflow-hidden">
                  {/* Order summary row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full text-left p-6 flex flex-wrap items-center gap-4 hover:bg-sand/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-earth/50 mb-1">
                        #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                        {new Date(order.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="font-serif text-lg">{order.customer_name}</p>
                      <p className="text-xs text-earth/50">
                        {qty} article{qty > 1 ? "s" : ""} · {order.city}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={order.status} />
                      <p className="font-medium text-sm tabular-nums">{fmt(order.total)}</p>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="border-t border-earth/10 p-6 space-y-5">
                      {/* Items */}
                      <div>
                        <p className="eyebrow text-earth/50 text-[10px] mb-3">Articles commandés</p>
                        <ul className="space-y-2">
                          {items.map((it, i) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span className="text-earth/80">
                                {it.name} <span className="text-earth/50">× {it.quantity}</span>
                              </span>
                              <span className="tabular-nums font-medium">
                                {fmt(it.price * it.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between border-t border-earth/10 mt-3 pt-3">
                          <span className="font-serif italic text-lg">Total</span>
                          <span className="font-medium tabular-nums">{fmt(order.total)}</span>
                        </div>
                      </div>

                      {/* Delivery info */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="eyebrow text-earth/40 text-[10px] mb-1">Téléphone</p>
                          <p>{order.phone}</p>
                        </div>
                        <div>
                          <p className="eyebrow text-earth/40 text-[10px] mb-1">Ville</p>
                          <p>{order.city}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="eyebrow text-earth/40 text-[10px] mb-1">Adresse</p>
                          <p>{order.address}</p>
                        </div>
                        {order.notes && (
                          <div className="col-span-2">
                            <p className="eyebrow text-earth/40 text-[10px] mb-1">Notes</p>
                            <p className="text-earth/70">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Status timeline */}
                      <div>
                        <p className="eyebrow text-earth/50 text-[10px] mb-3">Progression</p>
                        <div className="flex items-center gap-1">
                          {["pending", "confirmed", "shipped", "delivered"].map((s, i, arr) => {
                            const statuses = [
                              "pending",
                              "confirmed",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ];
                            const currentIdx = statuses.indexOf(order.status);
                            const stepIdx = statuses.indexOf(s);
                            const isCancelled = order.status === "cancelled";
                            const isActive = !isCancelled && currentIdx >= stepIdx;
                            const cfg = STATUS_CONFIG[s];
                            const Icon = cfg.icon;
                            return (
                              <div key={s} className="flex items-center flex-1 last:flex-none">
                                <div
                                  className={`flex flex-col items-center gap-1 ${isActive ? "opacity-100" : "opacity-30"}`}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? "border-earth bg-earth text-skin" : "border-earth/20 bg-white"}`}
                                  >
                                    <Icon className="size-3" strokeWidth={2} />
                                  </div>
                                  <span className="text-[9px] uppercase tracking-wider text-earth/60 hidden sm:block">
                                    {cfg.label}
                                  </span>
                                </div>
                                {i < arr.length - 1 && (
                                  <div
                                    className={`h-px flex-1 mx-1 transition-colors ${isActive && currentIdx > stepIdx ? "bg-earth" : "bg-earth/15"}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                          {order.status === "cancelled" && (
                            <div className="ml-2 flex items-center gap-1 text-red-600">
                              <XCircle className="size-4" strokeWidth={1.5} />
                              <span className="text-[10px] uppercase tracking-wider">Annulée</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Link to="/" className="block text-center mt-10 eyebrow text-earth/50 hover:text-clay">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
