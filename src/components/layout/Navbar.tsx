"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navSections, siteConfig } from "@/data/site";

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
      className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between py-3 text-white">
        <button
          onClick={() => goToSection("home")}
          className="pl-5 text-sm font-bold lg:pl-0 lg:text-3xl"
        >
          {siteConfig.shortName}
        </button>

        {/* Desktop */}
        <div className="hidden space-x-6 lg:flex">
          {navSections.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => goToSection(item.id)}
              whileHover={{ scale: 1.1 }}
              className="group relative text-white/80 transition-colors duration-300 hover:text-cyan-400"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded bg-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
            </motion.button>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="pr-5 lg:hidden">
          <button
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full space-y-4 bg-black px-6 py-4 text-white backdrop-blur-md lg:hidden"
        >
          {navSections.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className="block w-full border-b border-white/10 px-1 py-2 text-left text-white/80 hover:text-cyan-400"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
