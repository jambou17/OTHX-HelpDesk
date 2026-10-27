import React, { useState } from 'react';
import { DiagnosticProcedure, DiagnosticStepResult, Ticket } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, AlertCircle, Wrench, ArrowRight, ArrowLeft, Link as LinkIcon, RotateCcw } from 'lucide-react';

interface DiagnosticWizardProps {
  procedure: DiagnosticProcedure;
  initialTicketId?: string;
  onFinish?: () => void;
  onCancel?: () => void;
}

export const DiagnosticWizard: React.FC<DiagnosticWizardProps> = ({
  procedure,
  initialTicketId,
  onFinish,
  onCancel,
}) => {
  const { state, recordDiagnosticExecution } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(initialTicketId || '');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<Record<number, DiagnosticStepResult>>(() => {
    const initial: Record<number, DiagnosticStepResult> = {};
    procedure.etapas.forEach(s => {
      initial[s.ordem] = { realizado: false, passou: null, nota: '' };
    });
    return initial;
  });
  const [observacoes, setObservacoes] = useState('');
  const [conclusao, setConclusao] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = procedure.etapas[currentStepIndex];
  const totalSteps = procedure.etapas.length;

  const handleUpdateStep = (ordem: number, updates: Partial<DiagnosticStepResult>) => {
    setStepResults(prev => ({
      ...prev,
      [ordem]: {
        ...prev[ordem],
        ...updates,
      },
    }));
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTicket = state.tickets.find(t => t.id === selectedTicketId);

    recordDiagnosticExecution({
      procedimentoId: procedure.id,
      procedimentoTitulo: procedure.titulo,
      ticketId: selectedTicketId || undefined,
      ticketNumeroOS: selectedTicket?.numeroOS,
      resultados: stepResults,
      observacoes,
      conclusao: conclusao || 'Procedimento técnico executado conforme checklist homologado.',
      tecnico: state.currentUser.nome,
    });

    setIsCompleted(true);
    if (onFinish) {
      setTimeout(() => {
        onFinish();
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Wizard Header */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-[#1565C0]">
              <Wrench className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Assistente de Diagnóstico: {procedure.titulo}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
            {procedure.categoria} · Nível {procedure.dificuldade}
          </span>
        </div>

        {/* Link to active ticket */}
        <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5" /> Vincular a uma Ordem de Serviço:
          </span>
          <select
            value={selectedTicketId}
            onChange={e => setSelectedTicketId(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">Nenhum chamado vinculado (Execução Avulsa)</option>
            {state.tickets
              .filter(t => t.status !== 'concluido' && t.status !== 'cancelado')
              .map(t => (
                <option key={t.id} value={t.id}>
                  {t.numeroOS} - {t.titulo} ({t.solicitante})
                </option>
              ))}
          </select>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Passo {currentStepIndex + 1} de {totalSteps}</span>
            <span>
              {Math.round(((Object.values(stepResults).filter(s => s.realizado).length) / totalSteps) * 100)}% concluído
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
            {procedure.etapas.map((step, idx) => {
              const res = stepResults[step.ordem];
              let bg = 'bg-slate-300';
              if (res.realizado) {
                bg = res.passou === false ? 'bg-rose-500' : 'bg-emerald-500';
              } else if (idx === currentStepIndex) {
                bg = 'bg-[#1565C0]';
              }
              return (
                <div
                  key={step.ordem}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex-1 h-full cursor-pointer transition-colors ${bg}`}
                  title={`Passo ${step.ordem}: ${step.titulo}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-bold text-[#1565C0] uppercase tracking-wider block mb-1">
                  Etapa {currentStep.ordem}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {currentStep.titulo}
                </h4>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-1">
                  Orientação de Verificação:
                </span>
                <p className="leading-relaxed">{currentStep.orientacao}</p>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-900">
                <span className="font-semibold block mb-1">
                  Resultado Esperado:
                </span>
                <p className="leading-relaxed">{currentStep.resultadoEsperado}</p>
              </div>

              <div className="text-slate-500 text-xs italic">
                <strong>Recomendação técnica:</strong> {currentStep.recomendacao}
              </div>
            </div>

            {/* Test Action Checkers */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Resultado deste teste:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStep(currentStep.ordem, {
                      realizado: true,
                      passou: true,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    stepResults[currentStep.ordem]?.realizado &&
                    stepResults[currentStep.ordem]?.passou === true
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Passou / OK
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStep(currentStep.ordem, {
                      realizado: true,
                      passou: false,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    stepResults[currentStep.ordem]?.realizado &&
                    stepResults[currentStep.ordem]?.passou === false
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Falhou / Problema
                </button>
              </div>
            </div>

            {/* Optional note for this step */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Observação pontual para este passo (opcional)..."
                value={stepResults[currentStep.ordem]?.nota || ''}
                onChange={e =>
                  handleUpdateStep(currentStep.ordem, { nota: e.target.value })
                }
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStepIndex < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
              >
                Próxima Etapa
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-600">
                Última etapa alcançada
              </span>
            )}
          </div>

          {/* Finalization Section when at last step or reviewing */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Conclusão e Registro Técnico
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Conclusão do Diagnóstico
              </label>
              <textarea
                rows={2}
                value={conclusao}
                onChange={e => setConclusao(e.target.value)}
                placeholder="Ex: Identificado curto no cabo de força. Substituído por cabo novo e equipamento restabelecido."
                className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observações Adicionais
              </label>
              <textarea
                rows={2}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Anotações internas de monitoramento ou sugestões para prevenir reincidência..."
                className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Fechar sem Salvar
                </button>
              )}
              <button
                type="button"
                onClick={handleFinalize}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registrar Diagnóstico Técnico
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
