import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Menu, Plus, HardDrive, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      return { title: 'Dashboard Geral', breadcrumb: 'Visão Geral & Indicadores' };
    }
    if (path === '/chamados') {
      return { title: 'Gestão de Chamados', breadcrumb: 'Ordens de Serviço' };
    }
    if (path === '/chamados/novo') {
      return { title: 'Abertura de Chamado', breadcrumb: 'Novo Registro de Incidente' };
    }
    if (path.startsWith('/chamados/')) {
      return { title: 'Detalhes da OS', breadcrumb: 'Atendimento & Diagnóstico' };
    }
    if (path === '/diagnosticos') {
      return { title: 'Central de Diagnósticos', breadcrumb: 'Checklists & Procedimentos Técnicos' };
    }
    if (path === '/conhecimento') {
      return { title: 'Base de Conhecimento', breadcrumb: 'Artigos & Soluções Homologadas' };
    }
    if (path === '/inventario') {
      return { title: 'Inventário de TI', breadcrumb: 'Estações, Impressoras & Ativos' };
    }
    if (path === '/configuracoes') {
      return { title: 'Configurações', breadcrumb: 'Gestão de Dados do Protótipo' };
    }
    return { title: 'HQ TechAssist', breadcrumb: 'ITSM' };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Health Quality TI</span>
            <span>/</span>
            <span className="truncate">{breadcrumb}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right zone: Actions & User pill */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/chamados/novo"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Solicitação</span>
          <span className="sm:hidden">Novo</span>
        </Link>

        {/* Local Storage Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono">
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          <span>Local v0.1.0</span>
        </div>

        {/* Current user role badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-800 block leading-tight">
              {state.currentUser.nome.split(' ')[0]}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1565C0] block">
              {state.currentUser.perfil}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100">
            {state.currentUser.avatarInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
