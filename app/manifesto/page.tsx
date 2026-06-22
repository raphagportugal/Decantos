import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "O gesto editorial de Decantos: desacelerar e devolver espessura ao vivido.",
};

export default function ManifestoPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Manifesto" title="Contra a vida que passa sem assentar">
        <p>
          Decantos nasce da suspeita de que nem tudo precisa virar opinião
          imediata, desempenho público ou ruído. Algumas experiências pedem
          repouso antes de se tornarem linguagem.
        </p>
      </PageIntro>

      <div className="prose-decantos mt-14 max-w-3xl">
        <p>
          Decantar é permitir que o excesso desça. É separar o que turva do que
          permanece. Num tempo que premia a reação, escolhemos o ensaio: uma
          forma imperfeita, paciente, capaz de pensar enquanto caminha.
        </p>
        <p>
          Aqui, cultura não é ornamento; é modo de perceber. Filosofia não é
          torre; é pergunta feita dentro da cozinha, no transporte, diante de
          uma lembrança que voltou sem pedir licença. A vida cotidiana não é
          menor. Ela apenas fala baixo.
        </p>
        <p>
          Publicamos Decantações que procuram companhia para a atenção. Sem
          pressa de concluir, sem desejo de vencer a conversa, sem transformar
          cada tema em mercadoria de urgência.
        </p>
      </div>
    </div>
  );
}
