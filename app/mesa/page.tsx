import type { Metadata } from "next";
import { MesaDeEscrita } from "./MesaDeEscrita";

export const metadata: Metadata = {
  title: "Mesa de Escrita",
  description: "Uma superfície silenciosa para rascunhar uma nova Decantação.",
};

export default function MesaPage() {
  return <MesaDeEscrita />;
}
