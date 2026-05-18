import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { resolveProductImage } from "@/lib/product-images";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Commander — Lunéra Bijoux" },
      {
        name: "description",
        content: "Finalisez votre commande Lunéra Bijoux. Livraison partout en Tunisie.",
      },
    ],
  }),
});

const SHIPPING = 7;

const orderSchema = z.object({
  customer_name: z.string().trim().min(2, "Nom trop court").max(100),
  phone: z.string().trim().min(6, "Numéro invalide").max(20),
  address: z.string().trim().min(5, "Adresse trop courte").max(300),
  city: z.string().trim().min(2, "Ville requise").max(80),
  notes: z.string().trim().max(500).optional(),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grandTotal = total + (items.length > 0 ? SHIPPING : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErr: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) fieldErr[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErr);
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      customer_name: parsed.data.customer_name,
      phone: parsed.data.phone,
      address: parsed.data.address,
      city: parsed.data.city,
      notes: parsed.data.notes || null,
      items: items.map((i) => ({
        product_id: i.id,
        slug: i.slug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageKey: i.imageKey,
      })),
      total: grandTotal,
      status: "pending",
      user_id: user?.id ?? null,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    setSubmitting(false);

    if (error || !data) {
      toast.error("Une erreur est survenue. Réessayez.");
      console.error("Order insert error:", error?.message, error?.details, error?.hint);
      return;
    }

    clear();
    navigate({ to: "/commande/$id", params: { id: data.id } });
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-12">
          <p className="eyebrow text-clay mb-3">Étape finale</p>
          <h1 className="font-serif text-4xl md:text-5xl italic">Votre commande</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-2xl italic text-earth/60 mb-6">Votre panier est vide.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-earth text-skin text-[11px] uppercase tracking-[0.25em]"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              <h2 className="font-serif text-2xl mb-6">Informations de livraison</h2>

              <Field label="Nom complet" error={errors.customer_name}>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="input"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Téléphone" error={errors.phone}>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input"
                    placeholder="+216 ..."
                  />
                </Field>
                <Field label="Ville" error={errors.city}>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Adresse" error={errors.address}>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input"
                  placeholder="Rue, numéro, code postal"
                />
              </Field>

              <Field label="Notes (optionnel)" error={errors.notes}>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="input resize-none"
                  placeholder="Instructions de livraison..."
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-4 bg-earth text-skin text-[11px] uppercase tracking-[0.25em] hover:bg-clay transition-colors disabled:opacity-60"
              >
                {submitting ? "Envoi..." : `Confirmer la commande — ${grandTotal.toFixed(2)} DT`}
              </button>
              <p className="text-xs text-earth/50 text-center">
                Paiement à la livraison. Vous recevrez un appel pour confirmer.
              </p>
            </form>

            {/* Summary */}
            <aside className="lg:col-span-2">
              <div className="bg-sand/40 p-6 lg:p-8 lg:sticky lg:top-32">
                <h2 className="font-serif text-2xl mb-6">Récapitulatif</h2>
                <div className="divide-y divide-earth/10">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-3 py-3">
                      <div className="w-14 h-16 bg-sand overflow-hidden shrink-0">
                        <img
                          src={resolveProductImage(it.imageKey)}
                          alt={it.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base leading-tight truncate">{it.name}</p>
                        <p className="text-[11px] text-earth/50 mt-1">Qté {it.quantity}</p>
                      </div>
                      <p className="text-sm tabular-nums shrink-0">
                        {(it.price * it.quantity).toFixed(2)} DT
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-earth/15 mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-earth/60">Sous-total</span>
                    <span className="tabular-nums">{total.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth/60">Livraison</span>
                    <span className="tabular-nums">{SHIPPING.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-earth/15 mt-3">
                    <span className="eyebrow">Total</span>
                    <span className="font-serif text-2xl tabular-nums">
                      {grandTotal.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block eyebrow text-earth/70 mb-2">{label}</span>
      {children}
      {error && <span className="block text-xs text-clay mt-1">{error}</span>}
    </label>
  );
}
