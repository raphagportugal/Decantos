import Link from "next/link";
import { TextList } from "@/components/TextList";
import { getAllTextos } from "@/lib/textos";

export default function Home() {
  const textos = getAllTextos();
  const destaque = textos[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <section className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.18em] text-accent">
            Casa de ensaios
          </p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.98] text-foreground sm:text-6xl md:text-7xl">
            Decantos
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">
            um lugar para decantar a vida
          </p>
          <p className="mt-10 max-w-2xl text-lg leading-8 text-foreground/85">
            Ensaios sobre vida, sociedade, cultura, filosofia cotidiana, atencao,
            memoria, espanto e reencantamento. Um site para entrar mais devagar
            do que se chegou.
          </p>
        </div>

        {destaque ? (
          <aside className="border-l border-line pl-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Texto recente</p>
            <h2 className="mt-5 font-serif text-3xl leading-tight">
              <Link
                href={`/textos/${destaque.slug}`}
                className="underline decoration-transparent transition-colors hover:text-accent hover:decoration-accent"
              >
                {destaque.title}
              </Link>
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">{destaque.description}</p>
          </aside>
        ) : null}
      </section>

      <section className="mt-20 border-t border-line pt-10">
        <div className="mb-2 flex items-baseline justify-between gap-6">
          <h2 className="font-serif text-3xl">Textos</h2>
          <Link href="/textos" className="text-sm text-muted underline hover:text-accent">
            ver todos
          </Link>
        </div>
        <TextList textos={textos.slice(0, 3)} compact />
      </section>
    </div>
  );
}
