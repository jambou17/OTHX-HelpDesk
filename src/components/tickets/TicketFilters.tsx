import React from 'react';
import { TicketCategory, TicketPriority, TicketStatus } from '../../types';
import { SearchInput } from '../ui/SearchInput';
import { X } from 'lucide-react';

interface FilterState {
  search: string;
  categoria: string;
  status: string;
  prioridade: string;
  responsavel: string;
}

interface TicketFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
  responsavelList: string[];
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onChange,
  onClear,
  responsavelList,
}) => {
  const categories: TicketCategory[] = [
    'TOTVS Protheus',
    'Computadores e notebooks',
    'Impressoras e etiquetas',
    'Redes e internet',
    'VPN e acessos',
    'Sistemas e softwares',
    'Outros',
  ];

  const statuses: { value: TicketStatus; label: string }[] = [
    { value: 'novo', label: 'Novo' },
    { value: 'em_atendimento', label: 'Em Atendimento' },
    { value: 'aguardando_retorno', label: 'Aguardando Retorno' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  const priorities: { value: TicketPriority; label: string }[] = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'critica', label: 'Crítica' },
  ];

  const hasActiveFilters =
    filters.search ||
    filters.categoria ||
    filters.status ||
    filters.prioridade ||
    filters.responsavel;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={search => onChange({ ...filters, search })}
            placeholder="Pesquisar por OS, título, solicitante ou equipamento..."
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <select
            value={filters.categoria}
            onChange={e => onChange({ ...filters, categoria: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">Todas Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={e => onChange({ ...filters, status: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">Todos Status</option>
            {statuses.map(st => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>

          <select
            value={filters.prioridade}
            onChange={e => onChange({ ...filters, prioridade: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">Todas Prioridades</option>
            {priorities.map(p => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            value={filters.responsavel}
            onChange={e => onChange({ ...filters, responsavel: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="">Todos Técnicos</option>
            {responsavelList.map(resp => (
              <option key={resp} value={resp}>
                {resp}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};
