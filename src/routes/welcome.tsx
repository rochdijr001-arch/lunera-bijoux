import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { CheckCircle2, ShieldCheck, ShieldAlert, ArrowRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
  head: () => ({
    meta: [{ title: "Bienvenue — Lunéra Bijoux" }],
  }),
});

function WelcomePage() {
  const { user, isAdmin, loading, signOut, refreshRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    refreshRole();
    // Run once on welcome page mount to refresh the admin badge after login.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-skin">
        <p className="eyebrow text-earth/60">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skin flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link
          to="/"
          className="block text-center font-serif text-3xl tracking-[0.25em] uppercase mb-2"
        >
          Lunéra
        </Link>
        <p className="eyebrow text-clay text-center mb-10">Connexion réussie</p>

        <div className="bg-white border border-earth/10 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-7 text-clay" strokeWidth={1.5} />
            <div>
              <h1 className="font-serif text-2xl italic">Bienvenue</h1>
              <p className="text-sm text-earth/60">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-earth/10 pt-6 space-y-4">
            <p className="eyebrow text-earth/60">Statut du compte</p>

            {isAdmin ? (
              <div className="bg-clay/10 border border-clay/30 p-5 flex items-start gap-3">
                <ShieldCheck className="size-6 text-clay shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="font-serif text-lg">Compte Administrateur</p>
                  <p className="text-sm text-earth/70">
                    Votre compte a été promu avec les privilèges d'administration. Vous avez un
                    accès complet à la gestion des produits, des commandes et des statistiques.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] bg-earth text-skin px-2 py-1">
                      admin
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] border border-earth/30 px-2 py-1">
                      accès total
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-sand/40 border border-earth/10 p-5 flex items-start gap-3">
                <ShieldAlert className="size-6 text-earth/60 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="font-serif text-lg">Compte Client</p>
                  <p className="text-sm text-earth/70">
                    Votre compte est actif mais ne dispose pas des privilèges d'administration.
                    Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
                  </p>
                  <span className="inline-block text-[10px] uppercase tracking-[0.2em] border border-earth/30 px-2 py-1 mt-2">
                    user
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-earth/10 pt-6 flex flex-col gap-3">
            {isAdmin && (
              <button
                onClick={() => navigate({ to: "/admin" })}
                className="w-full bg-earth text-skin py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors flex items-center justify-center gap-2"
              >
                Accéder au tableau de bord <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full border border-earth/20 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-sand/40 transition-colors"
            >
              Continuer vers la boutique
            </button>
            <button
              onClick={() => signOut().then(() => navigate({ to: "/auth" }))}
              className="w-full text-xs text-earth/60 hover:text-clay flex items-center justify-center gap-2 pt-2"
            >
              <LogOut className="size-3.5" strokeWidth={1.5} /> Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
