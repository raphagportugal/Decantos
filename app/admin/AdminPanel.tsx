"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProfileRole = "reader" | "author" | "moderator";
type DecantacaoStatus =
  | "rascunho"
  | "em_revisao"
  | "pronta_para_publicar"
  | "publicada"
  | "arquivada";

export type AdminProfile = {
  id: string;
  nome: string | null;
  email: string;
  role: ProfileRole;
  ativo: boolean;
};

export type AdminDecantacao = {
  id: string;
  numero: number;
  titulo: string;
  status: DecantacaoStatus;
  atualizado_em: string | null;
  publicado_em: string | null;
};

type AdminPanelProps = {
  initialProfiles: AdminProfile[];
  initialDecantacoes: AdminDecantacao[];
};

const roles: ProfileRole[] = ["reader", "author", "moderator"];

function formatarRole(role: ProfileRole) {
  const labels: Record<ProfileRole, string> = {
    reader: "Leitor",
    author: "Autor",
    moderator: "Moderador",
  };

  return labels[role];
}

function formatarStatus(status: DecantacaoStatus) {
  const labels: Record<DecantacaoStatus, string> = {
    rascunho: "Rascunho",
    em_revisao: "Em revisão",
    pronta_para_publicar: "Pronta para publicar",
    publicada: "Publicada",
    arquivada: "Arquivada",
  };

  return labels[status];
}

function formatarNumero(numero: number) {
  return `DECANTAÇÃO #${String(numero).padStart(3, "0")}`;
}

function formatarData(date?: string | null) {
  if (!date) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function AdminPanel({ initialProfiles, initialDecantacoes }: AdminPanelProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [decantacoes, setDecantacoes] = useState(initialDecantacoes);
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function atualizarProfile(profileId: string, changes: Partial<AdminProfile>) {
    setFeedback("");
    setBusyId(profileId);

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(changes)
      .eq("id", profileId)
      .select("id, nome, email, role, ativo")
      .single<AdminProfile>();

    setBusyId(null);

    if (error || !data) {
      setFeedback("Não foi possível alterar este usuário.");
      return;
    }

    setProfiles((current) => current.map((profile) => (profile.id === data.id ? data : profile)));
    setFeedback("Usuário atualizado.");
  }

  async function atualizarDecantacao(decantacao: AdminDecantacao, status: DecantacaoStatus) {
    if (status === "publicada" && decantacao.status !== "pronta_para_publicar") {
      setFeedback("Apenas Decantações prontas podem ser publicadas.");
      return;
    }

    setFeedback("");
    setBusyId(decantacao.id);

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("decantacoes")
      .update({
        status,
        publicado_em: status === "publicada" ? new Date().toISOString() : null,
      })
      .eq("id", decantacao.id)
      .select("id, numero, titulo, status, updated_at, publicado_em")
      .single();

    setBusyId(null);

    if (error || !data) {
      setFeedback("Não foi possível atualizar esta Decantação.");
      return;
    }

    const updated = {
      id: data.id,
      numero: data.numero,
      titulo: data.titulo,
      status: data.status,
      atualizado_em: data.updated_at,
      publicado_em: data.publicado_em,
    } as AdminDecantacao;

    setDecantacoes((current) => {
      if (updated.status === "publicada" || updated.status === "arquivada") {
        return current.filter((item) => item.id !== updated.id);
      }

      return current.map((item) => (item.id === updated.id ? updated : item));
    });
    setFeedback(
      updated.status === "publicada" ? "Decantação publicada." : "Decantação atualizada.",
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
      <header className="max-w-3xl border-b border-wine/20 pb-10">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
          Curadoria
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
          Painel editorial
        </h1>
        <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-muted">
          Um lugar discreto para cuidar dos acessos e acompanhar as Decantações
          antes da publicação.
        </p>
      </header>

      {feedback ? <p className="mt-8 font-body text-sm leading-6 text-wine">{feedback}</p> : null}

      <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1fr]">
        <section className="border-t border-wine/20 pt-7">
          <p className="mb-6 text-xs uppercase tracking-[0.18em] text-wine">
            Usuários
          </p>

          {profiles.length ? (
            <div className="divide-y divide-wine/15">
              {profiles.map((profile) => (
                <article key={profile.id} className="py-5">
                  <h2 className="font-serif text-2xl font-semibold leading-tight text-foreground">
                    {profile.nome || "Sem nome"}
                  </h2>
                  <p className="mt-2 font-body text-sm leading-6 text-muted">{profile.email}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    <label className="text-xs uppercase tracking-[0.14em] text-muted">
                      Papel
                      <select
                        value={profile.role}
                        disabled={busyId === profile.id}
                        onChange={(event) =>
                          atualizarProfile(profile.id, {
                            role: event.target.value as ProfileRole,
                          })
                        }
                        className="ml-3 border-0 border-b border-wine/25 bg-transparent pb-1 text-sm normal-case tracking-normal text-foreground outline-none focus:border-wine"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {formatarRole(role)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      disabled={busyId === profile.id}
                      onClick={() => atualizarProfile(profile.id, { ativo: !profile.ativo })}
                      className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {profile.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <span className="text-xs uppercase tracking-[0.14em] text-muted">
                      {profile.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="font-body text-base leading-7 text-muted">
              Ainda não há perfis por aqui.
            </p>
          )}
        </section>

        <section className="border-t border-wine/20 pt-7">
          <p className="mb-6 text-xs uppercase tracking-[0.18em] text-wine">
            Decantações em revisão
          </p>

          {decantacoes.length ? (
            <div className="divide-y divide-wine/15">
              {decantacoes.map((decantacao) => (
                <article key={decantacao.id} className="py-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-wine">
                    {formatarNumero(decantacao.numero)}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
                    {decantacao.titulo}
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">
                    {formatarStatus(decantacao.status)} · Atualizada em{" "}
                    {formatarData(decantacao.atualizado_em)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-4">
                    <button
                      type="button"
                      disabled={
                        busyId === decantacao.id ||
                        decantacao.status !== "pronta_para_publicar"
                      }
                      onClick={() => atualizarDecantacao(decantacao, "publicada")}
                      className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Aprovar como publicada
                    </button>
                    <button
                      type="button"
                      disabled={busyId === decantacao.id}
                      onClick={() => atualizarDecantacao(decantacao, "em_revisao")}
                      className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Voltar para revisão
                    </button>
                    <button
                      type="button"
                      disabled={busyId === decantacao.id}
                      onClick={() => atualizarDecantacao(decantacao, "arquivada")}
                      className="text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Arquivar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="font-body text-base leading-7 text-muted">
              Nenhuma Decantação em revisão no momento.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
