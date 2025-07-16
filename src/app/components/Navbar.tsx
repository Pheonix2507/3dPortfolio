'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  {href: '/three-projects',label:'3D Projects'},
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
  <div className="max-w-6xl mx-auto py-3 flex justify-between items-center text-white">
    <div className="lg:text-3xl text-sm lg:pl-0 pl-5 font-bold">Chintu&apos;s 3D Portfolio</div>

    {/* Desktop Nav */}
    <div className="space-x-6 hidden lg:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <motion.div
            key={item.href}
            className="relative"
            whileHover="hover"
            initial="rest"
            animate={isActive ? 'active' : 'rest'}
          >
            <Link
              href={item.href}
              className={`transition-colors duration-300 px-1 ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-white/80'
              }`}
            >
              {item.label}
            </Link>
            <motion.div
              variants={{
                rest: { width: 0, opacity: 0 },
                hover: { width: '100%', opacity: 1 },
                active: { width: '100%', opacity: 1 },
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 -bottom-1 h-[2px] bg-cyan-400 rounded"
            />
          </motion.div>
        );
      })}
    </div>

    {/* Mobile Menu Button */}
    <div className="lg:hidden pr-5">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile Sidebar */}
  {isOpen && (
    <div className="lg:hidden bg-black/80 backdrop-blur-md absolute top-full left-0 w-full px-6 py-4 space-y-4 text-white">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-1 py-2 border-b border-white/10 ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-white/80'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  )}
</nav>

  );
}
