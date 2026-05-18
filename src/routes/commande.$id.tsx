import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/commande/$id")({
  component: OrderConfirmedPage,
  head: () => ({
    meta: [
      { title: "Commande confirmée — Lunéra Bijoux" },
      { name: "description", content: "Merci pour votre commande Lunéra Bijoux." },
    ],
  }),
});

function OrderConfirmedPage() {
  const { id } = Route.useParams();
  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-clay text-skin rounded-full mb-8">
          <Check className="size-8" strokeWidth={2} />
        </div>
        <p className="eyebrow text-clay mb-3">Merci ✨</p>
        <h1 className="font-serif text-4xl md:text-5xl italic mb-6">
          Votre commande est confirmée
        </h1>
        <p className="text-earth/70 leading-relaxed mb-2">
          Nous avons bien reçu votre commande. Notre équipe vous contactera très vite pour confirmer
          la livraison.
        </p>
        <p className="text-xs text-earth/40 mb-10 mt-6">
          Référence : <span className="tabular-nums">{id.slice(0, 8).toUpperCase()}</span>
        </p>
        <Link
          to="/"
          className="inline-block px-10 py-4 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors"
        >
          Continuer mes achats
        </Link>
      </div>
      <Footer />
    </div>
  );
}
