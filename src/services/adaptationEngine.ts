/**
 * NeuroEduca - Motor Especialista de Adaptação Pedagógica & Anti-Bullying
 * Suporta modo Online (Gemini 3.8 Flash via API Express) e Modo 100% Offline (Matriz Heurística Clínica-Pedagógica)
 */

import {
  NeurodiversityType,
  SupportLevel,
  Student,
  ActivityOriginal,
  ActivityAdaptation,
  PedagogicalUser
} from "../types";

export interface AdaptationRequest {
  activityTitle: string;
  activityDescription: string;
  ageGroup: string;
  neurodiversity: NeurodiversityType;
  supportLevel: SupportLevel;
  student?: Student;
  user: PedagogicalUser;
  forceOffline?: boolean;
}

export async function adaptPedagogicalActivity(req: AdaptationRequest): Promise<ActivityAdaptation> {
  // If not forcing offline, try server-side Gemini adaptation first
  if (!req.forceOffline) {
    try {
      const resp = await fetch("/api/adapt-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityTitle: req.activityTitle,
          activityDescription: req.activityDescription,
          ageGroup: req.ageGroup,
          neurodiversityType: req.neurodiversity,
          supportLevel: req.supportLevel,
          studentName: req.student?.name || "Aluno(a)",
          sensorySensitivities: req.student?.sensoryProfile
            ? `Auditivo: ${req.student.sensoryProfile.auditory}, Visual: ${req.student.sensoryProfile.visual}, Tátil: ${req.student.sensoryProfile.tactile}, Gatilhos: ${req.student.sensoryProfile.specificTriggers.join(", ")}`
            : "Sensibilidade a ruídos repentinos",
          specialInterests: req.student?.hyperfocusInterests?.join(", ") || "Atividades lúdicas gerais"
        })
      });

      if (resp.ok) {
        const json = await resp.json();
        if (json.success && json.data) {
          const aiData = json.data;
          return {
            id: `adapt-${Date.now()}`,
            studentId: req.student?.id,
            studentName: req.student?.name,
            adaptedByUserId: req.user.id,
            adaptedByUserName: req.user.name,
            adaptedByUserRole: req.user.role,
            neurodiversity: req.neurodiversity,
            supportLevel: req.supportLevel,
            originalTitle: req.activityTitle,
            adaptedTitle: aiData.adaptedTitle || `Adaptação: ${req.activityTitle}`,
            pedagogicalGoal: aiData.pedagogicalGoal || "Objetivo de inclusão e respeito mútuo.",
            antiBullyingObjective: aiData.antiBullyingObjective || "Conscientização e prevenção de condutas hostis.",
            stepByStep: Array.isArray(aiData.stepByStep) ? aiData.stepByStep : ["Passo a passo estruturado"],
            visualGuidelines: Array.isArray(aiData.visualGuidelines) ? aiData.visualGuidelines : ["Apoio visual"],
            sensoryGuidelines: Array.isArray(aiData.sensoryGuidelines) ? aiData.sensoryGuidelines : ["Acomodação sensorial"],
            socialStoryScript: aiData.socialStoryScript || "Roteiro de apoio social.",
            bystanderGuideline: aiData.bystanderGuideline || "Apoio dos pares.",
            teacherMediationTips: Array.isArray(aiData.teacherMediationTips) ? aiData.teacherMediationTips : ["Mediação empática"],
            evaluationMetric: aiData.evaluationMetric || "Observação qualitativa da participação.",
            sourceEngine: json.source || "gemini-3.8-flash",
            isApproved: req.user.role === "coordenador" || req.user.role === "professor_aee",
            createdAt: new Date().toISOString()
          };
        }
      }
    } catch (e) {
      console.warn("API de IA indisponível ou offline. Ativando Matriz Pedagógica Offline Nativa.", e);
    }
  }

  // Native Offline Expert Pedagogical Matrix
  return generateOfflinePedagogicalAdaptation(req);
}

function generateOfflinePedagogicalAdaptation(req: AdaptationRequest): ActivityAdaptation {
  const { activityTitle, activityDescription, neurodiversity, supportLevel, student, user } = req;
  const studentName = student ? student.name.split(" ")[0] : "o(a) Aluno(a)";
  const interestHook = student?.hyperfocusInterests?.[0] || "Elementos Lúdicos";

  let adaptedTitle = `Adaptação Acessível: ${activityTitle}`;
  let pedagogicalGoal = "";
  let antiBullyingObjective = "";
  let stepByStep: string[] = [];
  let visualGuidelines: string[] = [];
  let sensoryGuidelines: string[] = [];
  let socialStoryScript = "";
  let bystanderGuideline = "";
  let teacherMediationTips: string[] = [];
  let evaluationMetric = "";

  switch (neurodiversity) {
    case "TEA":
      if (supportLevel === "Nivel_3") {
        adaptedTitle = `[TEA N3/CAA] ${activityTitle} com Prancha Visual & Interesses em ${interestHook}`;
        pedagogicalGoal = `Proporcionar a vivência da proposta de convivência e respeito através de Comunicação Alternativa (CAA/PECS), garantindo a proteção integral de ${studentName} e a mediação de pares tutores.`;
        antiBullyingObjective = `Capacitar ${studentName} a usar o cartão de socorro visual (símbolo de 'PARE' e 'AJUDA') diante de qualquer desconforto ou toque indesejado, enquanto a turma aprende a respeitar o espaço pessoal dele.`;
        stepByStep = [
          `1. Antecipação Visual (3 min): O mediador/AT apresenta a prancha de rotina mostrando as 3 etapas da atividade com velcro.`,
          `2. Exploração Sensorial Guiada (7 min): Apresentação dos materiais com texturas amigáveis e estímulos visuais concretos ancorados em ${interestHook}.`,
          `3. Dinâmica em Dupla com Par Tutor Confiável (10 min): O colega faz o modelo amigável de partilha sem invadir o espaço corporal de ${studentName}.`,
          `4. Treino de Cartão de Ajuda (5 min): Simulação lúdica onde ${studentName} entrega o cartão de 'Socorro/Professor' para encerrar a atividade com sucesso.`
        ];
        visualGuidelines = [
          "Cronograma visual vertical em tiras com fotos reais ou símbolos PECS de alta resolução.",
          "Cartão 'PARE' em vermelho vivo e cartão 'CANTINHO CALMO' em azul claro sempre ao alcance das mãos.",
          "Delimitação física visual do espaço de trabalho com fita adesiva colorida na mesa."
        ];
        sensoryGuidelines = [
          "Uso preventivo de abafadores de ruído auriculares durante momentos de euforia coletiva da turma.",
          "Cantinho de autorregulação pré-preparado com almofada ponderada caso ocorra sobrecarga tátil ou sonora.",
          "Iluminação suave indireta; evitar que a luz do sol reflita diretamente no campo de visão da criança."
        ];
        socialStoryScript = `História Social / Script: "Esta é a minha escola. Meu corpo gosta de tranquilidade. Quando alguém se aproxima muito ou pega meu objeto sem permissão, eu não preciso gritar: eu mostro o meu Cartão de Pare para o professor ou para o meu mediador. Meus colegas são meus guardiões e me ajudam a ficar bem."`;
        bystanderGuideline = `Orientação aos colegas: "Gabriel se comunica por imagens e gestos. Se vocês virem qualquer pessoa tirando sarro do jeito dele ou pegando os materiais dele, digam com firmeza: 'Respeitem o espaço do Gabriel!' e chamem o professor imediatamente."`;
        teacherMediationTips = [
          "Manter a fala com poucas palavras, tom de voz calmo e neutro, dando pelo menos 10 segundos de tempo de resposta motora.",
          "Nunca conter fisicamente a criança em momentos de autorregulação (flapping ou balanço corporal), a menos que haja risco à integridade.",
          "Validar qualquer tentativa de entrega de cartão ou gesto comunicativo antes que surja frustração."
        ];
        evaluationMetric = "Entrega espontânea ou assistida do cartão de comunicação funcional e permanência calma durante a dinâmica mediada.";
      } else if (supportLevel === "Nivel_2") {
        adaptedTitle = `[TEA N2] ${activityTitle}: Estação Concreta dos Sentimentos e Prevenção do Bullying`;
        pedagogicalGoal = `Desenvolver a discriminação de intenções sociais (diferenciar gracejo amigável de caçoada maldosa) com apoio de esquemas visuais e roteiros conversacionais.`;
        antiBullyingObjective = `Reconhecer microagressões e exclusões sutis no pátio, capacitando ${studentName} a expressar limites assertivos e recorrer à rede de apoio escolar.`;
        stepByStep = [
          `1. Estruturação Teacch (5 min): Organização das tarefas em caixas numeradas da esquerda para a direita (O que fazer? Quanto fazer? Quando acaba?).`,
          `2. Análise de Tirinhas Sociais (10 min): Análise em duplas de cenários concretos (ex: rir de um tropeço vs rir de uma piada contada).`,
          `3. Treino de Fala Escudo (8 min): Prática do script verbal 'Isso que você fez não é legal, pare agora' com postura ereta.`,
          `4. Registro Visual de Conclusão (5 min): Colar o selo verde de 'Missão Concluída' no caderno de conquistas.`
        ];
        visualGuidelines = [
          "Tirinhas em quadrinhos (Comic Strip Conversations) com balões de pensamento em nuvem e balões de fala normais para diferenciar o que as pessoas pensam do que dizem.",
          "Semáforo das atitudes: Verde (respeito), Amarelo (desconforto passageiro), Vermelho (bullying que exige denúncia).",
          "Evitar linguagem figurada, sarcasmo ou metáforas sem explicação visual literal concomitante."
        ];
        sensoryGuidelines = [
          "Pausa sensorial programada aos 15 minutos com caminhada proprioceptiva ou fidget de compressão.",
          "Posicionamento estratégico na sala: longe de portas de passagem ruidosas e sob boa ventilação.",
          "Disponibilizar fones com ruído branco ou silenciador se houver trabalho em grupos barulhentos."
        ];
        socialStoryScript = `História Social: "Às vezes as pessoas riem juntas porque algo engraçado aconteceu. Isso é uma brincadeira. Mas quando alguém ri de mim repetidas vezes, ou me chama de nomes que me deixam triste, isso é bullying. Eu tenho o direito de dizer bem alto: 'Pare, não gostei!' e depois caminhar até o adulto de confiança."`;
        bystanderGuideline = `Orientação aos colegas: "Quando perceberem que alguém está se aproveitando de o colega interpretar as coisas de forma literal para enganá-lo, intervenham imediatamente acolhendo-o na sua equipe."`;
        teacherMediationTips = [
          "Explicar explicitamente as regras sociais implícitas que a criança não capta intuitivamente.",
          "Permitir o uso de seu hiperfoco (${interestHook}) como ponte de diálogo com outros alunos da turma.",
          "Observar no recreio: o isolamento muitas vezes não é escolha, mas falta de ferramentas de entrada na brincadeira."
        ];
        evaluationMetric = "Capacidade de identificar corretamente nos cartões pelo menos 3 condutas de bullying e verbalizar o script de proteção.";
      } else {
        // Nivel 1
        adaptedTitle = `[TEA N1] ${activityTitle}: Decodificador Social e Fortalecimento de Autoestima`;
        pedagogicalGoal = `Aprimorar habilidades de Teoria da Mente e tomada de perspectiva em conflitos interpessoais, fortalecendo a autoeficácia diante de julgamentos de pares.`;
        antiBullyingObjective = `Desmantelar o bullying velado (comentários passivo-agressivos, exclusão em grupos digitais e panelinhas), promovendo a liderança empática.`;
        stepByStep = [
          `1. Ativação de Repertório (5 min): Discussão aberta sobre situações em que as palavras ferem sem haver agressão física direta.`,
          `2. Mapeamento de Perspectiva (12 min): Criação de mapas conceituais ligando ações a sentimentos reais de quem sofre bullying.`,
          `3. Simulação Guiada (10 min): Role-playing seguro de desescalada de provocação e busca de mediação justa.`,
          `4. Contrato de Sala Inclusivo (8 min): Redação colaborativa de cláusulas de convivência ética.`
        ];
        visualGuidelines = [
          "Infográficos de relações interpessoais com diferenciação clara entre conflito pontual e bullying contínuo.",
          "Régua de intensímetro emocional de 1 a 10 com indicadores fisiológicos (respiração curta, aperto no estômago)."
        ];
        sensoryGuidelines = [
          "Permissão para movimentar-se discretamente ou utilizar anel sensorial de dígito-pressão durante a exposição oral.",
          "Ambiente com nível sonoro moderado; pausas após debates calorosos."
        ];
        socialStoryScript = `Script Assertivo: "Eu sou uma pessoa com direitos e valor. As opiniões maldosas dos outros não definem quem eu sou. Se alguém me excluir ou debochar, eu olho nos olhos, digo 'Sua atitude não me afeta, mas não vou aceitar desrespeito' e registro a ocorrência com a coordenação."`;
        bystanderGuideline = `Instrução para a turma: "Colegas no espectro autista podem ter formas únicas de socializar. O papel da turma é abrir espaço na mesa e jamais tolerar cochichos ou piadas de mau gosto."`;
        teacherMediationTips = [
          "Evitar forçar a criança a 'fazer as pazes' com o agressor sem mediação real, pois isso gera revitimização e sensação de injustiça.",
          "Valorizar a honestidade e os conhecimentos aprofundados do aluno diante do grande grupo."
        ];
        evaluationMetric = "Demonstração de clareza na distinção entre brincadeira e bullying e expressão de estratégias de autoproteção emocional.";
      }
      break;

    case "TDAH":
      adaptedTitle = `[TDAH - Suporte Ativo] ${activityTitle} com Dinâmica Dinâmica e Pausas Motoras`;
      pedagogicalGoal = `Canalizar a energia psicomotora e o raciocínio rápido para a cooperação coletiva, prevenindo a impulsividade em situações de conflito e o estigma de 'bagunceiro'.`;
      antiBullyingObjective = `Proteger o aluno de ser o bode expiatório da turma e treinar a pausa antes da resposta emocional explosiva frente a provocações de colegas.`;
      stepByStep = [
        `1. Instrução Fracionada (3 min): Explicar apenas um comando de cada vez com apoio visual e checklist de riscar.`,
        `2. Missão Ativa de Liderança (10 min): Nomear ${studentName} como o 'Guardião dos Materiais' ou 'Co-mediador do Grupo' para manter foco e pertencimento.`,
        `3. Dinâmica do Botão 'Pausa & Play' (8 min): Treino prático de respiração de 5 segundos antes de reagir a um empurrão ou gracejo.`,
        `4. Fechamento Celebrativo (5 min): Validação pública das atitudes de autocontrole e respeito mútuo.`
      ];
      visualGuidelines = [
        "Checklist visual passo a passo com caixas de checagem (gamificação das etapas).",
        "Timer visual regressivo (Time Timer) para gerenciar o tempo sem ansiedade.",
        "Cartaz com os '5 Segundos Mágicos' desenhado em destaque na parede."
      ];
      sensoryGuidelines = [
        "Faixa elástica de resistência fixada nos pés da cadeira (fidget band) para descarga motora silenciosa das pernas.",
        "Almofada inflável proprioceptiva (disco de equilíbrio) para sentar com estabilidade dinâmica.",
        "Pausa motora permitida a cada 15 minutos (ex: beber água, entregar um aviso pedagógico)."
      ];
      socialStoryScript = `Script de Autocontrole: "Quando alguém me provoca para ver minha reação explosiva, eu lembro: a minha raiva é minha, não vou dar a eles o poder de me descontrolar. Eu aperto o meu fidget, conto até 5, dou as costas e aviso o professor com calma."`;
      bystanderGuideline = `Orientação aos pares: "Não fiquem cutucando ou provocando o colega quando ele estiver agitado. Quando virem que ele está sobrecarregado, ofereçam ajuda ou convidem-no para uma atividade tranquila."`;
      teacherMediationTips = [
        "Nunca usar a privação do recreio como punição; isso aumenta a desregulação dopaminérgica e piora os conflitos no turno seguinte.",
        "Elogiar em público condutas de autocontrole e repreender desvios estritamente em particular, preservando a dignidade.",
        "Manter proximidade física sutil para auxiliar no reengajamento da atenção sem chamar a atenção negativa dos colegas."
      ];
      evaluationMetric = "Adesão ao checklist de etapas da atividade e utilização da pausa de autorregulação antes de responder a atritos.";
      break;

    case "TOD":
      adaptedTitle = `[TOD - Abordagem Colaborativa] ${activityTitle} com Escolhas Dirigidas e Autonomia`;
      pedagogicalGoal = `Promover o engajamento através de parceria não coercitiva, minimizando gatilhos de oposição e construindo segurança psicológica para lidar com regras de convivência.`;
      antiBullyingObjective = `Evitar que o aluno caia em armadilhas de colegas provocadores dissimulados e fornecer canais seguros e justos de denúncia sem humilhação pública.`;
      stepByStep = [
        `1. Contrato Prévio Individual (4 min): Alinhar discretamente com o aluno as 2 opções de participação disponíveis (Menu de Escolha A ou B).`,
        `2. Realização com Foco em Produção Concreta (12 min): Tarefa prática orientada onde o aluno tem papel ativo de autonomia.`,
        `3. Dinâmica de Mediação de Justiça Restaurativa (8 min): Discussão sobre o que é 'jogo limpo' sem apontar culpados.`,
        `4. Feedback Privado (4 min): Conversa reservada reconhecendo a maturidade demonstrada na atividade.`
      ];
      visualGuidelines = [
        "Menu visual com opções de trabalho equivalentes ('Você prefere desenhar o cenário do bullying ou listar as 3 atitudes do guardião?').",
        "Regras da sala formuladas em tom positivo (ex: 'Falamos com respeito' em vez de 'Proibido gritar').",
        "Cartão de descompressão reservado que o aluno pode virar na mesa para sinalizar que precisa de 3 minutos de pausa neutra."
      ];
      sensoryGuidelines = [
        "Espaço de escape previamente acordado onde o aluno pode se sentar sem ser observado como punido.",
        "Possibilidade de ouvir música instrumental em fones durante tarefas individuais para amortecer sons irritantes.",
        "Evitar qualquer contato físico invasivo ou aproximação corporal intimidadora por parte de adultos ou colegas."
      ];
      socialStoryScript = `Script Restaurativo: "Eu sou inteligente e sei quando alguém quer me fazer perder a paciência para que eu leve a culpa. Não vou cair nesse jogo. Eu respiro, mantenho minha cabeça erguida e registro a verdade com firmeza e calma."`;
      bystanderGuideline = `Orientação aos colegas: "Respeitem os momentos em que o colega precisa de espaço. Provocar ou filmar colegas em momento de raiva é uma grave violação de convivência que não é tolerada nesta escola."`;
      teacherMediationTips = [
        "Jamais entrar em disputa de poder verbal diante da turma; nunca gritar ou fazer ameaças generalizadas.",
        "Utilizar a técnica da 'escolha dirigida': dar duas alternativas aceitáveis em vez de dar ordens imperativas secas.",
        "Investigar a fundo os bastidores do conflito: em 80% das vezes em que a criança com TOD explode, houve uma microagressão anterior que os adultos não viram."
      ];
      evaluationMetric = "Aceitação colaborativa de uma das opções de atividade e não envolvimento em escaladas de confronto durante o trabalho.";
      break;

    case "DISLEXIA":
      adaptedTitle = `[Acessibilidade Textual & Multissensorial] ${activityTitle}`;
      pedagogicalGoal = `Garantir o acesso universal ao conteúdo reflexivo sobre bullying eliminando a barreira da decodificação leitora e valorizando a inteligência narrativa do aluno.`;
      antiBullyingObjective = `Erradicar o bullying baseado em apelidos depreciativos de capacidade intelectual e fortalecer a participação oral e criativa com dignidade.`;
      stepByStep = [
        `1. Apresentação Multimodal (5 min): Instruções apresentadas com recursos orais, ilustrações ricas e áudio explicativo.`,
        `2. Produção em Formato Aberto (15 min): O aluno pode responder por desenho, gravação de áudio, mapa mental ou relato falado, sem exigência de caligrafia formal sob tempo.`,
        `3. Exposição Coletiva Colaborativa (8 min): Valorização das ideias do aluno diante do grupo.`,
        `4. Registro Positivo (4 min): Validação da riqueza de conteúdo e respeito mútuo conquistado.`
      ];
      visualGuidelines = [
        "Textos adaptados com fontes amigáveis à dislexia (OpenDyslexic, Comic Sans ou Arial 14pt+ com entrelinhas 1.5).",
        "Uso de papel com contraste confortável (fundo marfim, azul claro ou pastel, evitando o branco ofuscante).",
        "Régua de leitura ou marcador colorido para guiar o rastreamento visual sem salto de linhas."
      ];
      sensoryGuidelines = [
        "Permitir leitura silenciosa sem pressão de tempo ou obrigatoriedade de leitura em voz alta diante da classe.",
        "Disponibilizar fones com áudio gravado do texto-base da atividade."
      ];
      socialStoryScript = `Script de Empoderamento: "Minha inteligência é enorme e meu cérebro aprende de formas visuais incríveis. Ter dificuldade com letras não significa que alguém pode zombar de mim. Quando alguém fizer gracinha da minha leitura, eu digo: 'Cada um tem seus talentos, e respeito é inegociável'."`;
      bystanderGuideline = `Orientação aos colegas: "Na nossa turma ninguém zomba de quem gagueja ou demora para ler uma palavra. Nós incentivamos, temos paciência e celebramos o esforço de todos."`;
      teacherMediationTips = [
        "Nunca expor o aluno a leituras surpresa em voz alta no grande grupo; agendar previamente se o aluno desejar praticar um trecho específico.",
        "Avaliar a profundidade da reflexão e o raciocínio moral sobre o bullying, não os erros ortográficos da escrita preliminar.",
        "Incentivar o uso de tecnologia assistiva (leitores de tela e ditado por voz)."
      ];
      evaluationMetric = "Expressão plena de estratégias de empatia e combate ao bullying através do canal expressivo de sua preferência.";
      break;

    case "DEF_INTELECTUAL":
      adaptedTitle = `[Ensino Concreto & Aprendizagem Significativa] ${activityTitle}`;
      pedagogicalGoal = `Concretizar conceitos abstratos de convivência ética e limites corporais através de objetos reais, dramatizações simples e reforço visual imediato.`;
      antiBullyingObjective = `Proteger a criança contra exploração, deboche velado e isolamento, ensinando a distinção entre toque amigo e toque desrespeitoso com clareza cristalina.`;
      stepByStep = [
        `1. Demonstração Concreta (5 min): Utilização de bonecos de feltro ou fantoches para demonstrar abraço amigável versus empurrão.`,
        `2. Associação Prática em Cores (10 min): O aluno carimba carinhas felizes nas atitudes boas e carinhas tristes nas atitudes que machucam.`,
        `3. Par Tutor Amigo (8 min): Um colega de turma gentil acompanha e apoia a realização conjunta do mural de respeito.`,
        `4. Abraço Coletivo de Encerramento (5 min): Celebração de pertencimento do aluno à turma.`
      ];
      visualGuidelines = [
        "Fotografias reais de rostos humanos expressando alegria, tristeza e surpresa.",
        "Pictogramas simples com traço grosso e cores primárias contrastantes.",
        "Cartaz com as '3 Regras de Ouro': Mãos amigas, Palavras doces, Coração contente."
      ];
      sensoryGuidelines = [
        "Materiais táteis agradáveis (massinha de modelar colorida, papel crepom, fantoches macios).",
        "Ambiente sem sobrecarga de estímulos simultâneos; uma tarefa de cada vez sobre a mesa."
      ];
      socialStoryScript = `Script Afetivo: "Meu corpo é meu tesouro. Se alguém me empurrar, me xingar ou me deixar triste, eu não guardo no coração: eu pego na mão da professora e conto tudo. A professora me protege."`;
      bystanderGuideline = `Orientação aos colegas: "Cuidar com carinho não é fazer as coisas por ele, mas incentivar e nunca permitir que ninguém caçoe da fala ou das atitudes do colega."`;
      teacherMediationTips = [
        "Repetir as instruções com vocabulário simples e checar a compreensão pedindo para a criança mostrar com as mãos.",
        "Reconhecer cada pequeno progresso com reforço social caloroso e autêntico.",
        "Supervisionar de perto as interações no recreio e nos banheiros para assegurar proteção contínua."
      ];
      evaluationMetric = "Reconhecimento das atitudes de carinho versus atitudes de machucar através de cartões visuais e busca do professor.";
      break;

    case "AH_SD":
      adaptedTitle = `[Altas Habilidades / Desafio Ético] ${activityTitle}: Observatório de Convivência e Justiça Social`;
      pedagogicalGoal = `Estimular o raciocínio moral aprofundado e a liderança inclusiva, evitando o isolamento por assincronia emocional ou arrogância defensiva.`;
      antiBullyingObjective = `Capacitar o aluno a lidar com o ressentimento ou zombaria de colegas pelo seu desempenho escolar, transformando-o em um defensor ativo dos mais vulneráveis.`;
      stepByStep = [
        `1. Análise Crítica de Dilema Moral (7 min): Apresentar um estudo de caso complexo sobre dinâmica de poder e preconceito social.`,
        `2. Criação de Campanhas de Conscientização (15 min): O aluno lidera a criação de um podcast, cartilha informativa ou jogo de tabuleiro sobre empatia.`,
        `3. Debate Estruturado (8 min): Discussão sobre como a inteligência deve ser colocada a serviço do acolhimento humano.`,
        `4. Autoavaliação de Modéstia e Empatia (5 min): Reflexão pessoal sobre escuta ativa.`
      ];
      visualGuidelines = [
        "Mapas conceituais de causa e efeito sociológico do bullying.",
        "Gráficos e fluxogramas de resolução de conflitos éticos."
      ];
      sensoryGuidelines = [
        "Acomodar sensibilidades sensoriais comumente presentes em AH/SD (ex: hiperestesia a tecidos, ruídos ou injustiças sociais).",
        "Espaço para pesquisa e aprofundamento autônomo se concluir antes do tempo previsto."
      ];
      socialStoryScript = `Script Reflexivo: "Minha agilidade mental é uma ferramenta para construir pontes, não barreiras. Se colegas me chamarem de 'sabe-tudo' ou se afastarem, não vou me fechar em desdém: vou exercitar a generosidade e usar minha voz para proteger quem precisa de apoio."`;
      bystanderGuideline = `Orientação aos colegas: "Ter facilidade com matérias é uma das muitas formas de ser no mundo. Vamos aprender uns com os outros sem rivalidades ou piadas depreciativas."`;
      teacherMediationTips = [
        "Oferecer complexidade conceitual e desafios éticos proporcionais ao seu potencial sem sobrecarregar emocionalmente.",
        "Mediar para que a criança não assuma o papel de 'professor substituto' da turma, o que atrai rejeição dos colegas.",
        "Acolher sua intensa sensibilidade à injustiça social com escuta compreensiva."
      ];
      evaluationMetric = "Profundidade da análise do dilema moral e engajamento empático nas produções coletivas de apoio aos colegas.";
      break;

    case "TPS":
    default:
      adaptedTitle = `[Regulação Sensorial & Acolhimento] ${activityTitle}`;
      pedagogicalGoal = `Criar um ambiente sensorialmente balanceado para permitir o processamento cognitivo e a interação segura sem sobrecargas fisiológicas.`;
      antiBullyingObjective = `Impedir que manifestações de hipersensibilidade (tapar os ouvidos, assustar-se, esquiva ao toque) sejam ridicularizadas pelos pares como 'frescura'.`;
      stepByStep = [
        `1. Ambientação Sensorial Confortável (4 min): Ajuste de iluminação e verificação do nível de ruído antes do início.`,
        `2. Apresentação das Ferramentas de Conforto (6 min): Explicar à turma a função do abafador e dos materiais de regulação como 'óculos para o cérebro'.`,
        `3. Realização da Atividade em Ritmo Orgânico (15 min): Participação com liberdade de autorregulação física.`,
        `4. Partilha Acolhedora (5 min): Roda de apreciação mútua.`
      ];
      visualGuidelines = [
        "Termômetro de volume da sala (medidor visual de decibéis em cores).",
        "Cartões de zona de conforto sensorial (Verde = Confortável, Vermelho = Ambiente Sobrecarregado)."
      ];
      sensoryGuidelines = [
        "Abafadores auriculares circum-aurais prontamente disponíveis.",
        "Eliminação de luzes fluorescentes piscantes ou perfumes fortes no ambiente.",
        "Acesso livre a texturas reguladoras e cantinho silencioso de descompressão."
      ];
      socialStoryScript = `Script de Autoaceitação: "Meus sentidos percebem o mundo com muita intensidade. Usar meu abafador ou pedir silêncio não é fraqueza, é autocuidado inteligente. Meus colegas respeitam a minha forma de sentir o mundo."`;
      bystanderGuideline = `Orientação aos colegas: "Sons que para nós são normais podem doer fisicamente nos ouvidos de alguns colegas. Vamos manter um volume suave e nunca gritar perto deles de surpresa."`;
      teacherMediationTips = [
        "Lembrar que o comportamento de esquiva ou choro repentino é frequentemente uma resposta neurológica à dor sensorial, não pirraça.",
        "Educar a turma sobre neurofisiologia sensorial de maneira descontraída e científica.",
        "Oferecer pausas antes que a sobrecarga se transforme em colapso (meltdown)."
      ];
      evaluationMetric = "Manutenção do equilíbrio sensorial e capacidade de utilizar os recursos de apoio sem inibição social.";
      break;
  }

  return {
    id: `adapt-${Date.now()}`,
    studentId: student?.id,
    studentName: student?.name,
    adaptedByUserId: user.id,
    adaptedByUserName: user.name,
    adaptedByUserRole: user.role,
    neurodiversity,
    supportLevel,
    originalTitle: activityTitle,
    adaptedTitle,
    pedagogicalGoal,
    antiBullyingObjective,
    stepByStep,
    visualGuidelines,
    sensoryGuidelines,
    socialStoryScript,
    bystanderGuideline,
    teacherMediationTips,
    evaluationMetric,
    sourceEngine: "pedagogical_heuristic_offline",
    isApproved: user.role === "coordenador" || user.role === "professor_aee",
    createdAt: new Date().toISOString()
  };
}
