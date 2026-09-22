# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidato.spec.ts >> Fluxo do Candidato >> busca de vagas mostra os filtros
- Location: tests\candidato.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /^filtrar$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('button', { name: /^filtrar$/i }) with timeout 5000ms
  - waiting for getByRole('button', { name: /^filtrar$/i })

```

```yaml
- link "Vagas na Rede":
  - /url: /
  - img "Vagas na Rede"
- heading "Entrar" [level=1]
- paragraph: Acesse sua conta no Vagas na Rede.
- text: E-mail
- textbox
- text: Senha
- textbox
- button "Entrar"
- link "Ainda não tem conta? Fale com a gente":
  - /url: https://wa.me/undefined
  - img
  - text: Ainda não tem conta? Fale com a gente
- alert
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | import { emailUnico, cadastrarCandidato } from "./helpers";
  3  | 
  4  | test.describe("Fluxo do Candidato", () => {
  5  |   const email = emailUnico("candidato");
  6  |   const senha = "senhaTeste12345";
  7  | 
  8  |   test("cadastro completo e cai no painel", async ({ page }) => {
  9  |     await cadastrarCandidato(page, email, senha);
  10 |     await expect(page.getByRole("heading", { name: /bem-vindo/i })).toBeVisible();
  11 |     await expect(page.getByText(/completude do perfil/i)).toBeVisible();
  12 |   });
  13 | 
  14 |   test("preenche e salva o perfil", async ({ page }) => {
  15 |     await page.goto("/login");
  16 |     await page.locator('input[type="email"]').fill(email);
  17 |     await page.locator('input[type="password"]').fill(senha);
  18 |     await page.getByRole("button", { name: /entrar/i }).click();
  19 |     await page.goto("/candidato/perfil");
  20 | 
  21 |     await page.locator('input[type="tel"]').fill("61988887777");
  22 |     await page.locator('input[type="url"]').first().fill("https://linkedin.com/in/teste");
  23 |     await page.getByRole("button", { name: /salvar perfil/i }).click();
  24 |     await expect(page.getByText(/perfil atualizado com sucesso/i)).toBeVisible();
  25 |   });
  26 | 
  27 |   test("adiciona uma skill", async ({ page }) => {
  28 |     await page.goto("/login");
  29 |     await page.locator('input[type="email"]').fill(email);
  30 |     await page.locator('input[type="password"]').fill(senha);
  31 |     await page.getByRole("button", { name: /entrar/i }).click();
  32 |     await page.goto("/candidato/skills");
  33 | 
  34 |     await page.getByPlaceholder(/ex: react/i).fill("TypeScript");
  35 |     await page.getByRole("button", { name: /^adicionar$/i }).click();
  36 |     await expect(page.getByText("typescript")).toBeVisible({ timeout: 5000 });
  37 |   });
  38 | 
  39 |   test("busca de vagas mostra os filtros", async ({ page }) => {
  40 |     await page.goto("/login");
  41 |     await page.locator('input[type="email"]').fill(email);
  42 |     await page.locator('input[type="password"]').fill(senha);
  43 |     await page.getByRole("button", { name: /entrar/i }).click();
  44 |     await page.goto("/candidato/vagas");
  45 | 
> 46 |     await expect(page.getByRole("button", { name: /^filtrar$/i })).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  47 |   });
  48 | });
  49 | 
```