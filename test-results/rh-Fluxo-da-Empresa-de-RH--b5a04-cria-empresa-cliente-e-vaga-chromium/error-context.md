# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rh.spec.ts >> Fluxo da Empresa de RH >> apos ativar assinatura, cria empresa-cliente e vaga
- Location: tests\rh.spec.ts:14:7

# Error details

```
Error: Command failed: npx tsx scripts/ativar-assinatura-teste.ts rh-1790033312773-2713@teste-e2e.local
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | import { emailUnico, cadastrarEmpresa, login } from "./helpers";
  3  | import { execSync } from "child_process";
  4  | 
  5  | test.describe("Fluxo da Empresa de RH", () => {
  6  |   const email = emailUnico("rh");
  7  |   const senha = "senhaTeste12345";
  8  | 
  9  |   test("cadastro cai no paywall da RH", async ({ page }) => {
  10 |     await cadastrarEmpresa(page, email, senha, "EMPRESA_RH");
  11 |     await expect(page.getByRole("button", { name: /assinar agora/i })).toBeVisible();
  12 |   });
  13 | 
  14 |   test("apos ativar assinatura, cria empresa-cliente e vaga", async ({ page }) => {
> 15 |     execSync(`npx tsx scripts/ativar-assinatura-teste.ts ${email}`, { stdio: "inherit" });
     |             ^ Error: Command failed: npx tsx scripts/ativar-assinatura-teste.ts rh-1790033312773-2713@teste-e2e.local
  16 | 
  17 |     await login(page, email, senha);
  18 |     await page.goto("/rh/empresas-cliente");
  19 |     await page.getByRole("button", { name: /nova empresa-cliente/i }).click();
  20 | 
  21 |     await page.locator('input').nth(0).fill("Cliente Teste E2E LTDA");
  22 |     await page.locator('input').nth(1).fill("11444777000161");
  23 |     await page.locator('input').nth(2).fill("61977776666");
  24 |     await page.locator('input').nth(3).fill("Goiania");
  25 |     await page.getByRole("button", { name: /^criar$/i }).click();
  26 | 
  27 |     await expect(page.getByText("Cliente Teste E2E LTDA")).toBeVisible({ timeout: 5000 });
  28 | 
  29 |     await page.goto("/rh/vagas/nova");
  30 |     await page.getByRole("combobox").first().selectOption({ label: "Cliente Teste E2E LTDA" });
  31 |     await page.locator('input').nth(1).fill("Analista de RH");
  32 |     await page.locator("textarea").fill("Vaga de teste automatizado com descricao minima de vinte caracteres.");
  33 |     await page.locator('input[type="text"]').last().fill("Goiania");
  34 |     await page.getByRole("button", { name: /publicar vaga/i }).click();
  35 | 
  36 |     await expect(page).toHaveURL(/\/rh\/vagas$/);
  37 |   });
  38 | 
  39 |   test("painel master mostra pelo menos 1 cliente", async ({ page }) => {
  40 |     await login(page, email, senha);
  41 |     await page.goto("/rh");
  42 |     await expect(page.getByText(/empresas-cliente/i)).toBeVisible();
  43 |   });
  44 | });
  45 | 
```