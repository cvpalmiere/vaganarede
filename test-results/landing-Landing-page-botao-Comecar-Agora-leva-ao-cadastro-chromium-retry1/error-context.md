# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: landing.spec.ts >> Landing page >> botao Comecar Agora leva ao cadastro
- Location: tests\landing.spec.ts:23:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /comecar agora/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link [ref=e5] [cursor=pointer]:
          - /url: /
          - img "Vagas na Rede" [ref=e6]
        - generic [ref=e7]:
          - link "Recursos" [ref=e8] [cursor=pointer]:
            - /url: "#recursos"
          - link "Para empresas" [ref=e9] [cursor=pointer]:
            - /url: "#empresas"
          - link "Para candidatos" [ref=e10] [cursor=pointer]:
            - /url: "#candidatos"
          - link "Agências de RH" [ref=e11] [cursor=pointer]:
            - /url: "#agencias"
        - generic [ref=e12]:
          - link "Entrar" [ref=e13] [cursor=pointer]:
            - /url: /login
          - link "Começar agora" [ref=e14] [cursor=pointer]:
            - /url: /cadastro
    - main [ref=e15]:
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "Recrutamento inteligente. Conexões que geram oportunidades." [level=1] [ref=e19]
          - paragraph [ref=e20]: A Vagas na Rede conecta candidatos, empresas e agências de RH em uma única plataforma segura, com score de compatibilidade real em cada etapa do recrutamento.
          - generic [ref=e21]:
            - link "Começar agora" [ref=e22] [cursor=pointer]:
              - /url: /cadastro
            - link "Conhecer a plataforma" [ref=e26] [cursor=pointer]:
              - /url: "#recursos"
          - paragraph [ref=e29]: Uma rede feita para aproximar pessoas, processos e decisões.
        - generic [ref=e31]:
          - generic [ref=e32]:
            - generic [ref=e33]: Visão geral
            - generic [ref=e36]:
              - button "Estudante" [ref=e37]
              - button "Empresa" [ref=e38]
              - button "Empresa de RH" [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e43]:
                - paragraph [ref=e44]: Resumo do perfil
                - paragraph [ref=e45]: Perfil em construção
              - paragraph [ref=e52]: Progresso do cadastro
            - generic [ref=e53]:
              - paragraph [ref=e56]: Competências cadastradas
              - paragraph [ref=e57]: Skills e experiências organizadas.
            - generic [ref=e58]:
              - paragraph [ref=e62]: Vagas recomendadas
              - paragraph [ref=e63]: Oportunidades alinhadas ao perfil.
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: Candidatos
          - paragraph [ref=e68]: Talentos em busca da próxima oportunidade.
        - generic [ref=e69]:
          - paragraph [ref=e70]: Empresas
          - paragraph [ref=e71]: Times que querem contratar com mais visão.
        - generic [ref=e72]:
          - paragraph [ref=e73]: Agências de RH
          - paragraph [ref=e74]: Operações que conectam diferentes clientes.
      - generic [ref=e76]:
        - generic [ref=e77]:
          - paragraph [ref=e78]: Feita para a sua jornada
          - heading "Uma plataforma. Três experiências." [level=2] [ref=e79]
          - paragraph [ref=e80]: Cada perfil encontra uma experiência pensada para transformar a rotina de recrutamento em movimento.
        - generic [ref=e81]:
          - article [ref=e82]:
            - generic [ref=e83]: "01"
            - heading "Para candidatos" [level=3] [ref=e90]
            - paragraph [ref=e91]: Cadastro gratuito para apresentar currículo, skills e se candidatar a vagas que fazem sentido para sua trajetória.
            - paragraph [ref=e93]: Seu perfil, sua próxima conexão.
          - article [ref=e94]:
            - generic [ref=e95]: "02"
            - heading "Para empresas" [level=3] [ref=e102]
            - paragraph [ref=e103]: Publique vagas, avalie candidatos e acompanhe o processo seletivo com uma visão mais organizada da operação.
            - paragraph [ref=e105]: Decisões melhores começam com clareza.
          - article [ref=e106]:
            - generic [ref=e107]: "03"
            - heading "Para agências de RH" [level=3] [ref=e115]
            - paragraph [ref=e116]: Um painel master para gerenciar vagas de vários clientes com organização e contexto para cada frente de trabalho.
            - paragraph [ref=e118]: Mais controle para uma operação em rede.
      - generic [ref=e120]:
        - generic [ref=e121]:
          - generic [ref=e122]:
            - paragraph [ref=e123]: Tudo o que você precisa para contratar melhor
            - heading "Funcionalidades" [level=2] [ref=e124]
          - paragraph [ref=e125]: Os caminhos e funcionalidades do sistema, organizados por quem usa cada um.
        - generic [ref=e128]:
          - button "Candidato Encontre sua próxima oportunidade. + Visibilidade do status Acompanhe cada etapa da sua candidatura em tempo real. Linguagem clara Sem jargão técnico — informação direta em cada tela. Controle total do perfil Edite, atualize ou remova seus dados quando quiser. Consistência A mesma ação sempre gera o mesmo resultado, em qualquer tela. Prevenção de erros Validações no cadastro evitam dados incorretos antes de enviar. Sugestões inteligentes Skills e vagas sugeridas, sem precisar decorar nada." [ref=e129]:
            - generic [ref=e130]:
              - generic [ref=e131]:
                - generic [ref=e132]: Candidato
                - generic [ref=e133]: Encontre sua próxima oportunidade.
              - generic [ref=e134]: +
            - generic [ref=e135]:
              - generic [ref=e136]:
                - paragraph [ref=e137]: Visibilidade do status
                - paragraph [ref=e138]: Acompanhe cada etapa da sua candidatura em tempo real.
              - generic [ref=e139]:
                - paragraph [ref=e140]: Linguagem clara
                - paragraph [ref=e141]: Sem jargão técnico — informação direta em cada tela.
              - generic [ref=e142]:
                - paragraph [ref=e143]: Controle total do perfil
                - paragraph [ref=e144]: Edite, atualize ou remova seus dados quando quiser.
              - generic [ref=e145]:
                - paragraph [ref=e146]: Consistência
                - paragraph [ref=e147]: A mesma ação sempre gera o mesmo resultado, em qualquer tela.
              - generic [ref=e148]:
                - paragraph [ref=e149]: Prevenção de erros
                - paragraph [ref=e150]: Validações no cadastro evitam dados incorretos antes de enviar.
              - generic [ref=e151]:
                - paragraph [ref=e152]: Sugestões inteligentes
                - paragraph [ref=e153]: Skills e vagas sugeridas, sem precisar decorar nada.
          - button "Empresa Contrate com mais clareza. +" [ref=e154]:
            - generic [ref=e155]:
              - generic [ref=e156]:
                - generic [ref=e157]: Empresa
                - generic [ref=e158]: Contrate com mais clareza.
              - generic [ref=e159]: +
          - button "Empresa de RH Conecte toda a operação. +" [ref=e160]:
            - generic [ref=e161]:
              - generic [ref=e162]:
                - generic [ref=e163]: Empresa de RH
                - generic [ref=e164]: Conecte toda a operação.
              - generic [ref=e165]: +
      - generic [ref=e167]:
        - generic [ref=e168]:
          - paragraph [ref=e173]: Segurança por princípio
          - heading "Seus dados protegidos em cada etapa" [level=2] [ref=e174]
        - generic [ref=e175]:
          - paragraph [ref=e176]: Documentos sensíveis, como CPF e CNPJ, são criptografados com AES-256-GCM. A arquitetura da Vagas na Rede foi pensada para proteger dados de candidatos e empresas enquanto as conexões acontecem.
          - generic [ref=e177]:
            - paragraph [ref=e184]: Documentos sensíveis tratados com cuidado.
            - paragraph [ref=e189]: Acesso restrito por perfil de usuário.
      - generic [ref=e191]:
        - generic [ref=e192]:
          - paragraph [ref=e193]: Planos para empresas
          - heading "Escolha a estrutura que acompanha a sua operação" [level=2] [ref=e194]
        - generic [ref=e195]:
          - article [ref=e196]:
            - paragraph [ref=e197]: Empresa
            - heading "Standard" [level=3] [ref=e198]
            - paragraph [ref=e199]: R$ 299/mês
            - paragraph [ref=e200]: Até 10 vagas/mês e acesso ao banco de currículos.
            - link "Começar agora" [ref=e201] [cursor=pointer]:
              - /url: /cadastro?tipo=EMPRESA
          - article [ref=e202]:
            - generic [ref=e203]:
              - paragraph [ref=e204]: Empresa de RH
              - generic [ref=e205]: EM DESTAQUE
            - heading "Pro" [level=3] [ref=e206]
            - paragraph [ref=e207]: R$ 899/mês
            - paragraph [ref=e208]: Vagas ilimitadas, múltiplos clientes e API de integração.
            - link "Começar agora" [ref=e209] [cursor=pointer]:
              - /url: /cadastro?tipo=EMPRESA_RH
          - article [ref=e210]:
            - paragraph [ref=e211]: Sua realidade primeiro
            - heading "Sob medida" [level=3] [ref=e212]
            - paragraph [ref=e213]: Uma conversa para encontrar o formato ideal para a sua operação.
            - link "Falar com a gente" [ref=e214] [cursor=pointer]:
              - /url: https://wa.me/undefined?text=Quero%20falar%20sobre%20um%20plano%20sob%20medida
        - generic [ref=e215]:
          - paragraph [ref=e216]: Pagamento processado com segurança via Stripe.
          - paragraph [ref=e217]: Pagou, ativou — sem espera manual.
      - generic [ref=e219]:
        - heading "O próximo talento pode estar mais perto do que você imagina." [level=2] [ref=e220]
        - paragraph [ref=e221]: Crie conexões mais diretas entre quem procura e quem constrói oportunidades.
        - link "Começar agora" [ref=e222] [cursor=pointer]:
          - /url: /cadastro
    - contentinfo [ref=e226]:
      - generic [ref=e227]:
        - generic [ref=e228]:
          - generic [ref=e229]:
            - img "Vagas na Rede" [ref=e230]
            - paragraph [ref=e231]: Uma plataforma para gerir talentos, oportunidades e processos com mais confiança.
          - generic [ref=e232]:
            - link "Recursos" [ref=e233] [cursor=pointer]:
              - /url: "#recursos"
            - link "Para empresas" [ref=e234] [cursor=pointer]:
              - /url: "#empresas"
            - link "Para candidatos" [ref=e235] [cursor=pointer]:
              - /url: "#candidatos"
            - link "Agências de RH" [ref=e236] [cursor=pointer]:
              - /url: "#agencias"
            - link "Entrar" [ref=e237] [cursor=pointer]:
              - /url: /login
            - link "Começar agora" [ref=e238] [cursor=pointer]:
              - /url: /cadastro
        - paragraph [ref=e240]: Vagas na Rede — tecnologia para uma gestão de talentos mais conectada e responsável.
  - alert [ref=e241]
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
  20 |     await expect(page.getByText("Assinatura e liberação automatizada")).toBeVisible();
  21 |   });
  22 | 
  23 |   test("botao Comecar Agora leva ao cadastro", async ({ page }) => {
  24 |     await page.goto("/");
> 25 |     await page.getByRole("link", { name: /comecar agora/i }).first().click();
     |                                                                      ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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