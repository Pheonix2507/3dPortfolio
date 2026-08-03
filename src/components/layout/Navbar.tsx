"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navSections, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * The section ids only exist on the landing page, so from any other route
   * this hands off to the home page with a hash instead of doing nothing.
   */
  const goToSection = (id: string) => {
    setIsOpen(false);

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    // scrollIntoView plays nicely with Lenis' smooth scrolling.
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Main navigation"
      className="glass border-hazard/70 fixed top-0 left-0 z-50 w-full border-b-2"
    >
      <div className="mx-auto flex max-w-7xl items-stretch justify-between">
        {/* Wordmark */}
        <button
          onClick={() => goToSection("home")}
          className="group border-hazard/30 hover:bg-hazard/10 flex items-center gap-3 border-r-2 px-4 py-3 transition-colors lg:px-6"
        >
          <span className="bg-hazard text-void px-1.5 py-0.5 font-mono text-[10px] tracking-[0.2em] uppercase">
            CB
          </span>
          <span className="font-display text-ink text-sm tracking-tight uppercase lg:text-xl">
            {siteConfig.shortName}
          </span>
        </button>

        {/* Desktop */}
        <div className="hidden items-stretch lg:flex">
          {navSections.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="group border-hazard/20 text-ink/70 hover:bg-hazard hover:text-void relative flex items-center gap-2 border-l-2 px-6 font-mono text-xs tracking-[0.2em] uppercase transition-colors"
            >
              <span className="text-hazard/70 group-hover:text-void text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="border-hazard/30 text-ink hover:bg-hazard hover:text-void focus-visible:outline-hazard border-l-2 px-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="glass border-hazard/40 absolute top-full left-0 w-full border-t-2 lg:hidden"
        >
          {navSections.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className={cn(
                "border-ink/10 flex w-full items-center gap-3 border-b-2 px-5 py-4",
                "text-ink/75 font-mono text-xs tracking-[0.2em] uppercase",
                "hover:bg-hazard hover:text-void transition-colors",
              )}
            >
              <span className="text-hazard/70 text-[10px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
