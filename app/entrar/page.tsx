import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entrada reservada para autores autorizados do Decantos.",
};

export default function EntrarPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center px-5 py-16 sm:px-8">
      <section className="w-full max-w-xl border-t border-wine/25 pt-10">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-wine">
          Mesa de Escrita
        </p>
        <h1 className="font-serif text-5xl font-semibold leading-[0.98] text-foreground md:text-6xl">
          Entrar sem pressa
        </h1>
        <p className="mt-7 max-w-lg font-body text-lg leading-8 text-muted">
          A mesa é reservada a autores autorizados. Entre para continuar o
          rascunho de uma Decantação.
        </p>

        <LoginForm />
      </section>
    </div>
  );
}
