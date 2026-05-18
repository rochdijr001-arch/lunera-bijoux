import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import detail from "@/assets/detail.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Lunéra Bijoux" },
      {
        name: "description",
        content:
          "L'histoire de Lunéra Bijoux : élégance, féminité et brillance, faites à la main en Tunisie.",
      },
    ],
  }),
});

function About() {
  return (
    <div>
      <Header />
      <section className="px-6 lg:px-8 py-20 max-w-5xl mx-auto">
        <p className="eyebrow text-clay mb-6 text-center">Notre histoire</p>
        <h1 className="font-serif text-5xl md:text-6xl text-center mb-12 leading-tight">
          L'éclat naît du <span className="italic">détail</span>.
        </h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={detail}
            alt="Atelier Lunéra"
            className="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
          <div className="space-y-6 text-earth/75 leading-relaxed">
            <p>
              Lunéra Bijoux est née d'une passion pour les pièces qui traversent le temps. Chaque
              bijou est imaginé en Tunisie, façonné avec patience et amour du détail.
            </p>
            <p>
              Nous croyons qu'un bijou n'est pas un accessoire — c'est une présence. Une promesse de
              lumière portée contre la peau, jour après jour.
            </p>
            <p className="font-serif italic text-2xl text-clay pt-4">
              Élégance. Féminité. Brillance.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
