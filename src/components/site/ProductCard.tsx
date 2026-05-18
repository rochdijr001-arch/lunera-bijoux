import { Link } from "@tanstack/react-router";
import { discountPct, type Product } from "@/lib/products-api";
import { resolveProductImage } from "@/lib/product-images";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  if (!product) return null;
  const off = discountPct(product);
  const offset = index % 3 === 1 ? "md:mt-10" : "";

  return (
    <Link
      to="/produit/$slug"
      params={{ slug: product.slug || "" }}
      className={`group block animate-fade-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/5] bg-pure-white mb-6 overflow-hidden border border-soft-gray group-hover:border-light-gold/40 transition-all duration-1000 shadow-sm group-hover:shadow-2xl reflection-shine">
        <img
          src={resolveProductImage(product.imageKey || "")}
          alt={product.name || "Bijou Lunéra"}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
        />
        {off > 0 && (
          <span className="absolute top-4 left-4 bg-rich-gold text-pure-white px-3 py-1 text-[9px] tracking-[0.3em] uppercase font-bold shadow-xl">
            -{off}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-4 right-4 bg-luxury-black/80 text-pure-white px-3 py-1 text-[9px] tracking-[0.3em] uppercase backdrop-blur-md">
            Sold Out
          </span>
        )}

        {/* Hover Quick Action */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out bg-gradient-to-t from-pure-white/90 to-transparent">
          <div className="w-full py-3 bg-luxury-black text-pure-white text-[9px] uppercase tracking-[0.4em] text-center font-bold">
            Quick View
          </div>
        </div>
      </div>
      <div className="flex justify-between items-start gap-4 px-1">
        <div className="min-w-0">
          <h4 className="text-[clamp(1.25rem,2vw,1.75rem)] leading-tight group-hover:text-rich-gold transition-all duration-500 mb-1">
            {product.name || "Sans nom"}
          </h4>
          <p className="eyebrow text-light-gold/60">{product.category || "Collection"}</p>
        </div>
        <div className="text-right shrink-0 tabular-nums">
          <span className="block text-rich-gold text-lg font-medium tracking-tight">
            {(product.price || 0).toFixed(2)} DT
          </span>
          {product.oldPrice && (
            <span className="block text-[11px] text-muted-foreground line-through mt-0.5">
              {(product.oldPrice || 0).toFixed(2)} DT
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
