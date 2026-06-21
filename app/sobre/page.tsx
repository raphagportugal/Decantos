import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre Decantos, uma casa digital dedicada a ensaios de leitura confortável e pensamento atento.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Sobre" title="Uma casa para textos que precisam de ar">
        <p>
          Decantos e um projeto editorial independente dedicado a ensaios sobre
          vida, sociedade, cultura, filosofia cotidiana, atencao, memoria,
          espanto e reencantamento.
        </p>
      </PageIntro>

      <div className="prose-decantos mt-14 max-w-3xl">
        <p>
          A proposta e simples: oferecer uma experiencia de leitura limpa,
          silenciosa e consistente, onde cada texto tenha espaco para respirar.
          O site evita a logica do fluxo infinito e prefere o arquivo, a volta,
          a demora.
        </p>
        <p>
          Decantos nao quer disputar a ansiedade do dia. Quer criar uma pequena
          sala, aberta, onde pensamentos possam chegar sem precisar gritar.
        </p>
      </div>
    </div>
  );
}
