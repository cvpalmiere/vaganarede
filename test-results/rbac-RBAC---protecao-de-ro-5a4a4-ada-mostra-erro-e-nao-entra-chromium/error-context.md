# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac.spec.ts >> RBAC - protecao de rotas >> login com senha errada mostra erro e nao entra
- Location: tests\rbac.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/email ou senha invalidos/i)
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/email ou senha invalidos/i) with timeout 15000ms
  - waiting for getByText(/email ou senha invalidos/i)

```

```yaml
- link "Vagas na Rede":
  - /url: /
  - img "Vagas na Rede"
- heading "Entrar" [level=1]
- paragraph: Acesse sua conta no Vagas na Rede.
- text: E-mail
- textbox: naoexiste@teste-e2e.local
- text: Senha
- textbox: senhaerrada123
- paragraph: E-mail ou senha inválidos
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
  2  | 
  3  | test.describe("RBAC - protecao de rotas", () => {
  4  |   test("candidato deslogado e redirecionado para login", async ({ page }) => {
  5  |     await page.goto("/candidato");
  6  |     await expect(page).toHaveURL(/\/login/);
  7  |   });
  8  | 
  9  |   test("empresa deslogada e redirecionada para login", async ({ page }) => {
  10 |     await page.goto("/empresa/vagas");
  11 |     await expect(page).toHaveURL(/\/login/);
  12 |   });
  13 | 
  14 |   test("rh deslogado e redirecionado para login", async ({ page }) => {
  15 |     await page.goto("/rh");
  16 |     await expect(page).toHaveURL(/\/login/);
  17 |   });
  18 | 
  19 |   test("login com senha errada mostra erro e nao entra", async ({ page }) => {
  20 |     await page.goto("/login");
  21 |     await page.locator('input[type="email"]').fill("naoexiste@teste-e2e.local");
  22 |     await page.locator('input[type="password"]').fill("senhaerrada123");
  23 |     await page.getByRole("button", { name: /entrar/i }).click();
> 24 |     await expect(page.getByText(/email ou senha invalidos/i)).toBeVisible({ timeout: 15000 });
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  25 |     await expect(page).toHaveURL(/\/login/);
  26 |   });
  27 | });
  28 | 
  29 | 
```