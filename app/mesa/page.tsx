import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MesaDeEscrita, type MesaDraft } from "./MesaDeEscrita";
import { SairButton } from "./SairButton";

export const metadata: Metadata = {
  title: "Mesa de Escrita",
  description: "Uma superfície silenciosa para rascunhar uma nova Decantação.",
};

function MesaHeader({ isModerator }: { isModerator: boolean }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pt-6 text-xs uppercase tracking-[0.16em] text-muted sm:px-8">
      <Link
        href="/"
        className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
      >
        ← Voltar para a casa
      </Link>
      <div className="flex items-center gap-5">
        {isModerator ? (
          <Link
            href="/admin"
            className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
          >
            Admin
          </Link>
        ) : null}
        <span className="text-wine">Escrever</span>
        <SairButton />
      </div>
    </div>
  );
}

function ReservedAccess() {
  return (
    <>
      <MesaHeader isModerator={false} />
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center px-5 py-16 sm:px-8">
        <section className="max-w-xl border-t border-wine/25 pt-10">
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
            Mesa de Escrita
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
            Acesso reservado
          </h1>
          <p className="mt-7 font-body text-lg leading-8 text-muted">
            Esta mesa é reservada a autores autorizados.
          </p>
          <div className="mt-10">
            <SairButton />
          </div>
        </section>
      </div>
    </>
  );
}

export default async function MesaPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nome, role, ativo")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile?.ativo || (profile.role !== "author" && profile.role !== "moderator")) {
    return <ReservedAccess />;
  }

  const { data: drafts } = await supabase
    .from("decantacoes")
    .select(
      "id, numero, titulo, slug, subtitulo, trecho, conteudo, tempo_leitura, status, updated_at, created_at",
    )
    .eq("profile_id", profile.id)
    .in("status", ["rascunho", "em_revisao", "pronta_para_publicar"])
    .order("updated_at", { ascending: false });

  return (
    <>
      <MesaHeader isModerator={profile.role === "moderator"} />
      <MesaDeEscrita profileId={profile.id} initialDrafts={(drafts ?? []) as MesaDraft[]} />
    </>
  );
}
