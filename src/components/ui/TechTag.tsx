import { cn } from "@/lib/utils";

/**
 * Bracketed mono tag. The brackets are decorative, so they are hidden from
 * assistive tech and the label is read on its own.
 */
export default function TechTag({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "brut-edge-thin border-ink/35 text-ink/70 inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] tracking-[0.15em] uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="text-hazard/60">
        [
      </span>
      {children}
      <span aria-hidden="true" className="text-hazard/60">
        ]
      </span>
    </span>
  );
}
