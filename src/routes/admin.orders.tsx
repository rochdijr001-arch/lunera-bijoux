import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  ORDER_STATUSES,
  type OrderRow,
  type OrderItem,
} from "@/lib/admin-api";
import { Trash2, X, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const fmt = (n: number) => `${n.toFixed(2)} DT`;

function AdminOrders() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [viewing, setViewing] = useState<OrderRow | null>(null);

  const load = () => {
    setLoading(true);
    adminListOrders()
      .then(setRows)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = rows.filter((r) => {
    if (filter && r.status !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${r.customer_name} ${r.phone} ${r.city}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const onStatus = async (r: OrderRow, status: string) => {
    try {
      await adminUpdateOrderStatus(r.id, status);
      toast.success(`Statut mis à jour : ${status.toUpperCase()}`);
      setRows((prev) => prev.map((o) => (o.id === r.id ? { ...o, status } : o)));
      if (viewing?.id === r.id) setViewing({ ...viewing, status });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const onDelete = async (r: OrderRow) => {
    if (!confirm(`Supprimer la commande de ${r.customer_name} ?`)) return;
    try {
      await adminDeleteOrder(r.id);
      toast.success("Commande archivée");
      setRows((prev) => prev.filter((o) => o.id !== r.id));
      if (viewing?.id === r.id) setViewing(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="p-6 sm:p-10 lg:p-16 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow text-rich-gold mb-3 text-[10px] sm:text-xs">Logistique & Suivi</p>
        <h1 className="font-serif text-4xl sm:text-5xl italic">Carnet de Commandes</h1>
      </header>

      <div className="flex flex-wrap gap-4 mb-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="size-4 text-luxury-black/30 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Client, téléphone, ville..."
            className="w-full bg-pure-white border border-soft-gray pl-12 pr-6 py-4 text-[11px] uppercase tracking-widest focus:border-rich-gold focus:outline-none transition-all duration-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-pure-white border border-soft-gray px-6 py-4 text-[11px] uppercase tracking-widest focus:border-rich-gold focus:outline-none transition-all duration-500 min-w-[200px]"
        >
          <option value="">Tous les statuts</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-pure-white border border-soft-gray shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <p className="eyebrow text-luxury-black/40 animate-pulse">
              Consultation des registres...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm text-muted-foreground italic">Aucune commande répertoriée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 bg-soft-white/50">
                <tr className="border-b border-soft-gray">
                  <th className="text-left p-6 font-bold">Date & Heure</th>
                  <th className="text-left p-6 font-bold">Client</th>
                  <th className="text-left p-6 font-bold">Destinations</th>
                  <th className="text-right p-6 font-bold">Articles</th>
                  <th className="text-right p-6 font-bold">Total</th>
                  <th className="text-left p-6 font-bold">Statut Actuel</th>
                  <th className="text-right p-6 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-gray">
                {filtered.map((r) => {
                  const items = (r.items as unknown as OrderItem[]) ?? [];
                  const qty = items.reduce((s, it) => s + it.quantity, 0);
                  return (
                    <tr key={r.id} className="hover:bg-soft-white/30 transition-colors group">
                      <td className="p-6 text-luxury-black/70 whitespace-nowrap">
                        <p className="font-bold">
                          {new Date(r.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">
                          {new Date(r.created_at).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="p-6 font-bold uppercase tracking-wider text-luxury-black whitespace-nowrap">
                        {r.customer_name}
                      </td>
                      <td className="p-6 text-luxury-black/60 whitespace-nowrap">
                        <p className="text-xs">{r.city}</p>
                        <p className="text-[10px] font-mono">{r.phone}</p>
                      </td>
                      <td className="p-6 text-right tabular-nums font-bold">{qty}</td>
                      <td className="p-6 text-right tabular-nums font-serif text-lg italic text-rich-gold whitespace-nowrap">
                        {fmt(Number(r.total))}
                      </td>
                      <td className="p-6">
                        <select
                          value={r.status}
                          onChange={(e) => onStatus(r, e.target.value)}
                          className="text-[10px] font-bold border border-soft-gray px-3 py-1 bg-soft-white uppercase tracking-widest focus:border-rich-gold focus:outline-none transition-all duration-500"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setViewing(r)}
                          className="p-3 border border-soft-gray hover:bg-soft-white hover:text-rich-gold transition-all duration-500"
                          aria-label="Voir"
                        >
                          <Eye className="size-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => onDelete(r)}
                          className="p-3 border border-soft-gray hover:bg-red-50 hover:text-red-600 transition-all duration-500 text-luxury-black/40"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <OrderDialog
          order={viewing}
          onClose={() => setViewing(null)}
          onStatus={(s) => onStatus(viewing, s)}
        />
      )}
    </div>
  );
}

function OrderDialog({
  order,
  onClose,
  onStatus,
}: {
  order: OrderRow;
  onClose: () => void;
  onStatus: (s: string) => void;
}) {
  const items = (order.items as unknown as OrderItem[]) ?? [];

  return (
    <div className="fixed inset-0 z-[100] bg-luxury-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-pure-white w-full max-w-3xl my-8 p-10 sm:p-16 relative shadow-2xl border border-rich-gold/20 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-soft-white hover:rotate-90 transition-all duration-500"
        >
          <X className="size-6 text-luxury-black" strokeWidth={1} />
        </button>
        <p className="eyebrow text-rich-gold mb-4 text-[10px] tracking-widest">DÉTAILS COMMANDE</p>
        <h2 className="font-serif text-4xl italic mb-2 border-b border-soft-gray pb-6">
          {order.customer_name}
        </h2>
        <p className="text-[11px] font-mono text-muted-foreground mb-12 flex items-center gap-2">
          <span className="bg-soft-white px-2 py-0.5 border border-soft-gray text-luxury-black">
            Ref: {order.id.slice(0, 8).toUpperCase()}
          </span>
          <span>
            —{" "}
            {new Date(order.created_at).toLocaleString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-16">
          <Info label="Coordonnées" value={order.phone} />
          <Info label="Localité" value={order.city} />
          <div className="sm:col-span-2">
            <Info label="Adresse de Livraison" value={order.address} />
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <Info label="Instructions Spéciales" value={order.notes} />
            </div>
          )}
        </div>

        <div className="border-t border-soft-gray pt-10 mb-10">
          <p className="eyebrow text-rich-gold mb-6 text-[10px] tracking-widest uppercase">
            Composition du Coffret
          </p>
          <ul className="space-y-4">
            {items.map((it, i) => (
              <li
                key={i}
                className="flex justify-between items-center text-sm border-b border-soft-gray/30 pb-4"
              >
                <span className="font-bold uppercase tracking-widest text-[11px]">
                  {it.name} <span className="text-rich-gold mx-2">×</span> {it.quantity}
                </span>
                <span className="font-serif italic text-lg">{fmt(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t-2 border-luxury-black mt-8 pt-8">
            <span className="font-serif text-3xl italic">Total</span>
            <span className="font-serif text-3xl italic text-rich-gold">
              {fmt(Number(order.total))}
            </span>
          </div>
        </div>

        <div className="border-t border-soft-gray pt-10">
          <p className="eyebrow text-luxury-black/40 mb-6 text-[9px] font-bold uppercase tracking-widest">
            Évolution du Statut Logistique
          </p>
          <div className="flex flex-wrap gap-3">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(s)}
                className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${
                  order.status === s
                    ? "bg-luxury-black text-pure-white border-luxury-black shadow-lg"
                    : "border-soft-gray text-luxury-black/40 hover:border-rich-gold hover:text-rich-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="eyebrow text-luxury-black/30 text-[9px] font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-bold uppercase tracking-wider text-luxury-black">{value}</p>
    </div>
  );
}
