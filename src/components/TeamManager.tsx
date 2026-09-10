import React, { useState } from "react";
import {
  UserCheck,
  Plus,
  Shield,
  CheckCircle2,
  Lock,
  Award,
  BookOpen,
  Eye,
  HeartHandshake,
  Sparkles
} from "lucide-react";
import { PedagogicalUser, UserRole } from "../types";
import { localDb } from "../services/db";

interface TeamManagerProps {
  users: PedagogicalUser[];
  currentUser: PedagogicalUser;
  onSwitchUser: (user: PedagogicalUser) => void;
  onUserCreated: (user: PedagogicalUser) => void;
}

const ROLE_DESCRIPTIONS: Record<
  UserRole,
  {
    title: string;
    description: string;
    duties: string[];
    permissions: string[];
    color: string;
  }
> = {
  coordenador: {
    title: "Coordenador Pedagógico / Gestor",
    description:
      "Supervisão geral das diretrizes de inclusão, aprovação de PEI e mediação institucional da escola.",
    duties: [
      "Aprovar oficialmente adaptações curriculares e PEI",
      "Conduzir reuniões com famílias e conselhos",
      "Monitorar indicadores de convivência da unidade"
    ],
    permissions: ["Acesso total", "Aprovação de PEI", "Gestão de equipe"],
    color: "border-purple-200 bg-purple-50/50 text-purple-950"
  },
  professor_aee: {
    title: "Professor do AEE (Especialista)",
    description:
      "Especialista em neurodesenvolvimento e Tecnologia Assistiva, formulação de adaptações técnicas.",
    duties: [
      "Mapear perfis sensoriais e pranchas CAA (PECS)",
      "Formular adaptações e orientar a regência",
      "Acompanhar histórico observacional de cada aluno"
    ],
    permissions: ["Formulação de adaptações", "Aprovação técnica", "Edição sensorial"],
    color: "border-violet-200 bg-violet-50/50 text-violet-950"
  },
  professor_regente: {
    title: "Professor Regente (Sala Regular)",
    description:
      "Docente titular da turma, integrando o aluno nas dinâmicas de sala e prevenindo o bullying.",
    duties: [
      "Aplicar atividades adaptadas na rotina diária",
      "Promover empatia e guias anti-bullying na turma",
      "Registrar observações diárias de convivência"
    ],
    permissions: ["Aplicação de atividades", "Registro observacional", "Adaptação rápida"],
    color: "border-purple-200 bg-purple-50/30 text-purple-950"
  },
  psicopedagogo: {
    title: "Psicopedagogo / Terapeuta Escolar",
    description:
      "Foco na saúde socioemocional, acolhimento e mediação ética de conflitos entre pares.",
    duties: [
      "Intervir preventivamente em deboches e exclusões",
      "Desenvolver roteiros sociais assertivos",
      "Apoiar o aluno em sofrimento emocional"
    ],
    permissions: ["Avaliação comportamental", "Histórias sociais", "Mediação ética"],
    color: "border-fuchsia-200 bg-fuchsia-50/40 text-fuchsia-950"
  },
  mediador_at: {
    title: "Acompanhante Terapêutico (AT) / Mediador",
    description:
      "Apoio direto e contínuo ao aluno em sala de aula e momentos desafiadores do recreio.",
    duties: [
      "Identificar sinais prévios de sobrecarga sensorial",
      "Conduzir pausas no cantinho calmo com abafador",
      "Proteger ativamente contra isolamento no pátio"
    ],
    permissions: ["Registro em tempo real", "Manejo de crise", "Suporte sensorial"],
    color: "border-purple-200 bg-purple-50/40 text-purple-950"
  }
};

export const TeamManager: React.FC<TeamManagerProps> = ({
  users,
  currentUser,
  onSwitchUser,
  onUserCreated
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("professor_regente");
  const [regNum, setRegNum] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const colors = [
      "bg-purple-600",
      "bg-violet-600",
      "bg-fuchsia-600",
      "bg-indigo-600"
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser: PedagogicalUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      roleTitle: ROLE_DESCRIPTIONS[role].title,
      registrationNumber: regNum || `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      avatarColor: pickedColor,
      createdAt: new Date().toISOString()
    };

    await localDb.saveUser(newUser);
    onUserCreated(newUser);
    setIsCreateModalOpen(false);
    // Reset
    setName("");
    setEmail("");
    setRegNum("");
  };

  return (
    <div className="space-y-8">
      {/* Header - Purple & Lilac Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            Equipe Multidisciplinar & Segurança
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-purple-950">
            Perfis Pedagógicos & Controle de Acesso
          </h2>
          <p className="text-xs text-purple-700/80">
            Acesso baseado em papéis (RBAC): Coordenação, AEE, Sala Regular, Psicopedagogia e Mediação/AT.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Profissional</span>
        </button>
      </div>

      {/* Current Active User Banner - Purple Theme */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-white p-6 rounded-2xl border border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md ${currentUser.avatarColor}`}
          >
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">{currentUser.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-400/20 text-purple-200 border border-purple-400/30">
                Sessão Ativa
              </span>
            </div>
            <p className="text-xs text-purple-200/90 mt-0.5">
              {currentUser.roleTitle} • Matrícula: {currentUser.registrationNumber}
            </p>
          </div>
        </div>

        <div className="text-xs text-purple-200/80 bg-purple-900/60 px-3.5 py-2 rounded-xl border border-purple-700/60 max-w-sm">
          Clique em qualquer profissional abaixo para alternar rapidamente a sessão e os privilégios no sistema.
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="space-y-3">
        <h3 className="font-bold text-purple-950 text-sm">
          Profissionais da Unidade Escolar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const isSelected = u.id === currentUser.id;

            return (
              <div
                key={u.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 bg-white ${
                  isSelected
                    ? "border-purple-600 ring-2 ring-purple-500/20 shadow-md"
                    : "border-purple-100 hover:border-purple-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ${u.avatarColor}`}
                    >
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-950 text-xs sm:text-sm">{u.name}</h4>
                      <p className="text-[11px] text-purple-700">{u.email}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Ativo
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                  <span className="font-bold text-purple-950 block text-[11px]">{u.roleTitle}</span>
                  <span className="text-[10px] text-purple-700 block">
                    Registro: {u.registrationNumber}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSwitchUser(u)}
                  disabled={isSelected}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 text-purple-400 cursor-default"
                      : "bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200"
                  }`}
                >
                  {isSelected ? "Perfil em Uso" : "Alternar para Este Perfil"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-6 space-y-4">
        <div className="border-b border-purple-100 pb-3">
          <h3 className="font-bold text-purple-950 text-base font-serif flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Matriz de Atribuições & Proteção Pedagógica
          </h3>
          <p className="text-xs text-purple-700/80 mt-1">
            Cada função atua em colaboração contínua para resguardar a integridade socioemocional dos estudantes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.entries(ROLE_DESCRIPTIONS).map(([rKey, rData]) => (
            <div
              key={rKey}
              className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${rData.color}`}
            >
              <div className="space-y-2">
                <span className="font-bold text-purple-950 block text-xs sm:text-sm">
                  {rData.title}
                </span>
                <p className="text-purple-900/90 leading-relaxed text-[11px]">{rData.description}</p>
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-purple-950 block text-[11px]">
                    Atribuições Principais:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-purple-900 text-[11px]">
                    {rData.duties.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-200 flex flex-wrap gap-1">
                {rData.permissions.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg bg-white border border-purple-200 text-[10px] font-semibold text-purple-900"
                  >
                    🔒 {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Cadastrar Novo Usuário */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-bold text-purple-950 text-base font-serif flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Cadastrar Profissional da Equipe
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-purple-400 hover:text-purple-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-purple-950 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Prof. Roberto Andrade"
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: roberto.andrade@escola.educa"
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Perfil Pedagógico & Nível de Acesso
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-purple-50/30 border border-purple-200 rounded-xl px-3 py-2 text-purple-950 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="coordenador">Coordenador Pedagógico / Gestor</option>
                  <option value="professor_aee">Professor do AEE (Especialista)</option>
                  <option value="professor_regente">Professor Regente (Sala Regular)</option>
                  <option value="psicopedagogo">Psicopedagogo / Terapeuta Escolar</option>
                  <option value="mediador_at">Mediador Escolar / Acompanhante Terapêutico (AT)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-purple-950 mb-1">
                  Matrícula / Registro Profissional
                </label>
                <input
                  type="text"
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  placeholder="Ex: MAT-2024-332 ou CRP-06/..."
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
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
