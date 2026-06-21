import type { Metadata } from "next";
import { Inter, Literata } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://decantos.vercel.app"),
  title: {
    default: "Decantos | um lugar para decantar a vida",
    template: "%s | Decantos",
  },
  description:
    "Uma casa digital de ensaios sobre vida, sociedade, cultura, filosofia cotidiana, atenção, memória, espanto e reencantamento.",
  openGraph: {
    title: "Decantos",
    description: "um lugar para decantar a vida",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${literata.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
