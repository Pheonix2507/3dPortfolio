import type { Metadata, Viewport } from "next";
import { Archivo_Black, Share_Tech_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollController from "@/components/layout/ScrollController";
import { siteConfig } from "@/data/site";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

/**
 * Share Tech Mono only ships weight 400, which is far too light to carry
 * oversized brutalist headings. Archivo Black handles display type; the mono
 * keeps the technical voice for body copy and labels.
 */
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    // Route pages set just their own name; this frames it.
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The palette is dark-only by design; without this the shadcn light
    // variables win and routes without the 3D backdrop render white on white.
    <html lang="en" className="dark">
      <body
        className={`${shareTechMono.variable} ${archivoBlack.variable} mono-header bg-void scanlines antialiased`}
      >
        <ScrollController>
          <Navbar />
          {children}
          <Footer />
        </ScrollController>
      </body>
    </html>
  );
}
