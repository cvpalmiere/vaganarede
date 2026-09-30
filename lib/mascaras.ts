// formata o valor enquanto a pessoa digita, sempre baseado so nos digitos - nunca deixa o campo ficar com pontuacao "presa"
export function formatarCnpj(valorBruto: string): string {
  const d = valorBruto.replace(/\D/g, "").slice(0, 14);
  if (d.length > 12) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5");
  if (d.length > 8) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4");
  if (d.length > 5) return d.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3");
  if (d.length > 2) return d.replace(/^(\d{2})(\d{1,3})$/, "$1.$2");
  return d;
}

export function formatarCpf(valorBruto: string): string {
  const d = valorBruto.replace(/\D/g, "").slice(0, 11);
  if (d.length > 9) return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  if (d.length > 6) return d.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
  if (d.length > 3) return d.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
  return d;
}

export function formatarTelefone(valorBruto: string): string {
  const d = valorBruto.replace(/\D/g, "").slice(0, 11);
  if (d.length > 10) return d.replace(/^(\d{2})(\d{5})(\d{1,4})$/, "($1) $2-$3");
  if (d.length > 6) return d.replace(/^(\d{2})(\d{4})(\d{1,4})$/, "($1) $2-$3");
  if (d.length > 2) return d.replace(/^(\d{2})(\d{1,5})$/, "($1) $2");
  return d;
}
