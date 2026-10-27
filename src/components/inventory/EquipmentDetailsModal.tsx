import React from 'react';
import { Equipment, Ticket } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge, PriorityBadge } from '../ui/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Laptop, Cpu, HardDrive, Wifi, User, Building, Clock, Wrench } from 'lucide-react';

interface EquipmentDetailsModalProps {
  equipment: Equipment | null;
  relatedTickets: Ticket[];
  isOpen: boolean;
  onClose: () => void;
  onEdit: (equipment: Equipment) => void;
}

export const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({
  equipment,
  relatedTickets,
  isOpen,
  onClose,
  onEdit,
}) => {
  const navigate = useNavigate();
  if (!equipment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ativo: ${equipment.codigo}`}
      subtitle={`${equipment.fabricante} ${equipment.modelo} (${equipment.tipo})`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                equipment.status === 'operacional'
                  ? 'bg-emerald-500'
                  : equipment.status === 'em_manutencao'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-semibold text-slate-800 capitalize">
              Status: {equipment.status.replace('_', ' ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(equipment);
            }}
            className="text-xs font-semibold text-[#1565C0] hover:underline"
          >
            Editar Ativo
          </button>
        </div>

        {/* Specifications grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 flex items-center gap-1.5 mb-1">
              <Laptop className="w-3.5 h-3.5 text-slate-500" /> Hostname
            </span>
            <span className="font-mono font-semibold text-slate-800 block">
              {equipment.hostname}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 flex items-center gap-1.5 mb-1">
              <Wifi className="w-3.5 h-3.5 text-slate-500" /> Endereço IP
            </span>
            <span className="font-mono font-semibold text-slate-800 block">
              {equipment.ip}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 flex items-center gap-1.5 mb-1">
              <Building className="w-3.5 h-3.5 text-slate-500" /> Setor
            </span>
            <span className="font-semibold text-slate-800 block">
              {equipment.setor}
            </span>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="text-slate-400 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-slate-500" /> Usuário Responsável
            </span>
            <span className="font-semibold text-slate-800 block">
              {equipment.usuario}
            </span>
          </div>
        </div>

        {/* Hardware Specs list */}
        <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2.5">
            Hardware & Sistema
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400">SO:</span> {equipment.especificacoes.os || 'N/D'}
            </div>
            <div>
              <span className="text-slate-400">CPU:</span> {equipment.especificacoes.cpu || 'N/D'}
            </div>
            <div>
              <span className="text-slate-400">RAM:</span> {equipment.especificacoes.ram || 'N/D'}
            </div>
            <div>
              <span className="text-slate-400">Armazenamento:</span> {equipment.especificacoes.storage || 'N/D'}
            </div>
          </div>
          {equipment.observacoes && (
            <p className="mt-3 pt-2 border-t border-slate-200 text-slate-600 text-xs italic">
              <strong>Obs:</strong> {equipment.observacoes}
            </p>
          )}
        </div>

        {/* Linked tickets */}
        <div>
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Histórico de Chamados Vinculados ({relatedTickets.length})</span>
          </h4>

          {relatedTickets.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {relatedTickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    onClose();
                    navigate(`/chamados/${t.id}`);
                  }}
                  className="p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1565C0]">{t.numeroOS}</span>
                      <span className="font-medium text-slate-800 truncate">{t.titulo}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                      {t.solicitante} · {t.categoria}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <StatusBadge status={t.status} showIcon={false} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-200 rounded-lg">
              Nenhum chamado de manutenção registrado para este equipamento até o momento.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
