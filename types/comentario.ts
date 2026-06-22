export type ComentarioStatus = "pendente" | "aprovado" | "oculto";

export interface Comentario {
  id: string;
  decantacaoId: string;
  readerId?: string;
  nomeLeitor?: string;
  corpo: string;
  status: ComentarioStatus;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ComentarioModeracao {
  comentarioId: string;
  curadorId: string;
  statusAnterior: ComentarioStatus;
  statusNovo: ComentarioStatus;
  motivo?: string;
  criadoEm: string;
}
