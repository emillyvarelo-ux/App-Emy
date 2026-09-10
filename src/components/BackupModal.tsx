import React, { useState } from "react";
import { localDb } from "../services/db";
import {
  HardDrive,
  Download,
  Upload,
  RefreshCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  FileJson
} from "lucide-react";

interface BackupModalProps {
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ onClose, onDataRestored }) => {
  const [exportNotice, setExportNotice] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      const json = await localDb.exportFullBackup();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuroeduca_backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 4000);
    } catch (e) {
      console.error(e);
      alert("Falha ao exportar backup.");
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await localDb.importBackup(content);
      if (success) {
        setImportStatus("Backup restaurado com sucesso!");
        onDataRestored();
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        alert("O arquivo fornecido não é um backup válido do NeuroEduca.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (
      confirm(
        "Atenção: Deseja redefinir os dados para o padrão inicial do sistema? Suas alterações locais serão substituídas pelos exemplos recomendados."
      )
    ) {
      await localDb.resetToDefaults();
      onDataRestored();
      alert("Banco local restaurado para os dados padronizados!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-purple-200 space-y-5">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-purple-950 text-base font-serif">
                Banco de Dados Local & Privacidade Offline
              </h3>
              <p className="text-[11px] text-purple-700/80">
                Arquitetura Offline-First & Conformidade LGPD Escolar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 space-y-2">
          <div className="font-bold text-purple-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            Garantia de Privacidade de Dados Sensíveis
          </div>
          <p className="leading-relaxed text-[11px] text-purple-900/90">
            Todos os diagnósticos, anotações de vulnerabilidade ao bullying, relatórios individuais
            de progresso e perfis de alunos ficam armazenados <strong>exclusivamente na memória local do seu navegador (IndexedDB)</strong>.
            Nenhum dado pessoal de estudantes é exposto sem o seu consentimento.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="space-y-3 text-xs">
          {/* Export Button */}
          <div className="p-3.5 rounded-xl border border-purple-100 hover:border-purple-300 transition-all flex items-center justify-between gap-3 bg-white">
            <div className="space-y-0.5">
              <span className="font-bold text-purple-950 block">Exportar Backup Completo</span>
              <p className="text-[11px] text-purple-700/80">
                Gera um arquivo .json seguro com todos os alunos, adaptações e registros.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

          {exportNotice && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Arquivo de backup baixado com sucesso! Guarde-o com segurança.</span>
            </div>
          )}

          {/* Import Button */}
          <div className="p-3.5 rounded-xl border border-purple-100 hover:border-purple-300 transition-all flex items-center justify-between gap-3 bg-white">
            <div className="space-y-0.5">
              <span className="font-bold text-purple-950 block">Restaurar Backup</span>
              <p className="text-[11px] text-purple-700/80">
                Carregue um arquivo .json salvo anteriormente para restaurar a base escolar.
              </p>
            </div>
            <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs cursor-pointer shrink-0 transition-colors border border-purple-200">
              <Upload className="w-3.5 h-3.5 text-purple-600" />
              <span>Carregar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Reset to Factory Defaults */}
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-rose-950 block">Restaurar Dados Padrão</span>
              <p className="text-[11px] text-rose-800">
                Substitui a base atual pelos 5 perfis pedagógicos e casos de exemplo.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-300 cursor-pointer shrink-0 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-900 text-white font-semibold text-xs hover:bg-purple-950 cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
