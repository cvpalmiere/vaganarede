# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rh.spec.ts >> Fluxo completo da Empresa de RH >> cadastro, aprovacao, empresa-cliente, vaga e painel master
- Location: tests\rh.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /cadastro em analise/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /cadastro em analise/i }) with timeout 5000ms
  - waiting for getByRole('heading', { name: /cadastro em analise/i })

```

```yaml
- alert
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | import { cadastrarEmpresa, login, aprovarComoAdmin, cnpjValido } from "./helpers";
  3  | 
  4  | test.describe("Fluxo completo da Empresa de RH", () => {
  5  |   test("cadastro, aprovacao, empresa-cliente, vaga e painel master", async ({ page, request }) => {
  6  |     const { email, senha } = await cadastrarEmpresa(page, "EMPRESA_RH");
> 7  |     await expect(page.getByRole("heading", { name: /cadastro em analise/i })).toBeVisible();
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  8  | 
  9  |     await aprovarComoAdmin(request, "EMPRESA_RH", email);
  10 |     await login(page, email, senha);
  11 |     await expect(page).toHaveURL(/\/rh/);
  12 | 
  13 |     await page.goto("/rh/empresas-cliente");
  14 |     await page.getByRole("button", { name: /nova empresa-cliente/i }).click();
  15 |     await page.locator('input').nth(0).fill("Cliente Teste E2E LTDA");
  16 |     await page.locator('input').nth(1).fill(cnpjValido());
  17 |     await page.locator('input').nth(2).fill("61977776666");
  18 |     await page.locator('input').nth(3).fill("Goiania");
  19 |     await page.getByRole("button", { name: /^criar$/i }).click();
  20 |     await expect(page.getByText("Cliente Teste E2E LTDA")).toBeVisible({ timeout: 5000 });
  21 | 
  22 |     await page.goto("/rh/vagas/nova");
  23 |     await page.getByRole("combobox").first().selectOption({ label: "Cliente Teste E2E LTDA" });
  24 |     await page.locator('input').nth(1).fill("Analista de RH Teste E2E");
  25 |     await page.locator("textarea").fill("Vaga de teste automatizado com descricao de pelo menos vinte caracteres.");
  26 |     await page.locator('input[type="text"]').last().fill("Goiania");
  27 |     await page.getByRole("button", { name: /publicar vaga/i }).click();
  28 |     await expect(page).toHaveURL(/\/rh\/vagas$/);
  29 |     await expect(page.getByText("Analista de RH Teste E2E")).toBeVisible();
  30 | 
  31 |     await page.goto("/rh");
  32 |     await expect(page.getByText(/empresas-cliente/i)).toBeVisible();
  33 |   });
  34 | });
  35 | 
```