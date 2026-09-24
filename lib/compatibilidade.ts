import "server-only";

type SkillCandidato = { skillId: string; nivel: number };
type SkillVaga = { skillId: string; peso: number };

export function calcularScoreSkills(skillsCandidato: SkillCandidato[], skillsVaga: SkillVaga[]): number {
  if (skillsVaga.length === 0) return 100;

  const mapaCandidato = new Map(skillsCandidato.map((s) => [s.skillId, s.nivel]));
  let pesoTotal = 0;
  let pesoAtingido = 0;

  for (const sv of skillsVaga) {
    pesoTotal += sv.peso;
    const nivelCandidato = mapaCandidato.get(sv.skillId);
    if (nivelCandidato) {
      pesoAtingido += sv.peso * (nivelCandidato / 5);
    }
  }

  return pesoTotal > 0 ? Math.round((pesoAtingido / pesoTotal) * 100) : 100;
}

function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const ORDEM_NIVEL = ["ESTAGIO", "TRAINEE", "JUNIOR", "PLENO", "SENIOR"];
const ORDEM_SALARIO = ["ATE_2000", "DE_2000_A_4000", "DE_4000_A_6000", "DE_6000_A_10000", "ACIMA_DE_10000"];

function scoreNivel(candidatoNivel: string | null, vagaNivel: string): number | null {
  if (!candidatoNivel) return null;
  const diff = Math.abs(ORDEM_NIVEL.indexOf(candidatoNivel) - ORDEM_NIVEL.indexOf(vagaNivel));
  if (diff === 0) return 100;
  if (diff === 1) return 60;
  return 20;
}

function scoreModelo(candidatoModelo: string | null, vagaModelo: string): number | null {
  if (!candidatoModelo) return null;
  if (candidatoModelo === vagaModelo) return 100;
  if (vagaModelo === "HIBRIDO" || candidatoModelo === "HIBRIDO") return 60;
  return 0;
}

function scoreSalario(candidatoFaixa: string | null, vagaFaixa: string): number | null {
  if (!candidatoFaixa) return null;
  if (vagaFaixa === "A_COMBINAR") return 80;
  const idxCandidato = ORDEM_SALARIO.indexOf(candidatoFaixa);
  const idxVaga = ORDEM_SALARIO.indexOf(vagaFaixa);
  if (idxCandidato === -1 || idxVaga === -1) return null;
  return idxVaga >= idxCandidato ? 100 : 30;
}

function scoreDistancia(latC: number, lonC: number, latV: number, lonV: number): number | null {
  if (!latC || !lonC || !latV || !lonV) return null;
  const km = distanciaKm(latC, lonC, latV, lonV);
  if (km < 10) return 100;
  if (km < 30) return 80;
  if (km < 60) return 50;
  return 20;
}

type CandidatoPreferencias = {
  nivelExperiencia: string | null;
  modeloPreferido: string | null;
  pretensaoSalarial: string | null;
  latitude: number;
  longitude: number;
};

type VagaDados = {
  nivel: string;
  modelo: string;
  faixaSalarial: string;
  latitude: number;
  longitude: number;
};

export function calcularScoreCompleto(
  candidato: CandidatoPreferencias,
  vaga: VagaDados,
  skillsCandidato: SkillCandidato[],
  skillsVaga: SkillVaga[]
): number {
  const dimensoes: { score: number; peso: number }[] = [
    { score: calcularScoreSkills(skillsCandidato, skillsVaga), peso: 0.5 },
  ];

  const sn = scoreNivel(candidato.nivelExperiencia, vaga.nivel);
  if (sn !== null) dimensoes.push({ score: sn, peso: 0.2 });

  const sm = scoreModelo(candidato.modeloPreferido, vaga.modelo);
  if (sm !== null) dimensoes.push({ score: sm, peso: 0.15 });

  const ss = scoreSalario(candidato.pretensaoSalarial, vaga.faixaSalarial);
  if (ss !== null) dimensoes.push({ score: ss, peso: 0.1 });

  if (vaga.modelo !== "REMOTO") {
    const sd = scoreDistancia(candidato.latitude, candidato.longitude, vaga.latitude, vaga.longitude);
    if (sd !== null) dimensoes.push({ score: sd, peso: 0.05 });
  }

  const pesoTotal = dimensoes.reduce((soma, d) => soma + d.peso, 0);
  const somaScores = dimensoes.reduce((soma, d) => soma + d.score * d.peso, 0);
  return Math.round(somaScores / pesoTotal);
}
