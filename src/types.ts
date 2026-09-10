/**
 * NeuroEduca - Types & Data Models
 * Sistema de Pedagogia Inclusiva, Adaptação de Atividades e Combate ao Bullying
 */

export type UserRole =
  | "coordenador"      // Coordenador Pedagógico / Gestor Inclusivo
  | "professor_aee"    // Professor do AEE (Atendimento Educacional Especializado)
  | "professor_regente"// Professor da Sala Regular
  | "psicopedagogo"    // Psicopedagogo / Psicólogo Escolar
  | "mediador_at";     // Mediador Escolar / Acompanhante Terapêutico (AT)

export interface PedagogicalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  registrationNumber: string; // Matrícula escolar
  avatarColor: string;
  createdAt: string;
}

export type NeurodiversityType =
  | "TEA"        // Transtorno do Espectro Autista
  | "TDAH"       // Transtorno de Déficit de Atenção e Hiperatividade
  | "TOD"        // Transtorno Opositivo Desafiador
  | "DISLEXIA"   // Dislexia e Transtornos de Leitura
  | "AH_SD"      // Altas Habilidades / Superdotação
  | "DEF_INTELECTUAL" // Deficiência Intelectual / Síndrome de Down
  | "TPS";       // Transtorno de Processamento Sensorial

export type SupportLevel =
  | "Nivel_1" // Nível 1 - Suporte Leve
  | "Nivel_2" // Nível 2 - Suporte Moderado
  | "Nivel_3"; // Nível 3 - Suporte Substancial / Intenso

export interface SensoryProfile {
  auditory: "hipersensivel" | "hipossensivel" | "neutro";
  visual: "hipersensivel" | "hipossensivel" | "neutro";
  tactile: "hipersensivel" | "hipossensivel" | "neutro";
  vestibular: "busca_movimento" | "evita_movimento" | "neutro";
  specificTriggers: string[]; // ex: sino da escola, luz fluorescente, toque inesperado
  calmingStrategies: string[]; // ex: abafador de ruídos, mordedor sensorial, pausa no cantinho calmo
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  grade: string;
  turma: string;
  neurodiversity: NeurodiversityType;
  supportLevel: SupportLevel;
  medicalDiagnosticDetails: string;
  hyperfocusInterests: string[]; // Interesses hiperfocados (chave para engajamento pedagógico)
  communicationMode: "verbal_fluente" | "verbal_frases_curtas" | "ecolalia_funcional" | "caa_pictogramas" | "gestual_corporal";
  sensoryProfile: SensoryProfile;
  antiBullyingVulnerabilityNotes: string; // Ex: dificuldade de ler duplos sentidos, tendência a isolamento no recreio
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityOriginal {
  id: string;
  title: string;
  description: string;
  targetAge: string;
  subject: string;
  antiBullyingCoreTheme:
    | "identificacao_bullying_vs_brincadeira"
    | "empatia_e_respeito_as_diferencas"
    | "espectador_ativo_e_denuncia_segura"
    | "autorregulacao_emocional_no_conflito"
    | "comunicacao_assertiva_e_limites";
  instructions: string;
}

export interface ActivityAdaptation {
  id: string;
  activityId?: string;
  studentId?: string;
  studentName?: string;
  adaptedByUserId: string;
  adaptedByUserName: string;
  adaptedByUserRole: UserRole;
  neurodiversity: NeurodiversityType;
  supportLevel: SupportLevel;
  originalTitle: string;
  adaptedTitle: string;
  pedagogicalGoal: string;
  antiBullyingObjective: string;
  stepByStep: string[];
  visualGuidelines: string[];
  sensoryGuidelines: string[];
  socialStoryScript: string;
  bystanderGuideline: string;
  teacherMediationTips: string[];
  evaluationMetric: string;
  sourceEngine: "gemini-3.8-flash" | "pedagogical_heuristic_offline";
  isApproved: boolean;
  createdAt: string;
}

export interface ProgressLog {
  id: string;
  studentId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  date: string;
  activityTitle: string;
  category: "interacao_social" | "consciencia_bullying" | "autorregulacao_sensorial" | "engajamento_tarefa";
  scoreRating: 1 | 2 | 3 | 4 | 5; // 1 a 5 escala de desenvolvimento
  notes: string;
  observedBehaviors: string[]; // ex: "Pediu ajuda ao professor", "Reconheceu provocação", "Utilizou abafador"
  interventionsApplied: string[];
}

export interface StudentStats {
  totalActivitiesCompleted: number;
  socialInteractionScoreAvg: number;
  bullyingAwarenessScoreAvg: number;
  sensoryRegulationScoreAvg: number;
  taskEngagementScoreAvg: number;
  recentLogsCount: number;
  crisisEpisodesLastMonth: number;
}
