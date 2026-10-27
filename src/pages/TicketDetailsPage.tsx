import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/ui/StatusBadge';
import { TicketTimeline } from '../components/tickets/TicketTimeline';
import { Modal } from '../components/ui/Modal';
import { formatDateTime, formatDuration } from '../utils/dates';
import { TicketPriority, TicketStatus } from '../types';
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Laptop,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  BookOpen,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateTicket, resolveTicket } = useApp();

  const [activeTab, setActiveTab] = useState<'geral' | 'atendimento' | 'historico' | 'diagnostico'>('geral');
  const [solucaoText, setSolucaoText] = useState('');
  const [errorSolucao, setErrorSolucao] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const ticket = state.tickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Chamado não encontrado</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          A Ordem de Serviço solicitada não existe ou foi removida da base local.
        </p>
        <button
          onClick={() => navigate('/chamados')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#1565C0] rounded-lg hover:bg-[#0D326B] transition-colors"
        >
          Voltar para Lista de Chamados
        </button>
      </div>
    );
  }

  const equipment = state.equipment.find(e => e.id === ticket.equipamentoId);

  // Diagnósticos vinculados
  const linkedExecutions = state.executions.filter(e => e.ticketId === ticket.id);

  // Artigos semelhantes da base de conhecimento da mesma categoria
  const relatedArticles = state.articles.filter(
    a => a.categoria === ticket.categoria && a.status === 'aprovado'
  );

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (newStatus === 'concluido') {
      setIsResolveModalOpen(true);
      return;
    }
    updateTicket(
      ticket.id,
      { status: newStatus },
      `Status alterado para "${newStatus}".`
    );
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    updateTicket(
      ticket.id,
      { prioridade: newPriority },
      `Prioridade ajustada para "${newPriority}".`
    );
  };

  const handleAssigneeChange = (newAssignee: string) => {
    updateTicket(
      ticket.id,
      { responsavel: newAssignee || undefined },
      newAssignee
        ? `Responsável técnico definido como ${newAssignee}.`
        : 'Chamado desatribuído da fila técnica.'
    );
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solucaoText.trim()) {
      setErrorSolucao('Informe a descrição detalhada da solução para concluir a OS.');
      return;
    }
    resolveTicket(ticket.id, solucaoText.trim());
    setIsResolveModalOpen(false);
    setSolucaoText('');
    setErrorSolucao('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Back and OS Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chamados')}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Voltar para a listagem"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-bold text-[#1565C0]">
                {ticket.numeroOS}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.prioridade} />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-0.5 leading-snug">
              {ticket.titulo}
            </h2>
          </div>
        </div>

        {/* Quick action: Conclude button if not yet completed */}
        {ticket.status !== 'concluido' && (
          <button
            type="button"
            onClick={() => setIsResolveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            Concluir Atendimento
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 flex gap-2 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('geral')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'geral'
              ? 'border-[#1565C0] text-[#1565C0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Informações Gerais
        </button>
        <button
          onClick={() => setActiveTab('atendimento')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'atendimento'
              ? 'border-[#1565C0] text-[#1565C0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Atendimento Técnico
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'historico'
              ? 'border-[#1565C0] text-[#1565C0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Histórico & Linha do Tempo</span>
          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
            {state.events.filter(e => e.ticketId === ticket.id).length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('diagnostico')}
          className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'diagnostico'
              ? 'border-[#1565C0] text-[#1565C0]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Diagnósticos & Soluções</span>
          {linkedExecutions.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-100 text-[#1565C0] text-[10px] font-bold flex items-center justify-center">
              {linkedExecutions.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* ABA 1: Informações Gerais */}
        {activeTab === 'geral' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Solicitante Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                  Solicitante
                </span>
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  {ticket.solicitante}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {ticket.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {ticket.setor}
                </div>
              </div>

              {/* Classificação Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                  Classificação
                </span>
                <div>
                  <span className="text-slate-400">Categoria:</span>{' '}
                  <strong className="text-slate-800">{ticket.categoria}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Subcategoria:</span>{' '}
                  <span className="text-slate-700">{ticket.subcategoria}</span>
                </div>
                <div>
                  <span className="text-slate-400">Impacto:</span>{' '}
                  <span className="text-slate-700 font-medium">
                    {ticket.impacto.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Prazos & Registro */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                  Registro & Ciclo de Vida
                </span>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Aberto: {formatDateTime(ticket.dataAbertura)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Atualizado: {formatDateTime(ticket.dataAtualizacao)}</span>
                </div>
                {ticket.dataConclusao && (
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Concluído em: {formatDateTime(ticket.dataConclusao)}</span>
                  </div>
                )}
                {ticket.dataConclusao && (
                  <div className="text-[11px] text-slate-500">
                    Duração total:{' '}
                    <strong>{formatDuration(ticket.dataAbertura, ticket.dataConclusao)}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição Detalhada */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Descrição Detalhada do Problema
              </h4>
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {ticket.descricao}
              </div>
            </div>

            {/* Equipamento Associado */}
            {equipment && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-[#1565C0]" />
                    Equipamento Físico Associado
                  </span>
                  <Link
                    to="/inventario"
                    className="text-xs font-semibold text-[#1565C0] hover:underline"
                  >
                    Ver no Inventário
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 mt-2">
                  <div>
                    <span className="text-slate-400 block">Patrimônio / Código:</span>
                    <strong className="font-mono text-slate-900">{equipment.codigo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Modelo:</span>
                    <span>{equipment.fabricante} {equipment.modelo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hostname & IP:</span>
                    <span className="font-mono">{equipment.hostname} ({equipment.ip})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status Operacional:</span>
                    <span className="capitalize">{equipment.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Solução Registrada se Concluído */}
            {ticket.solucao && (
              <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Solução Técnica Homologada
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {ticket.solucao}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: Atendimento */}
        {activeTab === 'atendimento' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alterar Status do Chamado
                </label>
                <select
                  value={ticket.status}
                  onChange={e => handleStatusChange(e.target.value as TicketStatus)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="novo">Novo</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="aguardando_retorno">Aguardando Retorno</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alterar Prioridade
                </label>
                <select
                  value={ticket.prioridade}
                  onChange={e => handlePriorityChange(e.target.value as TicketPriority)}
                  className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Técnico Responsável
              </label>
              <select
                value={ticket.responsavel || ''}
                onChange={e => handleAssigneeChange(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="">Não atribuído (Fila geral)</option>
                {state.availableUsers
                  .filter(u => u.perfil !== 'colaborador')
                  .map(tech => (
                    <option key={tech.id} value={tech.nome}>
                      {tech.nome} ({tech.cargo})
                    </option>
                  ))}
              </select>
            </div>

            {/* Concluir Atendimento box */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Encerramento da Ordem de Serviço
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                O encerramento formal exige o preenchimento detalhado da solução técnica para auditoria e base de conhecimento.
              </p>

              {ticket.status !== 'concluido' ? (
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Preencher Solução e Concluir Chamado
                </button>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
                  Este chamado já foi concluído em {formatDateTime(ticket.dataConclusao)}. Para reabrir, selecione outro status no menu acima.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: Histórico e Linha do Tempo */}
        {activeTab === 'historico' && (
          <div>
            <TicketTimeline ticketId={ticket.id} events={state.events} />
          </div>
        )}

        {/* ABA 4: Diagnósticos & Soluções Sugeridas */}
        {activeTab === 'diagnostico' && (
          <div className="space-y-6">
            {/* Linked diagnostic executions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Checklists Técnicos Executados ({linkedExecutions.length})
                </h4>
                <Link
                  to={`/diagnosticos?ticketId=${ticket.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] rounded-lg transition-colors shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Iniciar Novo Diagnóstico para esta OS
                </Link>
              </div>

              {linkedExecutions.length > 0 ? (
                <div className="space-y-3">
                  {linkedExecutions.map(exec => (
                    <div
                      key={exec.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {exec.procedimentoTitulo}
                        </span>
                        <span className="text-slate-400 tabular-nums">
                          {formatDateTime(exec.dataExecucao)}
                        </span>
                      </div>
                      <p className="text-slate-700">
                        <strong>Conclusão:</strong> {exec.conclusao}
                      </p>
                      {exec.observacoes && (
                        <p className="text-slate-500 italic">
                          <strong>Observações:</strong> {exec.observacoes}
                        </p>
                      )}
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                        Executado pelo técnico: {exec.tecnico}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  Nenhum teste de diagnóstico registrado para esta OS ainda.
                </div>
              )}
            </div>

            {/* Related Knowledge Articles */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1565C0]" />
                Artigos Homologados Relacionados na Categoria "{ticket.categoria}"
              </h4>

              {relatedArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedArticles.map(art => (
                    <Link
                      key={art.id}
                      to="/conhecimento"
                      className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all block text-xs group"
                    >
                      <h5 className="font-bold text-slate-900 group-hover:text-[#1565C0] transition-colors leading-snug">
                        {art.titulo}
                      </h5>
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-1">
                        {art.conteudo}
                      </p>
                      <span className="text-[11px] text-[#1565C0] font-semibold mt-2 inline-flex items-center gap-1">
                        Abrir artigo <ExternalLink className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Nenhum artigo específico encontrado para esta categoria.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setSolucaoText('');
          setErrorSolucao('');
        }}
        title="Concluir Atendimento Técnico"
        subtitle={`${ticket.numeroOS} - ${ticket.titulo}`}
      >
        <form onSubmit={handleConfirmResolution} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Solução Técnica Aplicada <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={solucaoText}
              onChange={e => {
                setSolucaoText(e.target.value);
                if (errorSolucao) setErrorSolucao('');
              }}
              placeholder="Descreva de maneira detalhada: causa raiz encontrada, correções no sistema, testes realizados e orientações passadas ao colaborador..."
              className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              autoFocus
            />
            {errorSolucao && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errorSolucao}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsResolveModalOpen(false);
                setSolucaoText('');
                setErrorSolucao('');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar e Salvar Solução
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
