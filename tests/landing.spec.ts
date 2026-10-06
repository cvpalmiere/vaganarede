import { test, expect } from "@playwright/test";

test.describe("Landing e paginas publicas", () => {
  test("carrega o hero", async ({ page }) => {
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

  test("Comecar Agora leva ao cadastro", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/cadastro"]').first().click();
    await expect(page).toHaveURL(/\/cadastro/);
  });

  test("Entrar leva ao login", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav a[href="/login"]').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("links de termos e privacidade no rodape funcionam", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/termos"]').first().click();
    await expect(page).toHaveURL(/\/termos/);
    await expect(page.getByRole("heading", { name: /termos de uso/i })).toBeVisible();

    await page.goto("/");
    await page.locator('a[href="/privacidade"]').first().click();
    await expect(page).toHaveURL(/\/privacidade/);
    await expect(page.getByRole("heading", { name: /politica de privacidade/i })).toBeVisible();
  });

  test("sitemap.xml e robots.txt respondem", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
  });
});
