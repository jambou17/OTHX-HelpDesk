import React from 'react';
import { TicketPriority, TicketStatus } from '../../types';
import { PRIORITY_MAP, STATUS_MAP } from '../../utils/ticketUtils';
import { CheckCircle2, Clock, AlertCircle, XCircle, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const config = STATUS_MAP[status] || STATUS_MAP.novo;

  const getIcon = () => {
    switch (status) {
      case 'novo':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
      case 'em_atendimento':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'aguardando_retorno':
        return <AlertCircle className="w-3.5 h-3.5 text-purple-600" />;
      case 'concluido':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'cancelado':
        return <XCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${config.bgClass} ${config.textClass} ${config.borderClass} whitespace-nowrap`}>
      {showIcon && getIcon()}
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_MAP[priority] || PRIORITY_MAP.media;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border ${config.bgClass} ${config.textClass} ${config.borderClass} whitespace-nowrap`}>
      <span 
        className="w-1.5 h-1.5 rounded-full" 
        style={{ backgroundColor: config.iconColor }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
};
