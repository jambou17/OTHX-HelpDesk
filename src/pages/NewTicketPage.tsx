import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  CATEGORIES_WITH_SUBCATEGORIES, 
  IMPACT_MAP, 
  SECTORES_HQ 
} from '../utils/ticketUtils';
import { TicketCategory, TicketImpact, TicketPriority } from '../types';
import { 
  PlusCircle, 
  ArrowLeft, 
  Paperclip, 
  AlertCircle, 
  Laptop, 
  Send,
  Info
} from 'lucide-react';

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, createTicket } = useApp();

  const [solicitante, setSolicitante] = useState(state.currentUser.nome);
  const [email, setEmail] = useState(state.currentUser.email);
  const [setor, setSetor] = useState(state.currentUser.setor || SECTORES_HQ[0]);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<TicketCategory>('TOTVS Protheus');
  const [subcategoria, setSubcategoria] = useState(
    CATEGORIES_WITH_SUBCATEGORIES['TOTVS Protheus'][0]
  );
  const [impacto, setImpacto] = useState<TicketImpact>('consigo_trabalhar');
  const [descricao, setDescricao] = useState('');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleCategoryChange = (newCat: TicketCategory) => {
    setCategoria(newCat);
    const subcats = CATEGORIES_WITH_SUBCATEGORIES[newCat] || [];
    setSubcategoria(subcats[0] || 'Geral');
  };

  const validateForm = () => {
    const newErros: Record<string, string> = {};
    if (!solicitante.trim()) newErros.solicitante = 'O nome do solicitante é obrigatório.';
    if (!email.trim() || !email.includes('@')) newErros.email = 'Informe um e-mail corporativo válido.';
    if (!titulo.trim()) newErros.titulo = 'O título ou resumo do incidente é obrigatório.';
    if (titulo.trim().length < 5) newErros.titulo = 'O título deve ter no mínimo 5 caracteres.';
    if (!descricao.trim()) newErros.descricao = 'A descrição detalhada do problema é obrigatória.';
    if (descricao.trim().length < 15) newErros.descricao = 'Forneça uma descrição com mais detalhes (mínimo 15 caracteres).';

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // A prioridade inicial é deduzida com base no impacto declarado pelo usuário
    const prioridadeInicial: TicketPriority = IMPACT_MAP[impacto].defaultPriority;

    const createdTicket = createTicket({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      solicitante: solicitante.trim(),
      email: email.trim(),
      setor,
      categoria,
      subcategoria,
      impacto,
      prioridade: prioridadeInicial,
      equipamentoId: equipamentoId || undefined,
    });

    // Direcionar para a tela de detalhes do chamado recém-criado
    navigate(`/chamados/${createdTicket.id}`);
  };

  const availableSubcategories = CATEGORIES_WITH_SUBCATEGORIES[categoria] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/chamados')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Lista de Chamados
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Form Header */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-[#1565C0]">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Abertura de Chamado Técnico
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Preencha os dados do incidente para direcionamento à equipe de TI da Health Quality
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Seção 1: Identificação do Solicitante */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100">
              1. Identificação do Solicitante
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Solicitante <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={solicitante}
                  onChange={e => setSolicitante(e.target.value)}
                  placeholder="Nome completo"
                  className={`w-full text-xs sm:text-sm p-2.5 bg-white border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                    erros.solicitante ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {erros.solicitante && (
                  <p className="text-[11px] text-rose-600 mt-1">{erros.solicitante}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail Corporativo <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome.sobrenome@healthquality.corp"
                  className={`w-full text-xs sm:text-sm p-2.5 bg-white border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                    erros.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {erros.email && (
                  <p className="text-[11px] text-rose-600 mt-1">{erros.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Setor / Departamento <span className="text-rose-600">*</span>
                </label>
                <select
                  value={setor}
                  onChange={e => setSetor(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {SECTORES_HQ.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2: Classificação do Incidente */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100">
              2. Classificação do Problema
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria Principal <span className="text-rose-600">*</span>
                </label>
                <select
                  value={categoria}
                  onChange={e => handleCategoryChange(e.target.value as TicketCategory)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subcategoria / Tipo de Falha <span className="text-rose-600">*</span>
                </label>
                <select
                  value={subcategoria}
                  onChange={e => setSubcategoria(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {availableSubcategories.map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3: Impacto Operacional */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Impacto no Trabalho <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(IMPACT_MAP) as TicketImpact[]).map(key => {
                const item = IMPACT_MAP[key];
                const isSelected = impacto === key;
                return (
                  <div
                    key={key}
                    onClick={() => setImpacto(key)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1565C0] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">
                        {item.label}
                      </span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#1565C0] bg-[#1565C0]' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção 4: Detalhes do Incidente */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-1 border-b border-slate-100">
              3. Detalhes da Falha e Equipamento
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Resumido do Problema <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={e => {
                    setTitulo(e.target.value);
                    if (erros.titulo) setErros(prev => ({ ...prev, titulo: '' }));
                  }}
                  placeholder="Ex: Erro ao emitir Danfe no Protheus ou Computador não dá vídeo"
                  className={`w-full text-xs sm:text-sm p-2.5 bg-white border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                    erros.titulo ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {erros.titulo && (
                  <p className="text-[11px] text-rose-600 mt-1">{erros.titulo}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipamento Relacionado (Opcional)
                </label>
                <div className="relative">
                  <select
                    value={equipamentoId}
                    onChange={e => setEquipamentoId(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Nenhum equipamento específico / Falha de software</option>
                    {state.equipment.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.codigo} - {eq.fabricante} {eq.modelo} ({eq.setor} - {eq.usuario})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição Detalhada do Incidente <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={descricao}
                  onChange={e => {
                    setDescricao(e.target.value);
                    if (erros.descricao) setErros(prev => ({ ...prev, descricao: '' }));
                  }}
                  placeholder="Descreva o que estava fazendo quando o erro ocorreu, mensagens que surgiram na tela e se o problema afeta outras pessoas do setor..."
                  className={`w-full text-xs sm:text-sm p-3 bg-white border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                    erros.descricao ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {erros.descricao && (
                  <p className="text-[11px] text-rose-600 mt-1">{erros.descricao}</p>
                )}
              </div>

              {/* Notice regarding file attachments */}
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Anexo de Arquivos e Evidências:</span>
                  <p className="text-slate-500 mt-0.5">
                    O upload direto de arquivos e capturas de tela será habilitado na versão 0.2 conectada ao Google Drive. Nesta versão local de demonstração, utilize o campo de descrição para colar textos de erro.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/chamados')}
              className="px-5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              Registrar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
