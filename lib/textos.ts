import {
  formatarAnoEditorial,
  formatarDataEditorial,
  formatarMesEditorial,
  formatarNumeroDecantacao,
  getAllDecantacoes,
  getDecantacaoBySlug,
  getPublishedDecantacaoSlugs,
  type Decantacao,
} from "./decantacoes";

export type Texto = Decantacao & {
  content: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  readingTime: number;
};

function toTexto(decantacao: Decantacao): Texto {
  const readingTime = Number.parseInt(decantacao.tempoLeitura, 10);

  return {
    ...decantacao,
    content: decantacao.conteudo,
    title: decantacao.titulo,
    subtitle: decantacao.trecho,
    date: decantacao.data,
    description: decantacao.trecho,
    readingTime: Number.isNaN(readingTime) ? 1 : readingTime,
  };
}

export function estimateReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));
}

export function getTextoSlugs() {
  return getPublishedDecantacaoSlugs();
}

export function getTextoBySlug(slug: string): Texto {
  return toTexto(getDecantacaoBySlug(slug));
}

export function getAllTextos() {
  return getAllDecantacoes().map(toTexto);
}

export function getDecantacaoNumber(slug: string) {
  return `#${String(getDecantacaoBySlug(slug).numero).padStart(3, "0")}`;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function formatDateUpper(date: string) {
  return formatarDataEditorial(date);
}

export function formatMonth(date: string) {
  return formatarMesEditorial(date);
}

export function formatYear(date: string) {
  return formatarAnoEditorial(date);
}

export { formatarNumeroDecantacao };
