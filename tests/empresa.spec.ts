import { test, expect } from "@playwright/test";
import { cadastrarEmpresa, login, aprovarComoAdmin } from "./helpers";

test.describe("Fluxo completo da Empresa", () => {
  test("cadastro fica pendente e bloqueia acesso antes da aprovacao", async ({ page }) => {
    const { email, senha } = await cadastrarEmpresa(page, "EMPRESA");
    await expect(page.getByRole("heading", { name: /cadastro em analise/i })).toBeVisible();

    await login(page, email, senha);
    await page.goto("/empresa/vagas");
    await expect(page).toHaveURL(/pendente-aprovacao/);
  });

  test("apos aprovacao do admin, publica vaga e ve candidaturas", async ({ page, request }) => {
    const { email, senha } = await cadastrarEmpresa(page, "EMPRESA");
    await aprovarComoAdmin(request, "EMPRESA", email);

    await login(page, email, senha);
    await expect(page).toHaveURL(/\/empresa\/vagas/);

    await page.getByRole("link", { name: /nova vaga/i }).click();
    await page.locator('input').first().fill("Desenvolvedor Frontend Teste E2E");
    await page.locator("textarea").fill("Vaga de teste automatizado com descricao de pelo menos vinte caracteres.");
    await page.locator('input[type="text"]').last().fill("Brasilia");
    await page.getByRole("button", { name: /publicar vaga/i }).click();

    await expect(page).toHaveURL(/\/empresa\/vagas$/);
    await expect(page.getByText("Desenvolvedor Frontend Teste E2E")).toBeVisible();

    await page.getByText("Desenvolvedor Frontend Teste E2E").click();
    await expect(page.getByRole("heading", { name: /candidaturas/i })).toBeVisible();
    await expect(page.getByText(/nenhuma candidatura recebida/i)).toBeVisible();

    await page.getByText("Currículos", { exact: true }).click();
    await expect(page.getByRole("heading", { name: /banco de curriculos/i })).toBeVisible();
  });
});
