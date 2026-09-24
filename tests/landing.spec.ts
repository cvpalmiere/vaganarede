import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("carrega e mostra o hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /recrutamento inteligente/i })).toBeVisible();
  });

  test("abas do hero trocam de conteudo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Empresa", exact: true }).click();
    await expect(page.getByText("Publicação de vagas")).toBeVisible();
    await page.getByRole("button", { name: "Empresa de RH", exact: true }).click();
    await expect(page.getByText("Painel master", { exact: true })).toBeVisible();
  });

  test("acordeao de funcionalidades troca categoria", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Contrate com mais clareza.").click();
    await expect(page.getByText("Liberacao automatica de acesso")).toBeVisible();
  });

  test("botao Comecar Agora leva ao cadastro", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/cadastro"]').first().click();
    await expect(page).toHaveURL(/\/cadastro/);
  });

  test("botao Entrar leva ao login", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav a[href="/login"]').click();
    await expect(page).toHaveURL(/\/login/);
  });
});

