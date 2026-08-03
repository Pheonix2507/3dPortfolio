import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Two-digit index, e.g. "02". Part of the brutalist habit of exposing structure. */
  index: string;
  /** Small label above the title. */
  eyebrow: string;
  title: string;
  /** Optional line of supporting copy under the rule. */
  meta?: string;
  className?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  meta,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("w-full", className)}>
      <div className="text-hazard flex items-baseline gap-3 font-mono text-xs tracking-[0.3em] uppercase">
        <span className="bg-hazard text-void px-1.5">{index}</span>
        <span aria-hidden="true" className="text-ink/40">
          /
        </span>
        <span className="text-ink/70">{eyebrow}</span>
      </div>

      <h2 className="font-display text-ink mt-3 text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.85] tracking-tight uppercase">
        {title}
      </h2>

      <div className="brut-rule mt-4 w-full" />

      {meta && (
        <p className="text-ink/50 mt-3 max-w-2xl font-mono text-xs tracking-widest uppercase">
          {meta}
        </p>
      )}
    </header>
  );
}
