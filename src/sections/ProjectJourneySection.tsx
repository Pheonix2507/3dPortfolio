"use client";

import { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import LazyCanvas from "@/components/three/LazyCanvas";
import ProjectJourney from "@/components/three/ProjectJourney";
import { journeyStations } from "@/data/journey";

const TOTAL = journeyStations.length;

/**
 * A scroll walkthrough of the Kubernetes Cost Analyzer.
 *
 * A car drives a curved route past one station per pipeline stage, and each
 * station explains itself where it stands rather than in a fixed column. The
 * route spans the page and runs longer than the frame: the camera travels with
 * the car instead of the whole route being squeezed into one screen.
 *
 * Scrolling down is the direction data actually moves through the system, so the
 * gesture matches the subject.
 *
 * The visible panel lives inside the canvas, attached to the active station. A
 * plain ordered list of every stage is kept in the DOM for assistive tech, since
 * the in-scene panel only ever holds one of them.
 */
export default function ProjectJourneySection() {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /*
   * Nearest station, not the bucket the scroll falls in. The car sits exactly on
   * station i at progress i/(n-1), so rounding puts the highlight on whichever
   * station the car is closest to and switches it at the midpoint between them.
   * Flooring over n buckets would run the highlight a stage ahead of the car.
   *
   * Fires on every scroll tick but only sets state when the station changes, so
   * this re-renders a handful of times across the whole section.
   */
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(
      TOTAL - 1,
      Math.max(0, Math.round(progress * (TOTAL - 1))),
    );
    setActive((previous) => (next === previous ? previous : next));
  });

  return (
    <section
      ref={ref}
      aria-labelledby="journey-heading"
      className="relative h-[420vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Full-bleed: the route spans the page rather than a column. */}
        <LazyCanvas
          camera={{ position: [0, 0, 7.5], fov: 42 }}
          dpr={[1, 1.5]}
          className="absolute inset-0"
        >
          <ProjectJourney
            progress={scrollYProgress}
            stations={journeyStations}
            active={active}
            reduceMotion={reduceMotion}
          />
        </LazyCanvas>

        {/* Chrome only: a title and a counter, kept out of the route's way. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto max-w-7xl px-4 pt-24 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase">
                <span className="bg-hazard text-void px-1.5">06</span>
                <span className="text-ink/40">/</span>
                <span className="text-ink/60">Walkthrough</span>
              </div>

              <h2
                id="journey-heading"
                className="font-display mt-3 text-[clamp(1.35rem,3vw,2.25rem)] leading-[0.9] tracking-tighter uppercase"
              >
                Kubernetes <span className="text-hazard">cost analyzer</span>
              </h2>
            </div>

            <p className="text-ink/35 font-mono text-[10px] tracking-[0.3em] uppercase">
              Stage {journeyStations[active]?.index} /{" "}
              {String(TOTAL).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/*
          The in-scene panel shows one stage at a time, so the full walkthrough
          would otherwise be unavailable to a screen reader. This carries all of
          it, in order, without duplicating anything on screen.
        */}
        <ol className="sr-only">
          {journeyStations.map((station) => (
            <li key={station.index}>
              <h3>
                {station.index} / {station.title}
              </h3>
              <p>{station.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
