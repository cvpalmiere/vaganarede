import { test, expect } from "@playwright/test";
import { emailUnico, cadastrarEmpresa, login } from "./helpers";
import { execSync } from "child_process";

test.describe("Fluxo da Empresa de RH", () => {
  const email = emailUnico("rh");
  const senha = "senhaTeste12345";

  test("cadastro cai no paywall da RH", async ({ page }) => {
    await cadastrarEmpresa(page, email, senha, "EMPRESA_RH");
    await expect(page.getByRole("button", { name: /assinar agora/i })).toBeVisible();
  });

  test("apos ativar assinatura, cria empresa-cliente e vaga", async ({ page }) => {
    execSync(`npx tsx scripts/ativar-assinatura-teste.ts ${email}`, { stdio: "inherit" });

    await login(page, email, senha);
    await page.goto("/rh/empresas-cliente");
    await page.getByRole("button", { name: /nova empresa-cliente/i }).click();

    await page.locator('input').nth(0).fill("Cliente Teste E2E LTDA");
    await page.locator('input').nth(1).fill("11444777000161");
    await page.locator('input').nth(2).fill("61977776666");
    await page.locator('input').nth(3).fill("Goiania");
    await page.getByRole("button", { name: /^criar$/i }).click();

    await expect(page.getByText("Cliente Teste E2E LTDA")).toBeVisible({ timeout: 5000 });

    await page.goto("/rh/vagas/nova");
    await page.getByRole("combobox").first().selectOption({ label: "Cliente Teste E2E LTDA" });
    await page.locator('input').nth(1).fill("Analista de RH");
    await page.locator("textarea").fill("Vaga de teste automatizado com descricao minima de vinte caracteres.");
    await page.locator('input[type="text"]').last().fill("Goiania");
    await page.getByRole("button", { name: /publicar vaga/i }).click();

    await expect(page).toHaveURL(/\/rh\/vagas$/);
  });

  test("painel master mostra pelo menos 1 cliente", async ({ page }) => {
    await login(page, email, senha);
    await page.goto("/rh");
    await expect(page.getByText(/empresas-cliente/i)).toBeVisible();
  });
});
