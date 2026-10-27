/**
 * OTHX Help Desk - Definições de Tipos e Modelos
 * OTHX Solutions | Conectando processos e tecnologia
 */

export type TicketStatus = 
  | 'novo'
  | 'em_atendimento'
  | 'aguardando_retorno'
  | 'concluido'
  | 'cancelado';

export type TicketPriority = 
  | 'baixa'
  | 'media'
  | 'alta'
  | 'critica';

export type TicketCategory =
  | 'TOTVS Protheus'
  | 'Computadores e notebooks'
  | 'Impressoras e etiquetas'
  | 'Redes e internet'
  | 'VPN e acessos'
  | 'Sistemas e softwares'
  | 'Outros';

export type TicketImpact =
  | 'consigo_trabalhar'
  | 'impedido_trabalhar'
  | 'setor_parado'
  | 'sem_interrupcao';

export interface Ticket {
  id: string;
  numeroOS: string; // Ex: OS-2026-0001
  titulo: string;
  descricao: string;
  solicitante: string;
  email: string;
  setor: string;
  categoria: TicketCategory;
  subcategoria: string;
  impacto: TicketImpact;
  prioridade: TicketPriority;
  status: TicketStatus;
  responsavel?: string;
  equipamentoId?: string;
  dataAbertura: string; // ISO 8601
  dataAtualizacao: string; // ISO 8601
  dataResolucao?: string; // ISO 8601
  dataConclusao?: string; // ISO 8601
  solucao?: string;
}

export type TicketEventType =
  | 'criacao'
  | 'mudanca_status'
  | 'mudanca_prioridade'
  | 'atribuicao'
  | 'comentario'
  | 'diagnostico'
  | 'conclusao';

export interface TicketEvent {
  id: string;
  ticketId: string;
  tipoEvento: TicketEventType;
  descricao: string;
  usuario: string;
  visibilidade: 'publico' | 'interno';
  dataHora: string; // ISO 8601
}

export type ArticleStatus = 'rascunho' | 'aprovado' | 'arquivado';

export interface KnowledgeArticle {
  id: string;
  titulo: string;
  categoria: TicketCategory | string;
  sintomas: string[];
  conteudo: string; // Passos e diretrizes detalhadas
  status: ArticleStatus;
  autor: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export type EquipmentStatus = 'operacional' | 'em_manutencao' | 'desativado';

export interface Equipment {
  id: string;
  codigo: string; // Ex: OTHX-PC-0001
  tipo: 'Computador' | 'Notebook' | 'Impressora' | 'Servidor' | 'Switch' | 'Outro';
  fabricante: string;
  modelo: string;
  hostname: string;
  ip: string;
  setor: string;
  usuario: string;
  especificacoes: {
    os?: string;
    cpu?: string;
    ram?: string;
    storage?: string;
  };
  status: EquipmentStatus;
  observacoes: string;
}

export type DiagnosticDifficulty = 'facil' | 'medio' | 'avancado';

export interface DiagnosticStep {
  ordem: number;
  titulo: string;
  orientacao: string;
  resultadoEsperado: string;
  recomendacao: string;
}

export interface DiagnosticProcedure {
  id: string;
  titulo: string;
  categoria: TicketCategory | string;
  sintomas: string[];
  dificuldade: DiagnosticDifficulty;
  etapas: DiagnosticStep[];
  possiveisCausas: string[];
}

export interface DiagnosticStepResult {
  realizado: boolean;
  passou: boolean | null; // true = sucesso, false = falha, null = não testado
  nota?: string;
}

export interface DiagnosticExecution {
  id: string;
  procedimentoId: string;
  procedimentoTitulo: string;
  ticketId?: string;
  ticketNumeroOS?: string;
  resultados: Record<number, DiagnosticStepResult>;
  observacoes: string;
  conclusao: string;
  tecnico: string;
  dataExecucao: string;
}

export type UserRole = 'colaborador' | 'tecnico' | 'admin';

export interface UserProfile {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  setor: string;
  perfil: UserRole;
  avatarInitials: string;
}

export interface AppState {
  tickets: Ticket[];
  events: TicketEvent[];
  articles: KnowledgeArticle[];
  equipment: Equipment[];
  diagnostics: DiagnosticProcedure[];
  executions: DiagnosticExecution[];
  currentUser: UserProfile;
  availableUsers: UserProfile[];
}

export interface ToastMessage {
  id: string;
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso';
  titulo: string;
  mensagem: string;
}
