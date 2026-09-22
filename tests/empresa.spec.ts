import { test, expect } from "@playwright/test";
import { emailUnico, cadastrarEmpresa, login } from "./helpers";
import { execSync } from "child_process";

test.describe("Fluxo da Empresa", () => {
  const email = emailUnico("empresa");
  const senha = "senhaTeste12345";

  test("cadastro cai no paywall (assinatura pendente)", async ({ page }) => {
    await cadastrarEmpresa(page, email, senha, "EMPRESA");
    await expect(page.getByRole("heading", { name: /ative seu plano/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /assinar agora/i })).toBeVisible();
  });

  test("botao assinar agora chama o endpoint de checkout", async ({ page }) => {
    await login(page, email, senha);
    await page.goto("/empresa/assinatura");

    const [resposta] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/stripe/checkout")),
      page.getByRole("button", { name: /assinar agora/i }).click(),
    ]);
    expect(resposta.status()).toBe(200);
  });

  test("acesso a /empresa/vagas continua bloqueado sem assinatura ativa", async ({ page }) => {
    await login(page, email, senha);
    await page.goto("/empresa/vagas");
    await expect(page).toHaveURL(/\/empresa\/assinatura/);
  });

  test("apos ativar assinatura (via script de apoio), consegue publicar vaga", async ({ page }) => {
    execSync(`npx tsx scripts/ativar-assinatura-teste.ts ${email}`, { stdio: "inherit" });

    await login(page, email, senha);
    await page.goto("/empresa/vagas/nova");

    await page.locator('input').first().fill("Desenvolvedor Frontend");
    await page.locator("textarea").fill("Vaga de teste automatizado com descricao minima de vinte caracteres.");
    await page.locator('input[type="text"]').last().fill("Brasilia");
    await page.getByRole("button", { name: /publicar vaga/i }).click();

    await expect(page).toHaveURL(/\/empresa\/vagas$/);
    await expect(page.getByText("Desenvolvedor Frontend")).toBeVisible();
  });
});
