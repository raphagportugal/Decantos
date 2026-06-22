export type AuthorRole = "autor" | "curador";

export interface Author {
  id: string;
  nome: string;
  assinatura: string;
  bio?: string;
  role: AuthorRole;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Curador extends Author {
  role: "curador";
  podePublicar: boolean;
  podeEditarAcervo: boolean;
}
