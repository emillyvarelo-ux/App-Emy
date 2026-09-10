import React, { useState } from "react";
import {
  Users,
  Plus,
  Brain,
  Eye,
  Volume2,
  Sparkles,
  Trash2,
  Edit2,
  HeartHandshake,
  AlertCircle,
  Tag,
  Search,
  CheckCircle2
} from "lucide-react";
import { Student, NeurodiversityType, SupportLevel, PedagogicalUser } from "../types";
import { localDb } from "../services/db";

interface StudentManagerProps {
  students: Student[];
  currentUser: PedagogicalUser;
  onStudentUpdated: () => void;
  onAdaptForStudent: (student: Student) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  currentUser,
  onStudentUpdated,
  onAdaptForStudent
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("4º Ano A");
  const [turma, setTurma] = useState("Sala 12 - Matutino");
  const [neurodiversity, setNeurodiversity] = useState<NeurodiversityType>("TEA");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("Nivel_2");
  const [diagDetails, setDiagDetails] = useState("");
  const [commMode, setCommMode] = useState<Student["communicationMode"]>("verbal_frases_curtas");
  const [interestsInput, setInterestsInput] = useState("");
  const [triggersInput, setTriggersInput] = useState("");
  const [calmingInput, setCalmingInput] = useState("");
  const [antiBullyingNotes, setAntiBullyingNotes] = useState("");
  const [auditory, setAuditory] = useState<"hipersensivel" | "hipossensivel" | "neutro">("hipersensivel");
  const [visual, setVisual] = useState<"hipersensivel" | "hipossensivel" | "neutro">("neutro");
  const [tactile, setTactile] = useState<"hipersensivel" | "hipossensivel" | "neutro">("hipersensivel");
  const [vestibular, setVestibular] = useState<"busca_movimento" | "evita_movimento" | "neutro">("busca_movimento");

  const openCreateModal = () => {
    setEditingStudent(null);
    setName("");
    setGrade("4º Ano A");
    setTurma("Sala 12 - Matutino");
    setNeurodiversity("TEA");
    setSupportLevel("Nivel_2");
    setDiagDetails("");
    setCommMode("verbal_frases_curtas");
    setInterestsInput("Trens, Astronomia");
    setTriggersInput("Sinal sonoro alto, Gritos");
    setCalmingInput("Abafador de ruídos, Cantinho calmo");
    setAntiBullyingNotes("Vulnerável a piadas sarcásticas e isolamento no recreio.");
    setAuditory("hipersensivel");
    setVisual("neutro");
    setTactile("hipersensivel");
    setVestibular("busca_movimento");
    setIsModalOpen(true);
  };

  const openEditModal = (st: Student) => {
    setEditingStudent(st);
    setName(st.name);
    setGrade(st.grade);
    setTurma(st.turma);
    setNeurodiversity(st.neurodiversity);
    setSupportLevel(st.supportLevel);
    setDiagDetails(st.medicalDiagnosticDetails);
    setCommMode(st.communicationMode);
    setInterestsInput(st.hyperfocusInterests.join(", "));
    setTriggersInput(st.sensoryProfile.specificTriggers.join(", "));
    setCalmingInput(st.sensoryProfile.calmingStrategies.join(", "));
    setAntiBullyingNotes(st.antiBullyingVulnerabilityNotes);
    setAuditory(st.sensoryProfile.auditory);
    setVisual(st.sensoryProfile.visual);
    setTactile(st.sensoryProfile.tactile);
    setVestibular(st.sensoryProfile.vestibular);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    const studentToSave: Student = {
      id: editingStudent ? editingStudent.id : `student-${Date.now()}`,
      name,
      birthDate: editingStudent?.birthDate || "2015-06-01",
      grade,
      turma,
      neurodiversity,
      supportLevel,
      medicalDiagnosticDetails: diagDetails || "Acompanhamento inclusivo escolar.",
      communicationMode: commMode,
      hyperfocusInterests: interestsInput.split(",").map((s) => s.trim()).filter(Boolean),
      sensoryProfile: {
        auditory,
        visual,
        tactile,
        vestibular,
        specificTriggers: triggersInput.split(",").map((s) => s.trim()).filter(Boolean),
        calmingStrategies: calmingInput.split(",").map((s) => s.trim()).filter(Boolean)
      },
      antiBullyingVulnerabilityNotes: antiBullyingNotes || "Atenção a interações no recreio.",
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await localDb.saveStudent(studentToSave);
    onStudentUpdated();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, stName: string) => {
    if (confirm(`Deseja remover o cadastro de "${stName}" do banco local?`)) {
      await localDb.deleteStudent(id);
      onStudentUpdated();
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.neurodiversity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header - Purple & Lilac Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Gestão Pedagógica & PEI
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-purple-950">
            Alunos Neurodivergentes & Fichas Sensoriais
          </h2>
          <p className="text-xs text-purple-700/80">
            Cadastros com mapeamento de sensibilidades, hiperfoco, comunicação e rede de proteção anti-bullying.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Aluno</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
          <input
            type="text"
            placeholder="Buscar por nome, neurodivergência ou turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-purple-50/40 border border-purple-200 rounded-xl text-purple-950 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Students List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
                    {st.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-950 text-base leading-tight">
                      {st.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        {st.neurodiversity} • {st.supportLevel.replace("_", " ")}
                      </span>
                      <span className="text-xs text-purple-700">
                        {st.grade} • {st.turma}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(st)}
                    className="p-1.5 rounded-xl text-purple-600 hover:text-purple-950 hover:bg-purple-50 transition-colors cursor-pointer"
                    title="Editar ficha do aluno"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(st.id, st.name)}
                    className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir aluno"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Diagnosis & Communication */}
              <div className="text-xs text-purple-900 space-y-1 bg-purple-50/40 p-3.5 rounded-xl border border-purple-100">
                <p>
                  <strong className="text-purple-950 font-bold">Diagnóstico:</strong> {st.medicalDiagnosticDetails}
                </p>
                <p>
                  <strong className="text-purple-950 font-bold">Comunicação:</strong>{" "}
                  {st.communicationMode.replace("_", " ").toUpperCase()}
                </p>
              </div>

              {/* Hyperfocus & Sensory profile */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-purple-950 font-bold">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Interesses Hiperfocados:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {st.hyperfocusInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Anti-Bullying Vulnerability Box */}
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                <div className="font-bold text-rose-950 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Alerta de Prevenção ao Bullying:</span>
                </div>
                <p className="text-rose-900 leading-relaxed">
                  {st.antiBullyingVulnerabilityNotes}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-purple-100 flex items-center justify-between">
              <span className="text-[11px] text-purple-700/70">
                Atualizado: {new Date(st.updatedAt).toLocaleDateString("pt-BR")}
              </span>
              <button
                onClick={() => onAdaptForStudent(st)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adaptar Atividade</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Cadastro / Edição de Aluno - Purple Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bold text-purple-950 text-base font-serif flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>{editingStudent ? "Editar Perfil do Aluno" : "Cadastrar Aluno Neurodivergente"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-400 hover:text-purple-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Lucas Pinheiro Fontes"
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Turma & Turno</label>
                  <input
                    type="text"
                    required
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    placeholder="Ex: 4º Ano A - Matutino"
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 mb-1">Neurodivergência</label>
                  <select
                    value={neurodiversity}
                    onChange={(e) => setNeurodiversity(e.target.value as any)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-2.5 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="TEA">TEA (Espectro Autista)</option>
                    <option value="TDAH">TDAH</option>
                    <option value="TOD">TOD</option>
                    <option value="DISLEXIA">Dislexia</option>
                    <option value="DEF_INTELECTUAL">Deficiência Intelectual / Down</option>
                    <option value="AH_SD">Altas Habilidades / Superdotação</option>
                    <option value="TPS">Processamento Sensorial (TPS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">Nível de Suporte</label>
                  <select
                    value={supportLevel}
                    onChange={(e) => setSupportLevel(e.target.value as any)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-2.5 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Nivel_1">Nível 1 (Leve)</option>
                    <option value="Nivel_2">Nível 2 (Moderado)</option>
                    <option value="Nivel_3">Nível 3 (Substancial)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 mb-1">Modo de Comunicação</label>
                  <select
                    value={commMode}
                    onChange={(e) => setCommMode(e.target.value as any)}
                    className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-2.5 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="verbal_fluente">Verbal Fluente</option>
                    <option value="verbal_frases_curtas">Frases Curtas</option>
                    <option value="ecolalia_funcional">Ecolalias Funcionais</option>
                    <option value="caa_pictogramas">CAA / Pictogramas (PECS)</option>
                    <option value="gestual_corporal">Gestual / Corporal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Detalhes Diagnósticos & Comorbidades
                </label>
                <textarea
                  rows={2}
                  required
                  value={diagDetails}
                  onChange={(e) => setDiagDetails(e.target.value)}
                  placeholder="CID, características neuropsicomotoras, acompanhamentos..."
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Sensory Profile Form */}
              <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 space-y-3">
                <span className="font-bold text-purple-950 block text-xs">
                  Mapeamento Sensorial (Regulação & Acomodação)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <label className="text-purple-800 block mb-0.5 font-medium">Auditivo</label>
                    <select
                      value={auditory}
                      onChange={(e) => setAuditory(e.target.value as any)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950"
                    >
                      <option value="hipersensivel">Hipersensível</option>
                      <option value="hipossensivel">Hipossensível</option>
                      <option value="neutro">Neutro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-purple-800 block mb-0.5 font-medium">Visual</label>
                    <select
                      value={visual}
                      onChange={(e) => setVisual(e.target.value as any)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950"
                    >
                      <option value="hipersensivel">Hipersensível</option>
                      <option value="hipossensivel">Hipossensível</option>
                      <option value="neutro">Neutro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-purple-800 block mb-0.5 font-medium">Tátil</label>
                    <select
                      value={tactile}
                      onChange={(e) => setTactile(e.target.value as any)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950"
                    >
                      <option value="hipersensivel">Hipersensível</option>
                      <option value="hipossensivel">Hipossensível</option>
                      <option value="neutro">Neutro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-purple-800 block mb-0.5 font-medium">Vestibular</label>
                    <select
                      value={vestibular}
                      onChange={(e) => setVestibular(e.target.value as any)}
                      className="w-full bg-white border border-purple-200 rounded-lg p-1.5 text-purple-950"
                    >
                      <option value="busca_movimento">Busca Movimento</option>
                      <option value="evita_movimento">Evita Movimento</option>
                      <option value="neutro">Neutro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-purple-950 font-bold block mb-0.5">
                      Gatilhos Sensoriais Específicos (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      value={triggersInput}
                      onChange={(e) => setTriggersInput(e.target.value)}
                      placeholder="Ex: Sirene do recreio, Luz forte"
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-purple-950"
                    />
                  </div>
                  <div>
                    <label className="text-purple-950 font-bold block mb-0.5">
                      Estratégias de Acalento / Cantinho Calmo
                    </label>
                    <input
                      type="text"
                      value={calmingInput}
                      onChange={(e) => setCalmingInput(e.target.value)}
                      placeholder="Ex: Abafador de ouvido, Almofada macia"
                      className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1.5 text-purple-950"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Interesses Hiperfocados (Essenciais para Engajamento DUA)
                </label>
                <input
                  type="text"
                  required
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="Ex: Trens, Dinossauros, Astronomia"
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-950 mb-1">
                  Histórico de Vulnerabilidade ao Bullying & Alertas
                </label>
                <textarea
                  rows={2}
                  required
                  value={antiBullyingNotes}
                  onChange={(e) => setAntiBullyingNotes(e.target.value)}
                  placeholder="Relate como o aluno reage a brincadeiras, se é isolado pelos colegas..."
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Salvar Cadastro Local
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
