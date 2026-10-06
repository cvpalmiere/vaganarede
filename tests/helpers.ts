import { Page, APIRequestContext, expect } from "@playwright/test";

export function emailUnico(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 100000)}@teste-e2e.local`;
}

function calcDv(nums: number[], pesos: number[]) {
  const soma = nums.reduce((acc, n, i) => acc + n * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cnpjValido(): string {
  const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  const d1 = calcDv(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcDv([...base, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...base, d1, d2].join("");
}

export function cpfValido(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = calcDv(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcDv([...base, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return [...base, d1, d2].join("");
}

export async function cadastrarCandidato(page: Page) {
  const email = emailUnico("candidato");
  const senha = "senhaTeste12345";

  await page.goto("/cadastro");
  await page.getByText("Sou Estudante").click();
  await page.locator('[name="nome"]').fill("Candidato Teste E2E");
  await page.locator('[name="email"]').fill(email);
  await page.locator('[name="senha"]').fill(senha);
  await page.locator('[name="cpf"]').fill(cpfValido());
  await page.locator('select[name="escolaridade"]').selectOption("Superior Completo");
  await page.locator('[name="curso"]').fill("Engenharia de Software");
  await page.locator('[name="aceiteTermos"]').check();
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/\/candidato/, { timeout: 15000 });

  return { email, senha };
}

export async function cadastrarEmpresa(page: Page, tipo: "EMPRESA" | "EMPRESA_RH") {
  const email = emailUnico(tipo === "EMPRESA" ? "empresa" : "rh");
  const senha = "senhaTeste12345";

  await page.goto(`/cadastro?tipo=${tipo}`);
  await page.locator('[name="nome"]').fill("Empresa Teste E2E LTDA");
  await page.locator('[name="email"]').fill(email);
  await page.locator('[name="senha"]').fill(senha);
  await page.locator('[name="cnpj"]').fill(cnpjValido());
  await page.locator('[name="telefone"]').fill("61999999999");
  await page.locator('[name="cidade"]').fill("Brasilia");
  await page.locator('[name="aceiteTermos"]').check();
  await page.getByRole("button", { name: /criar conta/i }).click();
  await expect(page).toHaveURL(/pendente-aprovacao/, { timeout: 15000 });

  return { email, senha };
}

export async function login(page: Page, email: string, senha: string) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(senha);
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForLoadState("networkidle");
}

export async function loginAdmin(page: Page) {
  await login(page, process.env.SEED_ADMIN_EMAIL!, process.env.SEED_ADMIN_SENHA!);
  await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });
}

// aprova empresa/RH direto pela API, autenticado como admin - usado so para preparar cenario de teste,
// nao substitui o teste de clique real que existe em tests/admin.spec.ts
export async function aprovarComoAdmin(request: APIRequestContext, tipo: "EMPRESA" | "EMPRESA_RH", email: string) {
  const loginResp = await request.post("/api/auth/login", {
    data: { email: process.env.SEED_ADMIN_EMAIL, senha: process.env.SEED_ADMIN_SENHA },
  });
  expect(loginResp.ok()).toBeTruthy();

  const listaResp = await request.get("/api/admin/empresas");
  const lista = await listaResp.json();
  const colecao = tipo === "EMPRESA" ? lista.empresas : lista.empresasRh;
  const item = colecao.find((e: { usuario: { email: string } }) => e.usuario.email === email);
  expect(item, `empresa com email ${email} nao encontrada na lista do admin`).toBeTruthy();

  const patchResp = await request.patch("/api/admin/empresas", {
    data: { tipo, id: item.id, aprovado: true },
  });
  expect(patchResp.ok()).toBeTruthy();
}
