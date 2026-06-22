"use client";

import { useMemo, useState } from "react";

const WORDS_PER_MINUTE = 200;

function contarPalavras(texto: string) {
  return texto.trim().split(/\s+/).filter(Boolean).length;
}

function estimarTempoLeitura(conteudo: string) {
  return Math.max(1, Math.ceil(contarPalavras(conteudo) / WORDS_PER_MINUTE));
}

function formatarDataAtual() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .toLocaleUpperCase("pt-BR");
}

function separarParagrafos(conteudo: string) {
  return conteudo
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function MesaDeEscrita() {
  const [titulo, setTitulo] = useState("");
  const [trecho, setTrecho] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [preview, setPreview] = useState(false);

  const dataAtual = useMemo(formatarDataAtual, []);
  const minutos = estimarTempoLeitura(conteudo);
  const tempoLeitura = `${minutos} MIN DE LEITURA`;
  const paragrafos = separarParagrafos(conteudo);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
      <header className="max-w-3xl border-b border-wine/20 pb-10">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
          Mesa de Escrita
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
          Rascunhar uma Decantação
        </h1>
        <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-muted">
          Um lugar provisório para assentar uma ideia antes que ela vire
          publicação.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <section aria-label="Escrita" className="space-y-9">
          <label className="block">
            <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-wine">
              Título
            </span>
            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Nome da Decantação"
              className="w-full border-0 border-b border-wine/25 bg-transparent px-0 pb-3 font-serif text-4xl font-semibold leading-tight text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-wine">
              Trecho
            </span>
            <textarea
              value={trecho}
              onChange={(event) => setTrecho(event.target.value)}
              placeholder="Uma frase breve para abrir a leitura."
              rows={3}
              className="w-full resize-none border-0 border-b border-wine/25 bg-transparent px-0 pb-3 font-body text-xl leading-9 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-wine">
              Conteúdo
            </span>
            <textarea
              value={conteudo}
              onChange={(event) => setConteudo(event.target.value)}
              placeholder="Escreva em parágrafos. A mesa apenas guarda este rascunho enquanto a página estiver aberta."
              rows={14}
              className="w-full resize-y border-0 border-b border-wine/25 bg-transparent px-0 pb-4 font-body text-lg leading-8 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
            />
          </label>

          <div className="flex flex-wrap items-center gap-5 border-t border-wine/15 pt-6">
            <button
              type="button"
              onClick={() => setPreview((current) => !current)}
              className="border border-wine/30 px-5 py-3 text-sm font-medium text-wine transition-colors hover:border-wine hover:text-foreground"
            >
              {preview ? "Voltar à escrita" : "Pré-visualizar"}
            </button>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {tempoLeitura}
            </p>
          </div>
        </section>

        <section
          aria-label="Pré-visualização"
          className={preview ? "block" : "hidden lg:block"}
        >
          <article className="border-l border-wine/20 pl-6 md:pl-8">
            <p className="mb-7 text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-wine">
              DECANTAÇÃO #RASCUNHO · {dataAtual} · {tempoLeitura}
            </p>

            <h2 className="font-serif text-[2.75rem] font-semibold leading-[0.98] text-foreground md:text-6xl">
              {titulo || "Título da Decantação"}
            </h2>
            <p className="mt-7 max-w-[62ch] font-body text-xl leading-9 text-muted">
              {trecho || "O trecho aparece aqui quando a ideia começa a assentar."}
            </p>

            <div className="prose-decantos mt-12 max-w-[68ch]">
              {paragrafos.length ? (
                paragrafos.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
              ) : (
                <p>O corpo da Decantação aparecerá aqui, parágrafo por parágrafo.</p>
              )}
            </div>

            <footer className="mt-14 max-w-[68ch] border-t border-wine/20 pt-7 font-body text-base leading-8 text-muted">
              <p className="m-0 text-foreground/80">— Raphael Portugal</p>
              <p className="m-0 mt-5 italic text-muted">Leia como quem abre uma janela.</p>
            </footer>
          </article>
        </section>
      </div>
    </div>
  );
}
