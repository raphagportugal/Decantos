import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-wine/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>Decantos, um lugar para saborear a vida.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <p>Leia como quem abre uma janela.</p>
          <Link
            href="/mesa"
            className="underline decoration-transparent transition-colors hover:text-wine hover:decoration-wine"
          >
            Mesa
          </Link>
        </div>
      </div>
    </footer>
  );
}
