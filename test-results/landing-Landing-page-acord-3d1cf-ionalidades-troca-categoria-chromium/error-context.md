# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing page >> acordeao de funcionalidades troca categoria
- Location: tests\landing.spec.ts:17:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Assinatura e liberação automatizada')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Assinatura e liberação automatizada') with timeout 5000ms
  - waiting for getByText('Assinatura e liberação automatizada')

```

```yaml
- banner:
  - navigation:
    - link "Vagas na Rede":
      - /url: /
      - img "Vagas na Rede"
    - link "Recursos":
      - /url: "#recursos"
    - link "Para empresas":
      - /url: "#empresas"
    - link "Para candidatos":
      - /url: "#candidatos"
    - link "Agências de RH":
      - /url: "#agencias"
    - link "Entrar":
      - /url: /login
    - link "Começar agora":
      - /url: /cadastro
- main:
  - heading "Recrutamento inteligente. Conexões que geram oportunidades." [level=1]
  - paragraph: A Vagas na Rede conecta candidatos, empresas e agências de RH em uma única plataforma segura, com score de compatibilidade real em cada etapa do recrutamento.
  - link "Começar agora":
    - /url: /cadastro
    - text: Começar agora
    - img
  - link "Conhecer a plataforma":
    - /url: "#recursos"
    - text: Conhecer a plataforma
    - img
  - paragraph: Uma rede feita para aproximar pessoas, processos e decisões.
  - text: Visão geral
  - button "Estudante"
  - button "Empresa"
  - button "Empresa de RH"
  - paragraph: Resumo do perfil
  - paragraph: Perfil em construção
  - img
  - paragraph: Progresso do cadastro
  - img
  - paragraph: Competências cadastradas
  - paragraph: Skills e experiências organizadas.
  - img
  - paragraph: Vagas recomendadas
  - paragraph: Oportunidades alinhadas ao perfil.
  - paragraph: Candidatos
  - paragraph: Talentos em busca da próxima oportunidade.
  - paragraph: Empresas
  - paragraph: Times que querem contratar com mais visão.
  - paragraph: Agências de RH
  - paragraph: Operações que conectam diferentes clientes.
  - paragraph: Feita para a sua jornada
  - heading "Uma plataforma. Três experiências." [level=2]
  - paragraph: Cada perfil encontra uma experiência pensada para transformar a rotina de recrutamento em movimento.
  - article:
    - img
    - text: "01"
    - heading "Para candidatos" [level=3]
    - paragraph: Cadastro gratuito para apresentar currículo, skills e se candidatar a vagas que fazem sentido para sua trajetória.
    - paragraph: Seu perfil, sua próxima conexão.
  - article:
    - img
    - text: "02"
    - heading "Para empresas" [level=3]
    - paragraph: Publique vagas, avalie candidatos e acompanhe o processo seletivo com uma visão mais organizada da operação.
    - paragraph: Decisões melhores começam com clareza.
  - article:
    - img
    - text: "03"
    - heading "Para agências de RH" [level=3]
    - paragraph: Um painel master para gerenciar vagas de vários clientes com organização e contexto para cada frente de trabalho.
    - paragraph: Mais controle para uma operação em rede.
  - paragraph: Tudo o que você precisa para contratar melhor
  - heading "Funcionalidades" [level=2]
  - paragraph: Os caminhos e funcionalidades do sistema, organizados por quem usa cada um.
  - button "Candidato Encontre sua próxima oportunidade. +"
  - button "Empresa Contrate com mais clareza. + Publicação ágil de vagas Preencha os campos fixos e a vaga vai ao ar na hora. Design sem ruído Só o que importa pra tomar decisão de contratação. Mensagens de erro claras Você sabe exatamente o que corrigir quando algo falha. Banco de currículos ranqueado Candidatos ordenados por compatibilidade com a vaga. Painel corporativo Visão consolidada de todas as vagas ativas. Liberação automática de acesso Pagou, ativou — sem espera manual de aprovação.":
    - text: Empresa Contrate com mais clareza. +
    - paragraph: Publicação ágil de vagas
    - paragraph: Preencha os campos fixos e a vaga vai ao ar na hora.
    - paragraph: Design sem ruído
    - paragraph: Só o que importa pra tomar decisão de contratação.
    - paragraph: Mensagens de erro claras
    - paragraph: Você sabe exatamente o que corrigir quando algo falha.
    - paragraph: Banco de currículos ranqueado
    - paragraph: Candidatos ordenados por compatibilidade com a vaga.
    - paragraph: Painel corporativo
    - paragraph: Visão consolidada de todas as vagas ativas.
    - paragraph: Liberação automática de acesso
    - paragraph: Pagou, ativou — sem espera manual de aprovação.
  - button "Empresa de RH Conecte toda a operação. +"
  - img
  - paragraph: Segurança por princípio
  - heading "Seus dados protegidos em cada etapa" [level=2]
  - paragraph: Documentos sensíveis, como CPF e CNPJ, são criptografados com AES-256-GCM. A arquitetura da Vagas na Rede foi pensada para proteger dados de candidatos e empresas enquanto as conexões acontecem.
  - img
  - paragraph: Documentos sensíveis tratados com cuidado.
  - img
  - paragraph: Acesso restrito por perfil de usuário.
  - paragraph: Planos para empresas
  - heading "Escolha a estrutura que acompanha a sua operação" [level=2]
  - article:
    - paragraph: Empresa
    - heading "Standard" [level=3]
    - paragraph: R$ 299/mês
    - paragraph: Até 10 vagas/mês e acesso ao banco de currículos.
    - link "Começar agora":
      - /url: /cadastro?tipo=EMPRESA
  - article:
    - paragraph: Empresa de RH
    - text: EM DESTAQUE
    - heading "Pro" [level=3]
    - paragraph: R$ 899/mês
    - paragraph: Vagas ilimitadas, múltiplos clientes e API de integração.
    - link "Começar agora":
      - /url: /cadastro?tipo=EMPRESA_RH
  - article:
    - paragraph: Sua realidade primeiro
    - heading "Sob medida" [level=3]
    - paragraph: Uma conversa para encontrar o formato ideal para a sua operação.
    - link "Falar com a gente":
      - /url: https://wa.me/undefined?text=Quero%20falar%20sobre%20um%20plano%20sob%20medida
  - paragraph: Pagamento processado com segurança via Stripe.
  - paragraph: Pagou, ativou — sem espera manual.
  - heading "O próximo talento pode estar mais perto do que você imagina." [level=2]
  - paragraph: Crie conexões mais diretas entre quem procura e quem constrói oportunidades.
  - link "Começar agora":
    - /url: /cadastro
    - text: Começar agora
    - img
- contentinfo:
  - img "Vagas na Rede"
  - paragraph: Uma plataforma para gerir talentos, oportunidades e processos com mais confiança.
  - link "Recursos":
    - /url: "#recursos"
  - link "Para empresas":
    - /url: "#empresas"
  - link "Para candidatos":
    - /url: "#candidatos"
  - link "Agências de RH":
    - /url: "#agencias"
  - link "Entrar":
    - /url: /login
  - link "Começar agora":
    - /url: /cadastro
  - paragraph: Vagas na Rede — tecnologia para uma gestão de talentos mais conectada e responsável.
- alert
```

# Test source

```ts
  1  | ﻿import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Landing page", () => {
  4  |   test("carrega e mostra o hero", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page.getByRole("heading", { name: /recrutamento inteligente/i })).toBeVisible();
  7  |   });
  8  | 
  9  |   test("abas do hero trocam de conteudo", async ({ page }) => {
  10 |     await page.goto("/");
  11 |     await page.getByRole("button", { name: "Empresa", exact: true }).click();
  12 |     await expect(page.getByText("Publicação de vagas")).toBeVisible();
  13 |     await page.getByRole("button", { name: "Empresa de RH", exact: true }).click();
  14 |     await expect(page.getByText("Painel master", { exact: true })).toBeVisible();
  15 |   });
  16 | 
  17 |   test("acordeao de funcionalidades troca categoria", async ({ page }) => {
  18 |     await page.goto("/");
  19 |     await page.getByText("Contrate com mais clareza.").click();
> 20 |     await expect(page.getByText("Assinatura e liberação automatizada")).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  21 |   });
  22 | 
  23 |   test("botao Comecar Agora leva ao cadastro", async ({ page }) => {
  24 |     await page.goto("/");
  25 |     await page.getByRole("link", { name: /comecar agora/i }).first().click();
  26 |     await expect(page).toHaveURL(/\/cadastro/);
  27 |   });
  28 | 
  29 |   test("botao Entrar leva ao login", async ({ page }) => {
  30 |     await page.goto("/");
  31 |     await page.getByRole("navigation").getByRole("link", { name: "Entrar" }).click();
  32 |     await expect(page).toHaveURL(/\/login/);
  33 |   });
  34 | });
  35 | 
```