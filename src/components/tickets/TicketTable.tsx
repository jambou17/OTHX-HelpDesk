import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/StatusBadge';
import { formatDateTime, formatRelativeTime } from '../../utils/dates';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
}

type SortField = 'numeroOS' | 'titulo' | 'solicitante' | 'setor' | 'categoria' | 'prioridade' | 'status' | 'dataAbertura' | 'dataAtualizacao';
type SortOrder = 'asc' | 'desc';

export const TicketTable: React.FC<TicketTableProps> = ({ tickets }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('dataAbertura');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (sortField === 'dataAbertura' || sortField === 'dataAtualizacao') {
      const aTime = new Date(aVal).getTime();
      const bTime = new Date(bVal).getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    }

    const comparison = String(aVal).localeCompare(String(bVal));
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-[#2563EB] ml-1 inline" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-[#2563EB] ml-1 inline" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
              <th
                onClick={() => handleSort('numeroOS')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                OS {renderSortIndicator('numeroOS')}
              </th>
              <th
                onClick={() => handleSort('titulo')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors"
              >
                Título / Resumo {renderSortIndicator('titulo')}
              </th>
              <th
                onClick={() => handleSort('solicitante')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                Solicitante {renderSortIndicator('solicitante')}
              </th>
              <th
                onClick={() => handleSort('setor')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                Setor {renderSortIndicator('setor')}
              </th>
              <th
                onClick={() => handleSort('categoria')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                Categoria {renderSortIndicator('categoria')}
              </th>
              <th
                onClick={() => handleSort('prioridade')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                Prioridade {renderSortIndicator('prioridade')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap"
              >
                Status {renderSortIndicator('status')}
              </th>
              <th className="py-3 px-4 whitespace-nowrap">
                Responsável
              </th>
              <th
                onClick={() => handleSort('dataAbertura')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors whitespace-nowrap text-right"
              >
                Abertura {renderSortIndicator('dataAbertura')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedTickets.map(ticket => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`/chamados/${ticket.id}`)}
                className="hover:bg-blue-50/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-semibold text-[#2563EB] whitespace-nowrap">
                  {ticket.numeroOS}
                </td>
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-semibold text-slate-900 truncate" title={ticket.titulo}>
                    {ticket.titulo}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {ticket.subcategoria}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                  {ticket.solicitante}
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {ticket.setor}
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {ticket.categoria}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.prioridade} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                  {ticket.responsavel ? (
                    <span className="font-medium text-slate-800">{ticket.responsavel}</span>
                  ) : (
                    <span className="text-slate-400 italic">Não atribuído</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap tabular-nums text-slate-500">
                  <div title={formatDateTime(ticket.dataAbertura)}>
                    {formatRelativeTime(ticket.dataAbertura)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
