import React from 'react';
import { Equipment, Ticket } from '../../types';
import { Laptop, Monitor, Printer, Server, Network, HelpCircle, Eye, Edit2, Trash2 } from 'lucide-react';

interface EquipmentTableProps {
  equipment: Equipment[];
  tickets: Ticket[];
  onView: (eq: Equipment) => void;
  onEdit: (eq: Equipment) => void;
  onDelete: (id: string) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  tickets,
  onView,
  onEdit,
  onDelete,
}) => {
  const getIcon = (tipo: Equipment['tipo']) => {
    switch (tipo) {
      case 'Computador':
        return <Monitor className="w-4 h-4 text-blue-600" />;
      case 'Notebook':
        return <Laptop className="w-4 h-4 text-sky-600" />;
      case 'Impressora':
        return <Printer className="w-4 h-4 text-amber-600" />;
      case 'Servidor':
        return <Server className="w-4 h-4 text-purple-600" />;
      case 'Switch':
        return <Network className="w-4 h-4 text-teal-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'operacional':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Operacional
          </span>
        );
      case 'em_manutencao':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            Manutenção
          </span>
        );
      case 'desativado':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Desativado
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Código / Tag</th>
              <th className="py-3 px-4">Tipo & Modelo</th>
              <th className="py-3 px-4">Hostname & IP</th>
              <th className="py-3 px-4">Setor & Usuário</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Chamados</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {equipment.map(item => {
              const relatedCount = tickets.filter(t => t.equipamentoId === item.id).length;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-[#2563EB] whitespace-nowrap">
                    {item.codigo}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getIcon(item.tipo)}
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 block truncate">
                          {item.fabricante} {item.modelo}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {item.tipo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <div className="text-slate-800 font-medium">{item.hostname}</div>
                    <div className="text-[11px] text-slate-400">{item.ip}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{item.setor}</div>
                    <div className="text-[11px] text-slate-500">{item.usuario}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3 px-4 text-center tabular-nums">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        relatedCount > 0
                          ? 'bg-blue-100 text-[#2563EB]'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {relatedCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(item)}
                        className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-slate-100 rounded-md transition-colors"
                        title="Ver detalhes e chamados"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Editar ativo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Excluir ativo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {equipment.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  Nenhum equipamento cadastrado no inventário.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
