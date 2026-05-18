import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { fetchAllProducts, CATEGORY_LABELS, type Product } from "@/lib/products-api";
import { useEffect, useState } from "react";

const validSlugs = new Set(Object.keys(CATEGORY_LABELS));

// Some slugs may aggregate (bracelet shows both "bracelet" and "bangle")
const matchFor = (slug: string): string[] => {
  if (slug === "bracelet") return ["bracelet", "bangle"];
  return [slug];
};

export const Route = createFileRoute("/categorie/$slug")({
  component: CategoryPage,
  loader: ({ params }) => {
    if (!validSlugs.has(params.slug)) throw notFound();
    return { title: CATEGORY_LABELS[params.slug] };
  },
  head: ({ params }) => {
    const title = CATEGORY_LABELS[params.slug] ?? "Boutique";
    return {
      meta: [
        { title: `${title} — Lunéra Bijoux` },
        { name: "description", content: `Découvrez notre collection ${title} chez Lunéra Bijoux.` },
        { property: "og:title", content: `${title} — Lunéra Bijoux` },
        { property: "og:description", content: `Découvrez notre collection ${title}.` },
      ],
    };
  },
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const title = CATEGORY_LABELS[slug];
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const cats = matchFor(slug);
    fetchAllProducts()
      .then((all) => setItems(all.filter((p) => cats.includes(p.category))))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div>
      <Header />
      <section className="px-6 lg:px-8 pt-16 pb-12 text-center">
        <p className="eyebrow text-clay mb-4">Collection</p>
        <h1 className="font-serif text-5xl md:text-6xl italic">{title}</h1>
        {!loading && (
          <p className="text-earth/60 mt-4 max-w-md mx-auto">
            {items.length} pièce{items.length > 1 ? "s" : ""} dans cette collection.
          </p>
        )}
      </section>
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-14">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-sand mb-5" />
                  <div className="h-4 bg-sand w-3/4" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl italic text-earth/60">
                Aucune pièce dans cette collection pour le moment.
              </p>
              <Link to="/" className="mt-6 inline-block eyebrow text-clay">
                Retour à l'accueil →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-14">
              {items.map((p, i) => (
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
