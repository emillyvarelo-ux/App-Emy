import React from "react";
import { ActivityAdaptation } from "../types";
import { Printer, X, ShieldAlert, CheckSquare, Sparkles, Volume2, Eye } from "lucide-react";

interface PrintSheetModalProps {
  adaptation: ActivityAdaptation | null;
  onClose: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({ adaptation, onClose }) => {
  if (!adaptation) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-purple-200 space-y-5 max-h-[95vh] overflow-y-auto print:max-h-none print:p-0 print:border-none print:shadow-none print:rounded-none">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-950 text-base font-serif">
              Visualização de Impressão • Ficha Pedagógica A4
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-purple-400 hover:text-purple-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 CONTENT */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 print:border-none print:p-0 space-y-6 text-slate-900 font-sans">
          {/* Header of the Sheet */}
          <div className="border-b-2 border-purple-900 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-800">
                NeuroEduca • Ficha de Adaptação Inclusiva & Prevenção ao Bullying
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-purple-950 mt-1">
                {adaptation.adaptedTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Proposta Original: <em>{adaptation.originalTitle}</em>
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5 shrink-0 bg-purple-50/50 p-2.5 rounded-xl border border-purple-200 print:bg-transparent print:border-none">
              {adaptation.studentName && (
                <div>
                  <strong>Aluno:</strong> {adaptation.studentName}
                </div>
              )}
              <div>
                <strong>Perfil:</strong> {adaptation.neurodiversity} (
                {adaptation.supportLevel.replace("_", " ")})
              </div>
              <div>
                <strong>Adaptado por:</strong> {adaptation.adaptedByUserName}
              </div>
              <div>
                <strong>Data:</strong>{" "}
                {new Date(adaptation.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>

          {/* Objectives Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30">
              <strong className="block text-purple-950 font-bold mb-1">
                🎯 Objetivo Pedagógico Inclusivo
              </strong>
              <p className="text-slate-800 leading-relaxed">{adaptation.pedagogicalGoal}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30">
              <strong className="block text-purple-950 font-bold mb-1">
                🛡️ Foco Central Anti-Bullying
              </strong>
              <p className="text-slate-800 leading-relaxed">
                {adaptation.antiBullyingObjective}
              </p>
            </div>
          </div>

          {/* Step-by-Step with Checkboxes for the Student / Teacher */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-purple-950 uppercase tracking-wider text-xs border-b border-purple-200 pb-1">
              Roteiro de Atividade Passo a Passo
            </h3>
            <div className="space-y-2">
              {adaptation.stepByStep.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl border border-purple-100 bg-white"
                >
                  <div className="w-5 h-5 border-2 border-purple-400 rounded-sm shrink-0 flex items-center justify-center font-bold text-[10px] text-purple-700">
                    {idx + 1}
                  </div>
                  <span className="text-slate-800 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual & Sensory Support Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-purple-950 flex items-center gap-1.5 border-b border-purple-200 pb-1">
                <Eye className="w-3.5 h-3.5 text-purple-700" />
                Diretrizes Visuais para a Sala
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                {adaptation.visualGuidelines.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-purple-950 flex items-center gap-1.5 border-b border-purple-200 pb-1">
                <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                Acomodações Sensoriais & Descompressão
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                {adaptation.sensoryGuidelines.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Anti-Bullying Story Script */}
          <div className="p-3.5 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/40 space-y-1.5 text-xs">
            <span className="font-bold text-purple-950 block">
              📖 História Social / Script de Autoproteção:
            </span>
            <blockquote className="italic text-slate-800 bg-white p-3 rounded-xl border border-purple-200 leading-relaxed">
              "{adaptation.socialStoryScript}"
            </blockquote>
          </div>

          {/* CUT-OUT CARDS: Cartões de Comunicação & Socorro para o Aluno Recortar */}
          <div className="space-y-2 pt-2 border-t-2 border-dashed border-purple-300">
            <div className="flex items-center justify-between text-[11px] text-purple-800 font-bold uppercase tracking-wider">
              <span>✂️ Cartões Visuais para Recortar e Plastificar</span>
              <span>NeuroEduca Cut-Out</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border-2 border-dashed border-emerald-600 rounded-xl p-3 bg-emerald-50 text-emerald-950 flex flex-col items-center justify-center space-y-1">
                <span className="text-2xl">🟢</span>
                <span className="font-black text-sm uppercase">TUDO BEM</span>
                <span className="text-[10px] text-emerald-800 leading-tight">
                  Estou confortável e participando
                </span>
              </div>

              <div className="border-2 border-dashed border-amber-500 rounded-xl p-3 bg-amber-50 text-amber-950 flex flex-col items-center justify-center space-y-1">
                <span className="text-2xl">🟡</span>
                <span className="font-black text-sm uppercase">PRECISO DE PAUSA</span>
                <span className="text-[10px] text-amber-800 leading-tight">
                  Quero respirar / Cantinho calmo
                </span>
              </div>

              <div className="border-2 border-dashed border-rose-600 rounded-xl p-3 bg-rose-50 text-rose-950 flex flex-col items-center justify-center space-y-1">
                <span className="text-2xl">🔴</span>
                <span className="font-black text-sm uppercase">PARE / AJUDA</span>
                <span className="text-[10px] text-rose-800 leading-tight">
                  Isto é bullying ou me machuca
                </span>
              </div>
            </div>
          </div>

          {/* Signatures for PEI Council */}
          <div className="pt-6 border-t border-purple-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-1" />
              <span>Assinatura do Prof. Especialista AEE / Regente</span>
            </div>
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-1" />
              <span>Assinatura da Coordenação Pedagógica</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
