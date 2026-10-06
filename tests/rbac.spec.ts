import { test, expect } from "@playwright/test";

test.describe("RBAC - protecao de rotas por tipo de usuario", () => {
  test("candidato deslogado vai para login", async ({ page }) => {
    await page.goto("/candidato");
    await expect(page).toHaveURL(/\/login/);
  });

  test("empresa deslogada vai para login", async ({ page }) => {
    await page.goto("/empresa/vagas");
    await expect(page).toHaveURL(/\/login/);
  });

  test("rh deslogado vai para login", async ({ page }) => {
    await page.goto("/rh");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin deslogado vai para login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login com senha errada mostra erro", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("naoexiste@teste-e2e.local");
    await page.locator('input[type="password"]').fill("senhaerrada123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/email ou senha invalidos|muitas tentativas/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
