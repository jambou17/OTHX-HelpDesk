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
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    state,
    switchUser,
    restoreDemoData,
    clearAllData,
    importDataFromJSON,
    exportDataToJSON,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleExport = () => {
    const jsonStr = exportDataToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hq-techassist-backup-${new Date().toISOString().split('T')[0]}.json`;
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
          <div className="p-3 rounded-xl bg-blue-100 text-[#1565C0] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Configurações & Armazenamento Local
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Gestão de persistência em <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">localStorage</code>, importação/exportação de backups JSON e simulação de perfis de usuário.
            </p>
          </div>
        </div>
      </div>

      {/* Visão dos Dados Armazenados */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1565C0]" />
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
          <UserCheck className="w-4 h-4 text-[#1565C0]" />
          Perfil Simulado para Demonstração
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Como este é um MVP de demonstração local, você pode alternar facilmente entre os perfis fictícios da Health Quality:
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
                    ? 'border-[#1565C0] bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#1565C0] text-white flex items-center justify-center font-bold text-xs">
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
          <FileCode className="w-4 h-4 text-[#1565C0]" />
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
            <Download className="w-4 h-4 text-[#1565C0]" />
            Exportar Dados para JSON
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

      {/* Ações de Restauração e Limpeza */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-600" />
          Manutenção do Ambiente de Demonstração
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Restaure os dados de demonstração originais ou limpe completamente a fila para testes em branco.
        </p>

        <div className="flex flex-wrap items-center gap-3">
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

      {/* Informações da Versão e Arquitetura */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800">HQ TechAssist | Health Quality</span>
          <span className="font-mono text-slate-500 font-semibold">v0.1.0 - Protótipo Local</span>
        </div>
        <p className="text-slate-500 leading-relaxed">
          Camada de repositório desacoplada pronta para migração com Google Apps Script e Google Sheets sem refatoração de componentes visuais.
        </p>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        title="Restaurar Dados Demonstrativos"
        message="Deseja recarregar os 12 chamados, 5 equipamentos e checklists padrão de fábrica? Qualquer alteração feita localmente será substituída."
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
        message="Atenção: esta ação apagará permanentemente todos os chamados e histórico salvos no localStorage deste navegador. Deseja continuar?"
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
