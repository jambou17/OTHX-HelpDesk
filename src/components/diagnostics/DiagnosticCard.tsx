import React from 'react';
import { DiagnosticProcedure } from '../../types';
import { Wrench, CheckCircle, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

interface DiagnosticCardProps {
  procedure: DiagnosticProcedure;
  onSelect: (procedure: DiagnosticProcedure) => void;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ procedure, onSelect }) => {
  const getDifficultyBadge = () => {
    switch (procedure.dificuldade) {
      case 'facil':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Fácil
          </span>
        );
      case 'medio':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Médio
          </span>
        );
      case 'avancado':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            Avançado
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {procedure.categoria}
          </span>
          {getDifficultyBadge()}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1565C0] transition-colors leading-snug">
          {procedure.titulo}
        </h3>

        {/* Symptoms checklist */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Sintomas Frequentes:
          </span>
          <ul className="text-xs text-slate-600 space-y-1">
            {procedure.sintomas.slice(0, 3).map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span className="line-clamp-1">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps count & Causes preview */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{procedure.etapas.length} etapas no checklist</span>
          <span>{procedure.possiveisCausas.length} causas mapeadas</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onSelect(procedure)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#1565C0] bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors group-hover:bg-[#1565C0] group-hover:text-white"
        >
          <Wrench className="w-3.5 h-3.5" />
          Iniciar Diagnóstico Passo a Passo
        </button>
      </div>
    </div>
  );
};
