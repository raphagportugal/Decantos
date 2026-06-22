import fs from "node:fs";
import path from "node:path";

const decantacoesDirectory = path.join(process.cwd(), "content", "textos");
const WORDS_PER_MINUTE = 200;

export type DecantacaoFrontmatter = {
  numero: number;
  titulo: string;
  data: string;
  tempoLeitura?: string;
  trecho: string;
  publicado: boolean;
};

// Mesa de Escrita futura (/mesa): gerar este modelo editorial sem editar MDX manualmente.
export type Decantacao = Omit<DecantacaoFrontmatter, "tempoLeitura"> & {
  slug: string;
  conteudo: string;
  tempoLeitura: string;
  tempoLeituraCalculado: string;
  tempoLeituraEditorial: string;
};

export type ArquivoMes = {
  mes: string;
  decantacoes: Decantacao[];
};

export type ArquivoAno = {
  ano: string;
  meses: ArquivoMes[];
};

function contarPalavras(conteudo: string) {
  return conteudo
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function calcularTempoLeitura(conteudo: string) {
  const minutos = Math.max(1, Math.ceil(contarPalavras(conteudo) / WORDS_PER_MINUTE));

  return `${minutos} min`;
}

function parseFrontmatter(source: string, slug: string) {
  const match = source.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Frontmatter ausente em ${slug}.mdx`);
  }

  const [, rawFrontmatter, conteudo] = match;
  validarConteudoSemMojibake(conteudo, slug);
  const data: Record<string, string> = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    data[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return { data, conteudo };
}

function validarConteudoSemMojibake(conteudo: string, slug: string) {
  const sinaisDeMojibake = ["Ã", "Â", "â€"];
  const sinalEncontrado = sinaisDeMojibake.find((sinal) => conteudo.includes(sinal));

  if (sinalEncontrado) {
    throw new Error(`Possível mojibake detectado no conteúdo de ${slug}.mdx: "${sinalEncontrado}"`);
  }
}

function getString(data: Record<string, unknown>, field: keyof DecantacaoFrontmatter, slug: string) {
  const value = data[field];

  if (typeof value !== "string" || !value) {
    throw new Error(`Frontmatter "${field}" ausente ou inválido em ${slug}.mdx`);
  }

  return value;
}

function getOptionalString(data: Record<string, unknown>, field: keyof DecantacaoFrontmatter) {
  const value = data[field];

  return typeof value === "string" && value ? value : undefined;
}

function getNumber(data: Record<string, unknown>, field: keyof DecantacaoFrontmatter, slug: string) {
  const value = Number(data[field]);

  if (!Number.isInteger(value)) {
    throw new Error(`Frontmatter "${field}" precisa ser inteiro em ${slug}.mdx`);
  }

  return value;
}

function getBoolean(data: Record<string, unknown>, field: keyof DecantacaoFrontmatter, slug: string) {
  const value = data[field];

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Frontmatter "${field}" precisa ser booleano em ${slug}.mdx`);
}

function assertDecantacaoFrontmatter(
  data: Record<string, unknown>,
  slug: string,
): DecantacaoFrontmatter {
  const date = getString(data, "data", slug);

  if (Number.isNaN(new Date(date).getTime())) {
    throw new Error(`Frontmatter "data" precisa estar em formato ISO em ${slug}.mdx`);
  }

  return {
    numero: getNumber(data, "numero", slug),
    titulo: getString(data, "titulo", slug),
    data: date,
    tempoLeitura: getOptionalString(data, "tempoLeitura"),
    trecho: getString(data, "trecho", slug),
    publicado: getBoolean(data, "publicado", slug),
  };
}

function getDecantacaoSlugs() {
  if (!fs.existsSync(decantacoesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(decantacoesDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function ordenarPorDataMaisRecente(a: Decantacao, b: Decantacao) {
  return new Date(b.data).getTime() - new Date(a.data).getTime();
}

function ordenarPorNumero(a: Decantacao, b: Decantacao) {
  return a.numero - b.numero;
}

function formatarTempoLeituraEditorial(tempoLeitura: string) {
  return `${tempoLeitura.replace(/\s+/g, " ").trim().toLocaleUpperCase("pt-BR")} DE LEITURA`;
}

export function formatarNumeroDecantacao(numero: number) {
  return `DECANTAÇÃO #${String(numero).padStart(3, "0")}`;
}

export function formatarDataEditorial(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(data))
    .toLocaleUpperCase("pt-BR");
}

export function formatarMesEditorial(data: string) {
  const mes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(data));

  return mes.charAt(0).toLocaleUpperCase("pt-BR") + mes.slice(1);
}

export function formatarAnoEditorial(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(data));
}

export function getDecantacaoBySlug(slug: string): Decantacao {
  const fullPath = path.join(decantacoesDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, conteudo } = parseFrontmatter(source, slug);
  const frontmatter = assertDecantacaoFrontmatter(data, slug);
  const tempoLeituraCalculado = calcularTempoLeitura(conteudo);
  const tempoLeitura = frontmatter.tempoLeitura ?? tempoLeituraCalculado;

  return {
    ...frontmatter,
    slug,
    conteudo,
    tempoLeitura,
    tempoLeituraCalculado,
    tempoLeituraEditorial: formatarTempoLeituraEditorial(tempoLeitura),
  };
}

export function getAllDecantacoes() {
  return getDecantacaoSlugs().map(getDecantacaoBySlug).sort(ordenarPorDataMaisRecente);
}

export function getPublishedDecantacoes() {
  return getAllDecantacoes().filter((decantacao) => decantacao.publicado);
}

export function getLatestDecantacao() {
  return getPublishedDecantacoes()[0] ?? null;
}

export function getArquivoCronologico() {
  const groups: ArquivoAno[] = [];

  for (const decantacao of getPublishedDecantacoes()) {
    const ano = formatarAnoEditorial(decantacao.data);
    const mes = formatarMesEditorial(decantacao.data);
    let yearGroup = groups.find((group) => group.ano === ano);

    if (!yearGroup) {
      yearGroup = { ano, meses: [] };
      groups.push(yearGroup);
    }

    let monthGroup = yearGroup.meses.find((group) => group.mes === mes);

    if (!monthGroup) {
      monthGroup = { mes, decantacoes: [] };
      yearGroup.meses.push(monthGroup);
    }

    monthGroup.decantacoes.push(decantacao);
  }

  for (const yearGroup of groups) {
    for (const monthGroup of yearGroup.meses) {
      monthGroup.decantacoes.sort(ordenarPorNumero);
    }
  }

  return groups;
}

export function getPublishedDecantacaoSlugs() {
  return getPublishedDecantacoes().map((decantacao) => decantacao.slug);
}
