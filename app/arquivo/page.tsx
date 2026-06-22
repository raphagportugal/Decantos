import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import {
  formatarDataEditorial,
  formatarNumeroDecantacao,
  getArquivoCronologico,
} from "@/lib/decantacoes";

export const metadata: Metadata = {
  title: "Arquivo",
  description: "Arquivo cronológico das Decantações publicadas em Decantos.",
};

export default function ArquivoPage() {
  const archiveGroups = getArquivoCronologico();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Arquivo" title="O que foi assentando">
        <p>
          Um acervo cronológico das Decantações publicadas em Decantos, organizado
          para retorno e demora.
        </p>
      </PageIntro>

      <section className="mt-16 max-w-4xl border-t border-wine/20">
        {archiveGroups.length ? (
          archiveGroups.map((yearGroup) => (
            <div
              key={yearGroup.ano}
              className="grid gap-7 border-b border-wine/15 py-10 md:grid-cols-[9rem_1fr] md:gap-12"
            >
              <h2 className="font-serif text-4xl font-semibold leading-none text-wine">
                {yearGroup.ano}
              </h2>

              <div className="space-y-10">
                {yearGroup.meses.map((monthGroup) => (
                  <section key={`${yearGroup.ano}-${monthGroup.mes}`}>
                    <h3 className="mb-5 text-xs uppercase tracking-[0.18em] text-muted">
                      {monthGroup.mes}
                    </h3>

                    <div className="space-y-4">
                      {monthGroup.decantacoes.map((decantacao) => (
                        <article
                          key={decantacao.slug}
                          className="grid gap-2 border-l border-clay/50 pl-4 sm:grid-cols-[10rem_1fr]"
                        >
                          <p className="text-xs uppercase tracking-[0.16em] text-wine">
                            {formatarNumeroDecantacao(decantacao.numero)}
                          </p>
                          <p className="font-body text-base leading-7 text-muted">
                            <Link
                              href={`/decantacoes/${decantacao.slug}`}
                              className="font-serif text-2xl font-semibold leading-tight text-foreground underline decoration-transparent transition-colors hover:text-wine hover:decoration-clay"
                            >
                              {decantacao.titulo}
                            </Link>
                            <span className="mx-2 text-clay">·</span>
                            <time dateTime={decantacao.data}>
                              {formatarDataEditorial(decantacao.data)}
                            </time>
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
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
