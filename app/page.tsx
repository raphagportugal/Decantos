import Link from "next/link";
import { formatDateUpper, getAllTextos } from "@/lib/textos";

export default function Home() {
  const textos = getAllTextos();
  const destaque = textos[0];

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-5 py-16 sm:px-8 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-9rem] top-8 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_38%_42%,rgba(122,75,71,0.18),rgba(177,122,87,0.10)_38%,rgba(246,242,234,0)_70%)] blur-2xl md:right-[-5rem] md:top-12 md:h-[30rem] md:w-[30rem]"
      />

      <section className="relative max-w-4xl pb-20 md:pb-28">
        <p className="max-w-3xl font-body text-xl leading-9 text-foreground/85 md:text-2xl md:leading-10">
          No vão das coisas que a gente disse e da vida que nos acontece,
          &quot;Decantos&quot; é o meu processo de inteligir e acessar os sabores
          que se dissolvem na pressa.
        </p>

        <h1 className="mt-14 font-serif text-6xl font-semibold leading-[0.95] text-wine sm:text-7xl md:text-8xl">
          Decantos
        </h1>
        <p className="mt-5 font-body text-2xl leading-9 text-foreground/75">
          um lugar para saborear a vida
        </p>
        <p className="mt-12 border-l border-clay pl-4 text-sm uppercase tracking-[0.18em] text-wine">
          Leia como quem abre uma janela.
        </p>
      </section>

      {destaque ? (
        <section className="relative border-t border-wine/25 py-14 md:grid md:grid-cols-[0.34fr_0.66fr] md:gap-12 md:py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-wine">
            Última Decantação
          </p>
          <article className="mt-7 md:mt-0">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              DECANTAÇÃO #001 · {formatDateUpper(destaque.date)} ·{" "}
              {destaque.readingTime} MIN DE LEITURA
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-foreground md:text-5xl">
              {destaque.title}
            </h2>
            <p className="mt-6 max-w-2xl font-body text-lg leading-8 text-muted">
              {destaque.description}
            </p>
            <Link
              href={`/textos/${destaque.slug}`}
              className="mt-8 inline-block text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
            >
              Ler a Decantação →
            </Link>
          </article>
        </section>
      ) : null}

      <section className="border-t border-wine/20 py-14 md:grid md:grid-cols-[0.34fr_0.66fr] md:gap-12 md:py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-wine">Manifesto</p>
        <div className="mt-7 max-w-2xl md:mt-0">
          <p className="font-body text-xl leading-9 text-foreground/85">
            Um gesto editorial para desacelerar a linguagem e devolver espessura
            ao vivido.
          </p>
          <Link
            href="/manifesto"
            className="mt-8 inline-block text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
          >
            Ler o Manifesto →
          </Link>
        </div>
      </section>

      <section className="border-t border-wine/20 py-14 md:grid md:grid-cols-[0.34fr_0.66fr] md:gap-12 md:py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-wine">Arquivo</p>
        <div className="mt-7 max-w-2xl md:mt-0">
          <p className="font-body text-xl leading-9 text-foreground/85">
            As Decantações reunidas para retorno, demora e leitura sem pressa.
          </p>
          <Link
            href="/arquivo"
            className="mt-8 inline-block text-sm font-medium text-wine underline decoration-clay/50 transition-colors hover:text-foreground hover:decoration-wine"
          >
            Explorar todas as Decantações →
          </Link>
        </div>
      </section>
    </div>
  );
}
