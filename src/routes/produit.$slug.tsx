import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { fetchProductBySlug, discountPct, type Product } from "@/lib/products-api";
import { resolveProductImage } from "@/lib/product-images";
import { useCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/produit/$slug")({
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Lunéra Bijoux` },
      {
        name: "description",
        content: `Découvrez ${params.slug.replace(/-/g, " ")} — bijou Lunéra fait main.`,
      },
    ],
  }),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { add, open } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/5] bg-sand" />
          <div className="space-y-4">
            <div className="h-4 bg-sand w-1/3" />
            <div className="h-10 bg-sand w-3/4" />
            <div className="h-6 bg-sand w-1/4" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="text-center py-32 px-6">
          <p className="eyebrow text-clay mb-3">Introuvable</p>
          <h1 className="font-serif text-4xl italic mb-6">Cette pièce n'existe plus</h1>
          <Link to="/" className="eyebrow text-earth hover:text-clay">
            ← Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const off = discountPct(product);
  const handleAdd = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageKey: product.imageKey,
      },
      qty,
    );
    toast.success(`${product.name} ajouté au panier`);
    open();
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        <nav className="text-[11px] uppercase tracking-[0.2em] text-earth/50 mb-10">
          <Link to="/" className="hover:text-clay">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-earth">{product.category}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative aspect-[4/5] bg-sand overflow-hidden">
            <img
              src={resolveProductImage(product.imageKey || "")}
              alt={product.name || "Bijou"}
              className="w-full h-full object-cover"
            />
            {off > 0 && (
              <span className="absolute top-6 left-6 bg-clay text-skin px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium">
                -{off}%
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <p className="eyebrow text-clay mb-4">{product.category || "Collection"}</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
              {product.name || "Sans nom"}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-serif text-3xl text-clay tabular-nums">
                {(product.price || 0).toFixed(2)} DT
              </span>
              {product.oldPrice && (
                <span className="text-earth/40 line-through tabular-nums">
                  {(product.oldPrice || 0).toFixed(2)} DT
                </span>
              )}
            </div>

            <p className="text-earth/70 leading-relaxed mb-10 text-pretty">
              {product.description ?? "Pièce signature Lunéra, conçue pour célébrer votre lumière."}
            </p>

            <div className="flex items-center gap-2 text-sm text-earth/60 mb-8">
              <Check className="size-4 text-clay" />
              {(product.stock ?? 0) > 0 ? `${product.stock} en stock` : "Rupture de stock"}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-earth/20">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Diminuer"
                  className="p-3 hover:bg-sand"
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-5 tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  aria-label="Augmenter"
                  className="p-3 hover:bg-sand"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.stock || product.stock === 0}
                className="flex-1 min-w-[200px] px-10 py-4 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!product.stock || product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
              </button>
            </div>

            <div className="border-t border-earth/10 pt-8 mt-4 space-y-3 text-sm text-earth/60">
              <p>✨ Livraison partout en Tunisie</p>
              <p>↻ Échange possible sous 7 jours</p>
              <p>🤍 Pièce faite main avec amour</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
