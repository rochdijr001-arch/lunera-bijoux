import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-soft-gray mt-32 py-[var(--section-padding-y)] bg-pure-white">
      <div className="max-luxury-container">
        <div className="flex flex-col items-center text-center mb-24 animate-fade-up">
          <h2 className="text-[clamp(4rem,15vw,12rem)] uppercase tracking-[0.4em] mb-4 text-luxury-black/[0.02] select-none">
            Lunéra
          </h2>
          <p className="eyebrow text-rich-gold">Élégance · Féminité · Brillance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 w-full text-left mb-24 border-b border-soft-gray pb-24 animate-fade-up">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="eyebrow mb-8 text-luxury-black">La Maison Lunéra</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Des créations intemporelles façonnées pour sublimer l'éclat de chaque femme. L'art de
              la joaillerie tunisienne moderne, entre tradition et minimalisme.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-8 text-luxury-black">Collections</p>
            <ul className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">
              <li>
                <Link
                  to="/categorie/$slug"
                  params={{ slug: "series" }}
                  className="hover:text-rich-gold transition-all duration-300"
                >
                  Toutes les Séries
                </Link>
              </li>
              <li>
                <Link
                  to="/categorie/$slug"
                  params={{ slug: "collier" }}
                  className="hover:text-rich-gold transition-all duration-300"
                >
                  Colliers Or
                </Link>
              </li>
              <li>
                <Link
                  to="/categorie/$slug"
                  params={{ slug: "bague" }}
                  className="hover:text-rich-gold transition-all duration-300"
                >
                  Bagues Délicates
                </Link>
              </li>
              <li>
                <Link
                  to="/categorie/$slug"
                  params={{ slug: "bracelet" }}
                  className="hover:text-rich-gold transition-all duration-300"
                >
                  Bracelets Joncs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-8 text-luxury-black">Univers</p>
            <ul className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">
              <li>
                <Link to="/about" className="hover:text-rich-gold transition-all duration-300">
                  Notre Histoire
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rich-gold transition-all duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-rich-gold transition-all duration-300">
                  Mon Compte
                </Link>
              </li>
              <li className="hover:text-rich-gold transition-all duration-300 cursor-pointer">
                Journal
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-8 text-luxury-black">Service Client</p>
            <ul className="space-y-4 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">
              <li>
                <a
                  href="tel:21238632"
                  className="hover:text-rich-gold transition-all duration-300 tracking-widest"
                >
                  21 238 632
                </a>
              </li>
              <li className="text-luxury-black/40 italic normal-case font-normal tracking-normal text-xs">
                Tunisie — Expédition 24/48h
              </li>
              <li className="hover:text-rich-gold transition-all duration-300 cursor-pointer">
                FAQs
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 animate-fade-up">
          <p className="text-[9px] uppercase tracking-[0.5em] text-luxury-black/30 font-bold">
            © 2026 Lunéra Bijoux — Crafted for Elegance
          </p>
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.5em] text-luxury-black/30 font-bold">
            <span className="hover:text-rich-gold cursor-pointer transition-colors">
              Confidentialité
            </span>
            <span className="hover:text-rich-gold cursor-pointer transition-colors">
              Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
