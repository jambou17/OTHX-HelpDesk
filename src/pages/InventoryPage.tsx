import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';
import { EquipmentTable } from '../components/inventory/EquipmentTable';
import { EquipmentForm } from '../components/inventory/EquipmentForm';
import { EquipmentDetailsModal } from '../components/inventory/EquipmentDetailsModal';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { Laptop, PlusCircle, Monitor, Printer, HardDrive } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { state, deleteEquipment } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [viewingEquipment, setViewingEquipment] = useState<Equipment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const types = ['todos', 'Computador', 'Notebook', 'Impressora', 'Servidor', 'Switch'];

  const filteredEquipment = state.equipment.filter(item => {
    if (selectedType !== 'todos' && item.tipo !== selectedType) {
      return false;
    }
    if (selectedStatus !== 'todos' && item.status !== selectedStatus) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchCod = item.codigo.toLowerCase().includes(q);
      const matchModel = item.modelo.toLowerCase().includes(q);
      const matchHost = item.hostname.toLowerCase().includes(q);
      const matchIp = item.ip.toLowerCase().includes(q);
      const matchSector = item.setor.toLowerCase().includes(q);
      const matchUser = item.usuario.toLowerCase().includes(q);
      if (!matchCod && !matchModel && !matchHost && !matchIp && !matchSector && !matchUser) {
        return false;
      }
    }
    return true;
  });

  const relatedTickets = viewingEquipment
    ? state.tickets.filter(t => t.equipamentoId === viewingEquipment.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventário de Ativos de TI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle de computadores, impressoras, switches e servidores da Health Quality
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEquipment(null);
            setFormModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Cadastrar Equipamento
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Pesquisar por patrimônio, hostname, IP, modelo ou setor..."
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="todos">Todos os Tipos</option>
            {types.filter(t => t !== 'todos').map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="todos">Todos os Status</option>
            <option value="operacional">Operacional</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="desativado">Desativado</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      {filteredEquipment.length > 0 ? (
        <EquipmentTable
          equipment={filteredEquipment}
          tickets={state.tickets}
          onView={eq => setViewingEquipment(eq)}
          onEdit={eq => {
            setEditingEquipment(eq);
            setFormModalOpen(true);
          }}
          onDelete={id => setDeletingId(id)}
        />
      ) : (
        <EmptyState
          icon={Laptop}
          title="Nenhum equipamento localizado"
          description="Nenhum ativo do inventário coincide com os termos pesquisados."
          action={{
            label: 'Limpar Filtros',
            onClick: () => {
              setSearch('');
              setSelectedType('todos');
              setSelectedStatus('todos');
            },
          }}
        />
      )}

      {/* Modal Form for Add/Edit */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingEquipment(null);
        }}
        title={editingEquipment ? 'Editar Ativo de TI' : 'Cadastrar Novo Equipamento'}
        subtitle="Preencha os dados de hardware, identificação de rede e setor"
        maxWidth="xl"
      >
        <EquipmentForm
          initialEquipment={editingEquipment || undefined}
          onSave={() => {
            setFormModalOpen(false);
            setEditingEquipment(null);
          }}
          onCancel={() => {
            setFormModalOpen(false);
            setEditingEquipment(null);
          }}
        />
      </Modal>

      {/* Equipment Details & Linked Tickets Modal */}
      <EquipmentDetailsModal
        isOpen={Boolean(viewingEquipment)}
        equipment={viewingEquipment}
        relatedTickets={relatedTickets}
        onClose={() => setViewingEquipment(null)}
        onEdit={eq => {
          setViewingEquipment(null);
          setEditingEquipment(eq);
          setFormModalOpen(true);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Excluir Equipamento"
        message="Tem certeza de que deseja remover este equipamento do inventário? O histórico de chamados anteriores será preservado, mas a vinculação direta será desfeita."
        confirmLabel="Sim, Excluir Ativo"
        cancelLabel="Cancelar"
        isDestructive
        onConfirm={() => {
          if (deletingId) {
            deleteEquipment(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
