import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { RecentTicketsTable } from '../components/dashboard/RecentTicketsTable';
import { calculateMTTR } from '../utils/dates';
import {
  Ticket as TicketIcon,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  Flame,
  Timer,
  PlusCircle,
  Cpu,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const { tickets } = state;

  const total = tickets.length;
  const novos = tickets.filter(t => t.status === 'novo').length;
  const emAtendimento = tickets.filter(t => t.status === 'em_atendimento').length;
  const aguardando = tickets.filter(t => t.status === 'aguardando_retorno').length;
  const concluidos = tickets.filter(t => t.status === 'concluido').length;
  const altaCritica = tickets.filter(t => t.prioridade === 'alta' || t.prioridade === 'critica').length;
  const mttr = calculateMTTR(tickets);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions with OTHX Enterprise Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB] p-6 sm:p-7 rounded-2xl text-white shadow-sm border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
              OTHX Solutions
            </span>
            <span className="text-xs text-slate-300">· v0.2.0</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            OTHX Help Desk
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
            Conectando processos e tecnologia. Plataforma inteligente para gerenciamento de chamados, diagnósticos e ativos de TI.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/chamados/novo')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#2563EB] hover:bg-slate-100 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Abrir Chamado
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total de Chamados"
          value={total}
          subtitle="Registros no Help Desk"
          icon={TicketIcon}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          onClick={() => navigate('/chamados')}
        />

        <StatCard
          title="Novos"
          value={novos}
          subtitle="Triagem pendente"
          icon={Sparkles}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50"
          onClick={() => navigate('/chamados?status=novo')}
        />

        <StatCard
          title="Em Atendimento"
          value={emAtendimento}
          subtitle="Em execução pela equipe"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          onClick={() => navigate('/chamados?status=em_atendimento')}
        />

        <StatCard
          title="Aguardando Retorno"
          value={aguardando}
          subtitle="Pendente de usuário/peça"
          icon={AlertCircle}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          onClick={() => navigate('/chamados?status=aguardando_retorno')}
        />

        <StatCard
          title="Concluídos"
          value={concluidos}
          subtitle="Atendimentos resolvidos"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          onClick={() => navigate('/chamados?status=concluido')}
        />

        <StatCard
          title="Alta / Crítica"
          value={altaCritica}
          subtitle="Prioridade máxima"
          icon={Flame}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          onClick={() => navigate('/chamados?prioridade=critica')}
        />
      </div>

      {/* MTTR Banner / Secondary Metrics Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-[#2563EB]">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Tempo Médio de Resolução (MTTR Real)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {mttr}
              </span>
              <span className="text-xs text-slate-500">
                calculado sobre os {concluidos} chamados efetivamente encerrados
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-slate-400 block">Ativos Cadastrados</span>
            <span className="font-bold text-slate-800 text-sm tabular-nums">
              {state.equipment.length} equipamentos
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Artigos Homologados</span>
            <span className="font-bold text-slate-800 text-sm tabular-nums">
              {state.articles.filter(a => a.status === 'aprovado').length} artigos
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Diagnósticos Disponíveis</span>
            <span className="font-bold text-slate-800 text-sm tabular-nums">
              {state.diagnostics.length} checklists
            </span>
          </div>
        </div>
      </div>

      {/* Charts Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CategoryChart tickets={tickets} />
        <StatusDistribution tickets={tickets} />
      </div>

      {/* Recent Tickets Table */}
      <RecentTicketsTable tickets={tickets} />
    </div>
  );
};
