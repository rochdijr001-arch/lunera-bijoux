import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, LogOut, Package, Search, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = { label: string; slug?: string; home?: boolean };
const nav: NavItem[] = [
  { label: "Home", home: true },
  { label: "Séries", slug: "series" },
  { label: "Pack", slug: "pack" },
  { label: "Bangle", slug: "bangle" },
  { label: "Collier", slug: "collier" },
  { label: "Bague", slug: "bague" },
  { label: "Bracelet", slug: "bracelet" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, open: openCart } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderLink = (n: NavItem, onClick?: () => void, className = "") => {
    const baseClass = `hover:text-rich-gold transition-all duration-500 relative group ${className}`;
    const activeClass = "text-rich-gold font-medium";

    if (n.home) {
      return (
        <Link
          key={n.label}
          to="/"
          onClick={onClick}
          activeOptions={{ exact: true }}
          activeProps={{ className: activeClass }}
          className={baseClass}
        >
          {n.label}
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-rich-gold transition-all duration-500 group-hover:w-full" />
        </Link>
      );
    }
    return (
      <Link
        key={n.label}
        to="/categorie/$slug"
        params={{ slug: n.slug! }}
        onClick={onClick}
        activeProps={{ className: activeClass }}
        className={baseClass}
      >
        {n.label}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-rich-gold transition-all duration-500 group-hover:w-full" />
      </Link>
    );
  };

  const CartButton = ({ className = "" }: { className?: string }) => (
    <button
      onClick={openCart}
      aria-label={`Panier (${count} article${count > 1 ? "s" : ""})`}
      className={`relative p-2 hover:text-rich-gold transition-all duration-500 ${className}`}
    >
      <ShoppingBag className="size-5 md:size-6" strokeWidth={1.2} />
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-rich-gold text-pure-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums shadow-sm">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
          scrolled ? "glass-nav py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-luxury-container">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center justify-between">
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-2 -ml-2">
              {open ? (
                <X className="size-6 text-luxury-black" strokeWidth={1.2} />
              ) : (
                <Menu className="size-6 text-luxury-black" strokeWidth={1.2} />
              )}
            </button>
            <Link
              to="/"
              className="font-serif text-2xl tracking-[0.2em] uppercase text-luxury-black"
            >
              Lunéra
            </Link>
            <CartButton />
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left Nav */}
            <div className="flex gap-6 xl:gap-8 text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-black/70">
              {nav.slice(0, 3).map((n) => renderLink(n))}
            </div>

            {/* Center Logo */}
            <div className="flex justify-center px-8 xl:px-12">
              <Link
                to="/"
                className="font-serif text-4xl tracking-[0.25em] uppercase text-luxury-black group whitespace-nowrap"
              >
                Lunéra{" "}
                <span className="text-rich-gold italic font-light group-hover:text-deep-gold transition-colors duration-700">
                  Bijoux
                </span>
              </Link>
            </div>

            {/* Right Nav */}
            <div className="flex items-center justify-end gap-6 xl:gap-8">
              <nav className="flex gap-6 xl:gap-8 text-[10px] tracking-[0.3em] uppercase font-bold text-luxury-black/70">
                {nav.slice(3, 6).map((n) => renderLink(n))}
              </nav>
              <div className="h-6 w-px bg-soft-gray mx-1 xl:mx-2" />
              <div className="flex items-center gap-2 xl:gap-4">
                <button
                  aria-label="Search"
                  className="p-2 hover:text-rich-gold transition-colors duration-500"
                >
                  <Search className="size-5" strokeWidth={1.2} />
                </button>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`p-2 transition-all duration-500 ${userMenuOpen ? "text-rich-gold" : "hover:text-rich-gold"}`}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                    >
                      <User className="size-5" strokeWidth={1.2} />
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-pure-white border border-soft-gray shadow-2xl z-[110] py-2"
                        >
                          <div className="px-6 py-4 border-b border-soft-gray">
                            <p className="text-[9px] tracking-widest uppercase text-luxury-black/30 mb-1">
                              Compte Client
                            </p>
                            <p className="text-[11px] font-bold text-luxury-black truncate uppercase tracking-wider">
                              {user.email}
                            </p>
                          </div>

                          <div className="py-2">
                            {isAdmin && (
                              <Link
                                to="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-soft-white transition-all text-rich-gold font-bold"
                              >
                                <LayoutDashboard className="size-4" /> Dashboard Admin
                              </Link>
                            )}

                            <Link
                              to="/mes-commandes"
                              onClick={() => setUserMenuOpen(false)}
                              className="w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-soft-white transition-all text-luxury-black/70"
                            >
                              <Package className="size-4" /> Mes commandes
                            </Link>

                            <button
                              onClick={() => {
                                signOut();
                                setUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-4 px-6 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-red-50 transition-all text-red-600 border-t border-soft-gray/50 mt-2"
                            >
                              <LogOut className="size-4" /> Déconnexion
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/auth" className="p-2 hover:text-rich-gold transition-all duration-500">
                    <User className="size-5" strokeWidth={1.2} />
                  </Link>
                )}
                <CartButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[110] bg-pure-white lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full p-8">
                <div className="flex justify-between items-center mb-16">
                  <span className="font-serif text-2xl tracking-[0.2em] uppercase">Lunéra</span>
                  <button onClick={() => setOpen(false)} className="p-2 -mr-2">
                    <X className="size-8" strokeWidth={1} />
                  </button>
                </div>

                <nav className="flex flex-col gap-8 text-2xl font-serif italic mb-20">
                  {nav.map((n, i) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      {renderLink(n, () => setOpen(false), "text-4xl")}
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-auto pt-10 border-t border-soft-gray">
                  <div className="flex flex-col gap-6 text-[10px] tracking-[0.4em] uppercase font-bold text-luxury-black/60">
                    <Link to="/about" onClick={() => setOpen(false)}>
                      About Us
                    </Link>
                    <Link to="/contact" onClick={() => setOpen(false)}>
                      Contact
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="text-rich-gold font-bold"
                      >
                        Dashboard Admin
                      </Link>
                    )}
                    {user ? (
                      <button
                        onClick={() => {
                          signOut();
                          setOpen(false);
                        }}
                        className="text-left text-destructive"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <Link to="/auth" onClick={() => setOpen(false)}>
                        Account
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
      {/* Spacer to prevent content jump */}
      <div className="h-[60px] lg:h-[100px]" />
    </>
  );
}
