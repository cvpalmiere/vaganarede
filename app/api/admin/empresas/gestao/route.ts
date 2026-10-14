import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Função para garantir que apenas o ADMIN acede a esta API (Next.js 15)
async function validarAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.tipo_usuario !== "ADMIN") return null;
  return user;
}

// 1. LER: Busca todas as empresas para listar no painel
export async function GET() {
  const admin = await validarAdmin();
  if (!admin) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  try {
    // Busca na tabela de empresas normais e de RH
    const empresas = await prisma.empresa.findMany({
      select: { id: true, razaoSocial: true, aprovado: true }
    });
    
    const empresasRh = await prisma.empresaRh.findMany({
      select: { id: true, razaoSocial: true, aprovado: true }
    });

    // Formata para o frontend
    const formatar = (lista: any[], tipo: string) => lista.map(e => ({
      id: e.id,
      nomeFantasia: `${e.razaoSocial} (${tipo})`,
      cnpj: "Protegido por Criptografia", // Mantém o sigilo do dado sensível no painel
      status: e.aprovado ? "APROVADA" : "PENDENTE"
    }));

    const todasEmpresas = [
      ...formatar(empresas, "Padrão"),
      ...formatar(empresasRh, "RH")
    ];

    return NextResponse.json({ empresas: todasEmpresas });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao buscar empresas" }, { status: 500 });
  }
}

// 2. ATUALIZAR: Aprova ou Rejeita a empresa (Muda o booleano)
export async function PATCH(request: Request) {
  const admin = await validarAdmin();
  if (!admin) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { id, status } = await request.json();
  const isAprovado = status === "APROVADA";

  try {
    // Como não sabemos de qual tabela veio o ID, tentamos na Empresa primeiro. 
    // Se não for, atualizamos na EmpresaRh.
    try {
      await prisma.empresa.update({
        where: { id },
        data: { aprovado: isAprovado }
      });
    } catch {
      await prisma.empresaRh.update({
        where: { id },
        data: { aprovado: isAprovado }
      });
    }
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: "Empresa não encontrada" }, { status: 404 });
  }
}

// 3. EXCLUIR: Apaga o usuário definitivamente
export async function DELETE(request: Request) {
  const admin = await validarAdmin();
  if (!admin) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });

  const { id } = await request.json();

  try {
    // Busca o usuarioId vinculado a esta empresa
    let usuarioId = null;
    
    const emp = await prisma.empresa.findUnique({ where: { id }, select: { usuarioId: true } });
    if (emp?.usuarioId) {
      usuarioId = emp.usuarioId;
    } else {
      const empRh = await prisma.empresaRh.findUnique({ where: { id }, select: { usuarioId: true } });
      if (empRh?.usuarioId) usuarioId = empRh.usuarioId;
    }

    // Se achou o usuário base, apaga-o. O "onDelete: Cascade" do Prisma apaga a empresa automaticamente.
    if (usuarioId) {
      await prisma.usuario.delete({ where: { id: usuarioId } });
    }
    
    return NextResponse.json({ sucesso: true });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao excluir empresa" }, { status: 500 });
  }
}