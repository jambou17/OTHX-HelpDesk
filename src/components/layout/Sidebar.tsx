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
  UserCheck,
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
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* OTHX Geometric Monogram Logo */}
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#2563EB] to-[#06B6D4] text-white flex items-center justify-center font-bold tracking-tight shadow-md shrink-0 border border-blue-400/20">
              <span className="font-extrabold text-sm tracking-tighter">OTHX</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-white text-sm tracking-tight block truncate">
                  OTHX Solutions
                </span>
                <span className="text-[11px] font-medium text-cyan-400 block truncate">
                  OTHX Help Desk
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-label="Alternar menu"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
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
                      ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 tabular-nums border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Switcher / Simulator Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/80">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Perfil Simulado
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  Ativo
                </span>
              </div>

              <div className="flex items-center gap-2.5 p-2 bg-[#0F172A] rounded-lg border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {state.currentUser.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {state.currentUser.nome}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {state.currentUser.cargo}
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <label htmlFor="user-select-sidebar" className="sr-only">Trocar perfil</label>
                <select
                  id="user-select-sidebar"
                  value={state.currentUser.id}
                  onChange={e => switchUser(e.target.value)}
                  className="w-full text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-md py-1.5 px-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  {state.availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nome} ({user.perfil === 'admin' ? 'Admin' : user.perfil === 'tecnico' ? 'Técnico' : 'Colaborador'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-1 text-[10px] text-slate-500 text-center truncate italic">
                Conectando processos e tecnologia.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer ring-1 ring-cyan-500/40"
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
