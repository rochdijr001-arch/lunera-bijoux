import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, Menu, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [{ title: "Admin — Lunéra Bijoux" }],
  }),
});

export function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white">
        <p className="eyebrow text-luxury-black/40 animate-pulse">Chargement showroom...</p>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-white px-6">
        <div className="text-center max-w-sm">
          <p className="eyebrow text-rich-gold mb-4">Accès réservé</p>
          <h1 className="font-serif text-4xl italic mb-6">Zone confidentielle</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Seuls les administrateurs de la Maison Lunéra peuvent accéder à cet espace.
          </p>
          <Link to="/" className="btn-luxury">
            Retour Boutique
          </Link>
        </div>
      </div>
    );
  }

  const links: {
    to: "/admin" | "/admin/products" | "/admin/orders" | "/admin/categories" | "/admin/customers";
    label: string;
    icon: LucideIcon;
    exact?: boolean;
  }[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Catalogue", icon: Package },
    { to: "/admin/orders", label: "Commandes", icon: ShoppingCart },
    { to: "/admin/categories", label: "Catégories", icon: Menu },
    { to: "/admin/customers", label: "Clients", icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-luxury-black text-pure-white">
      <div className="p-8 border-b border-pure-white/5">
        <Link to="/" className="block font-serif text-2xl tracking-[0.25em] uppercase">
          Lunéra
        </Link>
        <p className="eyebrow text-rich-gold mt-2">Maison d'Admin</p>
      </div>
      <nav className="flex-1 p-6 space-y-2">
        {links.map((l) => {
          const active = l.exact ? loc.pathname === l.to : loc.pathname.startsWith(l.to);
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-4 px-5 py-4 text-[11px] uppercase tracking-[0.3em] transition-all duration-500 font-bold ${
                active
                  ? "bg-rich-gold text-pure-white shadow-lg"
                  : "text-pure-white/40 hover:text-pure-white hover:bg-pure-white/5"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-pure-white/5 space-y-3">
        <Link
          to="/"
          className="flex items-center gap-4 px-5 py-3 text-[10px] tracking-widest uppercase text-pure-white/30 hover:text-rich-gold transition-colors font-bold"
        >
          <Store className="size-4" strokeWidth={1.5} /> Voir Boutique
        </Link>
        <button
          onClick={() => signOut().then(() => navigate({ to: "/auth" }))}
          className="w-full flex items-center gap-4 px-5 py-3 text-[10px] tracking-widest uppercase text-pure-white/30 hover:text-destructive transition-colors text-left font-bold"
        >
          <LogOut className="size-4" strokeWidth={1.5} /> Déconnexion
        </button>
        <div className="px-5 pt-4">
          <p className="text-[9px] text-pure-white/20 truncate font-mono uppercase tracking-tighter">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-soft-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-6 bg-luxury-black text-pure-white sticky top-0 z-40">
        <Link to="/" className="font-serif text-xl tracking-[0.2em] uppercase">
          Lunéra
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-pure-white hover:bg-pure-white/10">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-none w-80 bg-luxury-black">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 border-r border-soft-gray sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-x-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
