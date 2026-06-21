import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "O gesto editorial de Decantos: desacelerar, reparar e devolver espessura ao vivido.",
};

export default function ManifestoPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <PageIntro eyebrow="Manifesto" title="Contra a vida que passa sem assentar">
        <p>
          Decantos nasce da suspeita de que nem tudo precisa virar opiniao
          imediata, desempenho publico ou ruído. Algumas experiencias pedem
          repouso antes de se tornarem linguagem.
        </p>
      </PageIntro>

      <div className="prose-decantos mt-14 max-w-3xl">
        <p>
          Decantar e permitir que o excesso desça. E separar o que turva do que
          permanece. Num tempo que premia a reacao, escolhemos o ensaio: uma
          forma imperfeita, paciente, capaz de pensar enquanto caminha.
        </p>
        <p>
          Aqui, cultura nao e ornamento; e modo de perceber. Filosofia nao e
          torre; e pergunta feita dentro da cozinha, no transporte, diante de
          uma lembranca que voltou sem pedir licenca. A vida cotidiana nao e
          menor. Ela apenas fala baixo.
        </p>
        <p>
          Publicamos textos que procuram companhia para a atencao. Sem pressa
          de concluir, sem desejo de vencer a conversa, sem transformar cada
          tema em mercadoria de urgencia.
        </p>
      </div>
    </div>
  );
}
