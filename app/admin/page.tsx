import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SairButton } from "@/app/mesa/SairButton";
import { AdminPanel, type AdminDecantacao, type AdminProfile } from "./AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  description: "Curadoria inicial de acessos e Decantações do Decantos.",
};

function AdminHeader() {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pt-6 text-xs uppercase tracking-[0.16em] text-muted sm:px-8">
      <Link
        href="/"
        className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
      >
        ← Voltar para a casa
      </Link>
      <div className="flex items-center gap-5">
        <Link
          href="/mesa"
          className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
        >
          Escrever
        </Link>
        <span className="text-wine">Admin</span>
        <SairButton />
      </div>
    </div>
  );
}

function ReservedCuradoria() {
  return (
    <>
      <AdminHeader />
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center px-5 py-16 sm:px-8">
        <section className="max-w-xl border-t border-wine/25 pt-10">
          <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
            Curadoria
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
            Acesso reservado
          </h1>
          <p className="mt-7 font-body text-lg leading-8 text-muted">
            Esta área é reservada à curadoria do Decantos.
          </p>
          <div className="mt-10">
            <SairButton />
          </div>
        </section>
      </div>
    </>
  );
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, ativo")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile?.ativo || profile.role !== "moderator") {
    return <ReservedCuradoria />;
  }

  const [{ data: profiles }, { data: decantacoes }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, nome, email, role, ativo")
      .order("created_at", { ascending: false }),
    supabase
      .from("decantacoes")
      .select("id, numero, titulo, status, updated_at, publicado_em")
      .in("status", ["rascunho", "em_revisao", "pronta_para_publicar"])
      .order("updated_at", { ascending: false }),
  ]);

  const adminDecantacoes =
    decantacoes?.map((decantacao) => ({
      id: decantacao.id,
      numero: decantacao.numero,
      titulo: decantacao.titulo,
      status: decantacao.status,
      atualizado_em: decantacao.updated_at,
      publicado_em: decantacao.publicado_em,
    })) ?? [];

  return (
    <>
      <AdminHeader />
      <AdminPanel
        initialProfiles={(profiles ?? []) as AdminProfile[]}
        initialDecantacoes={adminDecantacoes as AdminDecantacao[]}
      />
    </>
  );
}
