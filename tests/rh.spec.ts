import { test, expect } from "@playwright/test";
import { cadastrarEmpresa, login, aprovarComoAdmin, cnpjValido } from "./helpers";

test.describe("Fluxo completo da Empresa de RH", () => {
  test("cadastro, aprovacao, empresa-cliente, vaga e painel master", async ({ page, request }) => {
    const { email, senha } = await cadastrarEmpresa(page, "EMPRESA_RH");
    await expect(page.getByRole("heading", { name: /cadastro em analise/i })).toBeVisible();

    await aprovarComoAdmin(request, "EMPRESA_RH", email);
    await login(page, email, senha);
    await expect(page).toHaveURL(/\/rh/);

    await page.goto("/rh/empresas-cliente");
    await page.getByRole("button", { name: /nova empresa-cliente/i }).click();
    await page.locator('input').nth(0).fill("Cliente Teste E2E LTDA");
    await page.locator('input').nth(1).fill(cnpjValido());
    await page.locator('input').nth(2).fill("61977776666");
    await page.locator('input').nth(3).fill("Goiania");
    await page.getByRole("button", { name: /^criar$/i }).click();
    await expect(page.getByText("Cliente Teste E2E LTDA")).toBeVisible({ timeout: 5000 });

    await page.goto("/rh/vagas/nova");
    await page.getByRole("combobox").first().selectOption({ label: "Cliente Teste E2E LTDA" });
    await page.locator('input').nth(1).fill("Analista de RH Teste E2E");
    await page.locator("textarea").fill("Vaga de teste automatizado com descricao de pelo menos vinte caracteres.");
    await page.locator('input[type="text"]').last().fill("Goiania");
    await page.getByRole("button", { name: /publicar vaga/i }).click();
    await expect(page).toHaveURL(/\/rh\/vagas$/);
    await expect(page.getByText("Analista de RH Teste E2E")).toBeVisible();

    await page.goto("/rh");
    await expect(page.getByText(/empresas-cliente/i)).toBeVisible();
  });
});
