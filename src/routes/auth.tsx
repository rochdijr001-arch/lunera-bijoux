import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "Mon Compte — Lunéra Bijoux" }],
  }),
});

function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password, fullName);
      setBusy(false);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Bienvenue chez Lunéra Bijoux ! 🌟 Votre compte est créé.");
      navigate({ to: "/" });
    } else {
      const { error } = await signIn(email, password);
      setBusy(false);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Bon retour parmi nous ! ✨");
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-skin flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="block text-center font-serif text-3xl tracking-[0.25em] uppercase mb-2"
        >
          Lunéra
        </Link>
        <p className="eyebrow text-clay text-center mb-10">Votre Espace Personnel</p>

        {/* Mode toggle tabs */}
        <div className="flex border border-earth/15 mb-0">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors ${mode === "signin" ? "bg-earth text-skin" : "bg-white text-earth/60 hover:text-earth"}`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors ${mode === "signup" ? "bg-earth text-skin" : "bg-white text-earth/60 hover:text-earth"}`}
          >
            Créer un compte
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white border border-earth/10 border-t-0 p-8 space-y-5"
        >
          <h1 className="font-serif text-2xl italic mb-1">
            {mode === "signin" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-xs text-earth/50 !mt-1">
            {mode === "signin"
              ? "Retrouvez vos commandes et suivez leur statut."
              : "Rejoignez Lunéra pour suivre vos commandes et profiter d'une expérience personnalisée."}
          </p>

          {mode === "signup" && (
            <div>
              <label className="eyebrow text-earth/60 block mb-2">Nom complet</label>
              <input
                type="text"
                required
                placeholder="Votre prénom et nom"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </div>
          )}

          <div>
            <label className="eyebrow text-earth/60 block mb-2">Adresse email</label>
            <input
              type="email"
              required
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="eyebrow text-earth/60 block mb-2">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-earth/40 hover:text-earth"
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="eyebrow text-earth/60 block mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Retapez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input pr-10 ${confirmPassword && confirmPassword !== password ? "border-red-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth/40 hover:text-earth"
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="size-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-earth text-skin py-3.5 text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors disabled:opacity-50"
          >
            {busy ? "..." : mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <Link to="/" className="block text-center mt-5 eyebrow text-earth/50 hover:text-clay">
          ← Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
