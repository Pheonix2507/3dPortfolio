import type { Metadata } from "next";
import Link from "next/link";
import { brutalButton } from "@/components/ui/BrutalButton";
import BrutalBox from "@/components/ui/BrutalBox";

export const metadata: Metadata = {
  title: "404",
  description: "That route does not exist.",
};

export default function NotFound() {
  return (
    <main className="text-ink flex min-h-screen items-center px-4 pt-32 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="text-alert flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase">
          <span className="bg-alert text-void px-1.5">Err</span>
          <span className="text-ink/40">/</span>
          <span className="text-ink/60">Route not found</span>
        </div>

        <h1 className="font-display mt-4 text-[clamp(5rem,22vw,14rem)] leading-[0.8] tracking-tighter">
          4<span className="text-hazard">0</span>4
        </h1>

        <div className="brut-rule mt-6" />

        <BrutalBox accent="bare" surface="solid" className="mt-8 max-w-xl p-5">
          <p className="text-ink/60 font-mono text-sm leading-relaxed">
            Nothing is mapped to this path. The structure is exposed, but this
            particular block was never there.
          </p>
        </BrutalBox>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className={brutalButton({ tone: "solid" })}>
            Back to index
          </Link>
          <Link href="/projects" className={brutalButton({ tone: "ink" })}>
            See the work
          </Link>
        </div>
      </div>
    </main>
  );
}
