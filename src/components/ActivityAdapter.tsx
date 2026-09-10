import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Eye,
  Volume2,
  BookCheck,
  ShieldAlert,
  Printer,
  Save,
  CheckCircle2,
  RefreshCw,
  Sliders,
  User,
  Brain,
  Layers,
  Heart,
  Wifi,
  WifiOff,
  Award,
  VolumeX,
  Play,
  Square,
  CheckSquare,
  Square as UncheckedSquare,
  Smile,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import {
  Student,
  ActivityOriginal,
  ActivityAdaptation,
  PedagogicalUser,
  NeurodiversityType,
  SupportLevel
} from "../types";
import { adaptPedagogicalActivity } from "../services/adaptationEngine";
import { localDb } from "../services/db";

interface ActivityAdapterProps {
  students: Student[];
  activities: ActivityOriginal[];
  currentUser: PedagogicalUser;
  onSaveAdaptation: (adaptation: ActivityAdaptation) => void;
  onOpenPrintSheet: (adaptation: ActivityAdaptation) => void;
  initialActivity?: ActivityOriginal | null;
  initialStudent?: Student | null;
}

const NEURODIVERSITY_LABELS: Record<NeurodiversityType, string> = {
  TEA: "TEA (Autismo)",
  TDAH: "TDAH",
  TOD: "TOD (Opositivo)",
  DISLEXIA: "Dislexia",
  DEF_INTELECTUAL: "Def. Intelectual",
  AH_SD: "Altas Habilidades",
  TPS: "Sensorial (TPS)"
};

// Preset quick activities for 1-click selection
const QUICK_PRESETS = [
  {
    icon: "🤝",
    title: "Trabalho em Grupo ou Duplas",
    desc: "Atividade colaborativa em sala dividida em pequenas equipes, com elaboração conjunta de cartaz ou projeto.",
    grade: "4º Ano - Fundamental"
  },
  {
    icon: "⚽",
    title: "Educação Física & Jogos no Pátio",
    desc: "Jogo coletivo com regras de time, movimentação motora intensa e interação livre no recreio/quadra.",
    grade: "Fundamental"
  },
  {
    icon: "📖",
    title: "Roda de Leitura e Conversa",
    desc: "Alunos sentados em círculo para leitura compartilhada de texto e discussão de sentimentos em voz alta.",
    grade: "3º ao 5º Ano"
  },
  {
    icon: "🎤",
    title: "Apresentação Oral em Público",
    desc: "Apresentação individual ou em dupla na frente da sala de aula para exposição de trabalho aos colegas.",
    grade: "5º Ano - Fundamental"
  },
  {
    icon: "🎨",
    title: "Artes & Coordenação Motora",
    desc: "Atividade manual com tintas, recorte, colagem de texturas e estímulos sensoriais manuais na mesa.",
    grade: "2º ao 4º Ano"
  },
  {
    icon: "🧪",
    title: "Experimento Prático de Ciências",
    desc: "Atividade em bancada com manipulação de materiais, observação e registro em folha de anotações.",
    grade: "4º Ano - Fundamental"
  }
];

export const ActivityAdapter: React.FC<ActivityAdapterProps> = ({
  students,
  activities,
  currentUser,
  onSaveAdaptation,
  onOpenPrintSheet,
  initialActivity,
  initialStudent
}) => {
  // Simple / Advanced mode toggle
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Input states
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudent?.id || "");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(initialActivity?.id || "");
  const [customTitle, setCustomTitle] = useState(initialActivity?.title || "");
  const [customDescription, setCustomDescription] = useState(initialActivity?.description || "");
  const [customGrade, setCustomGrade] = useState("4º Ano - Ensino Fundamental");
  const [neurodiversity, setNeurodiversity] = useState<NeurodiversityType>("TEA");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("Nivel_2");
  const [forceOffline, setForceOffline] = useState(false);

  // Status & Output states
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ActivityAdaptation | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<
    "passos" | "visuais" | "sensoriais" | "social" | "pares" | "professor"
  >("passos");
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Interactive Feature 1: Completed steps checklist
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Interactive Feature 2: Speech Synthesis (Read aloud)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Interactive Feature 3: Interactive Traffic Light (Semáforo das Emoções)
  const [selectedMood, setSelectedMood] = useState<"verde" | "amarelo" | "vermelho">("verde");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingPhase, setBreathingPhase] = useState<"Inspire..." | "Segure..." | "Expire devagar...">("Inspire...");

  // Interactive Feature 4: Interactive Dilemma Simulator (O que fazer se...)
  const [activeDilemma, setActiveDilemma] = useState<number | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialActivity) {
      setSelectedActivityId(initialActivity.id);
      setCustomTitle(initialActivity.title);
      setCustomDescription(initialActivity.description);
    }
  }, [initialActivity]);

  useEffect(() => {
    if (initialStudent) {
      setSelectedStudentId(initialStudent.id);
      setNeurodiversity(initialStudent.neurodiversity);
      setSupportLevel(initialStudent.supportLevel);
    }
  }, [initialStudent]);

  // Breathing timer loop
  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          setBreathingPhase((phase) => {
            if (phase === "Inspire...") return "Segure...";
            if (phase === "Segure...") return "Expire devagar...";
            return "Inspire...";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Toggle step completion
  const handleToggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Speech synthesis for social story
  const handleToggleReadAloud = (textToRead: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Select student card
  const handleSelectStudentCard = (st: Student | null) => {
    if (!st) {
      setSelectedStudentId("");
      return;
    }
    setSelectedStudentId(st.id);
    setNeurodiversity(st.neurodiversity);
    setSupportLevel(st.supportLevel);
  };

  // Quick preset activity click
  const handleSelectPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setCustomTitle(preset.title);
    setCustomDescription(preset.desc);
    setCustomGrade(preset.grade);
    setSelectedActivityId("");
  };

  const handleGenerateAdaptation = async () => {
    if (!customTitle.trim()) {
      alert("Por favor, selecione ou digite uma atividade escolar para adaptar.");
      return;
    }

    setIsLoading(true);
    setSaveSuccessNotice(false);
    setCompletedSteps({});

    // Stop any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    try {
      const selectedStudent = students.find((s) => s.id === selectedStudentId);

      const adaptation = await adaptPedagogicalActivity({
        activityTitle: customTitle,
        activityDescription: customDescription,
        ageGroup: customGrade,
        neurodiversity,
        supportLevel,
        student: selectedStudent,
        user: currentUser,
        forceOffline
      });

      setCurrentResult(adaptation);
      setActiveResultTab("passos");
    } catch (err) {
      console.error(err);
      alert("Houve uma oscilação na conexão. Ativamos a matriz heurística local.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDb = async () => {
    if (!currentResult) return;
    await localDb.saveAdaptation(currentResult);
    onSaveAdaptation(currentResult);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const currentStudentObj = students.find((s) => s.id === selectedStudentId);
  const totalSteps = currentResult?.stepByStep.length || 0;
  const doneStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((doneStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Introduction Hero Card - Purple & Lilac Theme */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-950/20 relative overflow-hidden border border-purple-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-fuchsia-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-violet-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-sm border border-purple-300/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Adaptação Simples em 3 Passos • Desenho Universal (DUA)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
            Adaptador Pedagógico Inclusivo & Anti-Bullying
          </h2>
          <p className="text-purple-100/90 text-sm leading-relaxed">
            Selecione o aluno e a atividade com apenas um clique. Receba um roteiro passo a passo,
            orientações de convivência para a turma e suportes sensoriais contra provocações.
          </p>
        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Simple 3-Step Creator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-6">
            {/* Header with offline toggle */}
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-purple-950 text-sm">
                  Escolha o Aluno ou Perfil
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setForceOffline(!forceOffline)}
                className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer ${
                  forceOffline
                    ? "bg-amber-50 text-amber-900 border-amber-300 font-medium"
                    : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                }`}
                title="Alternar entre IA Online e Matriz Offline"
              >
                {forceOffline ? (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Modo Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 text-purple-600" />
                    <span>IA Ativa (com Offline)</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Student Picker - Clickable Avatar Cards */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* General Class Card */}
                <button
                  type="button"
                  onClick={() => handleSelectStudentCard(null)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    selectedStudentId === ""
                      ? "bg-purple-50/80 border-purple-500 shadow-xs ring-1 ring-purple-400"
                      : "bg-slate-50/70 border-slate-200 hover:border-purple-200 hover:bg-purple-50/30"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    👥
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-purple-950 truncate">Toda a Turma</div>
                    <div className="text-[10px] text-purple-700 truncate">Perfil Geral (DUA)</div>
                  </div>
                </button>

                {/* Individual Students */}
                {students.map((st) => {
                  const isSelected = selectedStudentId === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectStudentCard(st)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-purple-50 border-purple-600 shadow-xs ring-2 ring-purple-500/20"
                          : "bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/40"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {st.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-purple-950 truncate">{st.name}</div>
                        <div className="text-[10px] text-purple-700 truncate font-medium">
                          {st.neurodiversity} • {st.grade}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Student Highlights Card */}
              {currentStudentObj && (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50/60 border border-purple-200 text-xs space-y-1.5 text-purple-950 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-purple-900">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span>Destaques de {currentStudentObj.name} ({currentStudentObj.neurodiversity}):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="font-semibold text-purple-900">🎯 Hiperfoco:</span>{" "}
                      <span className="text-purple-800">{currentStudentObj.hyperfocusInterests.join(", ")}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-900">⚠️ Gatilho:</span>{" "}
                      <span className="text-purple-800">{currentStudentObj.sensoryProfile.specificTriggers[0] || "Ruídos"}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-purple-700 italic border-t border-purple-200/60 pt-1">
                    🛡️ Atenção Anti-Bullying: {currentStudentObj.antiBullyingVulnerabilityNotes}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2: Activity Selection */}
            <div className="space-y-3 pt-3 border-t border-purple-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-purple-950 text-sm">
                  Escolha a Atividade Escolar
                </h3>
              </div>

              {/* Quick Clickable Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-purple-900 uppercase tracking-wider block">
                  Sugestões Rápidas (1 Clique)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_PRESETS.map((p, idx) => {
                    const isCurrent = customTitle === p.title;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isCurrent
                            ? "bg-purple-100 border-purple-600 text-purple-950 shadow-xs font-semibold"
                            : "bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/60 text-purple-900"
                        }`}
                      >
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-[11px] leading-tight line-clamp-2">{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-semibold text-purple-900 block">
                  Título da Atividade
                </label>
                <input
                  type="text"
                  id="input-activity-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ex: Roda de Conversa sobre Brincadeiras no Recreio"
                  className="w-full text-sm bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2.5 text-purple-950 placeholder:text-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-purple-900 block">
                  Como é a atividade atualmente?
                </label>
                <textarea
                  rows={2}
                  id="input-activity-desc"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Descreva resumidamente o que os alunos irão fazer..."
                  className="w-full text-xs bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 placeholder:text-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>

              {/* Advanced Settings Accordion Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                  className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isAdvancedMode ? "Ocultar Ajustes Técnicos" : "Ajustes Avançados (Nível de Suporte, Faixa Etária)"}</span>
                  {isAdvancedMode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {isAdvancedMode && (
                  <div className="mt-3 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-purple-900 uppercase">
                          Neurodivergência
                        </label>
                        <select
                          value={neurodiversity}
                          onChange={(e) => setNeurodiversity(e.target.value as NeurodiversityType)}
                          className="w-full text-xs bg-white border border-purple-200 rounded-lg p-2 text-purple-950 mt-1"
                        >
                          {Object.entries(NEURODIVERSITY_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-purple-900 uppercase">
                          Nível de Suporte
                        </label>
                        <select
                          value={supportLevel}
                          onChange={(e) => setSupportLevel(e.target.value as SupportLevel)}
                          className="w-full text-xs bg-white border border-purple-200 rounded-lg p-2 text-purple-950 mt-1"
                        >
                          <option value="Nivel_1">Nível 1 (Leve)</option>
                          <option value="Nivel_2">Nível 2 (Moderado)</option>
                          <option value="Nivel_3">Nível 3 (Intenso)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-purple-900 uppercase">
                        Ano Escolar
                      </label>
                      <input
                        type="text"
                        value={customGrade}
                        onChange={(e) => setCustomGrade(e.target.value)}
                        className="w-full text-xs bg-white border border-purple-200 rounded-lg p-2 text-purple-950 mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 3: Action Button */}
            <div className="pt-2">
              <button
                id="btn-generate-adaptation"
                onClick={handleGenerateAdaptation}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-violet-700 hover:from-purple-800 hover:to-violet-800 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 group hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span key="btn-loading-content" className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Adaptando com DUA & Proteção Anti-Bullying...</span>
                  </span>
                ) : (
                  <span key="btn-ready-content" className="inline-flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
                    <span>Gerar Adaptação Inclusiva & Sensorial</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Tool Card: Semáforo das Emoções & Cantinho da Calma */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-violet-50/40 rounded-2xl p-5 border border-purple-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-purple-950 text-sm">
                  Semáforo Interativo das Emoções
                </h4>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                Uso em Sala
              </span>
            </div>
            <p className="text-xs text-purple-800/80 leading-relaxed">
              Clique nas cores para simular como a criança expressa seu estado sensorial durante a atividade:
            </p>

            {/* Interactive Traffic Light Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedMood("verde");
                  setIsBreathingActive(false);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedMood === "verde"
                    ? "bg-emerald-100 border-emerald-500 shadow-xs ring-2 ring-emerald-400/30 font-bold"
                    : "bg-white border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <div className="text-xl mb-1">🟢</div>
                <div className="text-xs font-bold text-emerald-950">Seguro</div>
                <div className="text-[9px] text-emerald-700">Tudo bem</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMood("amarelo");
                  setIsBreathingActive(true);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedMood === "amarelo"
                    ? "bg-amber-100 border-amber-500 shadow-xs ring-2 ring-amber-400/30 font-bold"
                    : "bg-white border-amber-200 hover:bg-amber-50/50"
                }`}
              >
                <div className="text-xl mb-1">🟡</div>
                <div className="text-xs font-bold text-amber-950">Pausa</div>
                <div className="text-[9px] text-amber-700">Sobrecarga</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedMood("vermelho");
                  setIsBreathingActive(false);
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedMood === "vermelho"
                    ? "bg-rose-100 border-rose-500 shadow-xs ring-2 ring-rose-400/30 font-bold"
                    : "bg-white border-rose-200 hover:bg-rose-50/50"
                }`}
              >
                <div className="text-xl mb-1">🔴</div>
                <div className="text-xs font-bold text-rose-950">Socorro</div>
                <div className="text-[9px] text-rose-700">Bullying/Crise</div>
              </button>
            </div>

            {/* Dynamic Mood Feedback Panel */}
            {selectedMood === "verde" && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 animate-in fade-in">
                <span className="font-bold">✨ Feedback Positivo para a Criança:</span>
                <p className="text-emerald-900">
                  "Você está participando muito bem! Se precisar de algo ou quiser um par para a atividade, é só avisar."
                </p>
              </div>
            )}

            {selectedMood === "amarelo" && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold">🌬️ Guia Interativo de Respiração 4-4-4:</span>
                  <button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 cursor-pointer"
                  >
                    {isBreathingActive ? "Pausar" : "Reiniciar"}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Animated pulsating circle */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <div
                      className={`w-14 h-14 rounded-full bg-amber-300/60 border-2 border-amber-500 flex items-center justify-center transition-all duration-1000 ${
                        breathingPhase === "Inspire..."
                          ? "scale-125 bg-amber-400/80"
                          : breathingPhase === "Segure..."
                          ? "scale-125 bg-amber-500 text-white"
                          : "scale-90 bg-amber-200"
                      }`}
                    >
                      <span className="text-sm font-black">{breathingTimer}s</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-amber-900 text-sm">{breathingPhase}</div>
                    <p className="text-[11px] text-amber-800 leading-tight">
                      Ofereça o abafador de ruído ou permita que a criança vá ao cantinho da calma por 3 minutos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedMood === "vermelho" && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-950 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Protocolo Restaurativo Imediato:</span>
                </div>
                <p className="text-rose-900 leading-relaxed">
                  <strong>Ação do Professor:</strong> Isole a provocação sem expor a criança. Diga à turma com firmeza empática:
                  <em> "Aqui nesta sala nós nos protegemos e respeitamos o ritmo de todos. Risadas ou exclusão não são aceitas."</em>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Adaptation Output */}
        <div className="lg:col-span-7 space-y-6">
          {!currentResult && !isLoading ? (
            <div key="state-empty-instructions" className="bg-white rounded-2xl border border-dashed border-purple-200 p-8 sm:p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-xs">
                <Brain className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-purple-950 font-serif">
                  Pronto para criar uma aula acolhedora
                </h3>
                <p className="text-xs text-purple-700/80 leading-relaxed">
                  Selecione um aluno ou deixe em "Toda a Turma", escolha uma das sugestões rápidas ao lado e clique em
                  <strong> "Gerar Adaptação Inclusiva"</strong>.
                </p>
              </div>

              {/* Interactive preview pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  📋 Roteiro Passo a Passo
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  🔊 Leitura em Voz Alta
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  🛡️ Escudo Anti-Bullying
                </span>
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  🖨️ Ficha A4 Pronta
                </span>
              </div>
            </div>
          ) : isLoading ? (
            <div key="state-loading-progress" className="bg-white rounded-2xl border border-purple-200 p-12 text-center space-y-4 shadow-xs">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-purple-950 font-serif">
                  Criando Adaptação Especializada...
                </h4>
                <p className="text-xs text-purple-700/80 max-w-sm mx-auto">
                  Ajustando Desenho Universal (DUA), acomodações sensoriais, scripts sociais e orientações para os colegas.
                </p>
              </div>
            </div>
          ) : currentResult ? (
            <div key={`state-result-${currentResult.id}`} className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden space-y-4">
              {/* Header of Result with Purple Palette */}
              <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-5 sm:p-6 space-y-4 border-b border-purple-800/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                      {currentResult.neurodiversity} • {currentResult.supportLevel.replace("_", " ")}
                    </span>
                    {currentResult.studentName && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-500/20 text-violet-200 border border-violet-400/30">
                        Aluno: {currentResult.studentName}
                      </span>
                    )}
                    <span className="text-[11px] text-purple-300/80">
                      {currentResult.sourceEngine.startsWith("gemini") ? "IA Online Ativa" : "Matriz Pedagógica Offline"}
                    </span>
                  </div>

                  {/* Top Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPrintSheet(currentResult)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold cursor-pointer transition-colors border border-purple-700"
                      title="Imprimir fichas e cartões visuais para sala"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir A4</span>
                    </button>
                    <button
                      onClick={handleSaveToDb}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                      title="Salvar adaptação no banco local"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {currentResult.adaptedTitle}
                  </h3>
                  <p className="text-xs text-purple-300 mt-1">
                    Atividade Original: <span className="italic">{currentResult.originalTitle}</span>
                  </p>
                </div>

                {saveSuccessNotice && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/20 text-purple-200 text-xs border border-purple-400/40 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    <span>Salvo com sucesso no banco de dados local! Acessível offline a qualquer momento.</span>
                  </div>
                )}
              </div>

              {/* Core Objectives Cards */}
              <div className="px-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <BookCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Objetivo Inclusivo (DUA)</span>
                  </div>
                  <p className="text-purple-900 leading-relaxed">{currentResult.pedagogicalGoal}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-1">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                    <span>Prevenção Ativa ao Bullying</span>
                  </div>
                  <p className="text-rose-900 leading-relaxed">{currentResult.antiBullyingObjective}</p>
                </div>
              </div>

              {/* Navigation Tabs for Results */}
              <div className="px-5 sm:px-6">
                <div className="flex border-b border-purple-100 overflow-x-auto gap-1 no-scrollbar">
                  {[
                    { id: "passos", label: "Passo a Passo", icon: Layers },
                    { id: "visuais", label: "Apoios Visuais", icon: Eye },
                    { id: "sensoriais", label: "Sensoriais", icon: Volume2 },
                    { id: "social", label: "História Social", icon: Heart },
                    { id: "pares", label: "Guardiões da Turma", icon: User },
                    { id: "professor", label: "Mediação Docente", icon: Award }
                  ].map((t) => {
                    const Icon = t.icon;
                    const isTabActive = activeResultTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveResultTab(t.id as any)}
                        className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                          isTabActive
                            ? "border-purple-600 text-purple-950 bg-purple-50/60 font-bold"
                            : "border-transparent text-slate-500 hover:text-purple-900 hover:border-purple-200"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isTabActive ? "text-purple-600" : "text-slate-400"}`} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Panels */}
              <div className="px-5 sm:px-6 pb-6">
                {/* 1. Interactive Step-by-Step with Checkboxes & Progress Bar */}
                {activeResultTab === "passos" && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-purple-900 font-medium">
                        Roteiro estruturado (Metodologia TEACCH & DUA). Clique para marcar os passos concluídos:
                      </p>
                      <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {doneStepsCount} de {totalSteps} feitos ({progressPercent}%)
                      </span>
                    </div>

                    {/* Interactive Progress Bar */}
                    <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Step Cards with Clickable Checkboxes */}
                    <div className="space-y-2">
                      {currentResult.stepByStep.map((step, idx) => {
                        const isDone = !!completedSteps[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleStep(idx)}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isDone
                                ? "bg-purple-50/60 border-purple-300 text-purple-900 line-through opacity-75"
                                : "bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/30 text-purple-950"
                            }`}
                          >
                            <button
                              type="button"
                              className="shrink-0 mt-0.5 text-purple-600 cursor-pointer"
                            >
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-purple-700" />
                              ) : (
                                <UncheckedSquare className="w-4 h-4 text-purple-400" />
                              )}
                            </button>
                            <div className="leading-relaxed flex-1">
                              <strong className="text-purple-900 mr-1.5 font-bold">Passo {idx + 1}:</strong>
                              {step}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Visual Guidelines & Quick Cards */}
                {activeResultTab === "visuais" && (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-purple-900">
                      Recursos pictográficos, rotinas visuais e pistas ambientais para garantir previsibilidade:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentResult.visualGuidelines.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1.5"
                        >
                          <div className="font-bold flex items-center gap-1.5 text-purple-900">
                            <Eye className="w-3.5 h-3.5 text-purple-600" />
                            <span>Recurso Visual #{idx + 1}</span>
                          </div>
                          <p className="leading-relaxed text-purple-900/90">{item}</p>
                        </div>
                      ))}
                    </div>

                    {/* Visual Card Quick Print Preview */}
                    <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                      <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                        Cartões de Comunicação e Socorro para o Estojo (Pré-visualização)
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                        <div className="p-3 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950">
                          <div className="text-lg">🟢</div>
                          <div>ESTOU BEM</div>
                          <div className="text-[9px] font-normal text-emerald-800">Gostando da atividade</div>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-100 border-2 border-amber-500 text-amber-950">
                          <div className="text-lg">🟡</div>
                          <div>PAUSA</div>
                          <div className="text-[9px] font-normal text-amber-800">Preciso de ar / água</div>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-950">
                          <div className="text-lg">🔴</div>
                          <div>SOCORRO</div>
                          <div className="text-[9px] font-normal text-rose-800">Pare / Isso é bullying</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Sensory Guidelines */}
                {activeResultTab === "sensoriais" && (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-purple-900">
                      Acomodações práticas para prevenir sobrecargas auditivas, proprioceptivas e visuais:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentResult.sensoryGuidelines.map((sens, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-200 text-xs text-violet-950 space-y-1.5"
                        >
                          <div className="font-bold flex items-center gap-1.5 text-violet-900">
                            <Volume2 className="w-3.5 h-3.5 text-violet-600" />
                            <span>Acomodação Sensorial #{idx + 1}</span>
                          </div>
                          <p className="leading-relaxed text-violet-950/90">{sens}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Social Story with Interactive Speech Player */}
                {activeResultTab === "social" && (
                  <div className="space-y-4 pt-2">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50/50 border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-purple-950 text-xs flex items-center gap-2">
                          <Heart className="w-4 h-4 text-purple-600" />
                          <span>História Social Adaptada (Carol Gray)</span>
                        </div>

                        {/* Speech Synthesis Audio Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleReadAloud(currentResult.socialStoryScript)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                            isPlayingAudio
                              ? "bg-rose-600 text-white animate-pulse"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                        >
                          {isPlayingAudio ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Pausar Voz</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Ouvir em Voz Alta</span>
                            </>
                          )}
                        </button>
                      </div>

                      <blockquote className="p-4 rounded-xl bg-white border-l-4 border-purple-500 text-xs italic text-purple-950 leading-relaxed shadow-xs">
                        "{currentResult.socialStoryScript}"
                      </blockquote>

                      <div className="text-[11px] text-purple-800/90 leading-relaxed bg-white/70 p-3 rounded-xl border border-purple-100">
                        <strong className="text-purple-950">Como praticar com a criança:</strong> Leia esta história social
                        individualmente antes do início da aula. Use a voz para que ela se sinta segura e compreenda o roteiro.
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Bystanders & Active Peers */}
                {activeResultTab === "pares" && (
                  <div className="space-y-4 pt-2">
                    <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                      <div className="font-bold text-indigo-950 text-xs flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span>Orientação para a Turma (Colegas Guardiões)</span>
                      </div>
                      <p className="text-xs text-indigo-950 leading-relaxed bg-white p-3.5 rounded-xl border border-indigo-100 shadow-xs">
                        {currentResult.bystanderGuideline}
                      </p>
                      <p className="text-[11px] text-indigo-800">
                        <strong>Princípio DUA & Mediação:</strong> Transformar a turma em apoiadores ativos elimina o espaço
                        para exclusões e fofocas, criando um ecossistema seguro para todos.
                      </p>
                    </div>
                  </div>
                )}

                {/* 6. Teacher Mediation & Interactive Dilemma Tester */}
                {activeResultTab === "professor" && (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-purple-900 font-medium">
                      Orientações práticas para o Professor Regente e o Mediador/AT:
                    </p>

                    <div className="space-y-2">
                      {currentResult.teacherMediationTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-950"
                        >
                          <Award className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Dilemma / Crisis Simulator */}
                    <div className="mt-4 p-4 rounded-xl border border-purple-200 bg-white space-y-2.5">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Simulador: O que fazer se acontecer na sala? (Clique para ver a resposta)</span>
                      </span>

                      <div className="space-y-2 text-xs">
                        {[
                          {
                            q: "1. Um colega riu quando o aluno colocou o abafador de ruídos?",
                            ans: "Intervenção Rápida: 'O fone é um recurso de conforto, assim como quem usa óculos para enxergar. Aqui na nossa sala nós respeitamos os combinados de todos!'"
                          },
                          {
                            q: "2. O aluno não quer falar ou apresentar na frente da turma?",
                            ans: "Adaptação DUA: Permita que o aluno mostre um cartaz visual, aponte as gravuras ou apresente previamente gravado em vídeo com o professor."
                          },
                          {
                            q: "3. O aluno teve sobrecarga sensorial e começou a chorar ou bater na mesa?",
                            ans: "Acolhimento Imediato: Não repreenda verbalmente. Diminua as luzes, afaste o barulho ao redor e acompanhe-o ao cantinho da calma sem perguntas invasivas."
                          }
                        ].map((d, i) => {
                          const isOpen = activeDilemma === i;
                          return (
                            <div key={i} className="rounded-xl border border-purple-100 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setActiveDilemma(isOpen ? null : i)}
                                className="w-full text-left p-2.5 bg-purple-50/50 hover:bg-purple-50 flex items-center justify-between font-semibold text-purple-950 cursor-pointer"
                              >
                                <span>{d.q}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-purple-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                              </button>
                              {isOpen && (
                                <div className="p-3 bg-white text-purple-900 text-[11px] leading-relaxed border-t border-purple-100 animate-in fade-in">
                                  {d.ans}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                      <span className="font-semibold text-purple-950">Critério de Avaliação Qualitativo:</span>
                      <p className="text-purple-800">{currentResult.evaluationMetric}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
