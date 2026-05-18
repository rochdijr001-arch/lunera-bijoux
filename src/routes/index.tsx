import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchAllProducts } from "@/lib/products-api";
import { useEffect, useState, useRef } from "react";
import hero from "@/assets/hero.jpg";
import detail from "@/assets/detail.jpg";

import type { Product } from "@/lib/products-api";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lunéra Bijoux — Élégance, Féminité, Brillance" },
      {
        name: "description",
        content:
          "Découvrez la collection Lunéra Bijoux : colliers, bagues, bracelets et bangles dorés faits main en Tunisie.",
      },
    ],
  }),
});

function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slightly slowed playback for luxury feel
    }
    fetchAllProducts()
      .then((p) => setProducts(p))
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 6);
  const more = products.filter((p) => !p.featured).slice(0, 8);

  return (
    <div className="overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Video Container */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>

          {/* Elegant Luxury Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-pure-white/80 via-pure-white/40 to-transparent" />
          <div className="absolute inset-0 bg-pure-white/10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-luxury-container">
          <div className="max-w-4xl animate-fade-up">
            <p className="eyebrow mb-6 md:mb-10 drop-shadow-sm flex items-center gap-4">
              <span className="w-8 md:w-16 h-px bg-light-gold/50"></span>
              Collection 2026
              <span className="w-8 md:w-16 h-px bg-light-gold/50"></span>
            </p>

            <h1 className="mb-8 md:mb-12 drop-shadow-md tracking-tight leading-[1] max-w-[15ch]">
              La poésie de l'or sur{" "}
              <span className="italic font-light text-rich-gold">peau nue</span>.
            </h1>

            <p className="max-w-md text-luxury-black/70 mb-12 md:mb-16 text-pretty drop-shadow-sm">
              Une collection sculptée par la lumière du Sud, célébrant l'élégance intemporelle de la
              matière précieuse.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
              <Link
                to="/categorie/$slug"
                params={{ slug: "series" }}
                className="btn-luxury text-center"
              >
                Découvrir
              </Link>

              <Link to="/about" className="btn-outline-luxury text-center">
                Notre histoire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-[var(--section-padding-y)]">
        <div className="max-luxury-container animate-fade-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-soft-gray pb-8 md:pb-12 gap-6">
            <div>
              <p className="eyebrow mb-3 md:mb-4">Sélection</p>
              <h2 className="italic">Les Pièces Signatures</h2>
            </div>
            <Link
              to="/categorie/$slug"
              params={{ slug: "series" }}
              className="eyebrow text-rich-gold hover:text-deep-gold transition-colors duration-500"
            >
              Tout voir →
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-16 md:gap-y-24">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quote */}
      <section className="bg-pure-white py-[var(--section-padding-y)] relative overflow-hidden border-y border-soft-gray">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-light-gold/20 to-transparent" />
        <div className="max-luxury-container text-center animate-fade-up">
          <p className="eyebrow text-rich-gold mb-8 md:mb-12">L'art de s'ornementer</p>
          <blockquote className="font-serif text-[clamp(2rem,5vw,5rem)] italic font-light leading-[1.1] text-pretty text-luxury-black mb-12 md:mb-16">
            "Un bijou ne se porte pas, il s'habite."
          </blockquote>
          <div className="w-16 md:w-24 h-px bg-light-gold/40 mx-auto mb-12 md:mb-16" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Chaque pièce Lunéra est conçue comme un talisman. Textures imparfaites, contact
            chaleureux du métal, et courbes douces qui épousent le corps.
          </p>
        </div>
      </section>

      {/* More products */}
      <section className="py-[var(--section-padding-y)]">
        <div className="max-luxury-container animate-fade-up">
          <div className="text-center mb-16 md:mb-24">
            <p className="eyebrow mb-3 md:mb-4">✨ Explore our collection ✨</p>
            <h2>Nouvelles arrivées</h2>
          </div>
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-16 md:gap-y-24">
              {more.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-14">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-sand mb-5" />
          <div className="h-4 bg-sand w-3/4 mb-2" />
          <div className="h-3 bg-sand w-1/3" />
        </div>
      ))}
    </div>
  );
}
