import Link from "next/link";

type LogoProps = {
  variante?: "preto" | "branco";
  altura?: number;
  semLink?: boolean;
};

export function Logo({ variante = "branco", altura = 22, semLink = false }: LogoProps) {
  const src = variante === "branco" ? "/logo-branco.png" : "/logo-preto.png";
  const imagem = <img src={src} alt="Vagas na Rede" style={{ height: altura, width: "auto" }} />;

  if (semLink) return imagem;

  return (
    <Link href="/" className="inline-flex items-center">
      {imagem}
    </Link>
  );
}