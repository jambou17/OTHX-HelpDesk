import React from 'react';
import { KnowledgeArticle } from '../../types';
import { formatDate } from '../../utils/dates';
import { BookOpen, User, Calendar, CheckCircle2, FileText, Archive } from 'lucide-react';

interface ArticleCardProps {
  article: KnowledgeArticle;
  onView: (article: KnowledgeArticle) => void;
  onEdit: (article: KnowledgeArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onView, onEdit }) => {
  const getStatusBadge = () => {
    switch (article.status) {
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Aprovado
          </span>
        );
      case 'rascunho':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <FileText className="w-3 h-3" /> Rascunho
          </span>
        );
      case 'arquivado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            <Archive className="w-3 h-3" /> Arquivado
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onView(article)}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {article.categoria}
          </span>
          {getStatusBadge()}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1565C0] transition-colors leading-snug">
          {article.titulo}
        </h3>

        {/* Symptoms tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.sintomas.slice(0, 3).map((s, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 truncate max-w-full"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">{article.autor}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 shrink-0 tabular-nums">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(article.dataAtualizacao)}</span>
        </div>
      </div>
    </div>
  );
};
