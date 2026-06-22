import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/textos", label: "Decantações" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/arquivo", label: "Arquivo" },
];

export function SiteHeader() {
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

        <nav aria-label="Principal" className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-[0.8rem] text-muted sm:gap-x-7">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline decoration-transparent transition-colors hover:text-foreground hover:decoration-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
