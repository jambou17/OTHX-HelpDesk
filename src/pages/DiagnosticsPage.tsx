import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DiagnosticProcedure } from '../types';
import { DiagnosticCard } from '../components/diagnostics/DiagnosticCard';
import { DiagnosticWizard } from '../components/diagnostics/DiagnosticWizard';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { Wrench } from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const { state } = useApp();
  const [searchParams] = useSearchParams();
  const initialTicketId = searchParams.get('ticketId') || '';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [activeProcedure, setActiveProcedure] = useState<DiagnosticProcedure | null>(null);

  const categories = [
    { id: 'todas', label: 'Todas as Categorias' },
    { id: 'Computadores e notebooks', label: 'Computadores' },
    { id: 'Impressoras e etiquetas', label: 'Impressoras' },
    { id: 'Redes e internet', label: 'Redes' },
    { id: 'TOTVS Protheus', label: 'Protheus' },
    { id: 'VPN e acessos', label: 'VPN e Acessos' },
    { id: 'Sistemas e softwares', label: 'Sistemas' },
  ];

  const filteredProcedures = state.diagnostics.filter(proc => {
    if (selectedCategory !== 'todas' && proc.categoria !== selectedCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = proc.titulo.toLowerCase().includes(q);
      const matchSymptom = proc.sintomas.some(s => s.toLowerCase().includes(q));
      const matchCause = proc.possiveisCausas.some(c => c.toLowerCase().includes(q));
      if (!matchTitle && !matchSymptom && !matchCause) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-[#2563EB] shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Central de Diagnósticos Técnicos
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Roteiros guiados e checklists padronizados para investigação prudente de falhas de hardware, rede corporativa, impressoras e TOTVS Protheus.
              </p>
            </div>
          </div>

          {initialTicketId && (
            <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#2563EB] font-semibold shrink-0">
              Vinculando à OS selecionada
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por sintomas, título do problema ou causas prováveis..."
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Procedure Wizard View */}
      {activeProcedure ? (
        <DiagnosticWizard
          procedure={activeProcedure}
          initialTicketId={initialTicketId}
          onFinish={() => setActiveProcedure(null)}
          onCancel={() => setActiveProcedure(null)}
        />
      ) : (
        /* Procedures Catalog Grid */
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
            <span>
              {filteredProcedures.length} {filteredProcedures.length === 1 ? 'procedimento homologado' : 'procedimentos homologados'}
            </span>
          </div>

          {filteredProcedures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProcedures.map(proc => (
                <DiagnosticCard
                  key={proc.id}
                  procedure={proc}
                  onSelect={p => setActiveProcedure(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Wrench}
              title="Nenhum procedimento encontrado"
              description="Nenhum roteiro de diagnóstico coincide com o filtro ou termo pesquisado."
              action={{
                label: 'Ver todos os diagnósticos',
                onClick: () => {
                  setSearch('');
                  setSelectedCategory('todas');
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
