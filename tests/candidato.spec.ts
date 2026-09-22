import { test, expect } from "@playwright/test";
import { emailUnico, cadastrarCandidato } from "./helpers";

test.describe("Fluxo do Candidato", () => {
  const email = emailUnico("candidato");
  const senha = "senhaTeste12345";

  test("cadastro completo e cai no painel", async ({ page }) => {
    await cadastrarCandidato(page, email, senha);
    await expect(page.getByRole("heading", { name: /bem-vindo/i })).toBeVisible();
    await expect(page.getByText(/completude do perfil/i)).toBeVisible();
  });

  test("preenche e salva o perfil", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(senha);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/candidato/perfil");

    await page.locator('input[type="tel"]').fill("61988887777");
    await page.locator('input[type="url"]').first().fill("https://linkedin.com/in/teste");
    await page.getByRole("button", { name: /salvar perfil/i }).click();
    await expect(page.getByText(/perfil atualizado com sucesso/i)).toBeVisible();
  });

  test("adiciona uma skill", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(senha);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/candidato/skills");

    await page.getByPlaceholder(/ex: react/i).fill("TypeScript");
    await page.getByRole("button", { name: /^adicionar$/i }).click();
    await expect(page.getByText("typescript")).toBeVisible({ timeout: 5000 });
  });

  test("busca de vagas mostra os filtros", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(senha);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.goto("/candidato/vagas");

    await expect(page.getByRole("button", { name: /^filtrar$/i })).toBeVisible();
  });
});
