import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://decantos.vercel.app"),
  title: {
    default: "Decantos | um lugar para saborear a vida",
    template: "%s | Decantos",
  },
  description:
    'No vão das coisas que a gente disse e da vida que nos acontece, "Decantos" é o meu processo de inteligir e acessar os sabores que se dissolvem na pressa.',
  icons: {
    icon: "/brand/favicon.svg",
  },
  openGraph: {
    title: "Decantos",
    description: "um lugar para saborear a vida",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
