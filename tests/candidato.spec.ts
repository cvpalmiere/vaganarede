import { test, expect } from "@playwright/test";
import { cadastrarCandidato, login } from "./helpers";

test.describe("Fluxo completo do Candidato", () => {
  test("cadastro, perfil, skills, busca, recomendadas e conta", async ({ page }) => {
    const { email, senha } = await cadastrarCandidato(page);

    // painel inicial
    await expect(page.getByText(/completude do perfil/i)).toBeVisible();

    // perfil
    await page.goto("/candidato/perfil");
    await page.locator('input[type="tel"]').fill("61988887777");
    await page.locator('input[type="url"]').first().fill("https://linkedin.com/in/teste-e2e");
    await page.getByRole("button", { name: /salvar perfil/i }).click();
    await expect(page.getByText(/perfil atualizado com sucesso/i)).toBeVisible();

    // skills
    await page.goto("/candidato/skills");
    await page.getByPlaceholder(/ex: react/i).fill("TypeScript");
    await page.getByRole("button", { name: /^adicionar$/i }).click();
    await expect(page.getByText("typescript")).toBeVisible({ timeout: 5000 });

    // busca de vagas - filtros existem e o botao filtra sem erro
    await page.goto("/candidato/vagas");
    await expect(page.getByRole("button", { name: /^filtrar$/i })).toBeVisible();
    await page.getByRole("button", { name: /^filtrar$/i }).click();

    // documentos - tela carrega com o formulario de upload
    await page.goto("/candidato/documentos");
    await expect(page.getByRole("button", { name: /enviar documento/i })).toBeVisible();

    // recomendadas
    await page.goto("/candidato/recomendadas");
    await expect(page.getByRole("heading", { name: /vagas recomendadas/i })).toBeVisible();

    // minha conta - exportacao de dados responde com sucesso
    await page.goto("/candidato/conta");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /baixar meus dados/i }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("meus-dados");

    // relogin pra garantir que a sessao ainda e valida apos tudo isso
    await page.goto("/login");
    await login(page, email, senha);
    await expect(page).toHaveURL(/\/candidato/);
  });

  test("candidato consegue excluir a propria conta (LGPD)", async ({ page }) => {
    const { email, senha } = await cadastrarCandidato(page);
    await login(page, email, senha);

    await page.goto("/candidato/conta");
    await page.getByRole("button", { name: /quero excluir minha conta/i }).click();
    await page.getByRole("button", { name: /sim, excluir permanentemente/i }).click();
    await expect(page).toHaveURL("/", { timeout: 15000 });

    // conta excluida nao consegue mais logar
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(senha);
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/email ou senha invalidos/i)).toBeVisible({ timeout: 15000 });
  });
});
