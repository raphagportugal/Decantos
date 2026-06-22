export interface Favorito {
  id: string;
  readerId: string;
  decantacaoId: string;
  criadoEm: string;
}

export interface FavoritoResumo {
  decantacaoId: string;
  total: number;
}
