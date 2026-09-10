/**
 * NeuroEduca - Local Offline-First Database (IndexedDB Service)
 * Garante privacidade total dos dados sensíveis escolares sem envio a servidores externos não autorizados.
 */

import {
  Student,
  PedagogicalUser,
  ActivityOriginal,
  ActivityAdaptation,
  ProgressLog
} from "../types";

const DB_NAME = "neuroeduca_inclusive_db";
const DB_VERSION = 1;

// Seed Data: Equipe Pedagógica com 5 Perfis Distintos
export const DEFAULT_USERS: PedagogicalUser[] = [
  {
    id: "user-coord-1",
    name: "Mariana Alencar",
    email: "mariana.coord@escola.educa",
    role: "coordenador",
    roleTitle: "Coordenadora Pedagógica Geral",
    registrationNumber: "MAT-2024-001",
    avatarColor: "bg-purple-600",
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    id: "user-aee-1",
    name: "Profª Helena Vasconcelos",
    email: "helena.aee@escola.educa",
    role: "professor_aee",
    roleTitle: "Especialista em AEE & Neurodesenvolvimento",
    registrationNumber: "MAT-2024-042",
    avatarColor: "bg-teal-600",
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "user-regente-1",
    name: "Prof. Carlos Eduardo Rios",
    email: "carlos.regente@escola.educa",
    role: "professor_regente",
    roleTitle: "Professor Regente - 4º Ano Ensino Fundamental",
    registrationNumber: "MAT-2024-108",
    avatarColor: "bg-blue-600",
    createdAt: "2024-02-01T10:00:00Z"
  },
  {
    id: "user-psico-1",
    name: "Dra. Renata Siqueira",
    email: "renata.psico@escola.educa",
    role: "psicopedagogo",
    roleTitle: "Psicopedagoga & Mediadora de Conflitos",
    registrationNumber: "CRP-06/98214",
    avatarColor: "bg-amber-600",
    createdAt: "2024-02-10T11:00:00Z"
  },
  {
    id: "user-at-1",
    name: "Lucas Gabriel Morais",
    email: "lucas.at@escola.educa",
    role: "mediador_at",
    roleTitle: "Acompanhante Terapêutico (AT) / Mediador Escolar",
    registrationNumber: "MAT-2024-219",
    avatarColor: "bg-emerald-600",
    createdAt: "2024-02-15T14:00:00Z"
  }
];

// Seed Data: Alunos Neurodivergentes Reais com Perfis Sensoriais & Risco de Bullying
export const DEFAULT_STUDENTS: Student[] = [
  {
    id: "student-lucas-tea",
    name: "Lucas Pinheiro Fontes",
    birthDate: "2015-05-14",
    grade: "4º Ano A",
    turma: "Sala 12 - Matutino",
    neurodiversity: "TEA",
    supportLevel: "Nivel_2",
    medicalDiagnosticDetails: "TEA Nível 2 de Suporte (CID-11 6A02). Apresenta ecolalias funcionais, rigidez a mudanças bruscas de rotina e flapping de mãos em momentos de entusiasmo ou ansiedade.",
    hyperfocusInterests: ["Sistemas Ferroviários e Trens", "Astronomia e Planetas", "Desenho Geométrico"],
    communicationMode: "verbal_frases_curtas",
    sensoryProfile: {
      auditory: "hipersensivel",
      visual: "neutro",
      tactile: "hipersensivel",
      vestibular: "busca_movimento",
      specificTriggers: ["Sirene do recreio", "Gritos repentinos", "Toque físico surpresa por trás"],
      calmingStrategies: ["Abafador de ruído circum-aural", "Cronograma visual com cartões", "Cantinho sensorial com almofada de peso"]
    },
    antiBullyingVulnerabilityNotes: "Frequente alvo de imitações sarcásticas de seus gestos (flapping) no pátio e exclusão de jogos coletivos de bola. Dificuldade de identificar ironia ou risos zombeteiros de colegas.",
    createdAt: "2024-02-05T08:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z"
  },
  {
    id: "student-sofia-tdah",
    name: "Sofia Miranda Rezende",
    birthDate: "2016-08-22",
    grade: "3º Ano B",
    turma: "Sala 08 - Vespertino",
    neurodiversity: "TDAH",
    supportLevel: "Nivel_1",
    medicalDiagnosticDetails: "TDAH Tipo Combinado (Desatento e Hiperativo/Impulsivo). Alta agitação psicomotora, necessidade constante de troca postural e verbalizações impulsivas.",
    hyperfocusInterests: ["Animais Marinhos", "Pintura em Aquarela", "Lego e Blocos"],
    communicationMode: "verbal_fluente",
    sensoryProfile: {
      auditory: "neutro",
      visual: "hipossensivel",
      tactile: "neutro",
      vestibular: "busca_movimento",
      specificTriggers: ["Ficar sentada imóvel por mais de 20 minutos", "Ambiente estritamente cinza e silencioso"],
      calmingStrategies: ["Elástico de resistência na cadeira (fidget band)", "Pausas ativas como ajudante da turma", "Fidget toy de silicone"]
    },
    antiBullyingVulnerabilityNotes: "Rotulada pelos colegas de 'chata' ou 'intrometida' quando interrompe conversas sem perceber. Sofre exclusão passiva em trabalhos em grupo.",
    createdAt: "2024-02-08T09:30:00Z",
    updatedAt: "2024-03-02T11:00:00Z"
  },
  {
    id: "student-matheus-tod",
    name: "Matheus Borges Nogueira",
    birthDate: "2014-11-03",
    grade: "5º Ano C",
    turma: "Sala 15 - Matutino",
    neurodiversity: "TOD",
    supportLevel: "Nivel_2",
    medicalDiagnosticDetails: "Transtorno Opositivo Desafiador (TOD) em comorbidade com TDAH. Baixa tolerância à frustração e reações defensivas agressivas verbais quando se sente coagido ou humilhado.",
    hyperfocusInterests: ["Construção de Jogos Digitais", "Robótica", "Futebol de Botão"],
    communicationMode: "verbal_fluente",
    sensoryProfile: {
      auditory: "hipersensivel",
      visual: "neutro",
      tactile: "hipersensivel",
      vestibular: "neutro",
      specificTriggers: ["Tom de voz autoritário ou repreensão pública diante da turma", "Perder em disputas competitivas sem preparo"],
      calmingStrategies: ["Acordo prévio de escolhas dirigidas (Menu de Opções)", "Pausa para respiração diafragmática 4-7-8", "Negociação discreta fora do olhar dos colegas"]
    },
    antiBullyingVulnerabilityNotes: "Colegas utilizam de armadilhas sutis para desestabilizá-lo e fazê-lo explodir, para que apenas ele seja punido pelos professores. Requer proteção contra o bullying do tipo 'provocador dissimulado'.",
    createdAt: "2024-02-12T10:00:00Z",
    updatedAt: "2024-03-03T14:20:00Z"
  },
  {
    id: "student-beatriz-dislexia",
    name: "Beatriz Lins Castanho",
    birthDate: "2015-02-19",
    grade: "4º Ano A",
    turma: "Sala 12 - Matutino",
    neurodiversity: "DISLEXIA",
    supportLevel: "Nivel_1",
    medicalDiagnosticDetails: "Dislexia do desenvolvimento associada a ansiedade de desempenho escolar. Alta inteligência conceitual e raciocínio verbal, com grande defasagem na decodificação leitora sob pressão de tempo.",
    hyperfocusInterests: ["Contação Oral de Histórias", "Teatro de Fantoches", "Culinária Infantil"],
    communicationMode: "verbal_fluente",
    sensoryProfile: {
      auditory: "neutro",
      visual: "hipersensivel",
      tactile: "neutro",
      vestibular: "neutro",
      specificTriggers: ["Texto com letras miúdas sem espaçamento", "Ser chamada para ler em voz alta de surpresa", "Apelidos ligados à sua velocidade de leitura"],
      calmingStrategies: ["Régua de leitura com guia de linha", "Textos com fonte OpenDyslexic / sans-serif ampliada", "Gravações de áudio das instruções"]
    },
    antiBullyingVulnerabilityNotes: "Vítima de apelidos pejorativos ('lerda', 'ceguinha') quando solicitada a ler no quadro. Desenvolveu medo de ir à escola em dias de leitura coletiva.",
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-03-04T15:00:00Z"
  },
  {
    id: "student-gabriel-tea3",
    name: "Gabriel Santos Amorim",
    birthDate: "2016-03-10",
    grade: "2º Ano C",
    turma: "Sala 05 - Matutino",
    neurodiversity: "TEA",
    supportLevel: "Nivel_3",
    medicalDiagnosticDetails: "TEA Nível 3 de Suporte com comunicação não-verbal oralizada. Utiliza Comunicação Alternativa e Aumentativa (CAA - PECS e tablet com aplicativo de prancha). Requer acompanhamento integral de AT.",
    hyperfocusInterests: ["Música Clássica Suave", "Texturas Macias (Veludo e Pelúcia)", "Bolhas de Sabão"],
    communicationMode: "caa_pictogramas",
    sensoryProfile: {
      auditory: "hipersensivel",
      visual: "hipersensivel",
      tactile: "hipossensivel",
      vestibular: "busca_movimento",
      specificTriggers: ["Som agudo do apito da educação física", "Luz solar direta nos olhos", "Falta de rotina previsível visual"],
      calmingStrategies: ["Prancha de escolha PECS com velcro", "Colete sensorial ponderado (leve)", "Espaço de descompressão com luz difusa azul"]
    },
    antiBullyingVulnerabilityNotes: "Extremamente vulnerável a abusos e isolamento involuntário por não possuir fala oral para pedir socorro. Colegas já tomaram seus materiais sem que ele conseguisse alertar os inspetores.",
    createdAt: "2024-02-18T08:30:00Z",
    updatedAt: "2024-03-05T09:15:00Z"
  }
];

// Seed Data: Atividades Pedagógicas Especializadas em Combate ao Bullying
export const DEFAULT_ACTIVITIES: ActivityOriginal[] = [
  {
    id: "act-detetive-emocoes",
    title: "Detetive das Emoções: Brincadeira ou Bullying?",
    description: "Dinâmica investigativa com cartões ilustrados onde a turma analisa cenários cotidianos para discernir entre uma brincadeira onde todos riem juntos e atitudes repetitivas que causam sofrimento e exclusão.",
    targetAge: "7 a 11 anos (3º ao 5º Ano)",
    subject: "Educação Socioemocional & Convivência Ética",
    antiBullyingCoreTheme: "identificacao_bullying_vs_brincadeira",
    instructions: "1. Distribuir fichas de cenários com ilustrações claras. 2. Apresentar o critério dos 3 pilares: Intenção, Repetição e Desequilíbrio de Poder. 3. Classificar os casos no 'Semáforo da Convivência' (Verde = Amizade/Divertido, Amarelo = Alerta de incômodo, Vermelho = Bullying). 4. Praticar o pedido de parada assertivo."
  },
  {
    id: "act-circulo-empatia",
    title: "O Círculo da Empatia: Nossas Mentes São Diferentes e Incríveis",
    description: "Roda de diálogo sensorial onde as crianças experimentam simulações leves de percepção (ex: luvas grossas para amarrar cadarço, sons sobrepostos) para compreender a neurodiversidade e desmistificar estigmas.",
    targetAge: "6 a 12 anos",
    subject: "Ciências Humanas & Cidadania Inclusiva",
    antiBullyingCoreTheme: "empatia_e_respeito_as_diferencas",
    instructions: "1. Introduzir o conceito de que cada cérebro processa o mundo de maneira única. 2. Realizar pequenas estações sensoriais de empatia. 3. Cada aluno desenha seu 'Superpoder' e seu 'Ponto de Cuidado'. 4. Montar o Mosaico Coletivo de Proteção Mútua na parede da sala."
  },
  {
    id: "act-guardioes-espectador",
    title: "A Turma dos Guardiões: O Poder do Espectador Ativo",
    description: "Simulação orientada sobre o papel de quem assiste ao bullying. Foco em transformar o 'espectador silencioso' em um 'guardião da amizade' que não ri de piadas maldosas e acolhe quem foi ferido.",
    targetAge: "8 a 13 anos",
    subject: "Ética, Linguagens & Teatro Pedagógico",
    antiBullyingCoreTheme: "espectador_ativo_e_denuncia_segura",
    instructions: "1. Apresentar o teatro de fantoches ou tirinha da situação. 2. Demonstrar que o bullying só continua se houver plateia que aplaude ou se cala. 3. Ensinar os 4 'Passos do Guardião': Não rir, Chamar a vítima para outra brincadeira, Dizer 'Isso não é legal', e Avisar um adulto de confiança."
  },
  {
    id: "act-semaforo-autorregulacao",
    title: "O Semáforo dos Sentimentos e o Cartão de Ajuda Seguro",
    description: "Confecção de um instrumento tátil e visual individual para que cada aluno consiga mapear seu estado emocional interno antes que a frustração escale, prevenindo brigas e possibilitando refúgio seguro.",
    targetAge: "5 a 10 anos",
    subject: "Artes Visuais & Saúde Mental Escolar",
    antiBullyingCoreTheme: "autorregulacao_emocional_no_conflito",
    instructions: "1. Construir com cada aluno o seu 'Termômetro Emocional' com ponteiro deslizante. 2. Definir o que fazer em cada cor (Verde = Tudo bem; Amarelo = Preciso de uma pausa/respirar; Vermelho = Mostre o cartão ao professor). 3. Treinar a turma para respeitar quem está no tempo de descompressão."
  },
  {
    id: "act-comunicacao-assertiva",
    title: "Palavras Escudo: Comunicação Assertiva e Limites Pessoais",
    description: "Treinamento de scripts verbais e visuais para que alunos com timidez, TEA ou dificuldades de linguagem consigam expressar seus limites com firmeza, sem violência física.",
    targetAge: "6 a 11 anos",
    subject: "Língua Portuguesa & Habilidades Sociais",
    antiBullyingCoreTheme: "comunicacao_assertiva_e_limites",
    instructions: "1. Treinar a postura física e contato visual confortável ou direcionado. 2. Praticar as 3 'Palavras Escudo': 'PARE', 'NÃO GOSTEI' e 'ME RESPEITE'. 3. Disponibilizar o cartão de comunicação para quem tem fala oral restrita. 4. Fazer dramatizações positivas com pares acolhedores."
  }
];

// Seed Data: Histórico Inicial de Acompanhamento e Métricas de Progresso
export const DEFAULT_PROGRESS_LOGS: ProgressLog[] = [
  {
    id: "log-lucas-1",
    studentId: "student-lucas-tea",
    authorId: "user-aee-1",
    authorName: "Profª Helena Vasconcelos",
    authorRole: "professor_aee",
    date: "2024-03-01",
    activityTitle: "Detetive das Emoções: Brincadeira ou Bullying?",
    category: "consciencia_bullying",
    scoreRating: 4,
    notes: "Lucas utilizou os cartões com ilustração de trens para associar emoções. Conseguiu apontar corretamente que rir quando um colega tropeça e deixa cair o material é uma provocação dolorosa e não uma brincadeira coletiva.",
    observedBehaviors: ["Apontou cartão visual", "Identificou expressão facial de tristeza", "Manteve foco com apoio do abafador"],
    interventionsApplied: ["Uso de histórias sociais ilustradas", "Pausa tátil a cada 10 minutos"]
  },
  {
    id: "log-lucas-2",
    studentId: "student-lucas-tea",
    authorId: "user-at-1",
    authorName: "Lucas Gabriel Morais",
    authorRole: "mediador_at",
    date: "2024-03-05",
    activityTitle: "Mediação no Recreio Dirigido",
    category: "interacao_social",
    scoreRating: 4,
    notes: "Dois colegas do 4º ano convidaram Lucas para montar um circuito de pistas de trem no chão do pátio. Pela primeira vez, Lucas permaneceu 15 minutos em jogo compartilhado sem isolamento.",
    observedBehaviors: ["Compartilhou brinquedo do seu hiperfoco", "Sorriu em interação direta", "Aceitou a aproximação de colegas sem crise"],
    interventionsApplied: ["Mediação de aproximação estruturada pelo AT", "Uso prévio de protetor auditivo para o barulho do recreio"]
  },
  {
    id: "log-sofia-1",
    studentId: "student-sofia-tdah",
    authorId: "user-regente-1",
    authorName: "Prof. Carlos Eduardo Rios",
    authorRole: "professor_regente",
    date: "2024-03-02",
    activityTitle: "O Círculo da Empatia",
    category: "autorregulacao_sensorial",
    scoreRating: 5,
    notes: "Sofia foi a 'guardiã do bastão de fala'. Quando sentiu vontade de interromper os colegas, apertou a bolinha sensorial e aguardou a sua vez. A turma aplaudiu o respeito mútuo.",
    observedBehaviors: ["Aguardou sua vez de falar com apoio de objeto tátil", "Expressou empatia com colega que relatou tristeza", "Fez pausa motora produtiva"],
    interventionsApplied: ["Bolinha antiestresse de borracha", "Função de liderança no grupo"]
  },
  {
    id: "log-matheus-1",
    studentId: "student-matheus-tod",
    authorId: "user-psico-1",
    authorName: "Dra. Renata Siqueira",
    authorRole: "psicopedagogo",
    date: "2024-03-04",
    activityTitle: "Palavras Escudo e Limites Pessoais",
    category: "consciencia_bullying",
    scoreRating: 4,
    notes: "Durante um jogo na quadra, um colega tentou caçoar dele por errar o passe. Matheus ergueu a mão, disse 'Pare, não gostei' e dirigiu-se ao mediador em vez de atirar a bola no outro garoto. Grande vitória na gestão da raiva!",
    observedBehaviors: ["Utilizou script de comunicação assertiva", "Evitou agressão física reflexa", "Procurou adulto de apoio"],
    interventionsApplied: ["Reforço positivo imediato em particular", "Validação do sentimento de raiva sem julgamento"]
  },
  {
    id: "log-beatriz-1",
    studentId: "student-beatriz-dislexia",
    authorId: "user-aee-1",
    authorName: "Profª Helena Vasconcelos",
    authorRole: "professor_aee",
    date: "2024-03-03",
    activityTitle: "Roda de Histórias em Quadrinhos",
    category: "engajamento_tarefa",
    scoreRating: 5,
    notes: "Beatriz apresentou uma tirinha criada por ela sobre uma fada que não sabia ler runas mágicas mas salvou o reino com a sua voz. A turma ficou encantada e a autoestima da aluna teve elevação notável.",
    observedBehaviors: ["Participou oralmente com desenvoltura", "Sentiu-se valorizada pelos colegas", "Não demonstrou ansiedade de esquiva"],
    interventionsApplied: ["Adaptação da tarefa com ênfase na oralidade", "Eliminação da leitura pública sob pressão"]
  },
  {
    id: "log-gabriel-1",
    studentId: "student-gabriel-tea3",
    authorId: "user-at-1",
    authorName: "Lucas Gabriel Morais",
    authorRole: "mediador_at",
    date: "2024-03-06",
    activityTitle: "O Semáforo dos Sentimentos - Cartão Visual",
    category: "autorregulacao_sensorial",
    scoreRating: 4,
    notes: "Gabriel utilizou o cartão vermelho de sua prancha PECS quando a sala ao lado começou a bater palmas ritmadas. O mediador o levou ao cantinho calmo com o colete ponderado antes do início de uma crise.",
    observedBehaviors: ["Comunicação funcional por PECS", "Antecipação de sobrecarga sensorial", "Autorregulação em ambiente tranquilo"],
    interventionsApplied: ["Prancha de comunicação alternativa imediata", "Cantinho sensorial com luz azul difusa"]
  }
];

// Seed Data: Exemplo de Adaptação Completa com Diretrizes Visuais & Sensoriais
export const DEFAULT_ADAPTATIONS: ActivityAdaptation[] = [
  {
    id: "adapt-exemplo-lucas",
    activityId: "act-detetive-emocoes",
    studentId: "student-lucas-tea",
    studentName: "Lucas Pinheiro Fontes",
    adaptedByUserId: "user-aee-1",
    adaptedByUserName: "Profª Helena Vasconcelos",
    adaptedByUserRole: "professor_aee",
    neurodiversity: "TEA",
    supportLevel: "Nivel_2",
    originalTitle: "Detetive das Emoções: Brincadeira ou Bullying?",
    adaptedTitle: "Estação Detetive dos Sentimentos com o Maquinista Lucas",
    pedagogicalGoal: "Desenvolver a discriminação concreta entre interações acolhedoras e comportamentos de bullying, utilizando suporte visual ancorado no hiperfoco em trens.",
    antiBullyingObjective: "Identificar quando uma atitude de um colega é desrespeitosa e treinar o uso do 'Cartão do Semáforo Vermelho' para buscar o professor mediador imediatamente.",
    stepByStep: [
      "Passo 1 (5 min): Apresentar a 'Trilha do Trem da Amizade' com 3 estações (Estação Verde = Amizade, Estação Amarela = Parar e Pensar, Estação Vermelha = Bullying/Socorro).",
      "Passo 2 (10 min): Análise em pares com um colega tutor de apoio. Cada situação é representada em uma foto de alta definição com balões de fala em linguagem direta, sem metáforas.",
      "Passo 3 (8 min): Lucas encaixa o trenzinho na estação correspondente a cada cartão de situação social.",
      "Passo 4 (7 min): Treino prático da frase concreta: 'Isso é Estação Vermelha. Pare, não gostei!' mostrando a mão espalmada."
    ],
    visualGuidelines: [
      "Cronograma visual em tiras com fotos reais de cada etapa da atividade.",
      "Cartões de emoções plastificados com bordas de alto contraste e ícones PECS padronizados.",
      "Eliminação de qualquer metáfora abstrata (ex: em vez de 'ele pisou na bola', usar 'ele pegou seu brinquedo sem pedir')."
    ],
    sensoryGuidelines: [
      "Disponibilizar abafador de ruídos circum-aural antes de iniciar a discussão em grupo.",
      "Posicionar Lucas na extremidade da mesa, com vista livre para a porta e longe do ar-condicionado barulhento.",
      "Disponibilizar objeto de transição tátil (trenzinho sensorial de madeira lisa com peso suave)."
    ],
    socialStoryScript: "História Social: 'Às vezes meus colegas brincam e todos ficam contentes. Mas se alguém ri do jeito que mexo minhas mãos ou se alguém não me deixa brincar, isso não é brincadeira. Isso se chama bullying. Meu corpo pode sentir o coração bater rápido. Quando isso acontecer, eu respiro fundo, mostro o cartão da Estação Vermelha e caminho até a Profª Helena ou o tio Lucas.'",
    bystanderGuideline: "Instruir os colegas da mesa: 'Se vocês virem alguém imitando o movimento de mãos do Lucas, digam na mesma hora: 'Respeite o Lucas, cada um tem seu jeito'. Depois, convidem o Lucas para mostrar o trem dele.'",
    teacherMediationTips: [
      "Nunca force o contato visual direto durante a atividade; a escuta atenta do Lucas frequentemente ocorre com o olhar desviado.",
      "Se notar aumento no flapping acompanhado de tensão nos ombros, ofereça imediatamente a pausa proprioceptiva no cantinho sensorial.",
      "Dê reforço positivo descritivo específico: 'Lucas, você soube identificar exatamente quando a situação era desrespeitosa!'."
    ],
    evaluationMetric: "Capacidade de apontar corretamente pelo menos 3 cartões de situações sociais e utilizar o gesto ou cartão de pedir ajuda.",
    sourceEngine: "pedagogical_heuristic_offline",
    isApproved: true,
    createdAt: "2024-03-01T14:30:00Z"
  }
];

class NeuroEducaDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private readonly storageKeys = {
    students: "neuroeduca_students_v1",
    users: "neuroeduca_users_v1",
    currentUser: "neuroeduca_current_user_v1",
    activities: "neuroeduca_activities_v1",
    adaptations: "neuroeduca_adaptations_v1",
    progressLogs: "neuroeduca_logs_v1"
  };

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        console.warn("IndexedDB não disponível no navegador. Recorrendo a armazenamento local.");
        return resolve(null as any);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("students")) {
          db.createObjectStore("students", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("activities")) {
          db.createObjectStore("activities", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("adaptations")) {
          db.createObjectStore("adaptations", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("progress_logs")) {
          db.createObjectStore("progress_logs", { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Erro ao inicializar IndexedDB:", request.error);
        resolve(null as any);
      };
    });

    return this.dbPromise;
  }

  // Generic LocalStorage Fallback Helper
  private getLocal<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(item);
    } catch {
      return defaultVal;
    }
  }

  private setLocal<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Falha ao salvar no localStorage", e);
    }
  }

  // --- Students Management ---
  async getStudents(): Promise<Student[]> {
    try {
      const db = await this.initDatabase();
      if (!db) return this.getLocal<Student[]>(this.storageKeys.students, DEFAULT_STUDENTS);

      return new Promise((resolve) => {
        const tx = db.transaction("students", "readonly");
        const store = tx.objectStore("students");
        const req = store.getAll();
        req.onsuccess = () => {
          if (!req.result || req.result.length === 0) {
            // Seed
            this.seedStudents(db).then(() => resolve(DEFAULT_STUDENTS));
          } else {
            resolve(req.result);
          }
        };
        req.onerror = () => resolve(this.getLocal<Student[]>(this.storageKeys.students, DEFAULT_STUDENTS));
      });
    } catch {
      return this.getLocal<Student[]>(this.storageKeys.students, DEFAULT_STUDENTS);
    }
  }

  private async seedStudents(db: IDBDatabase): Promise<void> {
    const tx = db.transaction("students", "readwrite");
    const store = tx.objectStore("students");
    DEFAULT_STUDENTS.forEach((student) => store.put(student));
    this.setLocal(this.storageKeys.students, DEFAULT_STUDENTS);
  }

  async saveStudent(student: Student): Promise<void> {
    const updated = { ...student, updatedAt: new Date().toISOString() };
    const current = await this.getStudents();
    const index = current.findIndex((s) => s.id === updated.id);
    if (index >= 0) {
      current[index] = updated;
    } else {
      current.unshift(updated);
    }
    this.setLocal(this.storageKeys.students, current);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("students", "readwrite");
      tx.objectStore("students").put(updated);
    }
  }

  async deleteStudent(studentId: string): Promise<void> {
    const current = (await this.getStudents()).filter((s) => s.id !== studentId);
    this.setLocal(this.storageKeys.students, current);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("students", "readwrite");
      tx.objectStore("students").delete(studentId);
    }
  }

  // --- Users & Roles Management ---
  async getUsers(): Promise<PedagogicalUser[]> {
    try {
      const db = await this.initDatabase();
      if (!db) return this.getLocal<PedagogicalUser[]>(this.storageKeys.users, DEFAULT_USERS);

      return new Promise((resolve) => {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const req = store.getAll();
        req.onsuccess = () => {
          if (!req.result || req.result.length === 0) {
            const seedTx = db.transaction("users", "readwrite");
            DEFAULT_USERS.forEach((u) => seedTx.objectStore("users").put(u));
            this.setLocal(this.storageKeys.users, DEFAULT_USERS);
            resolve(DEFAULT_USERS);
          } else {
            resolve(req.result);
          }
        };
        req.onerror = () => resolve(this.getLocal<PedagogicalUser[]>(this.storageKeys.users, DEFAULT_USERS));
      });
    } catch {
      return this.getLocal<PedagogicalUser[]>(this.storageKeys.users, DEFAULT_USERS);
    }
  }

  async saveUser(user: PedagogicalUser): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.setLocal(this.storageKeys.users, users);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("users", "readwrite");
      tx.objectStore("users").put(user);
    }
  }

  getCurrentUser(): PedagogicalUser {
    return this.getLocal<PedagogicalUser>(this.storageKeys.currentUser, DEFAULT_USERS[1]); // Default to AEE Specialist
  }

  setCurrentUser(user: PedagogicalUser): void {
    this.setLocal(this.storageKeys.currentUser, user);
  }

  // --- Original Activities Library ---
  async getActivities(): Promise<ActivityOriginal[]> {
    try {
      const db = await this.initDatabase();
      if (!db) return this.getLocal<ActivityOriginal[]>(this.storageKeys.activities, DEFAULT_ACTIVITIES);

      return new Promise((resolve) => {
        const tx = db.transaction("activities", "readonly");
        const store = tx.objectStore("activities");
        const req = store.getAll();
        req.onsuccess = () => {
          if (!req.result || req.result.length === 0) {
            const seedTx = db.transaction("activities", "readwrite");
            DEFAULT_ACTIVITIES.forEach((a) => seedTx.objectStore("activities").put(a));
            this.setLocal(this.storageKeys.activities, DEFAULT_ACTIVITIES);
            resolve(DEFAULT_ACTIVITIES);
          } else {
            resolve(req.result);
          }
        };
        req.onerror = () => resolve(this.getLocal<ActivityOriginal[]>(this.storageKeys.activities, DEFAULT_ACTIVITIES));
      });
    } catch {
      return this.getLocal<ActivityOriginal[]>(this.storageKeys.activities, DEFAULT_ACTIVITIES);
    }
  }

  async saveActivity(activity: ActivityOriginal): Promise<void> {
    const list = await this.getActivities();
    const idx = list.findIndex((a) => a.id === activity.id);
    if (idx >= 0) {
      list[idx] = activity;
    } else {
      list.unshift(activity);
    }
    this.setLocal(this.storageKeys.activities, list);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("activities", "readwrite");
      tx.objectStore("activities").put(activity);
    }
  }

  // --- Adaptations Management ---
  async getAdaptations(): Promise<ActivityAdaptation[]> {
    try {
      const db = await this.initDatabase();
      if (!db) return this.getLocal<ActivityAdaptation[]>(this.storageKeys.adaptations, DEFAULT_ADAPTATIONS);

      return new Promise((resolve) => {
        const tx = db.transaction("adaptations", "readonly");
        const store = tx.objectStore("adaptations");
        const req = store.getAll();
        req.onsuccess = () => {
          if (!req.result || req.result.length === 0) {
            const seedTx = db.transaction("adaptations", "readwrite");
            DEFAULT_ADAPTATIONS.forEach((ad) => seedTx.objectStore("adaptations").put(ad));
            this.setLocal(this.storageKeys.adaptations, DEFAULT_ADAPTATIONS);
            resolve(DEFAULT_ADAPTATIONS);
          } else {
            resolve(req.result);
          }
        };
        req.onerror = () => resolve(this.getLocal<ActivityAdaptation[]>(this.storageKeys.adaptations, DEFAULT_ADAPTATIONS));
      });
    } catch {
      return this.getLocal<ActivityAdaptation[]>(this.storageKeys.adaptations, DEFAULT_ADAPTATIONS);
    }
  }

  async saveAdaptation(adaptation: ActivityAdaptation): Promise<void> {
    const list = await this.getAdaptations();
    const idx = list.findIndex((a) => a.id === adaptation.id);
    if (idx >= 0) {
      list[idx] = adaptation;
    } else {
      list.unshift(adaptation);
    }
    this.setLocal(this.storageKeys.adaptations, list);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("adaptations", "readwrite");
      tx.objectStore("adaptations").put(adaptation);
    }
  }

  async deleteAdaptation(adaptationId: string): Promise<void> {
    const list = (await this.getAdaptations()).filter((a) => a.id !== adaptationId);
    this.setLocal(this.storageKeys.adaptations, list);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("adaptations", "readwrite");
      tx.objectStore("adaptations").delete(adaptationId);
    }
  }

  // --- Progress Logs & Monitoring ---
  async getProgressLogs(studentId?: string): Promise<ProgressLog[]> {
    try {
      const db = await this.initDatabase();
      let allLogs: ProgressLog[] = [];
      if (!db) {
        allLogs = this.getLocal<ProgressLog[]>(this.storageKeys.progressLogs, DEFAULT_PROGRESS_LOGS);
      } else {
        allLogs = await new Promise<ProgressLog[]>((resolve) => {
          const tx = db.transaction("progress_logs", "readonly");
          const store = tx.objectStore("progress_logs");
          const req = store.getAll();
          req.onsuccess = () => {
            if (!req.result || req.result.length === 0) {
              const seedTx = db.transaction("progress_logs", "readwrite");
              DEFAULT_PROGRESS_LOGS.forEach((l) => seedTx.objectStore("progress_logs").put(l));
              this.setLocal(this.storageKeys.progressLogs, DEFAULT_PROGRESS_LOGS);
              resolve(DEFAULT_PROGRESS_LOGS);
            } else {
              resolve(req.result);
            }
          };
          req.onerror = () => resolve(this.getLocal<ProgressLog[]>(this.storageKeys.progressLogs, DEFAULT_PROGRESS_LOGS));
        });
      }

      if (studentId) {
        return allLogs.filter((l) => l.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return allLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      const all = this.getLocal<ProgressLog[]>(this.storageKeys.progressLogs, DEFAULT_PROGRESS_LOGS);
      if (studentId) return all.filter((l) => l.studentId === studentId);
      return all;
    }
  }

  async saveProgressLog(log: ProgressLog): Promise<void> {
    const all = await this.getProgressLogs();
    const idx = all.findIndex((l) => l.id === log.id);
    if (idx >= 0) {
      all[idx] = log;
    } else {
      all.unshift(log);
    }
    this.setLocal(this.storageKeys.progressLogs, all);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction("progress_logs", "readwrite");
      tx.objectStore("progress_logs").put(log);
    }
  }

  // --- Export / Import Backup Offline ---
  async exportFullBackup(): Promise<string> {
    const [students, users, activities, adaptations, logs] = await Promise.all([
      this.getStudents(),
      this.getUsers(),
      this.getActivities(),
      this.getAdaptations(),
      this.getProgressLogs()
    ]);

    const backup = {
      version: 1,
      appName: "NeuroEduca",
      exportedAt: new Date().toISOString(),
      data: {
        students,
        users,
        activities,
        adaptations,
        progressLogs: logs
      }
    };
    return JSON.stringify(backup, null, 2);
  }

  async importBackup(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) throw new Error("Formato de backup inválido.");

      const { students, users, activities, adaptations, progressLogs } = parsed.data;

      if (Array.isArray(students)) {
        this.setLocal(this.storageKeys.students, students);
      }
      if (Array.isArray(users)) {
        this.setLocal(this.storageKeys.users, users);
      }
      if (Array.isArray(activities)) {
        this.setLocal(this.storageKeys.activities, activities);
      }
      if (Array.isArray(adaptations)) {
        this.setLocal(this.storageKeys.adaptations, adaptations);
      }
      if (Array.isArray(progressLogs)) {
        this.setLocal(this.storageKeys.progressLogs, progressLogs);
      }

      // Sync to IndexedDB
      const db = await this.initDatabase();
      if (db) {
        const tx = db.transaction(["students", "users", "activities", "adaptations", "progress_logs"], "readwrite");
        if (Array.isArray(students)) students.forEach((s) => tx.objectStore("students").put(s));
        if (Array.isArray(users)) users.forEach((u) => tx.objectStore("users").put(u));
        if (Array.isArray(activities)) activities.forEach((a) => tx.objectStore("activities").put(a));
        if (Array.isArray(adaptations)) adaptations.forEach((ad) => tx.objectStore("adaptations").put(ad));
        if (Array.isArray(progressLogs)) progressLogs.forEach((l) => tx.objectStore("progress_logs").put(l));
      }
      return true;
    } catch (e) {
      console.error("Falha ao importar backup:", e);
      return false;
    }
  }

  async resetToDefaults(): Promise<void> {
    this.setLocal(this.storageKeys.students, DEFAULT_STUDENTS);
    this.setLocal(this.storageKeys.users, DEFAULT_USERS);
    this.setLocal(this.storageKeys.activities, DEFAULT_ACTIVITIES);
    this.setLocal(this.storageKeys.adaptations, DEFAULT_ADAPTATIONS);
    this.setLocal(this.storageKeys.progressLogs, DEFAULT_PROGRESS_LOGS);
    this.setLocal(this.storageKeys.currentUser, DEFAULT_USERS[1]);

    const db = await this.initDatabase();
    if (db) {
      const tx = db.transaction(["students", "users", "activities", "adaptations", "progress_logs"], "readwrite");
      tx.objectStore("students").clear();
      tx.objectStore("users").clear();
      tx.objectStore("activities").clear();
      tx.objectStore("adaptations").clear();
      tx.objectStore("progress_logs").clear();

      DEFAULT_STUDENTS.forEach((s) => tx.objectStore("students").put(s));
      DEFAULT_USERS.forEach((u) => tx.objectStore("users").put(u));
      DEFAULT_ACTIVITIES.forEach((a) => tx.objectStore("activities").put(a));
      DEFAULT_ADAPTATIONS.forEach((ad) => tx.objectStore("adaptations").put(ad));
      DEFAULT_PROGRESS_LOGS.forEach((l) => tx.objectStore("progress_logs").put(l));
    }
  }
}

export const localDb = new NeuroEducaDatabase();
