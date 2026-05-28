import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  type ProductRow,
  type ProductInput,
} from "@/lib/admin-api";
import { resolveProductImage } from "@/lib/product-images";
import { CATEGORY_LABELS } from "@/lib/products-api";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

// Removed IMAGE_KEYS - now using direct URL input

function emptyDraft(): ProductInput {
  return {
    slug: "",
    name: "",
    category: "bague",
    description: "",
    price: 0,
    old_price: null,
    image_url: "",
    stock: 10,
    featured: false,
  };
}

function AdminProducts() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const load = () => {
    setLoading(true);
    adminListProducts()
      .then(setRows)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = rows.filter((r) => {
    if (filterCat && r.category !== filterCat) return false;
    if (query && !`${r.name} ${r.slug}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const onDelete = async (r: ProductRow) => {
    if (!confirm(`Supprimer "${r.name}" ?`)) return;
    try {
      await adminDeleteProduct(r.id);
      toast.success("Produit supprimé de l'écrin");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="p-6 sm:p-10 lg:p-16 max-w-7xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow text-rich-gold mb-3 text-[10px] sm:text-xs">
            Gestion du Patrimoine
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl italic">Catalogue Bijoux</h1>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="btn-luxury flex items-center justify-center gap-3 !py-4"
        >
          <Plus className="size-4" /> Nouvelle Pièce
        </button>
      </header>

      <div className="flex flex-wrap gap-4 mb-10">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="size-4 text-luxury-black/30 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une pièce..."
            className="w-full bg-pure-white border border-soft-gray pl-12 pr-6 py-4 text-[11px] uppercase tracking-widest focus:border-rich-gold focus:outline-none transition-all duration-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-pure-white border border-soft-gray px-6 py-4 text-[11px] uppercase tracking-widest focus:border-rich-gold focus:outline-none transition-all duration-500 min-w-[200px]"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-pure-white border border-soft-gray shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <p className="eyebrow text-luxury-black/40 animate-pulse">Ouverture du coffre...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm text-muted-foreground italic">
              Aucune pièce ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/40 bg-soft-white/50">
                <tr className="border-b border-soft-gray">
                  <th className="text-left p-6 font-bold">Image</th>
                  <th className="text-left p-6 font-bold">Désignation</th>
                  <th className="text-left p-6 font-bold">Catégorie</th>
                  <th className="text-right p-6 font-bold">Prix</th>
                  <th className="text-right p-6 font-bold">Stock</th>
                  <th className="text-center p-6 font-bold">Signature</th>
                  <th className="text-right p-6 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-gray">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-soft-white/30 transition-colors group">
                    <td className="p-6">
                      <div className="relative size-16 overflow-hidden border border-soft-gray">
                        <img
                          src={resolveProductImage(r.image_url)}
                          alt={r.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </td>
                    <td className="p-6 min-w-[200px]">
                      <p className="font-bold text-luxury-black uppercase tracking-widest text-xs mb-1">
                        {r.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">{r.slug}</p>
                    </td>
                    <td className="p-6 text-xs font-medium text-luxury-black/60">
                      <span className="inline-block px-3 py-1 bg-soft-white border border-soft-gray rounded-full capitalize">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-6 text-right tabular-nums whitespace-nowrap">
                      <span className="font-serif text-lg italic text-rich-gold">
                        {Number(r.price).toFixed(2)} DT
                      </span>
                      {r.old_price && (
                        <div className="text-[10px] text-muted-foreground line-through decoration-rich-gold/30">
                          {Number(r.old_price).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-right tabular-nums">
                      <span
                        className={`text-sm font-bold ${r.stock < 5 ? "text-red-500" : "text-luxury-black"}`}
                      >
                        {r.stock}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {r.featured ? (
                        <span className="text-rich-gold text-xl">★</span>
                      ) : (
                        <span className="text-soft-gray">☆</span>
                      )}
                    </td>
                    <td className="p-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setEditing(r)}
                        className="p-3 border border-soft-gray hover:bg-soft-white hover:text-rich-gold transition-all duration-500"
                        aria-label="Modifier"
                      >
                        <Pencil className="size-4" strokeWidth={1.5} />
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ProductDialog
          initial={editing === "new" ? emptyDraft() : rowToInput(editing)}
          editingId={editing === "new" ? null : editing.id}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function rowToInput(r: ProductRow): ProductInput {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    description: r.description ?? "",
    price: Number(r.price),
    old_price: r.old_price !== null ? Number(r.old_price) : null,
    image_url: r.image_url,
    stock: r.stock,
    featured: r.featured,
  };
}

function ProductDialog({
  initial,
  editingId,
  onClose,
  onSaved,
}: {
  initial: ProductInput;
  editingId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<ProductInput>(initial);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await adminUpdateProduct(editingId, draft);
        toast.success("Pièce mise à jour avec éclat");
      } else {
        await adminCreateProduct(draft);
        toast.success("Nouvelle pièce forgée avec succès");
      }
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-luxury-black/90 backdrop-blur-sm overflow-y-auto flex justify-center items-start p-4 sm:p-8">
      <motion.form
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onSubmit={onSubmit}
        className="bg-pure-white w-full max-w-3xl my-4 sm:my-8 p-10 sm:p-16 relative shadow-2xl border border-rich-gold/20"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-soft-white hover:rotate-90 transition-all duration-500"
        >
          <X className="size-6 text-luxury-black" strokeWidth={1} />
        </button>
        <p className="eyebrow text-rich-gold mb-4 text-[10px] tracking-widest">
          {editingId ? "ÉDITION" : "CRÉATION"}
        </p>
        <h2 className="font-serif text-4xl italic mb-12 border-b border-soft-gray pb-8">
          Détails de la Pièce
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <Field label="Nom de la pièce *">
            <input
              required
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500"
            />
          </Field>
          <Field label="Identifiant (Slug) *">
            <input
              required
              value={draft.slug}
              onChange={(e) => set("slug", e.target.value.replace(/\s+/g, "-").toLowerCase())}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 font-mono"
            />
          </Field>
          <Field label="Catégorie *">
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 uppercase tracking-widest font-bold"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Image de présentation (URL) *">
            <input
              required
              type="text"
              placeholder="https://... ou /images/photo.jpg"
              value={draft.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500"
            />
            {draft.image_url && (
              <div className="mt-4 relative w-full h-40 bg-soft-white border border-soft-gray overflow-hidden">
                <img
                  src={
                    draft.image_url.startsWith("http") || draft.image_url.startsWith("/")
                      ? draft.image_url
                      : undefined
                  }
                  alt="Aperçu"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </Field>
          <Field label="Prix Public (DT) *">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={draft.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 font-serif italic text-lg"
            />
          </Field>
          <Field label="Ancien Prix (Optionnel)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={draft.old_price ?? ""}
              onChange={(e) =>
                set("old_price", e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 font-serif italic text-lg opacity-60"
            />
          </Field>
          <Field label="Stock Disponible *">
            <input
              required
              type="number"
              min="0"
              value={draft.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 font-bold"
            />
          </Field>
          <Field label="Mise en avant">
            <label className="flex items-center gap-4 h-14 cursor-pointer group">
              <input
                type="checkbox"
                className="size-5 accent-rich-gold"
                checked={draft.featured ?? false}
                onChange={(e) => set("featured", e.target.checked)}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-luxury-black/60 group-hover:text-rich-gold transition-colors">
                Afficher en Signature Collection
              </span>
            </label>
          </Field>
          <div className="md:col-span-2">
            <Field label="Poésie du produit (Description)">
              <textarea
                rows={4}
                value={draft.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                className="w-full bg-soft-white border border-soft-gray px-5 py-4 text-sm focus:border-rich-gold focus:outline-none transition-all duration-500 resize-none"
                placeholder="Racontez l'histoire de cette pièce..."
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-16 justify-end border-t border-soft-gray pt-10">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-5 text-[10px] uppercase tracking-[0.4em] border border-soft-gray hover:bg-soft-white transition-all duration-500 font-bold"
          >
            Annuler
          </button>
          <button type="submit" disabled={busy} className="btn-luxury !px-16 disabled:opacity-50">
            {busy
              ? "Traitement..."
              : editingId
                ? "Enregistrer les modifications"
                : "Certifier la création"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="eyebrow text-luxury-black/40 text-[9px] block font-bold uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}
