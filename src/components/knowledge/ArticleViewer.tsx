import React from 'react';
import { KnowledgeArticle } from '../../types';
import { formatDate } from '../../utils/dates';
import { Edit3, Archive, ArrowLeft, CheckCircle2, User, Calendar, BookOpen } from 'lucide-react';

interface ArticleViewerProps {
  article: KnowledgeArticle;
  onBack: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article,
  onBack,
  onEdit,
  onArchive,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Lista de Artigos
        </button>

        <div className="flex items-center gap-2">
          {article.status !== 'arquivado' && (
            <button
              type="button"
              onClick={onArchive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              Arquivar
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar Artigo
          </button>
        </div>
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
          {article.categoria}
        </span>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md capitalize">
          Status: {article.status}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-tight">
        {article.titulo}
      </h2>

      {/* Author and Date info */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-5 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4 text-slate-400" />
          <span>Autor: <strong className="text-slate-700">{article.autor}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 tabular-nums">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Atualizado em: {formatDate(article.dataAtualizacao)}</span>
        </div>
      </div>

      {/* Related symptoms */}
      {article.sintomas.length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Sintomas e Cenários de Aplicação:
          </h4>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
            {article.sintomas.map((s, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Content / Markdown-like rendering */}
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
        {article.conteudo}
      </div>
    </div>
  );
};
