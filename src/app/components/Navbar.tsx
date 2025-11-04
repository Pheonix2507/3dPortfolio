'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Scroll-to-section items
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Smooth scroll function
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' }); // Works well with Lenis too
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto py-3 flex justify-between items-center text-white">
        <div className="lg:text-3xl text-sm lg:pl-0 pl-5 font-bold">
          Chintu&apos;s 3D Portfolio
        </div>

        {/* Desktop Nav */}
        <div className="space-x-6 hidden lg:flex">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              whileHover={{ scale: 1.1 }}
              className="relative text-white/80 hover:text-cyan-400 transition-colors duration-300"
            >
              {item.label}
              <motion.div
                layoutId="nav-underline"
                className="absolute left-0 -bottom-1 h-[2px] bg-cyan-400 rounded opacity-0 group-hover:opacity-100"
              />
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden pr-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden bg-black backdrop-blur-md absolute top-full left-0 w-full px-6 py-4 space-y-4 text-white">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="block w-full text-left px-1 py-2 border-b border-white/10 text-white/80 hover:text-cyan-400"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
