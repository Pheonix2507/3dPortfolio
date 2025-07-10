'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  {href: '/three-projects',label:'3D Projects'},
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto py-3 flex justify-between items-center text-white">
        <div className="lg:text-3xl text-sm lg:pl-0 pl-5 font-bold">Chintu&apos;s 3D Portfolio</div>
        <div className="space-x-6 flex">
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
      </div>
    </nav>
  );
}
