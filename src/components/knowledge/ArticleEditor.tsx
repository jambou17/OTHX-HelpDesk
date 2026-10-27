import React, { useState } from 'react';
import { ArticleStatus, KnowledgeArticle, TicketCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { Save, X, Plus } from 'lucide-react';

interface ArticleEditorProps {
  initialArticle?: KnowledgeArticle;
  onSave: () => void;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialArticle,
  onSave,
  onCancel,
}) => {
  const { state, saveArticle } = useApp();

  const [titulo, setTitulo] = useState(initialArticle?.titulo || '');
  const [categoria, setCategoria] = useState<TicketCategory | string>(
    initialArticle?.categoria || 'TOTVS Protheus'
  );
  const [status, setStatus] = useState<ArticleStatus>(initialArticle?.status || 'rascunho');
  const [conteudo, setConteudo] = useState(initialArticle?.conteudo || '');
  const [sintomasInput, setSintomasInput] = useState(
    initialArticle?.sintomas.join(', ') || ''
  );
  const [erro, setErro] = useState('');

  const categories: TicketCategory[] = [
    'TOTVS Protheus',
    'Computadores e notebooks',
    'Impressoras e etiquetas',
    'Redes e internet',
    'VPN e acessos',
    'Sistemas e softwares',
    'Outros',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErro('O título do procedimento é obrigatório.');
      return;
    }
    if (!conteudo.trim()) {
      setErro('O conteúdo com os passos da solução técnica é obrigatório.');
      return;
    }

    const sintomas = sintomasInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const now = new Date().toISOString();

    const articleToSave: KnowledgeArticle = {
      id: initialArticle?.id || `art-${Date.now()}`,
      titulo: titulo.trim(),
      categoria,
      sintomas,
      conteudo: conteudo.trim(),
      status,
      autor: initialArticle?.autor || state.currentUser.nome,
      dataCriacao: initialArticle?.dataCriacao || now,
      dataAtualizacao: now,
    };

    saveArticle(articleToSave);
    onSave();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {initialArticle ? 'Editar Procedimento Técnico' : 'Novo Artigo na Base de Conhecimento'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Documente soluções homologadas para orientar o suporte de Helpdesk
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {erro && (
        <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título do Artigo / Procedimento <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={e => {
              setTitulo(e.target.value);
              if (erro) setErro('');
            }}
            placeholder="Ex: Como restaurar serviço de impressão e limpar spooler no Windows 11"
            className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria do Serviço
            </label>
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status da Publicação
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as ArticleStatus)}
              className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="rascunho">Rascunho (Em elaboração)</option>
              <option value="aprovado">Aprovado (Homologado para uso)</option>
              <option value="arquivado">Arquivado (Descontinuado)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sintomas e Termos de Busca (separados por vírgula)
          </label>
          <input
            type="text"
            value={sintomasInput}
            onChange={e => setSintomasInput(e.target.value)}
            placeholder="Ex: fila presa, spooler travado, erro ao imprimir, porta 9100"
            className="w-full text-xs sm:text-sm p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Passos para Solução e Orientações Técnicas <span className="text-rose-600">*</span>
          </label>
          <textarea
            rows={10}
            value={conteudo}
            onChange={e => {
              setConteudo(e.target.value);
              if (erro) setErro('');
            }}
            placeholder="Descreva de forma estruturada:&#10;1. Causa provável&#10;2. Pré-requisitos&#10;3. Passos ordenados de resolução&#10;4. Como validar o sucesso"
            className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg font-mono text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            Salvar Procedimento
          </button>
        </div>
      </form>
    </div>
  );
};
