import { test, expect } from "@playwright/test";
import { loginAdmin, cadastrarEmpresa } from "./helpers";

test.describe("Painel do Admin", () => {
  test("metricas, assinaturas e usuarios carregam", async ({ page }) => {
    await loginAdmin(page);

    await expect(page.getByText(/mrr/i)).toBeVisible();

    await page.getByRole("link", { name: /assinaturas/i }).click();
    await expect(page.getByRole("heading", { name: /assinaturas/i })).toBeVisible();

    await page.getByRole("link", { name: /usuarios/i }).click();
    await expect(page.getByRole("heading", { name: /usuarios/i })).toBeVisible();
  });

  test("admin aprova uma empresa clicando no botao (nao via API)", async ({ page, browser }) => {
    // cadastra a empresa numa aba separada pra nao perder a sessao de admin da aba principal
    const contextoEmpresa = await browser.newContext();
    const paginaEmpresa = await contextoEmpresa.newPage();
    const { email } = await cadastrarEmpresa(paginaEmpresa, "EMPRESA");
    await contextoEmpresa.close();

    await loginAdmin(page);
    await page.getByRole("link", { name: /^empresas$/i }).click();
    await expect(page.getByRole("heading", { name: /aprovacao de empresas/i })).toBeVisible();

    const linha = page.locator("tr", { hasText: email });
    await expect(linha).toBeVisible();
    await linha.getByRole("button", { name: /^aprovar$/i }).click();
    await expect(linha.getByRole("button", { name: /aprovada/i })).toBeVisible({ timeout: 5000 });
  });
});
