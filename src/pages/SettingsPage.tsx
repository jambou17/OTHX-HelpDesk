import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Database,
  UserCheck,
  Shield,
  Layers,
  FileCode,
  HardDrive,
  Info,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    state,
    switchUser,
    restoreDemoData,
    clearAllData,
    anonymizeData,
    importDataFromJSON,
    exportDataToJSON,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmAnonymizeOpen, setConfirmAnonymizeOpen] = useState(false);

  const handleExport = () => {
    const jsonStr = exportDataToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `othx-helpdesk-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importDataFromJSON(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-100 text-[#2563EB] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                OTHX Solutions
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">v0.2.0</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Configurações & Armazenamento Local
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Gestão de persistência em <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#2563EB]">othx-helpdesk:v1</code>, backups JSON, perfis de demonstração e sanitização de dados.
            </p>
          </div>
        </div>
      </div>

      {/* Visão dos Dados Armazenados */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          Estatísticas dos Registros Atuais
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Chamados (OS)</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {state.tickets.length}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Eventos de Histórico</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {state.events.length}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Ativos de Inventário</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {state.equipment.length}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5">Artigos da Base</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {state.articles.length}
            </span>
          </div>
        </div>
      </div>

      {/* Simulação de Perfil de Usuário */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#2563EB]" />
          Perfil Simulado para Demonstração
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Como este é um MVP de demonstração local, você pode alternar facilmente entre os perfis fictícios da OTHX Solutions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.availableUsers.map(user => {
            const isSelected = state.currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#2563EB] bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                    {user.avatarInitials}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    user.perfil === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user.perfil === 'tecnico'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.perfil}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{user.nome}</h4>
                <p className="text-[11px] text-slate-500 truncate">{user.cargo}</p>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{user.setor}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup, Importação e Exportação */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#2563EB]" />
          Importação e Exportação de Dados
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Exporte toda a base do aplicativo para um arquivo JSON legível ou restaure um backup gerado anteriormente.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            Exportar Dados para JSON (OTHX)
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Importar Arquivo JSON
          </button>
        </div>
      </div>

      {/* Manutenção e Anonimização */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-600" />
          Manutenção & Anonimização de Dados
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Restaure os dados de demonstração originais da OTHX, execute uma limpeza profunda de dados corporativos legados ou esvazie a fila de chamados.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setConfirmAnonymizeOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Anonimizar Base Salva
          </button>

          <button
            onClick={() => setConfirmRestoreOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Dados Demonstrativos
          </button>

          <button
            onClick={() => setConfirmClearOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Todos os Registros
          </button>
        </div>
      </div>

      {/* Seção Sobre o OTHX Help Desk */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-base tracking-wider shrink-0 shadow-xs border border-slate-800">
            OTHX
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Sobre o OTHX Help Desk
            </h3>
            <p className="text-xs sm:text-sm text-[#2563EB] font-medium mt-0.5">
              Conectando processos e tecnologia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 text-xs text-slate-600 border-b border-slate-100">
          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block font-medium">Nome do Produto:</span>
              <strong className="text-slate-800 font-semibold">OTHX Help Desk</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Empresa Desenvolvedora:</span>
              <strong className="text-slate-800 font-semibold">OTHX Solutions</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Versão:</span>
              <strong className="text-slate-800 font-mono">v0.2.0</strong>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block font-medium">Ambiente Operacional:</span>
              <span className="text-slate-700">Protótipo Local (Frontend SPA Reativo)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Chave de Armazenamento:</span>
              <code className="text-[#2563EB] font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                othx-helpdesk:v1
              </code>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Migração Segura:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Compatibilidade retroativa ativa
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 block mb-1">Aviso Institucional de Projeto Demonstrativo:</strong>
              Este aplicativo é um projeto demonstrativo com dados totalmente fictícios desenvolvido para a validação de arquitetura, fluxos operacionais e experiência do usuário (UX). Nenhuma informação real de clientes, pacientes ou empresas reais está contida nesta base.
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={confirmAnonymizeOpen}
        title="Anonimizar Dados Salvos"
        message="Esta ação fará uma varredura em todos os chamados, comentários e ativos salvos localmente, substituindo qualquer dado sensível ou termos remanescentes por identificadores genéricos da OTHX Solutions. Deseja prosseguir?"
        confirmLabel="Sim, Anonimizar Dados"
        cancelLabel="Cancelar"
        onConfirm={() => {
          anonymizeData();
          setConfirmAnonymizeOpen(false);
        }}
        onCancel={() => setConfirmAnonymizeOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restaurar Dados Demonstrativos"
        message="Deseja recarregar os 12 chamados, 6 equipamentos e procedimentos homologados padrão de fábrica da OTHX Solutions? Qualquer alteração feita localmente será substituída."
        confirmLabel="Sim, Restaurar Demonstração"
        cancelLabel="Cancelar"
        onConfirm={() => {
          restoreDemoData();
          setConfirmRestoreOpen(false);
        }}
        onCancel={() => setConfirmRestoreOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Limpar Todos os Registros"
        message="Atenção: esta ação apagará permanentemente todos os chamados e histórico salvos no localStorage (othx-helpdesk:v1) deste navegador. Deseja continuar?"
        confirmLabel="Sim, Limpar Tudo"
        cancelLabel="Cancelar"
        isDestructive
        onConfirm={() => {
          clearAllData();
          setConfirmClearOpen(false);
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
};
