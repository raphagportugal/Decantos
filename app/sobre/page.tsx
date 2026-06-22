import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre Decantos, uma casa digital dedicada a ensaios de leitura confortável e pensamento atento.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Sobre" title="Uma casa para leituras que precisam de ar">
        <p>
          Decantos é um projeto editorial independente dedicado a ensaios que
          acolhem a demora, a observação e a experiência cotidiana.
        </p>
      </PageIntro>

      <div className="prose-decantos mt-14 max-w-3xl">
        <p>
          A proposta é simples: oferecer uma experiência de leitura limpa,
          silenciosa e consistente, onde cada Decantação tenha espaço para
          respirar. O site evita a lógica do fluxo infinito e prefere o
          arquivo, a volta, a demora.
        </p>
        <p>
          Decantos não quer disputar a ansiedade do dia. Quer criar uma pequena
          sala, aberta, onde pensamentos possam chegar sem precisar gritar.
        </p>
      </div>
    </div>
  );
}
