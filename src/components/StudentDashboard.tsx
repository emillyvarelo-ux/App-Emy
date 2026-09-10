import React, { useState } from "react";
import {
  Student,
  ProgressLog,
  PedagogicalUser,
  ActivityAdaptation
} from "../types";
import { localDb } from "../services/db";
import {
  TrendingUp,
  ShieldCheck,
  HeartHandshake,
  Brain,
  CheckCircle2,
  Calendar,
  Plus,
  Printer,
  Sparkles,
  User,
  Filter,
  AlertTriangle,
  FileText,
  Activity,
  Award
} from "lucide-react";

interface StudentDashboardProps {
  students: Student[];
  progressLogs: ProgressLog[];
  currentUser: PedagogicalUser;
  adaptations: ActivityAdaptation[];
  onAddLog: (log: ProgressLog) => void;
  onOpenAdapterForStudent: (student: Student) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  students,
  progressLogs,
  currentUser,
  adaptations,
  onAddLog,
  onOpenAdapterForStudent
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ""
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new log
  const [logActivityTitle, setLogActivityTitle] = useState("");
  const [logCategory, setLogCategory] = useState<ProgressLog["category"]>("consciencia_bullying");
  const [logScore, setLogScore] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [logNotes, setLogNotes] = useState("");
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentLogs = progressLogs.filter((l) => l.studentId === currentStudent?.id);
  const studentAdaptations = adaptations.filter((a) => a.studentId === currentStudent?.id);

  // Filtered logs
  const filteredLogs = studentLogs.filter((l) => {
    if (selectedCategoryFilter === "todos") return true;
    return l.category === selectedCategoryFilter;
  });

  // Calculate Metrics
  const getAverageScore = (category?: ProgressLog["category"]) => {
    const logs = category ? studentLogs.filter((l) => l.category === category) : studentLogs;
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, curr) => acc + curr.scoreRating, 0);
    return Number((sum / logs.length).toFixed(1));
  };

  const avgBullying = getAverageScore("consciencia_bullying");
  const avgSocial = getAverageScore("interacao_social");
  const avgSensory = getAverageScore("autorregulacao_sensorial");
  const avgEngagement = getAverageScore("engajamento_tarefa");
  const overallAvg = getAverageScore();

  // Quick behavior suggestions
  const COMMON_BEHAVIORS = [
    "Apontou cartão visual de socorro",
    "Reconheceu provocação de colega",
    "Pediu abafador de ruídos",
    "Participou da dinâmica com par tutor",
    "Evitou reação explosiva motora",
    "Compartilhou brinquedo do hiperfoco",
    "Comunicou desconforto em voz alta assertiva"
  ];

  const COMMON_INTERVENTIONS = [
    "Pausa no cantinho sensorial",
    "Uso de história social de Carol Gray",
    "Adaptação de texto com guia visual",
    "Mediação do AEE / AT em sala",
    "Reforço positivo imediato",
    "Reorganização do ambiente físico"
  ];

  const handleToggleBehavior = (item: string) => {
    if (selectedBehaviors.includes(item)) {
      setSelectedBehaviors(selectedBehaviors.filter((b) => b !== item));
    } else {
      setSelectedBehaviors([...selectedBehaviors, item]);
    }
  };

  const handleToggleIntervention = (item: string) => {
    if (selectedInterventions.includes(item)) {
      setSelectedInterventions(selectedInterventions.filter((i) => i !== item));
    } else {
      setSelectedInterventions([...selectedInterventions, item]);
    }
  };

  const handleSubmitNewLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const newLog: ProgressLog = {
      id: `log-${Date.now()}`,
      studentId: currentStudent.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      date: new Date().toISOString().split("T")[0],
      activityTitle: logActivityTitle || "Observação Diária em Sala / Recreio",
      category: logCategory,
      scoreRating: logScore,
      notes: logNotes || "Observação pedagógica registrada pelo profissional.",
      observedBehaviors: selectedBehaviors,
      interventionsApplied: selectedInterventions
    };

    await localDb.saveProgressLog(newLog);
    onAddLog(newLog);
    setIsModalOpen(false);

    // Reset form
    setLogActivityTitle("");
    setLogNotes("");
    setSelectedBehaviors([]);
    setSelectedInterventions([]);
  };

  const handlePrintPEIReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Selector - Purple Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Monitoramento Socioemocional & Inclusão
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-purple-950">
            Painel do Aluno & Acompanhamento Anti-Bullying
          </h2>
          <p className="text-xs text-purple-700/80">
            Acompanhe o desenvolvimento da convivência, autorregulação e eficácia das adaptações sensoriais.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Select Student */}
          <select
            id="dashboard-student-select"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs bg-purple-50/60 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 font-semibold focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} — {st.neurodiversity} ({st.grade})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Observação</span>
          </button>

          <button
            onClick={handlePrintPEIReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold cursor-pointer transition-colors border border-purple-200 shrink-0"
            title="Imprimir relatório para Conselho de Classe ou Família"
          >
            <Printer className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Relatório PEI</span>
          </button>
        </div>
      </div>

      {currentStudent && (
        <>
          {/* Student Profile Card - Lilac & Violet Accents */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white text-base font-bold shadow-xs">
                  {currentStudent.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-purple-950">{currentStudent.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      {currentStudent.neurodiversity} • {currentStudent.supportLevel.replace("_", " ")}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-50 text-purple-900 font-medium">
                      {currentStudent.grade} • {currentStudent.turma}
                    </span>
                  </div>
                  <p className="text-xs text-purple-700/80 mt-0.5">
                    Comunicação:{" "}
                    <strong className="text-purple-900">
                      {currentStudent.communicationMode.replace("_", " ").toUpperCase()}
                    </strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenAdapterForStudent(currentStudent)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold cursor-pointer transition-colors self-start sm:self-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Adaptar Nova Aula para {currentStudent.name.split(" ")[0]}</span>
              </button>
            </div>

            {/* Diagnostic & Sensory details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-600" />
                  <span>Perfil Diagnóstico</span>
                </span>
                <p className="text-purple-900/90 leading-relaxed">
                  {currentStudent.medicalDiagnosticDetails}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-50/50 border border-violet-100 space-y-1">
                <span className="font-bold text-violet-950 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-violet-600" />
                  <span>Interesses / Hiperfoco</span>
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {currentStudent.hyperfocusInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-white border border-violet-200 text-[11px] font-semibold text-violet-900"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-violet-800 pt-1">
                  Gatilhos: {currentStudent.sensoryProfile.specificTriggers.join(", ")}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Atenção ao Bullying</span>
                </span>
                <p className="text-rose-900 leading-relaxed">
                  {currentStudent.antiBullyingVulnerabilityNotes}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Core KPIs Cards - Purple & Color-coded metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Bullying Awareness */}
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900/70 uppercase tracking-wider">
                  Anti-Bullying
                </span>
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-950">
                  {avgBullying > 0 ? avgBullying : "N/D"}
                </span>
                <span className="text-xs text-purple-600">/ 5.0</span>
              </div>
              <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${(avgBullying / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-800/80">Identificação de piadas e busca por auxílio.</p>
            </div>

            {/* Card 2: Social Interaction */}
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900/70 uppercase tracking-wider">
                  Interação Social
                </span>
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-950">
                  {avgSocial > 0 ? avgSocial : "N/D"}
                </span>
                <span className="text-xs text-purple-600">/ 5.0</span>
              </div>
              <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all"
                  style={{ width: `${(avgSocial / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-800/80">Integração no recreio e atividades em pares.</p>
            </div>

            {/* Card 3: Sensory Regulation */}
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900/70 uppercase tracking-wider">
                  Autorregulação
                </span>
                <div className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
                  <Brain className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-950">
                  {avgSensory > 0 ? avgSensory : "N/D"}
                </span>
                <span className="text-xs text-purple-600">/ 5.0</span>
              </div>
              <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-violet-600 h-full rounded-full transition-all"
                  style={{ width: `${(avgSensory / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-800/80">Uso do abafador, pausas e cantinho calmo.</p>
            </div>

            {/* Card 4: Task Engagement */}
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900/70 uppercase tracking-wider">
                  Engajamento
                </span>
                <div className="p-1.5 rounded-lg bg-fuchsia-100 text-fuchsia-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-950">
                  {avgEngagement > 0 ? avgEngagement : "N/D"}
                </span>
                <span className="text-xs text-purple-600">/ 5.0</span>
              </div>
              <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-fuchsia-600 h-full rounded-full transition-all"
                  style={{ width: `${(avgEngagement / 5) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-800/80">Participação efetiva nas aulas adaptadas.</p>
            </div>
          </div>

          {/* Timeline of Observational Logs */}
          <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-purple-950 text-sm">
                  Histórico Observacional & Registro de Intervenções
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                  {filteredLogs.length} registro(s)
                </span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                {[
                  { id: "todos", label: "Todos" },
                  { id: "consciencia_bullying", label: "Bullying" },
                  { id: "interacao_social", label: "Social" },
                  { id: "autorregulacao_sensorial", label: "Sensorial" },
                  { id: "engajamento_tarefa", label: "Engajamento" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedCategoryFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategoryFilter === f.id
                        ? "bg-purple-600 text-white font-bold shadow-xs"
                        : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-purple-700/80 text-xs">
                Nenhum registro observacional encontrado para este filtro.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-purple-100 hover:border-purple-300 transition-all bg-purple-50/20 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-950 text-xs sm:text-sm">
                          {log.activityTitle}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-100 text-purple-800">
                          {log.category.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-700">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {log.date}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-purple-900">
                          {log.authorName} ({log.authorRole.replace("_", " ")})
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                          ⭐ {log.scoreRating}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-purple-900 leading-relaxed bg-white p-3 rounded-xl border border-purple-100">
                      {log.notes}
                    </p>

                    {/* Observed behaviors & Interventions pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      {log.observedBehaviors?.map((b, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                        >
                          ✓ {b}
                        </span>
                      ))}
                      {log.interventionsApplied?.map((inv, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-medium"
                        >
                          🛠 {inv}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal: Novo Registro Observacional - Purple Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bold text-purple-950 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Registrar Observação Pedagógica - {currentStudent?.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-400 hover:text-purple-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Atividade ou Momento Observado
                </label>
                <input
                  type="text"
                  required
                  value={logActivityTitle}
                  onChange={(e) => setLogActivityTitle(e.target.value)}
                  placeholder="Ex: Trabalho em grupo / Recreio / Leitura em Roda"
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    Categoria de Avaliação
                  </label>
                  <select
                    value={logCategory}
                    onChange={(e) => setLogCategory(e.target.value as any)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="consciencia_bullying">Consciência Anti-Bullying</option>
                    <option value="interacao_social">Interação Social com Pares</option>
                    <option value="autorregulacao_sensorial">Autorregulação Sensorial</option>
                    <option value="engajamento_tarefa">Engajamento na Tarefa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">
                    Nota de Desenvolvimento (1 a 5)
                  </label>
                  <select
                    value={logScore}
                    onChange={(e) => setLogScore(Number(e.target.value) as any)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">1 - Apresentou extrema dificuldade/crise</option>
                    <option value="2">2 - Necessitou de suporte total</option>
                    <option value="3">3 - Participou com suporte moderado</option>
                    <option value="4">4 - Bom progresso e resposta autônoma</option>
                    <option value="5">5 - Excelente autonomia e autorregulação</option>
                  </select>
                </div>
              </div>

              {/* Quick behavior tags selector */}
              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Comportamentos Observados (Clique para marcar)
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COMMON_BEHAVIORS.map((beh) => {
                    const isSelected = selectedBehaviors.includes(beh);
                    return (
                      <button
                        key={beh}
                        type="button"
                        onClick={() => handleToggleBehavior(beh)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 font-semibold"
                            : "bg-purple-50/50 text-purple-900 border-purple-200 hover:bg-purple-100"
                        }`}
                      >
                        {beh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interventions selector */}
              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Intervenções Aplicadas (Clique para marcar)
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COMMON_INTERVENTIONS.map((inv) => {
                    const isSelected = selectedInterventions.includes(inv);
                    return (
                      <button
                        key={inv}
                        type="button"
                        onClick={() => handleToggleIntervention(inv)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-violet-600 text-white border-violet-600 font-semibold"
                            : "bg-purple-50/50 text-purple-900 border-purple-200 hover:bg-purple-100"
                        }`}
                      >
                        {inv}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Anotações Pedagógicas & Observações Detalhadas
                </label>
                <textarea
                  rows={3}
                  required
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Relate detalhadamente como o aluno reagiu, se houve sinais de desconforto ou suporte dos colegas..."
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Salvar no Histórico Local
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
