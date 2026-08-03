"use client";

import { cn } from "@/lib/utils";

interface SkeuoSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Value shown in the readout window, already formatted. */
  readout?: string;
  className?: string;
}

const KNOB_WIDTH_PX = 26;
const TICK_COUNT = 11;

/**
 * A physical fader. The visible parts are decorative layers; a real range input
 * sits invisibly on top so keyboard control, focus and screen-reader semantics
 * all come for free rather than being reimplemented.
 */
export default function SkeuoSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  readout,
  className,
}: SkeuoSliderProps) {
  // Guard the degenerate range so the knob never resolves to NaN.
  const span = max - min;
  const percent = span > 0 ? ((value - min) / span) * 100 : 0;

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className="mb-2 flex items-end justify-between gap-4">
        <label
          htmlFor={id}
          className="text-ink/60 font-mono text-[11px] tracking-[0.25em] uppercase"
        >
          {label}
        </label>

        {readout !== undefined && (
          <output
            htmlFor={id}
            className="skeuo-inset brut-edge-thin text-hazard border-black/70 px-2 py-0.5 font-mono text-xs"
          >
            {readout}
          </output>
        )}
      </div>

      {/* Fader body */}
      <div className="skeuo-metal brut-edge-thin relative border-black/70 px-4 py-4">
        <div className="relative h-10">
          {/* Cut channel */}
          <div
            aria-hidden="true"
            className="skeuo-inset brut-edge-thin absolute inset-x-0 top-1/2 h-3.5 -translate-y-1/2 border-black/80"
          />

          {/* Filled travel */}
          <div
            aria-hidden="true"
            className="bg-hazard absolute top-1/2 h-3.5 -translate-y-1/2"
            style={{
              width: `${percent}%`,
              // Inset only. The outer bloom was neon, not machinery.
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.55)",
            }}
          />

          {/* Travel ticks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[2px]"
          >
            {Array.from({ length: TICK_COUNT }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "w-px",
                  i % 5 === 0 ? "bg-ink/30 h-6" : "bg-ink/15 h-3",
                )}
              />
            ))}
          </div>

          {/* Knob */}
          <div
            aria-hidden="true"
            className="skeuo-raised brut-edge-thin absolute top-1/2 flex h-9 -translate-y-1/2 flex-col items-center justify-center gap-[3px] border-black/80"
            style={{
              width: KNOB_WIDTH_PX,
              left: `calc(${percent}% - ${KNOB_WIDTH_PX / 2}px)`,
            }}
          >
            {[0, 1, 2].map((line) => (
              <span
                key={line}
                className="bg-ink/25 h-px w-3.5"
                style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.6)" }}
              />
            ))}
          </div>

          {/* The actual control */}
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="absolute inset-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
}
