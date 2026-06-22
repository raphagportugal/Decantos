import Image from "next/image";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/decantacoes", label: "Decantações" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/arquivo", label: "Arquivo" },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role, ativo")
        .eq("auth_user_id", user.id)
        .eq("ativo", true)
        .maybeSingle()
    : { data: null };

  const role = profile?.role;
  const canWrite = role === "author" || role === "moderator";
  const isModerator = role === "moderator";
  const accessItems = user
    ? [
        ...(canWrite ? [{ href: "/mesa", label: "Escrever" }] : []),
        ...(isModerator ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [{ href: "/entrar", label: "Entrar" }];
  const items = [...navItems, ...accessItems];

  return (
    <header className="border-b border-line/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8 md:py-6">
        <Link href="/" className="group w-fit no-underline">
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Decantos"
            width={172}
            height={48}
            priority
            className="h-auto w-[142px] sm:w-[172px]"
          />
        </Link>

        <nav
          aria-label="Principal"
          className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-[0.8rem] text-muted sm:gap-x-7"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/entrar"
                  ? "border-b border-wine/40 pb-1 font-medium text-wine transition-colors hover:border-wine hover:text-foreground"
                  : "underline decoration-transparent transition-colors hover:text-foreground hover:decoration-accent"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
