import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/site/CartDrawer";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-skin px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-clay mb-3">Une erreur est survenue</p>
        <h1 className="font-serif text-4xl italic mb-4">Maison Lunéra</h1>
        <div className="bg-earth/5 p-6 mb-8 text-left border border-earth/10">
          <p className="text-xs font-mono text-earth/80 break-words">
            {error.message || "Une erreur inattendue a perturbé votre expérience."}
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 text-[10px] overflow-auto max-h-40 text-earth/40">
              {error.stack}
            </pre>
          )}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-block px-8 py-3 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors mr-4"
        >
          Réessayer
        </button>
        <Link
          to="/"
          className="inline-block px-8 py-3 border border-earth text-earth text-[11px] uppercase tracking-[0.25em] hover:bg-earth/5 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-skin px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-clay mb-3">Erreur 404</p>
        <h1 className="font-serif text-5xl italic mb-4">Page introuvable</h1>
        <p className="text-sm text-earth/60 mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lunéra Bijoux — Élégance, Féminité, Brillance" },
      {
        name: "description",
        content:
          "Bijoux raffinés faits main en Tunisie. Colliers, bagues, bracelets et bangles dorés pour célébrer votre éclat.",
      },
      { property: "og:title", content: "Lunéra Bijoux" },
      { property: "og:description", content: "Bijoux raffinés faits main en Tunisie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@200;300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <Outlet />
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
