import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Users,
  Search,
  Plus,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle,
  Clock,
  Tag
} from "lucide-react";
import { ActivityOriginal, PedagogicalUser } from "../types";
import { localDb } from "../services/db";

interface AntiBullyingLibraryProps {
  activities: ActivityOriginal[];
  currentUser: PedagogicalUser;
  onSelectActivityForAdaptation: (activity: ActivityOriginal) => void;
  onActivityCreated: (activity: ActivityOriginal) => void;
}

const THEME_LABELS: Record<ActivityOriginal["antiBullyingCoreTheme"], { label: string; color: string }> = {
  identificacao_bullying_vs_brincadeira: {
    label: "Bullying vs Brincadeira",
    color: "bg-purple-100 text-purple-900 border-purple-300"
  },
  empatia_e_respeito_as_diferencas: {
    label: "Empatia & Neurodiversidade",
    color: "bg-violet-100 text-violet-900 border-violet-300"
  },
  espectador_ativo_e_denuncia_segura: {
    label: "Guardiões da Turma",
    color: "bg-indigo-100 text-indigo-900 border-indigo-300"
  },
  autorregulacao_emocional_no_conflito: {
    label: "Autorregulação no Conflito",
    color: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300"
  },
  comunicacao_assertiva_e_limites: {
    label: "Comunicação Assertiva / Escudo",
    color: "bg-purple-100 text-purple-900 border-purple-300"
  }
};

export const AntiBullyingLibrary: React.FC<AntiBullyingLibraryProps> = ({
  activities,
  currentUser,
  onSelectActivityForAdaptation,
  onActivityCreated
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("todos");
  const [activeModalActivity, setActiveModalActivity] = useState<ActivityOriginal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New activity form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAge, setNewAge] = useState("6 a 11 anos");
  const [newSubject, setNewSubject] = useState("Educação Socioemocional & Convivência");
  const [newTheme, setNewTheme] = useState<ActivityOriginal["antiBullyingCoreTheme"]>(
    "identificacao_bullying_vs_brincadeira"
  );
  const [newInstructions, setNewInstructions] = useState("");

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedTheme === "todos" || act.antiBullyingCoreTheme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: ActivityOriginal = {
      id: `act-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      targetAge: newAge,
      subject: newSubject,
      antiBullyingCoreTheme: newTheme,
      instructions: newInstructions || "Instruções pedagógicas gerais."
    };

    await localDb.saveActivity(created);
    onActivityCreated(created);
    setIsCreateModalOpen(false);
    // Reset
    setNewTitle("");
    setNewDesc("");
    setNewInstructions("");
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - Purple & Lilac Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Acervo Especializado em Convivência
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-purple-950">
            Biblioteca de Propostas Anti-Bullying
          </h2>
          <p className="text-xs text-purple-700/80">
            Dinâmicas e roteiros para ensinar respeito às diferenças, acolhimento de neurodivergentes e limites seguros.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Proposta</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Buscar por tema ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/40 border border-purple-200 rounded-xl text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedTheme("todos")}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold ${
              selectedTheme === "todos"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-900 hover:bg-purple-100"
            }`}
          >
            Todos os Eixos
          </button>
          {Object.entries(THEME_LABELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedTheme(key)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer font-semibold ${
                selectedTheme === key
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-50 text-purple-900 hover:bg-purple-100"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((act) => {
          const themeInfo = THEME_LABELS[act.antiBullyingCoreTheme] || {
            label: "Geral",
            color: "bg-purple-100 text-purple-900 border-purple-300"
          };

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${themeInfo.color}`}
                  >
                    {themeInfo.label}
                  </span>
                  <span className="text-[11px] text-purple-600 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {act.targetAge}
                  </span>
                </div>

                <h3 className="font-bold text-purple-950 text-base leading-snug font-serif">
                  {act.title}
                </h3>

                <p className="text-xs text-purple-900/80 line-clamp-3 leading-relaxed">
                  {act.description}
                </p>

                <div className="text-[11px] text-purple-700 font-medium">
                  Área: <span className="text-purple-950 font-semibold">{act.subject}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalActivity(act)}
                  className="text-xs text-purple-700 hover:text-purple-950 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ver Detalhes</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectActivityForAdaptation(act)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Adaptar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Detalhes da Proposta */}
      {activeModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bold text-purple-950 text-base font-serif">
                {activeModalActivity.title}
              </h3>
              <button
                onClick={() => setActiveModalActivity(null)}
                className="text-purple-400 hover:text-purple-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold">
                  {THEME_LABELS[activeModalActivity.antiBullyingCoreTheme]?.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[11px] font-medium">
                  {activeModalActivity.targetAge}
                </span>
              </div>

              <div>
                <strong className="block text-purple-950 mb-1">Descrição:</strong>
                <p className="text-purple-900 leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                  {activeModalActivity.description}
                </p>
              </div>

              <div>
                <strong className="block text-purple-950 mb-1">Metodologia / Instruções para o Professor:</strong>
                <p className="text-purple-900 leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-100 whitespace-pre-line">
                  {activeModalActivity.instructions}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={() => setActiveModalActivity(null)}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectActivityForAdaptation(activeModalActivity);
                  setActiveModalActivity(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Adaptar com o Motor Inclusivo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Nova Proposta */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bold text-purple-950 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <span>Nova Proposta Pedagógica</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-purple-400 hover:text-purple-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-purple-950 mb-1">Título da Proposta</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Tribunal da Empatia / Oficina de Desenho em Duplas"
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Eixo Central Anti-Bullying</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as any)}
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                >
                  {Object.entries(THEME_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Faixa Etária</label>
                  <input
                    type="text"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Área / Disciplina</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Descrição Breve</label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explique o que os alunos farão..."
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">Instruções Passo a Passo</label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Orientações para o professor..."
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Salvar na Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
