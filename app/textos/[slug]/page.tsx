import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { formatDate, getAllTextos, getTextoBySlug, getTextoSlugs } from "@/lib/textos";

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
  const outrosTextos = getAllTextos().filter((item) => item.slug !== slug).slice(0, 2);
  const { default: MDXContent } = await evaluate(texto.content, {
    ...runtime,
    development: false,
  });

  return (
    <article className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
      <header className="max-w-4xl border-b border-line pb-10">
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
          <span>{texto.category}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={texto.date}>{formatDate(texto.date)}</time>
          <span aria-hidden="true">/</span>
          <span>{texto.readingTime} min de leitura</span>
        </div>
        <h1 className="font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
          {texto.title}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-muted">{texto.subtitle}</p>
      </header>

      <div className="prose-decantos mt-12 max-w-3xl">
        <MDXContent />
      </div>

      {outrosTextos.length ? (
        <footer className="mt-20 max-w-3xl border-t border-line pt-8">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">Continuar lendo</p>
          <div className="space-y-3">
            {outrosTextos.map((item) => (
              <Link
                key={item.slug}
                href={`/textos/${item.slug}`}
                className="block font-serif text-xl underline decoration-transparent hover:text-accent hover:decoration-accent"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </footer>
      ) : null}
    </article>
  );
}
