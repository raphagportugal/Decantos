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
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <div className="mt-7 max-w-2xl font-body text-lg leading-8 text-muted">{children}</div>
    </section>
  );
}
