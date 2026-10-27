import React, { useState } from 'react';
import { Equipment, EquipmentStatus } from '../../types';
import { SECTORES_HQ } from '../../utils/ticketUtils';
import { useApp } from '../../context/AppContext';
import { Save } from 'lucide-react';

interface EquipmentFormProps {
  initialEquipment?: Equipment;
  onSave: () => void;
  onCancel: () => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialEquipment,
  onSave,
  onCancel,
}) => {
  const { saveEquipment } = useApp();

  const [codigo, setCodigo] = useState(initialEquipment?.codigo || '');
  const [tipo, setTipo] = useState<Equipment['tipo']>(initialEquipment?.tipo || 'Computador');
  const [fabricante, setFabricante] = useState(initialEquipment?.fabricante || '');
  const [modelo, setModelo] = useState(initialEquipment?.modelo || '');
  const [hostname, setHostname] = useState(initialEquipment?.hostname || '');
  const [ip, setIp] = useState(initialEquipment?.ip || '');
  const [setor, setSetor] = useState(initialEquipment?.setor || SECTORES_HQ[0]);
  const [usuario, setUsuario] = useState(initialEquipment?.usuario || '');
  const [status, setStatus] = useState<EquipmentStatus>(initialEquipment?.status || 'operacional');
  const [os, setOs] = useState(initialEquipment?.especificacoes.os || 'Windows 11 Pro');
  const [cpu, setCpu] = useState(initialEquipment?.especificacoes.cpu || '');
  const [ram, setRam] = useState(initialEquipment?.especificacoes.ram || '16 GB');
  const [storage, setStorage] = useState(initialEquipment?.especificacoes.storage || '512 GB SSD');
  const [observacoes, setObservacoes] = useState(initialEquipment?.observacoes || '');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setErro('O código do equipamento (Patrimônio/Tag) é obrigatório.');
      return;
    }
    if (!modelo.trim()) {
      setErro('O modelo do equipamento é obrigatório.');
      return;
    }

    const equipmentToSave: Equipment = {
      id: initialEquipment?.id || `eq-${Date.now()}`,
      codigo: codigo.trim().toUpperCase(),
      tipo,
      fabricante: fabricante.trim() || 'Padrão',
      modelo: modelo.trim(),
      hostname: hostname.trim() || `${codigo.trim().toUpperCase()}-HOST`,
      ip: ip.trim() || '192.168.10.x',
      setor,
      usuario: usuario.trim() || 'Setorial',
      especificacoes: { os, cpu, ram, storage },
      status,
      observacoes: observacoes.trim(),
    };

    saveEquipment(equipmentToSave);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Código / Tag <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="Ex: HQ-PC-TESTE-006"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tipo de Ativo
          </label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value as Equipment['tipo'])}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="Computador">Computador Desktop</option>
            <option value="Notebook">Notebook Corporativo</option>
            <option value="Impressora">Impressora / Multifuncional</option>
            <option value="Servidor">Servidor</option>
            <option value="Switch">Switch / Roteador</option>
            <option value="Outro">Outro Equipamento</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Status Operacional
          </label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as EquipmentStatus)}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="operacional">Operacional (Em Produção)</option>
            <option value="em_manutencao">Em Manutenção</option>
            <option value="desativado">Desativado / Baixado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Fabricante
          </label>
          <input
            type="text"
            value={fabricante}
            onChange={e => setFabricante(e.target.value)}
            placeholder="Ex: Dell, Lenovo, HP, Zebra"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Modelo <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={modelo}
            onChange={e => setModelo(e.target.value)}
            placeholder="Ex: OptiPlex 7090, ThinkPad T14"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Hostname na Rede
          </label>
          <input
            type="text"
            value={hostname}
            onChange={e => setHostname(e.target.value)}
            placeholder="Ex: HQ-DESK-FAT02"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Endereço IP
          </label>
          <input
            type="text"
            value={ip}
            onChange={e => setIp(e.target.value)}
            placeholder="Ex: 192.168.10.45"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Setor de Alocação
          </label>
          <select
            value={setor}
            onChange={e => setSetor(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            {SECTORES_HQ.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Usuário Responsável / Custodiante
          </label>
          <input
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="Ex: Mariana Souza"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Hardware Specs */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
          Especificações Técnicas
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Sistema Operacional</label>
            <input
              type="text"
              value={os}
              onChange={e => setOs(e.target.value)}
              placeholder="Ex: Windows 11 Pro"
              className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Processador (CPU)</label>
            <input
              type="text"
              value={cpu}
              onChange={e => setCpu(e.target.value)}
              placeholder="Ex: Intel Core i5"
              className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Memória RAM</label>
            <input
              type="text"
              value={ram}
              onChange={e => setRam(e.target.value)}
              placeholder="Ex: 16 GB"
              className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Armazenamento</label>
            <input
              type="text"
              value={storage}
              onChange={e => setStorage(e.target.value)}
              placeholder="Ex: 512 GB SSD"
              className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Observações e Histórico de Manutenção
        </label>
        <textarea
          rows={2}
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Anotações gerais, data da última revisão preventiva..."
          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" />
          Salvar Equipamento
        </button>
      </div>
    </form>
  );
};
