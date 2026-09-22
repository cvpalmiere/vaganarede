import { Page, expect } from "@playwright/test";

export function emailUnico(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 10000)}@teste-e2e.local`;
}

export function cnpjValido() {
  const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  const calcularDigito = (nums: number[], pesos: number[]) => {
    const soma = nums.reduce((acc, n, i) => acc + n * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const d1 = calcularDigito(base, pesos1);
  const d2 = calcularDigito([...base, d1], pesos2);
  return [...base, d1, d2].join("");
}

export function cpfValido() {
  const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calc = (base: number[], pesos: number[]) => {
    const soma = base.reduce((acc, n, i) => acc + n * pesos[i], 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = calc(nums, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc([...nums, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...nums, d1, d2].join("");
}

export async function cadastrarCandidato(page: Page, email: string, senha: string) {
  await page.goto("/cadastro");
  await page.getByText("Sou Estudante").click();
  await page.locator('[name="nome"]').fill("Candidato Teste E2E");
  await page.locator('[name="email"]').fill(email);
  await page.locator('[name="senha"]').fill(senha);
  await page.locator('[name="cpf"]').fill(cpfValido());
  await page.locator('select[name="escolaridade"]').selectOption("Superior Completo");
  await page.locator('[name="curso"]').fill("Engenharia de Software");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/candidato/, { timeout: 15000 });
}

export async function cadastrarEmpresa(page: Page, email: string, senha: string, tipo: "EMPRESA" | "EMPRESA_RH" = "EMPRESA") {
  await page.goto(`/cadastro?tipo=${tipo}`);
  await page.locator('[name="nome"]').fill("Empresa Teste E2E LTDA");
  await page.locator('[name="email"]').fill(email);
  await page.locator('[name="senha"]').fill(senha);
  await page.locator('[name="cnpj"]').fill(cnpjValido());
  await page.locator('[name="telefone"]').fill("61999999999");
  await page.locator('[name="cidade"]').fill("Brasilia");
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/(empresa|rh)\/assinatura/, { timeout: 15000 });
}

export async function login(page: Page, email: string, senha: string) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(senha);
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForLoadState("networkidle");
}

