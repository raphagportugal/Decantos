import { permanentRedirect } from "next/navigation";

type LegacyTextoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyTextoPage({ params }: LegacyTextoPageProps) {
  const { slug } = await params;

  permanentRedirect(`/decantacoes/${slug}`);
}
