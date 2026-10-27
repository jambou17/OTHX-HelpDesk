import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketStatus } from '../../types';
import { PriorityBadge, StatusBadge } from '../ui/StatusBadge';
import { formatRelativeTime } from '../../utils/dates';
import { useApp } from '../../context/AppContext';
import { User, Laptop, Clock, ArrowRight, MoreHorizontal } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onOpenResolveModal: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onOpenResolveModal }) => {
  const navigate = useNavigate();
  const { updateTicket } = useApp();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statuses: { value: TicketStatus; label: string }[] = [
    { value: 'novo', label: 'Novo' },
    { value: 'em_atendimento', label: 'Em Atendimento' },
    { value: 'aguardando_retorno', label: 'Aguardando Retorno' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  const handleStatusChange = (newStatus: TicketStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusMenu(false);

    if (newStatus === 'concluido') {
      onOpenResolveModal(ticket);
      return;
    }

    updateTicket(
      ticket.id,
      { status: newStatus },
      `Status do chamado alterado via Kanban para "${newStatus}".`
    );
  };

  return (
    <div
      onClick={() => navigate(`/chamados/${ticket.id}`)}
      className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all duration-200 cursor-pointer relative group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold text-[#1565C0]">
            {ticket.numeroOS}
          </span>
          <PriorityBadge priority={ticket.prioridade} />
        </div>

        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#1565C0] transition-colors line-clamp-2 leading-snug">
          {ticket.titulo}
        </h4>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
          {ticket.descricao}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{ticket.solicitante} · {ticket.setor}</span>
          </div>
          {ticket.equipamentoId && (
            <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px]">
              <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Ativo associado</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-slate-400 tabular-nums">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(ticket.dataAbertura)}</span>
        </div>

        {/* Quick status transition dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
            }}
            className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
          >
            Mover
            <MoreHorizontal className="w-3 h-3" />
          </button>

          {showStatusMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={e => {
                  e.stopPropagation();
                  setShowStatusMenu(false);
                }}
              />
              <div
                className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-lg border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mover para:
                </div>
                {statuses.map(st => (
                  <button
                    key={st.value}
                    disabled={st.value === ticket.status}
                    onClick={e => handleStatusChange(st.value, e)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      st.value === ticket.status
                        ? 'text-slate-400 cursor-not-allowed bg-slate-50'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-[#1565C0]'
                    }`}
                  >
                    <span>{st.label}</span>
                    {st.value === ticket.status && (
                      <span className="text-[10px] font-medium text-slate-400">Atual</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
