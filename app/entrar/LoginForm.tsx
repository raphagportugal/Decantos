"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ProfileRole = "reader" | "author" | "moderator";

type Profile = {
  role: ProfileRole;
  ativo: boolean;
};

function nomePadrao(email: string) {
  return email.split("@")[0] || "Leitor";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getOrCreateProfile(userId: string, userEmail: string) {
    const supabase = createSupabaseBrowserClient();
    const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("role, ativo")
      .eq("auth_user_id", userId)
      .maybeSingle<Profile>();

    if (selectError) {
      throw selectError;
    }

    if (profile) {
      return profile;
    }

    const { data: createdProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        auth_user_id: userId,
        nome: nomePadrao(userEmail),
        email: userEmail,
        role: "reader",
        ativo: true,
      })
      .select("role, ativo")
      .single<Profile>();

    if (insertError) {
      throw insertError;
    }

    return createdProfile;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !data.user?.email) {
      setIsSubmitting(false);
      setError("Não foi possível entrar com esses dados.");
      return;
    }

    try {
      const profile = await getOrCreateProfile(data.user.id, data.user.email);
      setIsSubmitting(false);

      if (!profile.ativo) {
        setError("Este acesso está desativado no momento.");
        return;
      }

      if (profile.role === "moderator") {
        router.replace("/admin");
        router.refresh();
        return;
      }

      if (profile.role === "author") {
        router.replace("/mesa");
        router.refresh();
        return;
      }

      setMessage("Entrada feita. A casa está aberta para leitura.");
      router.replace("/");
      router.refresh();
    } catch {
      setIsSubmitting(false);
      setError("A entrada foi feita, mas não foi possível preparar o perfil.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-8">
      <label className="block">
        <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-wine">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="w-full border-0 border-b border-wine/25 bg-transparent px-0 pb-3 font-body text-xl leading-8 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
        />
      </label>

      <label className="block">
        <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-wine">
          Senha
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="w-full border-0 border-b border-wine/25 bg-transparent px-0 pb-3 font-body text-xl leading-8 text-foreground outline-none transition-colors placeholder:text-muted/45 focus:border-wine"
        />
      </label>

      {error ? <p className="font-body text-sm leading-6 text-wine">{error}</p> : null}
      {message ? <p className="font-body text-sm leading-6 text-muted">{message}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-wine/30 px-5 py-3 text-sm font-medium text-wine transition-colors hover:border-wine hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
