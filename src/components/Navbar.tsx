import React, { useState } from "react";
import {
  Sparkles,
  Users,
  LayoutDashboard,
  BookOpen,
  UserCheck,
  HardDrive,
  CheckCircle2,
  ChevronDown,
  Shield,
  HeartHandshake
} from "lucide-react";
import { PedagogicalUser, UserRole } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: PedagogicalUser;
  users: PedagogicalUser[];
  onSwitchUser: (user: PedagogicalUser) => void;
  onOpenBackup: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; badgeColor: string }> = {
  coordenador: { label: "Coordenação", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
  professor_aee: { label: "Especialista AEE", badgeColor: "bg-violet-100 text-violet-800 border-violet-300" },
  professor_regente: { label: "Prof. Regente", badgeColor: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300" },
  psicopedagogo: { label: "Psicopedagogia", badgeColor: "bg-purple-100 text-purple-800 border-purple-300" },
  mediador_at: { label: "Mediador / AT", badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300" }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  users,
  onSwitchUser,
  onOpenBackup
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const roleInfo = ROLE_LABELS[currentUser.role] || {
    label: currentUser.role,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
  };

  const navItems = [
    { id: "adapter", label: "Adaptar Aula", icon: Sparkles },
    { id: "dashboard", label: "Meu Aluno & Métricas", icon: LayoutDashboard },
    { id: "library", label: "Biblioteca Anti-Bullying", icon: BookOpen },
    { id: "students", label: "Perfis dos Alunos", icon: Users },
    { id: "team", label: "Equipe Escolar", icon: UserCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs print:hidden">
      {/* Top Banner: Contexto Inclusivo & Status de Privacidade Offline */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-purple-100 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-purple-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-medium text-purple-200">
            Ambiente Pedagógico Inclusivo • Banco Local no Navegador (Privacidade LGPD & Suporte Offline)
          </span>
        </div>
        <div className="flex items-center gap-4 text-purple-300">
          <span className="hidden sm:inline">Prevenção Ativa ao Bullying em Crianças Neurodivergentes</span>
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 text-purple-300 hover:text-white transition-colors font-medium cursor-pointer"
            title="Exportar ou Importar dados locais"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Dados Locais</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div
            onClick={() => setActiveTab("adapter")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-purple-950 font-serif">NeuroEduca</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  DUA & Anti-Bullying
                </span>
              </div>
              <p className="text-xs text-purple-700/80 hidden sm:block">
                Adaptação Inclusiva, Diretrizes Sensoriais e Apoio aos Colegas
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-semibold"
                      : "text-purple-900/70 hover:text-purple-950 hover:bg-purple-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-600"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-purple-200 hover:border-purple-300 bg-purple-50/50 hover:bg-purple-100/60 transition-all cursor-pointer shadow-xs text-left"
              title="Trocar perfil pedagógico de acesso"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs ${currentUser.avatarColor}`}
              >
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-purple-950 leading-tight flex items-center gap-1.5">
                  {currentUser.name}
                  <ChevronDown className="w-3 h-3 text-purple-400" />
                </div>
                <span
                  className={`inline-block text-[10px] font-medium px-1.5 py-0.2 rounded-sm border ${roleInfo.badgeColor}`}
                >
                  {roleInfo.label}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-purple-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-purple-100 mb-1">
                    <p className="text-xs font-semibold text-purple-900 uppercase tracking-wider">
                      Alternar Perfil Pedagógico
                    </p>
                    <p className="text-xs text-purple-600">
                      O controle de acesso adapta formulários e permissões.
                    </p>
                  </div>
                  <div className="space-y-1">
                    {users.map((u) => {
                      const isSelected = u.id === currentUser.id;
                      const uRole = ROLE_LABELS[u.role] || {
                        label: u.role,
                        badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
                      };
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-purple-50 text-purple-950 font-semibold border border-purple-200"
                              : "hover:bg-purple-50/50 text-slate-700"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${u.avatarColor}`}
                          >
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate text-purple-950">{u.name}</div>
                            <span
                              className={`inline-block text-[9px] font-medium px-1.5 py-0.2 rounded-sm border ${uRole.badgeColor}`}
                            >
                              {uRole.label}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-purple-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setActiveTab("team");
                      }}
                      className="w-full text-center text-xs text-purple-700 hover:text-purple-900 font-medium py-1.5 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Gerenciar Equipe & Permissões →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-purple-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 cursor-pointer transition-all ${
                  isActive
                    ? "bg-purple-600 text-white font-semibold shadow-xs"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
