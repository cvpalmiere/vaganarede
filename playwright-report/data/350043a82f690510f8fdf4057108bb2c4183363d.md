# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidato.spec.ts >> Fluxo do Candidato >> cadastro completo e cai no painel
- Location: tests\candidato.spec.ts:8:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/candidato/
Received string:  "http://localhost:3000/cadastro"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    33 × locator resolved to <html lang="pt-BR">…</html>
       - unexpected value "http://localhost:3000/cadastro"

```

```yaml
- banner:
  - link "Vagas na Rede":
    - /url: /
    - img "Vagas na Rede"
- main:
  - button "← Voltar e mudar perfil"
  - heading "Cadastro de Estudante" [level=2]
  - paragraph: CNPJ ou CPF ja cadastrado
  - text: Nome Completo
  - textbox: Candidato Teste E2E
  - text: E-mail
  - textbox: candidato-1790032944210-3916@teste-e2e.local
  - text: Senha
  - textbox: senhaTeste12345
  - text: CPF
  - textbox: "12345678909"
  - text: Nível de Escolaridade
  - combobox:
    - option "Selecione..."
    - option "Ensino Médio"
    - option "Técnico"
    - option "Superior Incompleto"
    - option "Superior Completo" [selected]
  - text: Curso
  - 'textbox "Ex: Engenharia de Software"': Engenharia de Software
  - button "Criar Conta"
- contentinfo: Vagas na Rede — Todos os direitos reservados.
- alert
```

# Test source

```ts
  1  | ﻿import { Page, expect } from "@playwright/test";
  2  | 
  3  | export function emailUnico(prefixo: string) {
  4  |   return `${prefixo}-${Date.now()}-${Math.floor(Math.random() * 10000)}@teste-e2e.local`;
  5  | }
  6  | 
  7  | export function cnpjValido() {
  8  |   const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  9  |   const calcularDigito = (nums: number[], pesos: number[]) => {
  10 |     const soma = nums.reduce((acc, n, i) => acc + n * pesos[i], 0);
  11 |     const resto = soma % 11;
  12 |     return resto < 2 ? 0 : 11 - resto;
  13 |   };
  14 |   const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  15 |   const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  16 |   const d1 = calcularDigito(base, pesos1);
  17 |   const d2 = calcularDigito([...base, d1], pesos2);
  18 |   return [...base, d1, d2].join("");
  19 | }
  20 | 
  21 | export async function cadastrarCandidato(page: Page, email: string, senha: string) {
  22 |   await page.goto("/cadastro");
  23 |   await page.getByText("Sou Estudante").click();
  24 |   await page.locator('[name="nome"]').fill("Candidato Teste E2E");
  25 |   await page.locator('[name="email"]').fill(email);
  26 |   await page.locator('[name="senha"]').fill(senha);
  27 |   await page.locator('[name="cpf"]').fill("12345678909");
  28 |   await page.locator('select[name="escolaridade"]').selectOption("Superior Completo");
  29 |   await page.locator('[name="curso"]').fill("Engenharia de Software");
  30 |   await page.getByRole("button", { name: /criar conta/i }).click();
> 31 |   await expect(page).toHaveURL(/\/candidato/, { timeout: 15000 });
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  32 | }
  33 | 
  34 | export async function cadastrarEmpresa(page: Page, email: string, senha: string, tipo: "EMPRESA" | "EMPRESA_RH" = "EMPRESA") {
  35 |   await page.goto(`/cadastro?tipo=${tipo}`);
  36 |   await page.locator('[name="nome"]').fill("Empresa Teste E2E LTDA");
  37 |   await page.locator('[name="email"]').fill(email);
  38 |   await page.locator('[name="senha"]').fill(senha);
  39 |   await page.locator('[name="cnpj"]').fill(cnpjValido());
  40 |   await page.locator('[name="telefone"]').fill("61999999999");
  41 |   await page.locator('[name="cidade"]').fill("Brasilia");
  42 |   await page.getByRole("button", { name: /criar conta/i }).click();
  43 |   await expect(page).toHaveURL(/\/(empresa|rh)\/assinatura/, { timeout: 15000 });
  44 | }
  45 | 
  46 | export async function login(page: Page, email: string, senha: string) {
  47 |   await page.goto("/login");
  48 |   await page.locator('input[type="email"]').fill(email);
  49 |   await page.locator('input[type="password"]').fill(senha);
  50 |   await page.getByRole("button", { name: /entrar/i }).click();
  51 |   await page.waitForLoadState("networkidle");
  52 | }
  53 | 
```