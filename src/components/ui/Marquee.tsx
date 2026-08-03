import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly string[];
  className?: string;
}

/**
 * Scrolling ticker strip used to separate sections. The item list is rendered
 * twice so the -50% keyframe wraps seamlessly, and the duplicate is hidden
 * from assistive tech. Honours prefers-reduced-motion via the utility.
 */
export default function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        "brut-edge-thin border-ink/25 bg-hazard/5 overflow-hidden border-x-0 py-2",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex items-center"
          >
            {items.map((item) => (
              <li
                key={item}
                className="text-ink/55 flex items-center font-mono text-[11px] tracking-[0.35em] uppercase"
              >
                <span className="px-6">{item}</span>
                <span aria-hidden="true" className="text-alert">
                  ◆
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
