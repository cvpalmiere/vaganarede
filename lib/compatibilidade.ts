import "server-only";

type SkillCandidato = { skillId: string; nivel: number };
type SkillVaga = { skillId: string; peso: number };

// score de 0 a 100 - cada skill da vaga contribui proporcional ao seu peso e ao nivel do candidato nela
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