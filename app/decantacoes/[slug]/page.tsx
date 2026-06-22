import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import {
  type Decantacao,
  formatarDataEditorial,
  formatarNumeroDecantacao,
  getDecantacaoEditorialBySlug,
  getPublishedDecantacaoSlugs,
} from "@/lib/decantacoes";

type DecantacaoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedDecantacaoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DecantacaoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decantacao = await getDecantacaoEditorialBySlug(slug);

  if (!decantacao) {
    return {};
  }

  return {
    title: decantacao.titulo,
    description: decantacao.trecho,
    openGraph: {
      title: decantacao.titulo,
      description: decantacao.trecho,
      type: "article",
      publishedTime: decantacao.data,
    },
  };
}

function PlainContent({ conteudo }: { conteudo: string }) {
  const paragraphs = conteudo
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.length ? (
        paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
      ) : (
        <p>Esta Decantação ainda está procurando seu corpo.</p>
      )}
    </>
  );
}

async function DecantacaoContent({ decantacao }: { decantacao: Decantacao }) {
  if (decantacao.origem === "supabase") {
    return <PlainContent conteudo={decantacao.conteudo} />;
  }

  const { default: MDXContent } = await evaluate(decantacao.conteudo, {
    ...runtime,
    development: false,
  });

  return <MDXContent />;
}

export default async function DecantacaoPage({ params }: DecantacaoPageProps) {
  const { slug } = await params;
  const decantacao = await getDecantacaoEditorialBySlug(slug);

  if (!decantacao) {
    notFound();
  }

  return (
    <article className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-20 pt-16 sm:px-8 md:pb-28 md:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12rem] top-10 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_58%_44%,rgba(122,75,71,0.12),rgba(177,122,87,0.08)_42%,rgba(246,242,234,0)_72%)] blur-2xl"
      />

      <header className="relative mx-auto max-w-[70ch] border-b border-wine/20 pb-12 md:pb-14">
        <p className="mb-7 text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-wine">
          {formatarNumeroDecantacao(decantacao.numero)} ·{" "}
          {formatarDataEditorial(decantacao.data)} · {decantacao.tempoLeituraEditorial}
        </p>

        <h1 className="font-serif text-[2.75rem] font-semibold leading-[0.98] text-foreground sm:text-6xl md:text-7xl">
          {decantacao.titulo}
        </h1>
        {decantacao.subtitulo ? (
          <p className="mt-7 max-w-[62ch] font-body text-xl leading-9 text-foreground/75">
            {decantacao.subtitulo}
          </p>
        ) : null}
        <p className="mt-8 max-w-[62ch] font-body text-xl leading-9 text-muted">
          {decantacao.trecho}
        </p>
      </header>

      <div className="prose-decantos relative mx-auto mt-14 max-w-[68ch] md:mt-16">
        <DecantacaoContent decantacao={decantacao} />
      </div>

      <footer className="relative mx-auto mt-14 max-w-[68ch] border-t border-wine/20 pt-7 font-body text-base leading-8 text-muted md:mt-16">
        <p className="m-0 text-foreground/80">— Raphael Portugal</p>
        <p className="m-0 mt-5 italic text-muted">Leia como quem abre uma janela.</p>
      </footer>
    </article>
  );
}
