import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { formatDate, getAllTextos } from "@/lib/textos";

export const metadata: Metadata = {
  title: "Arquivo",
  description: "Arquivo cronológico das Decantações publicadas em Decantos.",
};

export default function ArquivoPage() {
  const textos = getAllTextos();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Arquivo" title="O que foi assentando">
        <p>Um índice cronológico das Decantações publicadas em Decantos.</p>
      </PageIntro>

      <section className="mt-14 max-w-3xl border-t border-line/70">
        {textos.map((texto) => (
          <div
            key={texto.slug}
            className="grid gap-2 border-b border-line/70 py-5 text-sm sm:grid-cols-[10rem_1fr]"
          >
            <time className="text-muted" dateTime={texto.date}>
              {formatDate(texto.date)}
            </time>
            <Link
              href={`/textos/${texto.slug}`}
              className="font-serif text-2xl font-medium underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
            >
              {texto.title}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
