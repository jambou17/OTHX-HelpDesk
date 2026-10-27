import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Wrench,
  BookOpen,
  Laptop,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { state, switchUser } = useApp();

  const newTicketsCount = state.tickets.filter(t => t.status === 'novo').length;
  const inProgressCount = state.tickets.filter(t => t.status === 'em_atendimento').length;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/chamados',
      label: 'Chamados',
      icon: Ticket,
      badge: newTicketsCount > 0 ? newTicketsCount : undefined,
    },
    {
      to: '/chamados/novo',
      label: 'Novo Chamado',
      icon: PlusCircle,
    },
    {
      to: '/diagnosticos',
      label: 'Central de Diagnósticos',
      icon: Wrench,
    },
    {
      to: '/conhecimento',
      label: 'Base de Conhecimento',
      icon: BookOpen,
    },
    {
      to: '/inventario',
      label: 'Inventário de TI',
      icon: Laptop,
    },
    {
      to: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#1565C0] to-[#0D326B] text-white flex items-center justify-center font-bold tracking-tight text-lg shadow-sm shrink-0">
              HQ
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-sm tracking-tight block truncate">
                  HQ TechAssist
                </span>
                <span className="text-[11px] font-medium text-slate-500 block truncate">
                  Health Quality · TI
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-label="Alternar menu"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#1565C0] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Switcher / Simulator Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Perfil Simulado
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Ativo
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {state.currentUser.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {state.currentUser.nome}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {state.currentUser.cargo}
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <label htmlFor="user-select" className="sr-only">Trocar perfil</label>
                <select
                  id="user-select"
                  value={state.currentUser.id}
                  onChange={e => switchUser(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 text-slate-700 rounded-md py-1.5 px-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  {state.availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nome} ({user.perfil === 'admin' ? 'Admin' : user.perfil === 'tecnico' ? 'Técnico' : 'Colaborador'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full bg-[#1565C0] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                title={`${state.currentUser.nome} (${state.currentUser.cargo})`}
              >
                {state.currentUser.avatarInitials}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
