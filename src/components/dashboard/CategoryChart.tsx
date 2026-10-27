import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';

interface CategoryChartProps {
  tickets: Ticket[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ tickets }) => {
  const navigate = useNavigate();

  const total = tickets.length;
  const categories = [
    'TOTVS Protheus',
    'Computadores e notebooks',
    'Impressoras e etiquetas',
    'Redes e internet',
    'VPN e acessos',
    'Sistemas e softwares',
    'Outros',
  ];

  const counts = categories.map(cat => {
    const count = tickets.filter(t => t.categoria === cat).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { name: cat, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const getBarColor = (index: number) => {
    const colors = [
      'bg-[#2563EB]',
      'bg-cyan-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-amber-500',
      'bg-rose-500',
      'bg-slate-400',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Distribuição por Categoria
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Volume de solicitações segmentadas pelo catálogo de serviços
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md tabular-nums">
          {total} registros
        </span>
      </div>

      <div className="space-y-4">
        {counts.map((item, idx) => (
          <div
            key={item.name}
            onClick={() => navigate(`/chamados?categoria=${encodeURIComponent(item.name)}`)}
            className="group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 group-hover:text-[#2563EB] transition-colors truncate max-w-[220px] sm:max-w-xs">
                {item.name}
              </span>
              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                <span className="font-semibold text-slate-900 tabular-nums">
                  {item.count}
                </span>
                <span className="text-slate-400 text-[11px] tabular-nums">
                  ({item.percentage}%)
                </span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(idx)} group-hover:opacity-90`}
                style={{ width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
