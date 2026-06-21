import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { TextList } from "@/components/TextList";
import { getAllTextos } from "@/lib/textos";

export const metadata: Metadata = {
  title: "Textos",
  description: "Ensaios publicados em Decantos, ordenados dos mais recentes aos mais antigos.",
};

export default function TextosPage() {
  const textos = getAllTextos();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Textos" title="Ensaios para ler sem pressa">
        <p>
          Uma selecao de textos sobre o que insiste em pedir atencao: a cidade,
          a memoria, os pequenos rituais, o cansaço e as formas possiveis de
          reencantar o cotidiano.
        </p>
      </PageIntro>

      <section className="mt-14 max-w-4xl">
        <TextList textos={textos} />
      </section>
    </div>
  );
}
