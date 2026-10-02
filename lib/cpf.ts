// valida formato + digitos verificadores do CPF - mesma logica do CNPJ, pesos diferentes
export function validarCpf(cpfBruto: string): boolean {
  const cpf = cpfBruto.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce((acc, digito, i) => acc + Number(digito) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  const digito1 = calcularDigito(cpf.slice(0, 9), pesos1);
  const digito2 = calcularDigito(cpf.slice(0, 9) + digito1, pesos2);

  return cpf.endsWith(`${digito1}${digito2}`);
}

export function normalizarCpf(valor: string): string {
  return valor.replace(/\D/g, "");
}
