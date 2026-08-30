"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar in admin panel for cleaner CMS view, or keep it.
  // Propose hiding it or changing to admin nav when inside /admin.
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null; // Admin has its own navbar

  const links = [
    { name: "Work", href: "/work" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Process", href: "/process" }
  ];

  return (
    <nav className="bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-headline-md font-display font-bold tracking-tighter text-primary scale-95 active:scale-90 transition-transform duration-200"
          >
            AAROMI
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-sans font-semibold tracking-wider text-sm uppercase transition-all duration-300 pb-1 border-b-2 ${
                  isActive 
                    ? "text-primary border-primary" 
                    : "text-on-surface-variant border-transparent hover:text-primary hover:border-outline-variant"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <Link 
          href="/contact" 
          className="hidden md:inline-flex bg-secondary-fixed text-on-secondary-fixed font-sans font-semibold tracking-widest text-xs uppercase px-6 py-3 rounded-full hover:bg-secondary-container transition-colors items-center gap-2"
        >
          Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-primary hover:bg-surface-container/50 rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-outline-variant/20 bg-surface-bright/95 backdrop-blur-md absolute top-full left-0 w-full px-margin-mobile py-8 flex flex-col gap-6 shadow-xl animate-fade-in">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-sans font-bold tracking-widest text-sm uppercase ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-secondary-fixed text-on-secondary-fixed text-center font-sans font-bold tracking-widest text-xs uppercase py-4 rounded-xl hover:bg-secondary-container transition-colors mt-2"
          >
            Start a Project ↗
          </Link>
        </div>
      )}
    </nav>
  );
}
