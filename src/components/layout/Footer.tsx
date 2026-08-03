import Link from "next/link";
import { siteConfig } from "@/data/site";
import { socialLinks } from "@/data/socials";

export default function Footer() {
  return (
    <footer className="border-hazard/40 mt-24 border-t-[3px]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-ink text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-tighter uppercase">
              Let&apos;s build
              <br />
              <span className="text-hazard">something odd</span>
            </p>

            <Link
              href="mailto:chintub2507@gmail.com"
              className="text-ink/60 decoration-hazard/50 hover:text-hazard mt-5 inline-block font-mono text-xs tracking-[0.2em] uppercase underline decoration-2 underline-offset-4 transition-colors"
            >
              chintub2507@gmail.com
            </Link>
          </div>

          <ul className="flex flex-wrap gap-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="brut-edge-thin border-ink/30 text-ink/60 hover:border-hazard hover:bg-hazard hover:text-void flex h-10 w-10 items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ink/10 text-ink/30 mt-10 flex flex-col gap-2 border-t-2 pt-5 font-mono text-[10px] tracking-[0.25em] uppercase md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>Next.js · React Three Fiber · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
