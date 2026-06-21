import Link from "next/link";

const navItems = [
  { href: "/textos", label: "Textos" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/arquivo", label: "Arquivo" },
  { href: "/sobre", label: "Sobre" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group w-fit no-underline">
          <span className="block font-serif text-3xl leading-none tracking-normal text-foreground">
            Decantos
          </span>
          <span className="mt-2 block text-sm text-muted">
            um lugar para decantar a vida
          </span>
        </Link>

        <nav aria-label="Principal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
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
