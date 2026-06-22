import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import {
  formatarDataEditorial,
  formatarNumeroDecantacao,
  getPublishedDecantacoesEditorial,
} from "@/lib/decantacoes";

export const metadata: Metadata = {
  title: "Decantações",
  description: "Acervo editorial das Decantações publicadas em Decantos.",
};

export default async function DecantacoesPage() {
  const decantacoes = await getPublishedDecantacoesEditorial();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Decantações" title="Uma biblioteca para voltar devagar">
        <p>
          Cada Decantação repousa aqui como parte de um acervo em formação:
          leituras breves, feitas para permanecer.
        </p>
      </PageIntro>

      <section className="mt-16 max-w-5xl border-t border-wine/20">
        {decantacoes.length ? (
          decantacoes.map((decantacao) => (
            <article
              key={decantacao.slug}
              className="grid gap-6 border-b border-wine/15 py-9 md:grid-cols-[11rem_1fr] md:gap-10 md:py-11"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-wine">
                  {formatarNumeroDecantacao(decantacao.numero)}
                </p>
                <div className="space-y-1 text-xs uppercase tracking-[0.14em] text-muted">
                  <time dateTime={decantacao.data}>
                    {formatarDataEditorial(decantacao.data)}
                  </time>
                  <p>{decantacao.tempoLeituraEditorial}</p>
                </div>
              </div>

              <div>
                <h2 className="max-w-3xl font-serif text-3xl font-semibold leading-[1.06] text-foreground md:text-4xl">
                  <Link
                    href={`/decantacoes/${decantacao.slug}`}
                    className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-clay"
                  >
                    {decantacao.titulo}
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl font-body text-lg leading-8 text-muted">
                  {decantacao.trecho}
                </p>
                <Link
                  href={`/decantacoes/${decantacao.slug}`}
                  aria-label={`Ler ${decantacao.titulo}, publicada em ${formatarDataEditorial(decantacao.data)}`}
                  className="mt-7 inline-block text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
                >
                  Ler a Decantação →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="py-12 font-body text-lg leading-8 text-muted">
            <p>Ainda há poucas Decantações por aqui.</p>
            <p>Talvez seja um bom momento para começar.</p>
          </div>
        )}
      </section>
    </div>
  );
}
