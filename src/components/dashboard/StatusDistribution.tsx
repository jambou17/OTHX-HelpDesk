import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketStatus } from '../../types';
import { STATUS_MAP } from '../../utils/ticketUtils';

interface StatusDistributionProps {
  tickets: Ticket[];
}

export const StatusDistribution: React.FC<StatusDistributionProps> = ({ tickets }) => {
  const navigate = useNavigate();
  const total = tickets.length;

  const statuses: TicketStatus[] = [
    'novo',
    'em_atendimento',
    'aguardando_retorno',
    'concluido',
    'cancelado',
  ];

  const data = statuses.map(st => {
    const count = tickets.filter(t => t.status === st).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      status: st,
      label: STATUS_MAP[st].label,
      count,
      percentage,
    };
  });

  const getStatusHex = (st: TicketStatus) => {
    switch (st) {
      case 'novo': return '#2563EB';
      case 'em_atendimento': return '#D97706';
      case 'aguardando_retorno': return '#9333EA';
      case 'concluido': return '#16A34A';
      case 'cancelado': return '#64748B';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Visão do Fluxo de Atendimento
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proporção de chamados ativos e concluídos na fila
            </p>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-lg overflow-hidden flex mb-6">
          {data.map(item => (
            item.count > 0 && (
              <div
                key={item.status}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: getStatusHex(item.status),
                }}
                className="h-full transition-all duration-300 first:rounded-l-lg last:rounded-r-lg"
                title={`${item.label}: ${item.count} (${item.percentage}%)`}
              />
            )
          ))}
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map(item => (
            <button
              key={item.status}
              onClick={() => navigate(`/chamados?status=${item.status}`)}
              className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: getStatusHex(item.status) }}
                />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {item.label}
                </span>
              </div>
              <div className="text-right shrink-0 pl-2">
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  {item.count}
                </span>
                <span className="text-[10px] text-slate-400 ml-1 tabular-nums">
                  {item.percentage}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Eficiência operacional</span>
        <span className="font-semibold text-slate-800 tabular-nums">
          {total > 0
            ? `${Math.round(((tickets.filter(t => t.status === 'concluido').length) / total) * 100)}% de taxa de resolução`
            : '0% de taxa de resolução'}
        </span>
      </div>
    </div>
  );
};
