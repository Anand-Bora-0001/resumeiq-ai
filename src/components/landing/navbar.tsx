"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn: clerkIsSignedIn, isLoaded } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("logout=true")) {
      setIsLoggedOut(true);
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSignedIn = clerkIsSignedIn && !isLoggedOut;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Resume<span className="gradient-text">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Start Free
                  <Sparkles className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                {!isSignedIn ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="text-sm text-muted-foreground text-center py-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-white"
                    >
                      Start Free
                      <Sparkles className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
