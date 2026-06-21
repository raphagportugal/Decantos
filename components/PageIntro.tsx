import type { ReactNode } from "react";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <section className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <div className="mt-6 max-w-2xl text-lg leading-8 text-muted">{children}</div>
    </section>
  );
}
