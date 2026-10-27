import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { TicketKanban } from '../components/tickets/TicketKanban';
import { EmptyState } from '../components/ui/EmptyState';
import { LayoutList, Columns3, PlusCircle, Ticket as TicketIcon } from 'lucide-react';

export const TicketsPage: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoria: searchParams.get('categoria') || '',
    status: searchParams.get('status') || '',
    prioridade: searchParams.get('prioridade') || '',
    responsavel: searchParams.get('responsavel') || '',
  });

  // Atualiza os filtros caso os parâmetros de busca da URL mudem (ex: ao clicar num KPI do Dashboard)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      categoria: searchParams.get('categoria') || '',
      status: searchParams.get('status') || '',
      prioridade: searchParams.get('prioridade') || '',
      responsavel: searchParams.get('responsavel') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.categoria) params.set('categoria', newFilters.categoria);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.prioridade) params.set('prioridade', newFilters.prioridade);
    if (newFilters.responsavel) params.set('responsavel', newFilters.responsavel);
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    const cleared = {
      search: '',
      categoria: '',
      status: '',
      prioridade: '',
      responsavel: '',
    };
    setFilters(cleared);
    setSearchParams(new URLSearchParams());
  };

  // Extrair lista única de responsáveis
  const responsaveisUnicos = Array.from(
    new Set(
      state.tickets
        .map(t => t.responsavel)
        .filter((r): r is string => Boolean(r && r.trim()))
    )
  );

  // Filtragem dos chamados
  const filteredTickets = state.tickets.filter(ticket => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchOS = ticket.numeroOS.toLowerCase().includes(q);
      const matchTitle = ticket.titulo.toLowerCase().includes(q);
      const matchRequester = ticket.solicitante.toLowerCase().includes(q);
      const matchSector = ticket.setor.toLowerCase().includes(q);
      const matchEq = ticket.equipamentoId?.toLowerCase().includes(q);
      if (!matchOS && !matchTitle && !matchRequester && !matchSector && !matchEq) {
        return false;
      }
    }

    if (filters.categoria && ticket.categoria !== filters.categoria) {
      return false;
    }

    if (filters.status && ticket.status !== filters.status) {
      return false;
    }

    if (filters.prioridade && ticket.prioridade !== filters.prioridade) {
      return false;
    }

    if (filters.responsavel && ticket.responsavel !== filters.responsavel) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Ordens de Serviço e Incidentes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie tickets de suporte, fila técnica e histórico operacional
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-50 text-[#1565C0]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Tabela
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-blue-50 text-[#1565C0]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              Kanban
            </button>
          </div>

          <button
            onClick={() => navigate('/chamados/novo')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Nova OS
          </button>
        </div>
      </div>

      {/* Unified Filters Component */}
      <TicketFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        responsavelList={responsaveisUnicos}
      />

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Exibindo <strong className="text-slate-800 tabular-nums">{filteredTickets.length}</strong> de{' '}
          <span className="tabular-nums">{state.tickets.length}</span> chamados
        </span>
      </div>

      {/* Content Rendering based on ViewMode */}
      {filteredTickets.length > 0 ? (
        viewMode === 'table' ? (
          <TicketTable tickets={filteredTickets} />
        ) : (
          <TicketKanban tickets={filteredTickets} />
        )
      ) : (
        <EmptyState
          icon={TicketIcon}
          title="Nenhum chamado encontrado"
          description="Nenhum registro corresponde aos critérios de pesquisa ou filtros selecionados."
          action={{
            label: 'Limpar Filtros',
            onClick: handleClearFilters,
          }}
        />
      )}
    </div>
  );
};
