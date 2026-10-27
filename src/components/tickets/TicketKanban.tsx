import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types';
import { TicketCard } from './TicketCard';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

interface TicketKanbanProps {
  tickets: Ticket[];
}

export const TicketKanban: React.FC<TicketKanbanProps> = ({ tickets }) => {
  const { resolveTicket } = useApp();
  const [ticketToResolve, setTicketToResolve] = useState<Ticket | null>(null);
  const [solucaoText, setSolucaoText] = useState('');
  const [errorText, setErrorText] = useState('');

  const columns: { status: TicketStatus; label: string; headerColor: string; bgCol: string }[] = [
    {
      status: 'novo',
      label: 'Novo',
      headerColor: 'text-blue-700 border-blue-300',
      bgCol: 'bg-blue-50/30',
    },
    {
      status: 'em_atendimento',
      label: 'Em Atendimento',
      headerColor: 'text-amber-700 border-amber-300',
      bgCol: 'bg-amber-50/30',
    },
    {
      status: 'aguardando_retorno',
      label: 'Aguardando Retorno',
      headerColor: 'text-purple-700 border-purple-300',
      bgCol: 'bg-purple-50/30',
    },
    {
      status: 'concluido',
      label: 'Concluído',
      headerColor: 'text-emerald-700 border-emerald-300',
      bgCol: 'bg-emerald-50/30',
    },
  ];

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solucaoText.trim()) {
      setErrorText('Por favor, informe a descrição detalhada da solução técnica para concluir o chamado.');
      return;
    }
    if (ticketToResolve) {
      resolveTicket(ticketToResolve.id, solucaoText.trim());
      setTicketToResolve(null);
      setSolucaoText('');
      setErrorText('');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colTickets = tickets.filter(t => t.status === col.status);
          return (
            <div
              key={col.status}
              className={`rounded-xl border border-slate-200 ${col.bgCol} p-3 min-h-[500px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                    {col.label}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center tabular-nums shadow-xs">
                    {colTickets.length}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onOpenResolveModal={t => setTicketToResolve(t)}
                  />
                ))}

                {colTickets.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
                    Nenhum chamado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to input mandatory solution when concluding a ticket */}
      <Modal
        isOpen={Boolean(ticketToResolve)}
        onClose={() => {
          setTicketToResolve(null);
          setSolucaoText('');
          setErrorText('');
        }}
        title="Concluir Atendimento da OS"
        subtitle={ticketToResolve ? `${ticketToResolve.numeroOS} - ${ticketToResolve.titulo}` : ''}
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição da Solução Técnica <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={solucaoText}
              onChange={e => {
                setSolucaoText(e.target.value);
                if (errorText) setErrorText('');
              }}
              placeholder="Descreva detalhadamente o diagnóstico realizado, peças substituídas ou configuração aplicada..."
              className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              autoFocus
            />
            {errorText && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errorText}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setTicketToResolve(null);
                setSolucaoText('');
                setErrorText('');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar e Concluir
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
