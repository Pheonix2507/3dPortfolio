import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The offset shadow is 4px and the active state translates by exactly 4px, so
 * pressing the button lands it flush into its own shadow. That physical
 * "travel" is where the brutalist surface and the skeuomorphic idea meet.
 */
/** Exported so anchors can wear the same skin without duplicating the classes. */
export const brutalButton = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "brut-edge-thin px-5 py-2.5",
    "font-mono text-xs tracking-[0.2em] uppercase",
    "transition-[transform,box-shadow,background-color] duration-100 ease-out",
    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hazard",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      tone: {
        hazard:
          "border-hazard bg-transparent text-hazard brut-shadow-hazard hover:bg-hazard hover:text-void",
        ink: "border-ink bg-transparent text-ink brut-shadow-sm hover:bg-ink hover:text-void",
        solid:
          "border-ink bg-hazard text-void brut-shadow-sm hover:brightness-110",
      },
    },
    defaultVariants: {
      tone: "hazard",
    },
  },
);

export type BrutalButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof brutalButton>;

export default function BrutalButton({
  tone,
  className,
  type = "button",
  ...props
}: BrutalButtonProps) {
  return (
    <button
      type={type}
      className={cn(brutalButton({ tone }), className)}
      {...props}
    />
  );
}
