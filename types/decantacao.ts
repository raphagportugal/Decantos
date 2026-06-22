export type DecantacaoStatus = "rascunho" | "em_revisao" | "publicada" | "arquivada";

export interface Decantacao {
  id: string;
  slug: string;
  numero: number;
  titulo: string;
  trecho: string;
  conteudo: string;
  dataPublicacao?: string;
  tempoLeitura: string;
  status: DecantacaoStatus;
  authorId: string;
  curadorId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DecantacaoDraft {
  titulo: string;
  trecho: string;
  conteudo: string;
  authorId: string;
}

export interface DecantacaoPublicada extends Decantacao {
  status: "publicada";
  dataPublicacao: string;
}
