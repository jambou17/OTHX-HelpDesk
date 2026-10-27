import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/StatusBadge';
import { formatRelativeTime } from '../../utils/dates';
import { ArrowRight, Ticket as TicketIcon } from 'lucide-react';

interface RecentTicketsTableProps {
  tickets: Ticket[];
}

export const RecentTicketsTable: React.FC<RecentTicketsTableProps> = ({ tickets }) => {
  const navigate = useNavigate();
  const recent = [...tickets]
    .sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime())
    .slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Chamados Recentes
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Últimos registros abertos na fila de atendimento do Helpdesk
          </p>
        </div>
        <Link
          to="/chamados"
          className="text-xs font-semibold text-[#1565C0] hover:text-[#0D326B] inline-flex items-center gap-1 transition-colors"
        >
          Ver todos os chamados <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">OS</th>
              <th className="py-3 px-4">Título / Problema</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Prioridade</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Abertura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {recent.map(ticket => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`/chamados/${ticket.id}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-semibold text-[#1565C0] whitespace-nowrap">
                  {ticket.numeroOS}
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-medium text-slate-800 truncate" title={ticket.titulo}>
                    {ticket.titulo}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {ticket.categoria} · {ticket.setor}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                  {ticket.solicitante}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.prioridade} />
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3 px-4 text-right text-slate-500 whitespace-nowrap">
                  {formatRelativeTime(ticket.dataAbertura)}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Nenhum chamado registrado no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
