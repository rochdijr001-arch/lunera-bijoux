import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { resolveProductImage } from "@/lib/product-images";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, total } = useCart();

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-label="Panier">
      <button
        aria-label="Fermer le panier"
        className="absolute inset-0 bg-luxury-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
        onClick={close}
      />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-pure-white shadow-2xl flex flex-col animate-[slide-in-right_0.3s_ease-out]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-soft-gray">
          <p className="eyebrow text-rich-gold text-[10px] tracking-widest">
            VOTRE PANIER ({items.length})
          </p>
          <button
            onClick={close}
            aria-label="Fermer"
            className="p-2 hover:bg-soft-white transition-colors duration-500"
          >
            <X className="size-6 text-luxury-black" strokeWidth={1} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10 gap-6">
            <div className="size-20 bg-soft-white rounded-full flex items-center justify-center border border-soft-gray mb-4">
              <ShoppingBag className="size-8 text-luxury-black/30" strokeWidth={1} />
            </div>
            <p className="font-serif text-3xl italic">Votre panier est vide</p>
            <p className="text-[11px] uppercase tracking-widest text-luxury-black/40">
              Découvrez nos pièces signatures
            </p>
            <button
              onClick={close}
              className="mt-8 px-12 py-4 bg-luxury-black text-pure-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-rich-gold transition-all duration-500 shadow-lg"
            >
              Continuer
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {items.map((it) => (
                <div key={it.id} className="flex gap-6 items-center group">
                  <div className="w-24 h-28 bg-soft-white overflow-hidden shrink-0 border border-soft-gray group-hover:border-rich-gold transition-colors duration-500">
                    <img
                      src={resolveProductImage(it.imageKey)}
                      alt={it.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xl italic leading-tight truncate text-luxury-black">
                      {it.name}
                    </h4>
                    <p className="text-rich-gold font-serif italic text-lg mt-1 tabular-nums">
                      {it.price.toFixed(2)} DT
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-soft-gray bg-soft-white px-2">
                        <button
                          onClick={() => setQty(it.id, it.quantity - 1)}
                          className="p-2 hover:text-rich-gold transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-4 text-[11px] font-bold tabular-nums">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => setQty(it.id, it.quantity + 1)}
                          className="p-2 hover:text-rich-gold transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        aria-label="Retirer"
                        className="text-luxury-black/20 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-soft-gray p-8 space-y-6 bg-soft-white/30 backdrop-blur-sm">
              <div className="flex justify-between items-baseline">
                <span className="eyebrow text-[10px] tracking-widest text-luxury-black/40">
                  Sous-total
                </span>
                <span className="font-serif text-3xl italic tabular-nums text-luxury-black">
                  {total.toFixed(2)} DT
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-widest text-luxury-black/30 font-bold">
                Livraison offerte sur toute la collection
              </p>
              <Link
                to="/checkout"
                onClick={close}
                className="block text-center py-5 bg-luxury-black text-pure-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-rich-gold transition-all duration-500 shadow-xl"
              >
                Passer la commande
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
