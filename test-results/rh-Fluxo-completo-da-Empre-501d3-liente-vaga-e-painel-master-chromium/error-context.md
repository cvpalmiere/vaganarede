# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rh.spec.ts >> Fluxo completo da Empresa de RH >> cadastro, aprovacao, empresa-cliente, vaga e painel master
- Location: tests\rh.spec.ts:5:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /pendente-aprovacao/
Received string:  "http://localhost:3000/cadastro?tipo=EMPRESA_RH"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    33 × locator resolved to <html lang="pt-BR">…</html>
       - unexpected value "http://localhost:3000/cadastro?tipo=EMPRESA_RH"

```

```yaml
- banner:
  - link "Vagas na Rede":
    - /url: /
    - img "Vagas na Rede"
- main:
  - button "<- Voltar e mudar perfil"
  - heading "Cadastro Corporativo" [level=2]
  - paragraph: Muitas tentativas de cadastro. Tente novamente mais tarde.
  - text: Nome da Empresa
  - textbox: Empresa Teste E2E LTDA
  - text: E-mail
  - textbox: rh-1791467701755-49256@teste-e2e.local
  - text: Senha
  - textbox: senhaTeste12345
  - text: CNPJ
  - textbox "00.000.000/0000-00": 83.677.035/1648-90
  - text: Telefone / WhatsApp
  - textbox "(00) 00000-0000": (61) 99999-9999
  - text: Cidade Sede
  - textbox: Brasilia
  - checkbox "Li e aceito os Termos de Uso e a Politica de Privacidade." [checked]
  - text: Li e aceito os
  - link "Termos de Uso":
    - /url: /termos
  - text: e a
  - link "Politica de Privacidade":
    - /url: /privacidade
  - text: .
  - button "Criar Conta"
- contentinfo: Vagas na Rede — Todos os direitos reservados.
- alert
```

# Test source

```ts
  1  | ﻿import { Page, APIRequestContext, expect } from "@playwright/test";
  2  | 
  3  | export function emailUnico(prefixo: string) {
  4  |   return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 100000)}@teste-e2e.local`;
  5  | }
  6  | 
  7  | function calcDv(nums: number[], pesos: number[]) {
  8  |   const soma = nums.reduce((acc, n, i) => acc + n * pesos[i], 0);
  9  |   const resto = soma % 11;
  10 |   return resto < 2 ? 0 : 11 - resto;
  11 | }
  12 | 
  13 | export function cnpjValido(): string {
  14 |   const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  15 |   const d1 = calcDv(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  16 |   const d2 = calcDv([...base, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  17 |   return [...base, d1, d2].join("");
  18 | }
  19 | 
  20 | export function cpfValido(): string {
  21 |   const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  22 |   const d1 = calcDv(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  23 |   const d2 = calcDv([...base, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  24 |   return [...base, d1, d2].join("");
  25 | }
  26 | 
  27 | export async function cadastrarCandidato(page: Page) {
  28 |   const email = emailUnico("candidato");
  29 |   const senha = "senhaTeste12345";
  30 | 
  31 |   await page.goto("/cadastro");
  32 |   await page.getByText("Sou Estudante").click();
  33 |   await page.locator('[name="nome"]').fill("Candidato Teste E2E");
  34 |   await page.locator('[name="email"]').fill(email);
  35 |   await page.locator('[name="senha"]').fill(senha);
  36 |   await page.locator('[name="cpf"]').fill(cpfValido());
  37 |   await page.locator('select[name="escolaridade"]').selectOption("Superior Completo");
  38 |   await page.locator('[name="curso"]').fill("Engenharia de Software");
  39 |   await page.locator('[name="aceiteTermos"]').check();
  40 |   await page.getByRole("button", { name: /criar conta/i }).click();
  41 |   await expect(page).toHaveURL(/\/candidato/, { timeout: 15000 });
  42 | 
  43 |   return { email, senha };
  44 | }
  45 | 
  46 | export async function cadastrarEmpresa(page: Page, tipo: "EMPRESA" | "EMPRESA_RH") {
  47 |   const email = emailUnico(tipo === "EMPRESA" ? "empresa" : "rh");
  48 |   const senha = "senhaTeste12345";
  49 | 
  50 |   await page.goto(`/cadastro?tipo=${tipo}`);
  51 |   await page.locator('[name="nome"]').fill("Empresa Teste E2E LTDA");
  52 |   await page.locator('[name="email"]').fill(email);
  53 |   await page.locator('[name="senha"]').fill(senha);
  54 |   await page.locator('[name="cnpj"]').fill(cnpjValido());
  55 |   await page.locator('[name="telefone"]').fill("61999999999");
  56 |   await page.locator('[name="cidade"]').fill("Brasilia");
  57 |   await page.locator('[name="aceiteTermos"]').check();
  58 |   await page.getByRole("button", { name: /criar conta/i }).click();
> 59 |   await expect(page).toHaveURL(/pendente-aprovacao/, { timeout: 15000 });
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  60 | 
  61 |   return { email, senha };
  62 | }
  63 | 
  64 | export async function login(page: Page, email: string, senha: string) {
  65 |   await page.goto("/login");
  66 |   await page.locator('input[type="email"]').fill(email);
  67 |   await page.locator('input[type="password"]').fill(senha);
  68 |   await page.getByRole("button", { name: /entrar/i }).click();
  69 |   await page.waitForLoadState("networkidle");
  70 | }
  71 | 
  72 | export async function loginAdmin(page: Page) {
  73 |   await login(page, process.env.SEED_ADMIN_EMAIL!, process.env.SEED_ADMIN_SENHA!);
  74 |   await expect(page).toHaveURL(/\/admin/, { timeout: 15000 });
  75 | }
  76 | 
  77 | // aprova empresa/RH direto pela API, autenticado como admin - usado so para preparar cenario de teste,
  78 | // nao substitui o teste de clique real que existe em tests/admin.spec.ts
  79 | export async function aprovarComoAdmin(request: APIRequestContext, tipo: "EMPRESA" | "EMPRESA_RH", email: string) {
  80 |   const loginResp = await request.post("/api/auth/login", {
  81 |     data: { email: process.env.SEED_ADMIN_EMAIL, senha: process.env.SEED_ADMIN_SENHA },
  82 |   });
  83 |   expect(loginResp.ok()).toBeTruthy();
  84 | 
  85 |   const listaResp = await request.get("/api/admin/empresas");
  86 |   const lista = await listaResp.json();
  87 |   const colecao = tipo === "EMPRESA" ? lista.empresas : lista.empresasRh;
  88 |   const item = colecao.find((e: { usuario: { email: string } }) => e.usuario.email === email);
  89 |   expect(item, `empresa com email ${email} nao encontrada na lista do admin`).toBeTruthy();
  90 | 
  91 |   const patchResp = await request.patch("/api/admin/empresas", {
  92 |     data: { tipo, id: item.id, aprovado: true },
  93 |   });
  94 |   expect(patchResp.ok()).toBeTruthy();
  95 | }
  96 | 
```