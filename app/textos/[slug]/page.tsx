import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import {
  formatDateUpper,
  getDecantacaoNumber,
  getTextoBySlug,
  getTextoSlugs,
} from "@/lib/textos";

type TextoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getTextoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TextoPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const texto = getTextoBySlug(slug);

    return {
      title: texto.title,
      description: texto.description,
      openGraph: {
        title: texto.title,
        description: texto.description,
        type: "article",
        publishedTime: texto.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function TextoPage({ params }: TextoPageProps) {
  const { slug } = await params;

  if (!getTextoSlugs().includes(slug)) {
    notFound();
  }

  const texto = getTextoBySlug(slug);
  const decantacaoNumber = getDecantacaoNumber(slug);
  const { default: MDXContent } = await evaluate(texto.content, {
    ...runtime,
    development: false,
  });

  return (
    <article className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12rem] top-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_58%_44%,rgba(122,75,71,0.12),rgba(177,122,87,0.08)_42%,rgba(246,242,234,0)_72%)] blur-2xl"
      />

      <header className="relative mx-auto max-w-[70ch] border-b border-wine/20 pb-12 md:pb-14">
        <p className="mb-7 text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-wine">
          DECANTAÇÃO {decantacaoNumber} · {formatDateUpper(texto.date)} ·{" "}
          {texto.readingTime} MIN DE LEITURA
        </p>

        <h1 className="font-serif text-[2.75rem] font-semibold leading-[0.98] text-foreground sm:text-6xl md:text-7xl">
          {texto.title}
        </h1>
        <p className="mt-8 max-w-[62ch] font-body text-xl leading-9 text-muted">
          {texto.subtitle}
        </p>
      </header>

      <div className="prose-decantos relative mx-auto mt-14 max-w-[68ch] md:mt-16">
        <MDXContent />
      </div>

      <footer className="relative mx-auto mt-14 max-w-[68ch] border-t border-wine/20 pt-7 font-body text-base leading-8 text-muted md:mt-16">
        <p className="m-0 text-foreground/80">— Raphael Portugal</p>
        <p className="m-0 mt-5 italic text-muted">Leia como quem abre uma janela.</p>
      </footer>
    </article>
  );
}
