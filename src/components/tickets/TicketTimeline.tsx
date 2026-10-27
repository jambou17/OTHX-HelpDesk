import React, { useState } from 'react';
import { TicketEvent, TicketEventType } from '../../types';
import { formatDateTime } from '../../utils/dates';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Clock,
  UserCheck,
  CheckCircle2,
  Wrench,
  AlertCircle,
  Lock,
  Globe,
  Send,
} from 'lucide-react';

interface TicketTimelineProps {
  ticketId: string;
  events: TicketEvent[];
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ ticketId, events }) => {
  const { addTicketComment, state } = useApp();
  const [comentario, setComentario] = useState('');
  const [visibilidade, setVisibilidade] = useState<'publico' | 'interno'>('publico');

  const ticketEvents = [...events]
    .filter(e => e.ticketId === ticketId)
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;
    addTicketComment(ticketId, comentario.trim(), visibilidade);
    setComentario('');
  };

  const getEventIcon = (tipo: TicketEventType) => {
    switch (tipo) {
      case 'criacao':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'mudanca_status':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'mudanca_prioridade':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'atribuicao':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'diagnostico':
        return <Wrench className="w-4 h-4 text-sky-600" />;
      case 'conclusao':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'comentario':
      default:
        return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Adicionar Atualização ou Comentário
        </h4>
        <form onSubmit={handleAddComment}>
          <textarea
            rows={3}
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            placeholder="Digite aqui observações do atendimento, orientações ao usuário ou notas técnicas..."
            className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden transition-all"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Visibilidade:</label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setVisibilidade('publico')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    visibilidade === 'publico'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  Público
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilidade('interno')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    visibilidade === 'interno'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Nota Interna
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!comentario.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#1565C0] hover:bg-[#0D326B] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Publicar
            </button>
          </div>
        </form>
      </div>

      {/* Chronological Timeline */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {ticketEvents.map(evt => (
          <div key={evt.id} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center shadow-xs">
              {getEventIcon(evt.tipoEvento)}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {evt.usuario}
                  </span>
                  {evt.visibilidade === 'interno' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Lock className="w-2.5 h-2.5" /> Interno
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      <Globe className="w-2.5 h-2.5" /> Público
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 tabular-nums">
                  {formatDateTime(evt.dataHora)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {evt.descricao}
              </p>
            </div>
          </div>
        ))}

        {ticketEvents.length === 0 && (
          <p className="text-xs text-slate-400 italic">
            Nenhum evento registrado ainda para este chamado.
          </p>
        )}
      </div>
    </div>
  );
};
