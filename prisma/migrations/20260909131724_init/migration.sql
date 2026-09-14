-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('CANDIDATO', 'EMPRESA', 'EMPRESA_RH', 'ADMIN');

-- CreateEnum
CREATE TYPE "NivelVaga" AS ENUM ('ESTAGIO', 'TRAINEE', 'JUNIOR', 'PLENO', 'SENIOR');

-- CreateEnum
CREATE TYPE "ModeloTrabalho" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "AreaVaga" AS ENUM ('TI', 'SAUDE', 'ADMINISTRATIVO', 'COMERCIAL', 'MARKETING', 'FINANCEIRO', 'RH', 'ENGENHARIA', 'OUTROS');

-- CreateEnum
CREATE TYPE "FaixaSalarial" AS ENUM ('ATE_2000', 'DE_2000_A_4000', 'DE_4000_A_6000', 'DE_6000_A_10000', 'ACIMA_DE_10000', 'A_COMBINAR');

-- CreateEnum
CREATE TYPE "StatusVaga" AS ENUM ('ATIVA', 'PAUSADA', 'ENCERRADA');

-- CreateEnum
CREATE TYPE "StatusDocumento" AS ENUM ('PENDENTE', 'VERIFICADO', 'REJEITADO');

-- CreateEnum
CREATE TYPE "StatusCandidatura" AS ENUM ('ENVIADA', 'EM_ANALISE', 'ENTREVISTA', 'OFERTA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "PlanoTipo" AS ENUM ('EMPRESA', 'EMPRESA_RH');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('ATIVO', 'PENDENTE', 'CANCELADO', 'INADIMPLENTE');

-- CreateEnum
CREATE TYPE "CanalNotificacao" AS ENUM ('PUSH', 'WHATSAPP', 'EMAIL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatos" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpfHash" TEXT NOT NULL,
    "cpfCriptografado" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "resumoProfissional" TEXT,
    "completudePerfil" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_candidato" (
    "id" UUID NOT NULL,
    "candidatoId" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "status" "StatusDocumento" NOT NULL DEFAULT 'PENDENTE',
    "verificadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidato_skills" (
    "candidatoId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "nivel" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "candidato_skills_pkey" PRIMARY KEY ("candidatoId","skillId")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpjHash" TEXT NOT NULL,
    "cnpjCriptografado" TEXT NOT NULL,
    "cnpjVerificado" BOOLEAN NOT NULL DEFAULT false,
    "telefone" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "empresaRhId" UUID,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas_rh" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpjHash" TEXT NOT NULL,
    "cnpjCriptografado" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresas_rh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" UUID NOT NULL,
    "empresaId" UUID,
    "empresaRhId" UUID,
    "plano" "PlanoTipo" NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "gatewayClienteId" TEXT,
    "gatewayAssinaturaId" TEXT,
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vagas" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "area" "AreaVaga" NOT NULL,
    "nivel" "NivelVaga" NOT NULL,
    "modelo" "ModeloTrabalho" NOT NULL,
    "faixaSalarial" "FaixaSalarial" NOT NULL,
    "cidade" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "StatusVaga" NOT NULL DEFAULT 'ATIVA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vagas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaga_skills" (
    "vagaId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "peso" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "vaga_skills_pkey" PRIMARY KEY ("vagaId","skillId")
);

-- CreateTable
CREATE TABLE "matches_compatibilidade" (
    "id" UUID NOT NULL,
    "candidatoId" UUID NOT NULL,
    "vagaId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "distanciaKm" DOUBLE PRECISION,
    "calculadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_compatibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidaturas" (
    "id" UUID NOT NULL,
    "candidatoId" UUID NOT NULL,
    "vagaId" UUID NOT NULL,
    "scoreCompatibilidade" INTEGER NOT NULL,
    "status" "StatusCandidatura" NOT NULL DEFAULT 'ENVIADA',
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" UUID NOT NULL,
    "candidatoId" UUID NOT NULL,
    "canal" "CanalNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "enviadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidatos_usuarioId_key" ON "candidatos"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "candidatos_cpfHash_key" ON "candidatos"("cpfHash");

-- CreateIndex
CREATE UNIQUE INDEX "skills_nome_key" ON "skills"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_usuarioId_key" ON "empresas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpjHash_key" ON "empresas"("cnpjHash");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_rh_usuarioId_key" ON "empresas_rh"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_rh_cnpjHash_key" ON "empresas_rh"("cnpjHash");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_empresaId_key" ON "assinaturas"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "assinaturas_empresaRhId_key" ON "assinaturas"("empresaRhId");

-- CreateIndex
CREATE UNIQUE INDEX "matches_compatibilidade_candidatoId_vagaId_key" ON "matches_compatibilidade"("candidatoId", "vagaId");

-- CreateIndex
CREATE UNIQUE INDEX "candidaturas_candidatoId_vagaId_key" ON "candidaturas"("candidatoId", "vagaId");

-- AddForeignKey
ALTER TABLE "candidatos" ADD CONSTRAINT "candidatos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_candidato" ADD CONSTRAINT "documentos_candidato_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidato_skills" ADD CONSTRAINT "candidato_skills_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidato_skills" ADD CONSTRAINT "candidato_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_empresaRhId_fkey" FOREIGN KEY ("empresaRhId") REFERENCES "empresas_rh"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_rh" ADD CONSTRAINT "empresas_rh_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_empresaRhId_fkey" FOREIGN KEY ("empresaRhId") REFERENCES "empresas_rh"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vagas" ADD CONSTRAINT "vagas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga_skills" ADD CONSTRAINT "vaga_skills_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "vagas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaga_skills" ADD CONSTRAINT "vaga_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches_compatibilidade" ADD CONSTRAINT "matches_compatibilidade_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches_compatibilidade" ADD CONSTRAINT "matches_compatibilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "vagas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidaturas" ADD CONSTRAINT "candidaturas_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidaturas" ADD CONSTRAINT "candidaturas_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "vagas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "candidatos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
