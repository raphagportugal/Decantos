import fs from "node:fs";
import path from "node:path";

const textosDirectory = path.join(process.cwd(), "content", "textos");

export type TextoFrontmatter = {
  title: string;
  subtitle: string;
  date: string;
  category: string;
  description: string;
};

export type Texto = TextoFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};

function countWords(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function parseFrontmatter(source: string, slug: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Frontmatter ausente em ${slug}.mdx`);
  }

  const [, rawFrontmatter, content] = match;
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

  return { data, content };
}

export function estimateReadingTime(content: string) {
  return Math.max(1, Math.ceil(countWords(content) / 210));
}

function assertFrontmatter(data: Record<string, unknown>, slug: string): TextoFrontmatter {
  function getString(field: keyof TextoFrontmatter) {
    const value = data[field];

    if (typeof value !== "string" || !value) {
      throw new Error(`Frontmatter "${field}" ausente ou invalido em ${slug}.mdx`);
    }

    return value;
  }

  return {
    title: getString("title"),
    subtitle: getString("subtitle"),
    date: getString("date"),
    category: getString("category"),
    description: getString("description"),
  };
}

export function getTextoSlugs() {
  if (!fs.existsSync(textosDirectory)) {
    return [];
  }

  return fs
    .readdirSync(textosDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getTextoBySlug(slug: string): Texto {
  const fullPath = path.join(textosDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseFrontmatter(source, slug);
  const frontmatter = assertFrontmatter(data, slug);

  return {
    ...frontmatter,
    slug,
    content,
    readingTime: estimateReadingTime(content),
  };
}

export function getAllTextos() {
  return getTextoSlugs()
    .map(getTextoBySlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDecantacaoNumber(slug: string) {
  const orderedTextos = getAllTextos().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const index = orderedTextos.findIndex((texto) => texto.slug === slug);

  return `#${String(index + 1).padStart(3, "0")}`;
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
  return formatDate(date).toLocaleUpperCase("pt-BR");
}
