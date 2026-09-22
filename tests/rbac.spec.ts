import { test, expect } from "@playwright/test";

test.describe("RBAC - protecao de rotas", () => {
  test("candidato deslogado e redirecionado para login", async ({ page }) => {
    await page.goto("/candidato");
    await expect(page).toHaveURL(/\/login/);
  });

  test("empresa deslogada e redirecionada para login", async ({ page }) => {
    await page.goto("/empresa/vagas");
    await expect(page).toHaveURL(/\/login/);
  });

  test("rh deslogado e redirecionado para login", async ({ page }) => {
    await page.goto("/rh");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login com senha errada mostra erro e nao entra", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("naoexiste@teste-e2e.local");
    await page.locator('input[type="password"]').fill("senhaerrada123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/email ou senha invalidos/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

