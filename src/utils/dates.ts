/**
 * Utilitários para formatação e manipulação de datas no padrão pt-BR
 */

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '-';
  }
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return '-';
  }
}

export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 0) return 'Agora';

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Há poucos instantes';
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    if (diffHours < 24) return `Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    
    return formatDate(isoString);
  } catch {
    return '-';
  }
}

/**
 * Calcula a duração entre duas datas em formato amigável (ex: "2h 45m" ou "3 dias")
 */
export function formatDuration(startIso: string, endIso: string): string {
  try {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    const diffMinutes = Math.max(0, Math.floor((end - start) / (1000 * 60)));

    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    }
    const hours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  } catch {
    return '-';
  }
}

/**
 * Calcula tempo médio de resolução em horas a partir de chamados concluídos
 */
export function calculateMTTR(tickets: { dataAbertura: string; dataConclusao?: string; status: string }[]): string {
  const resolved = tickets.filter(t => t.status === 'concluido' && t.dataConclusao && t.dataAbertura);
  if (resolved.length === 0) return 'N/D';

  const totalMinutes = resolved.reduce((acc, t) => {
    const start = new Date(t.dataAbertura).getTime();
    const end = new Date(t.dataConclusao!).getTime();
    const minutes = Math.max(0, (end - start) / (1000 * 60));
    return acc + minutes;
  }, 0);

  const avgMinutes = Math.round(totalMinutes / resolved.length);
  if (avgMinutes < 60) {
    return `${avgMinutes} min`;
  }
  const hours = (avgMinutes / 60).toFixed(1);
  return `${hours}h`;
}
