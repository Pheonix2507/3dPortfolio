"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sparse to dense. Index is chosen by pixel luminance. */
const RAMP = " .:-=+*#%@";

/** Character columns. Higher means more detail and more DOM text. */
const COLUMNS = 78;

/**
 * Monospace glyphs are taller than they are wide, so rows are scaled by this to
 * keep the portrait's proportions. Roughly the advance-to-line-height ratio.
 */
const CHAR_ASPECT = 0.52;

interface AsciiPortraitProps {
  src: string;
  /** Describes the image for assistive tech; the glyphs themselves are hidden. */
  alt: string;
  className?: string;
}

/**
 * Renders an image as ASCII by sampling it onto an offscreen canvas and mapping
 * each cell's luminance to a character. The canvas never reaches the DOM: the
 * output is real selectable text.
 *
 * Sizing uses container query units, so the fixed character grid always spans
 * its parent exactly rather than being guessed at with viewport units.
 */
export default function AsciiPortrait({
  src,
  alt,
  className,
}: AsciiPortraitProps) {
  const [rows, setRows] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.src = src;

    image.onload = () => {
      if (cancelled) return;

      const height = Math.max(
        1,
        Math.round(COLUMNS * (image.height / image.width) * CHAR_ASPECT),
      );

      const canvas = document.createElement("canvas");
      canvas.width = COLUMNS;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        setFailed(true);
        return;
      }

      context.drawImage(image, 0, 0, COLUMNS, height);
      const { data } = context.getImageData(0, 0, COLUMNS, height);

      const output: string[] = [];
      for (let y = 0; y < height; y += 1) {
        let line = "";
        for (let x = 0; x < COLUMNS; x += 1) {
          const i = (y * COLUMNS + x) * 4;
          // Rec. 601 luma, weighted for perceived brightness.
          const luma =
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          const index = Math.min(
            RAMP.length - 1,
            Math.floor(luma * RAMP.length),
          );
          line += RAMP[index];
        }
        output.push(line);
      }

      if (!cancelled) setRows(output);
    };

    image.onerror = () => {
      if (!cancelled) setFailed(true);
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  // One character advance is ~0.6em, so the grid spans COLUMNS * 0.6 ems.
  const fontSize = `${100 / (COLUMNS * 0.6)}cqw`;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "@container flex h-full w-full items-center justify-center overflow-hidden bg-black",
        className,
      )}
    >
      {rows ? (
        <pre
          aria-hidden="true"
          style={{ fontSize, lineHeight: 1.02 }}
          className="text-ink/85 group-hover:text-hazard font-mono whitespace-pre transition-colors duration-500 select-none"
        >
          {rows.join("\n")}
        </pre>
      ) : (
        <span className="text-ink/30 font-mono text-[11px] tracking-[0.3em] uppercase">
          {failed ? "Signal lost" : "Resolving…"}
        </span>
      )}
    </div>
  );
}
