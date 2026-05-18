import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Phone, Instagram, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Lunéra Bijoux" },
      { name: "description", content: "Contactez Lunéra Bijoux. Téléphone : 21 238 632." },
    ],
  }),
});

function Contact() {
  return (
    <div>
      <Header />
      <section className="px-6 lg:px-8 py-20 max-w-3xl mx-auto text-center">
        <p className="eyebrow text-clay mb-6">Contact us</p>
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Parlons bijoux.</h1>
        <p className="text-earth/70 leading-relaxed max-w-xl mx-auto mb-16">
          Une question sur une pièce, une commande sur mesure, ou simplement envie d'échanger ?
          Notre équipe vous répond avec attention.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <a
            href="tel:21238632"
            className="group p-8 bg-sand hover:bg-clay hover:text-skin transition-colors duration-500"
          >
            <Phone className="size-5 mb-6 text-clay group-hover:text-skin" />
            <p className="eyebrow mb-2">Téléphone</p>
            <p className="font-serif text-xl">21 238 632</p>
          </a>
          <a
            href="mailto:contact@lunera.tn"
            className="group p-8 bg-sand hover:bg-clay hover:text-skin transition-colors duration-500"
          >
            <Mail className="size-5 mb-6 text-clay group-hover:text-skin" />
            <p className="eyebrow mb-2">Email</p>
            <p className="font-serif text-xl">contact@lunera.tn</p>
          </a>
          <a
            href="#"
            className="group p-8 bg-sand hover:bg-clay hover:text-skin transition-colors duration-500"
          >
            <Instagram className="size-5 mb-6 text-clay group-hover:text-skin" />
            <p className="eyebrow mb-2">Instagram</p>
            <p className="font-serif text-xl">@lunera.bijoux</p>
          </a>
        </div>

        <p className="mt-20 font-serif italic text-2xl text-clay">✨ Explore our collection ✨</p>
      </section>
      <Footer />
    </div>
  );
}
