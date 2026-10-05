import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  variante?: "preto" | "branco";
  altura?: number;
  semLink?: boolean;
};

export function Logo({ variante = "branco", altura = 22, semLink = false }: LogoProps) {
  const src = variante === "branco" ? "/logo-branco.png" : "/logo-preto.png";
  const largura = Math.round(altura * 3.4); // proporcao aproximada do wordmark original

  const imagem = (
    <Image src={src} alt="Vagas na Rede" height={altura} width={largura} style={{ height: altura, width: "auto" }} priority />
  );

  if (semLink) return imagem;

  return (
    <Link href="/" className="inline-flex items-center">
      {imagem}
    </Link>
  );
}
