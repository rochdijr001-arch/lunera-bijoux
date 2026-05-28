import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminListProducts, type ProductRow } from "@/lib/admin-api";
import { Layers, Package, ArrowRight, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminListProducts()
      .then((p) => setProducts(p))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate categories from products
  const categoriesMap = new Map<
    string,
    {
      name: string;
      productCount: number;
      totalStock: number;
      avgPrice: number;
    }
  >();

  products.forEach((p) => {
    const cat = p.category || "Uncategorized";
    const existing = categoriesMap.get(cat);
    if (existing) {
      existing.productCount += 1;
      existing.totalStock += p.stock;
      existing.avgPrice =
        (existing.avgPrice * (existing.productCount - 1) + p.price) / existing.productCount;
    } else {
      categoriesMap.set(cat, {
        name: cat,
        productCount: 1,
        totalStock: p.stock,
        avgPrice: p.price,
      });
    }
  });

  const categories = Array.from(categoriesMap.values()).sort(
    (a, b) => b.productCount - a.productCount,
  );

  if (loading)
    return (
      <div className="p-12 eyebrow text-luxury-black/40 animate-pulse">
        Chargement des catégories...
      </div>
    );

  return (
    <div className="p-6 sm:p-10 lg:p-16 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow text-rich-gold mb-3">Organisation du Catalogue</p>
        <h1 className="font-serif text-4xl italic">Catégories & Collections</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((c, i) => (
          <div
            key={i}
            className="group bg-pure-white border border-soft-gray p-8 hover:border-rich-gold transition-all duration-700 shadow-sm hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="size-14 bg-soft-white rounded-2xl flex items-center justify-center border border-soft-gray group-hover:bg-rich-gold group-hover:border-rich-gold transition-all duration-700">
                <Tag
                  className="size-6 text-rich-gold group-hover:text-pure-white transition-all duration-700"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-black/30 bg-soft-white px-3 py-1 rounded-full border border-soft-gray">
                #{i + 1}
              </span>
            </div>

            <h2 className="font-serif text-3xl italic capitalize mb-6 group-hover:text-rich-gold transition-colors">
              {c.name}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-soft-gray pb-2">
                <span className="text-muted-foreground">Produits</span>
                <span className="font-bold flex items-center gap-2">
                  <Package className="size-4" /> {c.productCount}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-soft-gray pb-2">
                <span className="text-muted-foreground">Stock Total</span>
                <span className="font-bold text-luxury-black">{c.totalStock} unités</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Prix Moyen</span>
                <span className="font-serif italic text-lg text-rich-gold">
                  {c.avgPrice.toFixed(2)} DT
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Category Placeholder */}
        <button className="flex flex-col items-center justify-center border-2 border-dashed border-soft-gray p-8 hover:border-rich-gold hover:bg-soft-white/30 transition-all duration-700 group">
          <div className="size-16 rounded-full border-2 border-dashed border-soft-gray flex items-center justify-center mb-6 group-hover:border-rich-gold group-hover:rotate-90 transition-all duration-700">
            <Layers className="size-8 text-soft-gray group-hover:text-rich-gold transition-all duration-700" />
          </div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-soft-gray group-hover:text-rich-gold transition-all duration-700">
            Nouvelle Catégorie
          </p>
        </button>
      </div>
    </div>
  );
}
