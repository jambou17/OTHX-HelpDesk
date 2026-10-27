import { Ticket, TicketCategory, TicketImpact, TicketPriority, TicketStatus } from '../types';

export const STATUS_MAP: Record<TicketStatus, { label: string; textClass: string; bgClass: string; borderClass: string }> = {
  novo: {
    label: 'Novo',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
  },
  em_atendimento: {
    label: 'Em Atendimento',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  aguardando_retorno: {
    label: 'Aguardando Retorno',
    textClass: 'text-purple-700',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
  },
  concluido: {
    label: 'Concluído',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  cancelado: {
    label: 'Cancelado',
    textClass: 'text-slate-600',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
  },
};

export const PRIORITY_MAP: Record<TicketPriority, { label: string; textClass: string; bgClass: string; borderClass: string; iconColor: string }> = {
  baixa: {
    label: 'Baixa',
    textClass: 'text-slate-600',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
    iconColor: '#94A3B8',
  },
  media: {
    label: 'Média',
    textClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    iconColor: '#0284C7',
  },
  alta: {
    label: 'Alta',
    textClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
    iconColor: '#EA580C',
  },
  critica: {
    label: 'Crítica',
    textClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
    iconColor: '#E11D48',
  },
};

export const IMPACT_MAP: Record<TicketImpact, { label: string; description: string; defaultPriority: TicketPriority }> = {
  consigo_trabalhar: {
    label: 'Consigo continuar trabalhando',
    description: 'Impacto pontual sem bloqueio das atividades imediatas.',
    defaultPriority: 'baixa',
  },
  impedido_trabalhar: {
    label: 'Estou impedido de trabalhar',
    description: 'Minha estação ou sistema principal está inoperante.',
    defaultPriority: 'alta',
  },
  setor_parado: {
    label: 'Meu setor está parado',
    description: 'Múltiplos colaboradores ou processo operacional crítico paralisado.',
    defaultPriority: 'critica',
  },
  sem_interrupcao: {
    label: 'Solicitação sem interrupção',
    description: 'Dúvidas, pedidos de instalação ou cadastros preventivos.',
    defaultPriority: 'baixa',
  },
};

export const CATEGORIES_WITH_SUBCATEGORIES: Record<TicketCategory, string[]> = {
  'TOTVS Protheus': [
    'Erro de login / Licença excedida',
    'Queda súbita de conexão',
    'Módulo Faturamento / Emissão NFe',
    'Módulo Compras e Estoque',
    'Módulo Financeiro / Baixas',
    'Impressão de Danfe / Boleto bancário',
    'Lentidão extrema em rotinas do Protheus',
    'Ajuste de perfil ou privilégios',
  ],
  'Computadores e notebooks': [
    'Computador não liga / Sem energia',
    'Lentidão extrema e travamento constante',
    'Tela azul (BSOD) recorrente',
    'Teclado, mouse ou periférico com falha',
    'Monitor sem sinal ou piscando',
    'Falha no carregador ou bateria de notebook',
    'Upgrade ou remanejamento de hardware',
  ],
  'Impressoras e etiquetas': [
    'Puxando várias folhas ao mesmo tempo / Atolamento',
    'Impressora Zebra / Etiquetas descalibrada',
    'Falha na qualidade da impressão / Manchas',
    'Impressora offline na rede corporativa',
    'Troca de toner ou fita ribbon',
    'Instalação de driver em novo computador',
  ],
  'Redes e internet': [
    'Sem acesso à rede local / Servidores internos',
    'Sem conexão externa com a internet',
    'Cabo de rede danificado ou desconectado',
    'Sinal Wi-Fi instável ou fraco no setor',
    'Lentidão geral de navegação',
    'Conexão com servidor de arquivos indisponível',
  ],
  'VPN e acessos': [
    'VPN FortiClient não conecta ou desconecta rápido',
    'Token expirado / Erro de autenticação MFA',
    'Usuário bloqueado no Active Directory (AD)',
    'Permissão em pasta compartilhada na rede',
    'Criação de novo usuário de colaborador',
    'Revogação ou alteração de acessos',
  ],
  'Sistemas e softwares': [
    'Instalação de software padrão homologado',
    'Microsoft Office / Excel travando ou sem licença',
    'Antivírus corporativo bloqueando aplicativo válido',
    'Certificado Digital A1 / A3 (Token não reconhecido)',
    'Problemas no navegador Google Chrome / Edge',
    'Sistema de Gestão Empresarial / ERP',
  ],
  'Outros': [
    'Dúvida de usabilidade geral',
    'Remanejamento físico de ponto de trabalho',
    'Descarte ou recolhimento de equipamento antigo',
    'Outras solicitações de suporte',
  ],
};

// Setores corporativos oficiais
export const SECTORES_OTHX = [
  'Administrativo',
  'Financeiro',
  'Recursos Humanos',
  'Comercial',
  'Operações',
  'Produção',
  'Logística',
  'Tecnologia da Informação',
  'Qualidade',
];

// Alias para compatibilidade reversa
export const SECTORES_HQ = SECTORES_OTHX;

/**
 * Gera o próximo número de OS sequencial no formato OS-2026-XXXX
 */
export function generateNextOSNumber(existingTickets: Ticket[]): string {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `OS-${currentYear}-`;

  const numbersThisYear = existingTickets
    .map(t => t.numeroOS)
    .filter(os => os && os.startsWith(yearPrefix))
    .map(os => {
      const parts = os.split('-');
      const num = parseInt(parts[2], 10);
      return isNaN(num) ? 0 : num;
    });

  const maxNum = numbersThisYear.length > 0 ? Math.max(...numbersThisYear) : 0;
  const nextNum = maxNum + 1;
  const paddedNum = String(nextNum).padStart(4, '0');

  return `${yearPrefix}${paddedNum}`;
}
