# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: empresa.spec.ts >> Fluxo da Empresa >> cadastro cai no paywall (assinatura pendente)
- Location: tests\empresa.spec.ts:9:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /ative seu plano/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /ative seu plano/i }) with timeout 5000ms
  - waiting for getByRole('heading', { name: /ative seu plano/i })

```

```yaml
- alert: Vagas na Rede
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | import { emailUnico, cadastrarEmpresa, login } from "./helpers";
  3  | import { execSync } from "child_process";
  4  | 
  5  | test.describe("Fluxo da Empresa", () => {
  6  |   const email = emailUnico("empresa");
  7  |   const senha = "senhaTeste12345";
  8  | 
  9  |   test("cadastro cai no paywall (assinatura pendente)", async ({ page }) => {
  10 |     await cadastrarEmpresa(page, email, senha, "EMPRESA");
> 11 |     await expect(page.getByRole("heading", { name: /ative seu plano/i })).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  12 |     await expect(page.getByRole("button", { name: /assinar agora/i })).toBeVisible();
  13 |   });
  14 | 
  15 |   test("botao assinar agora chama o endpoint de checkout", async ({ page }) => {
  16 |     await login(page, email, senha);
  17 |     await page.goto("/empresa/assinatura");
  18 | 
  19 |     const [resposta] = await Promise.all([
  20 |       page.waitForResponse((r) => r.url().includes("/api/stripe/checkout")),
  21 |       page.getByRole("button", { name: /assinar agora/i }).click(),
  22 |     ]);
  23 |     expect(resposta.status()).toBe(200);
  24 |   });
  25 | 
  26 |   test("acesso a /empresa/vagas continua bloqueado sem assinatura ativa", async ({ page }) => {
  27 |     await login(page, email, senha);
  28 |     await page.goto("/empresa/vagas");
  29 |     await expect(page).toHaveURL(/\/empresa\/assinatura/);
  30 |   });
  31 | 
  32 |   test("apos ativar assinatura (via script de apoio), consegue publicar vaga", async ({ page }) => {
  33 |     execSync(`npx tsx scripts/ativar-assinatura-teste.ts ${email}`, { stdio: "inherit" });
  34 | 
  35 |     await login(page, email, senha);
  36 |     await page.goto("/empresa/vagas/nova");
  37 | 
  38 |     await page.locator('input').first().fill("Desenvolvedor Frontend");
  39 |     await page.locator("textarea").fill("Vaga de teste automatizado com descricao minima de vinte caracteres.");
  40 |     await page.locator('input[type="text"]').last().fill("Brasilia");
  41 |     await page.getByRole("button", { name: /publicar vaga/i }).click();
  42 | 
  43 |     await expect(page).toHaveURL(/\/empresa\/vagas$/);
  44 |     await expect(page.getByText("Desenvolvedor Frontend")).toBeVisible();
  45 |   });
  46 | });
  47 | 
```