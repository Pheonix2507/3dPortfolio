import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

/**
 * Generated at build time, so a shared link renders a real card instead of the
 * blank grey box a missing og:image produces.
 *
 * Deliberately built from flat blocks and system-stack type rather than a
 * webfont: ImageResponse would otherwise need the font fetched at build, and a
 * network dependency inside the build is not worth it for a static card.
 */
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#000000";
const INK = "#ffffff";
const HAZARD = "#ffff00";
const ALERT = "#ff2200";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: VOID,
        padding: 64,
        fontFamily: "monospace",
      }}
    >
      {/* Top rule with the section marker the site uses */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            background: HAZARD,
            color: VOID,
            padding: "4px 12px",
            fontSize: 22,
            letterSpacing: 6,
          }}
        >
          CB
        </div>
        <div style={{ color: "#666", fontSize: 22, letterSpacing: 6 }}>/</div>
        <div style={{ color: "#999", fontSize: 22, letterSpacing: 6 }}>
          PORTFOLIO
        </div>
      </div>

      {/* Name, oversized, the way the site sets display type */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: INK,
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: -4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          CHINTAN
        </div>
        <div
          style={{
            color: HAZARD,
            fontSize: 128,
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: -4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          BHARA
        </div>

        {/* Heavy rule, as under the site's section headings */}
        <div style={{ height: 6, background: INK, marginTop: 28 }} />

        <div
          style={{
            color: "#aaa",
            fontSize: 28,
            letterSpacing: 2,
            marginTop: 24,
            display: "flex",
          }}
        >
          Full Stack Developer
        </div>
      </div>

      {/* Footer strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "#777", fontSize: 24, letterSpacing: 3 }}>
          REACT · NEXT.JS · TYPESCRIPT · GO · POSTGRES
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: HAZARD }} />
          <div style={{ width: 28, height: 28, background: ALERT }} />
          <div style={{ width: 28, height: 28, background: INK }} />
        </div>
      </div>
    </div>,
    size,
  );
}
