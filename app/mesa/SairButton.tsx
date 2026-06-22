"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SairButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/entrar");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-xs uppercase tracking-[0.16em] text-muted underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSigningOut ? "Saindo..." : "Sair"}
    </button>
  );
}
