# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidato.spec.ts >> Fluxo completo do Candidato >> cadastro, perfil, skills, busca, recomendadas e conta
- Location: tests\candidato.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/perfil atualizado com sucesso/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/perfil atualizado com sucesso/i) with timeout 5000ms
  - waiting for getByText(/perfil atualizado com sucesso/i)

```

```yaml
- navigation:
  - link "Vagas na Rede":
    - /url: /
    - img "Vagas na Rede"
  - link "Painel":
    - /url: /candidato
    - img
    - text: Painel
  - link "Perfil":
    - /url: /candidato/perfil
    - img
    - text: Perfil
  - link "Habilidades":
    - /url: /candidato/skills
    - img
    - text: Habilidades
  - link "Vagas":
    - /url: /candidato/vagas
    - img
    - text: Vagas
  - link "Documentos":
    - /url: /candidato/documentos
    - img
    - text: Documentos
  - link "Recomendadas":
    - /url: /candidato/recomendadas
    - img
    - text: Recomendadas
  - link "Conta":
    - /url: /candidato/conta
    - img
    - text: Conta
  - button "Sair":
    - img
    - text: Sair
- main:
  - heading "Seu Perfil" [level=1]
  - text: Telefone
  - textbox: "61988887777"
  - text: Cidade
  - textbox
  - text: LinkedIn
  - textbox "https://linkedin.com/in/seu-perfil": https://linkedin.com/in/teste-e2e
  - text: GitHub
  - textbox "https://github.com/seu-usuario"
  - text: Resumo profissional
  - textbox
  - paragraph: Erro ao salvar. Tenta de novo.
  - button "Salvar Perfil"
- alert
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | import { cadastrarCandidato, login } from "./helpers";
  3  | 
  4  | test.describe("Fluxo completo do Candidato", () => {
  5  |   test("cadastro, perfil, skills, busca, recomendadas e conta", async ({ page }) => {
  6  |     const { email, senha } = await cadastrarCandidato(page);
  7  | 
  8  |     // painel inicial
  9  |     await expect(page.getByText(/completude do perfil/i)).toBeVisible();
  10 | 
  11 |     // perfil
  12 |     await page.goto("/candidato/perfil");
  13 |     await page.locator('input[type="tel"]').fill("61988887777");
  14 |     await page.locator('input[type="url"]').first().fill("https://linkedin.com/in/teste-e2e");
  15 |     await page.getByRole("button", { name: /salvar perfil/i }).click();
> 16 |     await expect(page.getByText(/perfil atualizado com sucesso/i)).toBeVisible();
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  17 | 
  18 |     // skills
  19 |     await page.goto("/candidato/skills");
  20 |     await page.getByPlaceholder(/ex: react/i).fill("TypeScript");
  21 |     await page.getByRole("button", { name: /^adicionar$/i }).click();
  22 |     await expect(page.getByText("typescript")).toBeVisible({ timeout: 5000 });
  23 | 
  24 |     // busca de vagas - filtros existem e o botao filtra sem erro
  25 |     await page.goto("/candidato/vagas");
  26 |     await expect(page.getByRole("button", { name: /^filtrar$/i })).toBeVisible();
  27 |     await page.getByRole("button", { name: /^filtrar$/i }).click();
  28 | 
  29 |     // documentos - tela carrega com o formulario de upload
  30 |     await page.goto("/candidato/documentos");
  31 |     await expect(page.getByRole("button", { name: /enviar documento/i })).toBeVisible();
  32 | 
  33 |     // recomendadas
  34 |     await page.goto("/candidato/recomendadas");
  35 |     await expect(page.getByRole("heading", { name: /vagas recomendadas/i })).toBeVisible();
  36 | 
  37 |     // minha conta - exportacao de dados responde com sucesso
  38 |     await page.goto("/candidato/conta");
  39 |     const [download] = await Promise.all([
  40 |       page.waitForEvent("download"),
  41 |       page.getByRole("button", { name: /baixar meus dados/i }).click(),
  42 |     ]);
  43 |     expect(download.suggestedFilename()).toContain("meus-dados");
  44 | 
  45 |     // relogin pra garantir que a sessao ainda e valida apos tudo isso
  46 |     await page.goto("/login");
  47 |     await login(page, email, senha);
  48 |     await expect(page).toHaveURL(/\/candidato/);
  49 |   });
  50 | 
  51 |   test("candidato consegue excluir a propria conta (LGPD)", async ({ page }) => {
  52 |     const { email, senha } = await cadastrarCandidato(page);
  53 |     await login(page, email, senha);
  54 | 
  55 |     await page.goto("/candidato/conta");
  56 |     await page.getByRole("button", { name: /quero excluir minha conta/i }).click();
  57 |     await page.getByRole("button", { name: /sim, excluir permanentemente/i }).click();
  58 |     await expect(page).toHaveURL("/", { timeout: 15000 });
  59 | 
  60 |     // conta excluida nao consegue mais logar
  61 |     await page.goto("/login");
  62 |     await page.locator('input[type="email"]').fill(email);
  63 |     await page.locator('input[type="password"]').fill(senha);
  64 |     await page.getByRole("button", { name: /entrar/i }).click();
  65 |     await expect(page.getByText(/email ou senha invalidos/i)).toBeVisible({ timeout: 15000 });
  66 |   });
  67 | });
  68 | 
```