import Link from "next/link";
import { formatDate, type Texto } from "@/lib/textos";

type TextListProps = {
  textos: Texto[];
  compact?: boolean;
};

export function TextList({ textos, compact = false }: TextListProps) {
  return (
    <div className="divide-y divide-line/80">
      {textos.map((texto) => (
        <article key={texto.slug} className={compact ? "py-5" : "py-8"}>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
            <span>{texto.category}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={texto.date}>{formatDate(texto.date)}</time>
            <span aria-hidden="true">/</span>
            <span>{texto.readingTime} min</span>
          </div>

          <h2 className="font-serif text-2xl leading-tight text-foreground sm:text-3xl">
            <Link
              href={`/textos/${texto.slug}`}
              className="underline decoration-transparent transition-colors hover:text-accent hover:decoration-accent"
            >
              {texto.title}
            </Link>
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{texto.description}</p>
        </article>
      ))}
    </div>
  );
}
