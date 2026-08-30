"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null; // Hide in admin panel

  return (
    <footer className="bg-surface-container border-t border-outline-variant/30 mt-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <Link 
              href="/" 
              className="text-headline-md font-display font-bold text-primary block mb-6 tracking-tighter"
            >
              AAROMI
            </Link>
            <p className="text-body-md font-sans text-on-surface opacity-80 max-w-xs leading-relaxed">
              © {new Date().getFullYear()} AAROMI. Digital experiences that move businesses forward.
            </p>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:pl-12">
          {/* Social Links */}
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Socials</h4>
            <ul className="space-y-4">
              {["Instagram", "LinkedIn", "Behance", "Dribbble"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-body-md font-sans text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hello@aaromi.com" 
                  className="text-body-md font-sans text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                >
                  hello@aaromi.com
                </a>
              </li>
            </ul>
          </div>

          {/* Location info */}
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface mb-6">Location</h4>
            <p className="text-body-md font-sans text-on-surface-variant leading-relaxed">
              India · Working Worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
