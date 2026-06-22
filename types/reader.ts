export interface Reader {
  id: string;
  nome?: string;
  email?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ReaderPreferences {
  readerId: string;
  receberNovidades: boolean;
  temaLeitura?: "claro";
}
