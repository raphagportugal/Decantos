"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const WORDS_PER_MINUTE = 200;
const WORDS_PER_PAGE = 450;
const editableStatuses = ["rascunho", "em_revisao", "pronta_para_publicar"] as const;
const selectDraftFields =
  "id, numero, titulo, slug, subtitulo, trecho, conteudo, tempo_leitura, status, updated_at, created_at";

type DraftStatus = (typeof editableStatuses)[number];

export type MesaDraft = {
  id: string;
  numero: number;
  titulo: string;
  slug: string;
  subtitulo: string | null;
  trecho: string;
  conteudo: string;
  tempo_leitura: number;
  status: DraftStatus;
  updated_at: string;
  created_at: string;
};

type MesaDeEscritaProps = {
  profileId: string;
  initialDrafts: MesaDraft[];
};

function contarPalavras(texto: string) {
  return texto.trim().split(/\s+/).filter(Boolean).length;
}

function estimarTempoLeitura(palavras: number) {
  return Math.max(1, Math.ceil(palavras / WORDS_PER_MINUTE));
}

function estimarPaginas(palavras: number) {
  return palavras > 0 ? Math.max(1, Math.ceil(palavras / WORDS_PER_PAGE)) : 0;
}

function formatarQuantidade(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
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

function formatarDataCurta(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatarNumero(numero?: number) {
  return numero ? `DECANTAÇÃO #${String(numero).padStart(3, "0")}` : "DECANTAÇÃO #RASCUNHO";
}

function formatarStatus(status: DraftStatus) {
  const labels: Record<DraftStatus, string> = {
    rascunho: "Rascunho",
    em_revisao: "Em revisão",
    pronta_para_publicar: "Pronta para publicar",
  };

  return labels[status];
}

function separarParagrafos(conteudo: string) {
  return conteudo
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function gerarSlug(titulo: string) {
  const base =
    titulo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "decantacao";

  return `${base}-${Date.now().toString(36)}`;
}

export function MesaDeEscrita({ profileId, initialDrafts }: MesaDeEscritaProps) {
  const [drafts, setDrafts] = useState<MesaDraft[]>(initialDrafts);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [trecho, setTrecho] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [status, setStatus] = useState<DraftStatus>("rascunho");
  const [preview, setPreview] = useState(false);
  const [finalPreview, setFinalPreview] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedDraft = drafts.find((draft) => draft.id === draftId);
  const dataAtual = useMemo(formatarDataAtual, []);
  const caracteres = conteudo.length;
  const palavras = contarPalavras(conteudo);
  const minutos = estimarTempoLeitura(palavras);
  const paginas = estimarPaginas(palavras);
  const tempoLeitura = `${minutos} MIN DE LEITURA`;
  const paragrafos = separarParagrafos(conteudo);

  const metricas = [
    `${formatarQuantidade(caracteres)} ${caracteres === 1 ? "caractere" : "caracteres"}`,
    `${formatarQuantidade(palavras)} ${palavras === 1 ? "palavra" : "palavras"}`,
    paginas
      ? `${formatarQuantidade(paginas)} ${paginas === 1 ? "página estimada" : "páginas estimadas"}`
      : "0 páginas estimadas",
    `${minutos} min de leitura`,
  ];

  function carregarRascunho(draft: MesaDraft) {
    setDraftId(draft.id);
    setTitulo(draft.titulo);
    setSubtitulo(draft.subtitulo ?? "");
    setTrecho(draft.trecho);
    setConteudo(draft.conteudo);
    setStatus(draft.status);
    setFeedback("");
    setPreview(false);
    setFinalPreview(false);
  }

  function atualizarLista(savedDraft: MesaDraft) {
    setDraftId(savedDraft.id);
    setStatus(savedDraft.status);
    setDrafts((currentDrafts) => {
      const withoutSaved = currentDrafts.filter((draft) => draft.id !== savedDraft.id);
      return [savedDraft, ...withoutSaved];
    });
  }

  async function persistirRascunho(nextStatus: DraftStatus) {
    setFeedback("");
    setIsSaving(true);

    const supabase = createSupabaseBrowserClient();
    const payload = {
      titulo: titulo.trim() || "Decantação sem título",
      subtitulo: subtitulo.trim() || null,
      trecho: trecho.trim() || "Um rascunho ainda procurando sua primeira frase.",
      conteudo: conteudo.trim(),
      tempo_leitura: minutos,
      status: nextStatus,
      publicado_em: null,
    };

    let result = draftId
      ? await supabase
          .from("decantacoes")
          .update(payload)
          .eq("id", draftId)
          .select(selectDraftFields)
          .single()
      : await supabase
          .from("decantacoes")
          .insert({
            ...payload,
            status: "rascunho",
            slug: gerarSlug(payload.titulo),
            profile_id: profileId,
          })
          .select(selectDraftFields)
          .single();

    if (!draftId && nextStatus !== "rascunho" && result.data) {
      result = await supabase
        .from("decantacoes")
        .update({ status: nextStatus, publicado_em: null })
        .eq("id", result.data.id)
        .select(selectDraftFields)
        .single();
    }

    setIsSaving(false);

    if (result.error || !result.data) {
      setFeedback("Não foi possível salvar.");
      return null;
    }

    const savedDraft = result.data as MesaDraft;
    atualizarLista(savedDraft);
    return savedDraft;
  }

  async function salvarRascunho() {
    const wasExistingDraft = Boolean(draftId);
    const savedDraft = await persistirRascunho(status);

    if (!savedDraft) {
      return;
    }

    setFinalPreview(false);
    setFeedback(wasExistingDraft ? "Rascunho atualizado." : "Rascunho salvo.");
  }

  async function prepararPublicacao() {
    const savedDraft = await persistirRascunho("pronta_para_publicar");

    if (!savedDraft) {
      return;
    }

    setStatus("pronta_para_publicar");
    setPreview(true);
    setFinalPreview(true);
    setFeedback("Pronta para publicar.");
  }

  function PreviewEditorial() {
    return (
      <section
        aria-label="Prévia editorial"
        className="border-l border-wine/25 pl-5 md:pl-7"
      >
        <p className="mb-7 text-[0.68rem] uppercase leading-5 tracking-[0.18em] text-wine">
          {selectedDraft ? formatarNumero(selectedDraft.numero) : "DECANTAÇÃO #RASCUNHO"} ·{" "}
          {dataAtual} · {tempoLeitura}
        </p>

        <h2 className="font-serif text-[2.75rem] font-semibold leading-[0.98] text-foreground md:text-6xl">
          {titulo || "Título da Decantação"}
        </h2>
        {subtitulo ? (
          <p className="mt-5 max-w-[62ch] font-body text-xl leading-9 text-foreground/75">
            {subtitulo}
          </p>
        ) : null}
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
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-16">
      <header className="max-w-3xl border-b border-wine/20 pb-10">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
          Mesa de Escrita
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
          Ateliê de Decantações
        </h1>
        <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-muted">
          Um lugar provisório para assentar uma ideia antes que ela vire
          publicação.
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section aria-label="Escrevendo" className="space-y-9">
          <div>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-wine">
                Escrevendo
              </p>
              <button
                type="button"
                onClick={() => setPreview((current) => !current)}
                className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
              >
                {preview ? "Voltar à escrita" : "Prévia editorial"}
              </button>
            </div>

            {preview ? (
              <PreviewEditorial />
            ) : (
              <div className="space-y-9">
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
                    Subtítulo
                  </span>
                  <input
                    value={subtitulo}
                    onChange={(event) => setSubtitulo(event.target.value)}
                    placeholder="Opcional"
                    className="w-full border-0 border-b border-wine/25 bg-transparent px-0 pb-3 font-body text-xl leading-8 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
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
                  <span className="mb-4 block text-xs uppercase tracking-[0.16em] text-wine">
                    Conteúdo
                  </span>
                  <textarea
                    value={conteudo}
                    onChange={(event) => setConteudo(event.target.value)}
                    placeholder="Escreva em parágrafos. A mesa salva apenas rascunhos."
                    rows={22}
                    className="min-h-[34rem] w-full resize-y border-0 border-y border-wine/20 bg-[rgba(255,252,246,0.24)] px-0 py-8 font-body text-[1.25rem] leading-10 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine md:max-w-[68ch]"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-wine/15 pt-6">
            <button
              type="button"
              onClick={salvarRascunho}
              disabled={isSaving}
              className="border border-wine/30 px-5 py-3 text-sm font-medium text-wine transition-colors hover:border-wine hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : draftId ? "Atualizar rascunho" : "Salvar rascunho"}
            </button>
            <button
              type="button"
              onClick={prepararPublicacao}
              disabled={isSaving}
              className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-50"
            >
              Preparar publicação
            </button>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {selectedDraft ? formatarNumero(selectedDraft.numero) : "Novo rascunho"} ·{" "}
              {tempoLeitura}
            </p>
          </div>

          {feedback ? <p className="font-body text-sm leading-6 text-wine">{feedback}</p> : null}
          {finalPreview && !preview ? <PreviewEditorial /> : null}
        </section>

        <aside className="space-y-12 lg:sticky lg:top-8">
          <section aria-label="Métricas da escrita" className="border-t border-wine/20 pt-7">
            <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
              Medida do texto
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted lg:grid-cols-1">
              {metricas.map((metrica) => (
                <p key={metrica} className="font-body leading-6">
                  {metrica}
                </p>
              ))}
            </div>
          </section>

          <section aria-label="Meus Rascunhos" className="border-t border-wine/20 pt-7">
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-wine">
              Meus Rascunhos
            </p>
            {drafts.length ? (
              <div className="divide-y divide-wine/15">
                {drafts.map((draft) => (
                  <article key={draft.id} className="py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-wine">
                      {formatarNumero(draft.numero)}
                    </p>
                    <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
                      {draft.titulo}
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                      {formatarStatus(draft.status)} · Atualizado em{" "}
                      {formatarDataCurta(draft.updated_at)}
                    </p>
                    <button
                      type="button"
                      onClick={() => carregarRascunho(draft)}
                      className="mt-4 text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
                    >
                      Continuar escrevendo
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="font-body text-base leading-7 text-muted">
                Nenhum rascunho salvo ainda.
              </p>
            )}
          </section>

          <section aria-label="Ritual Editorial" className="border-t border-wine/20 pt-7">
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-wine">
              Ritual Editorial
            </p>
            <div className="space-y-3">
              {editableStatuses.map((item) => (
                <label key={item} className="flex items-center gap-3 font-body text-base text-muted">
                  <input
                    type="radio"
                    name="status"
                    checked={status === item}
                    onChange={() => {
                      setStatus(item);
                      setFinalPreview(false);
                    }}
                    className="h-3 w-3 accent-wine"
                  />
                  <span className={status === item ? "text-foreground" : ""}>
                    {formatarStatus(item)}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
