import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const brutalBox = cva("relative brut-edge", {
  variants: {
    accent: {
      ink: "border-ink brut-shadow",
      hazard: "border-hazard brut-shadow-hazard",
      alert: "border-alert brut-shadow-alert",
      bare: "border-ink",
    },
    surface: {
      solid: "bg-surface",
      glass: "glass",
      void: "bg-void",
      none: "",
    },
  },
  defaultVariants: {
    accent: "ink",
    surface: "solid",
  },
});

export type BrutalBoxProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof brutalBox>;

/**
 * The structural container the whole layout is built from: a hard border and a
 * solid, unblurred offset shadow. No radius, by design.
 */
export default function BrutalBox({
  accent,
  surface,
  className,
  ...props
}: BrutalBoxProps) {
  return (
    <div className={cn(brutalBox({ accent, surface }), className)} {...props} />
  );
}
