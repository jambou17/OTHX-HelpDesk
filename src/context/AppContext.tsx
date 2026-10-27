import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { 
  AppState, 
  DiagnosticExecution, 
  Equipment, 
  KnowledgeArticle, 
  Ticket, 
  TicketEvent, 
  ToastMessage, 
  UserProfile 
} from '../types';
import { LocalStorageRepository } from '../services/localStorageRepository';
import { generateNextOSNumber } from '../utils/ticketUtils';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_TICKET'; payload: { ticketData: Omit<Ticket, 'id' | 'numeroOS' | 'dataAbertura' | 'dataAtualizacao' | 'status'>; eventDesc?: string } }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<Ticket>; eventDesc?: string; isInternal?: boolean } }
  | { type: 'RESOLVE_TICKET'; payload: { id: string; solucao: string } }
  | { type: 'ADD_EVENT'; payload: Omit<TicketEvent, 'id' | 'dataHora'> }
  | { type: 'SAVE_EQUIPMENT'; payload: Equipment }
  | { type: 'DELETE_EQUIPMENT'; payload: string }
  | { type: 'SAVE_ARTICLE'; payload: KnowledgeArticle }
  | { type: 'RECORD_EXECUTION'; payload: Omit<DiagnosticExecution, 'id' | 'dataExecucao'> }
  | { type: 'SWITCH_USER'; payload: string };

interface AppContextValue {
  state: AppState;
  toasts: ToastMessage[];
  addToast: (tipo: ToastMessage['tipo'], titulo: string, mensagem: string) => void;
  removeToast: (id: string) => void;
  createTicket: (data: Omit<Ticket, 'id' | 'numeroOS' | 'dataAbertura' | 'dataAtualizacao' | 'status'>) => Ticket;
  updateTicket: (id: string, updates: Partial<Ticket>, eventDesc?: string, isInternal?: boolean) => void;
  resolveTicket: (id: string, solucao: string) => void;
  addTicketComment: (ticketId: string, descricao: string, visibilidade: 'publico' | 'interno') => void;
  saveEquipment: (equipment: Equipment) => void;
  deleteEquipment: (id: string) => void;
  saveArticle: (article: KnowledgeArticle) => void;
  recordDiagnosticExecution: (execution: Omit<DiagnosticExecution, 'id' | 'dataExecucao'>) => DiagnosticExecution;
  switchUser: (userId: string) => void;
  restoreDemoData: () => void;
  clearAllData: () => void;
  importDataFromJSON: (jsonString: string) => { success: boolean; error?: string };
  exportDataToJSON: () => string;
}

const AppContext = createContext<AppContextValue | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_TICKET': {
      const now = new Date().toISOString();
      const newId = `tick-${Date.now()}`;
      const numeroOS = generateNextOSNumber(state.tickets);

      const newTicket: Ticket = {
        ...action.payload.ticketData,
        id: newId,
        numeroOS,
        status: 'novo',
        dataAbertura: now,
        dataAtualizacao: now,
      };

      const initialEvent: TicketEvent = {
        id: `evt-${Date.now()}`,
        ticketId: newId,
        tipoEvento: 'criacao',
        descricao: action.payload.eventDesc || `Chamado aberto por ${newTicket.solicitante}.`,
        usuario: state.currentUser.nome,
        visibilidade: 'publico',
        dataHora: now,
      };

      return {
        ...state,
        tickets: [newTicket, ...state.tickets],
        events: [initialEvent, ...state.events],
      };
    }

    case 'UPDATE_TICKET': {
      const now = new Date().toISOString();
      const { id, updates, eventDesc, isInternal } = action.payload;

      const updatedTickets = state.tickets.map(ticket => {
        if (ticket.id === id) {
          return {
            ...ticket,
            ...updates,
            dataAtualizacao: now,
          };
        }
        return ticket;
      });

      let updatedEvents = state.events;
      if (eventDesc) {
        const newEvent: TicketEvent = {
          id: `evt-${Date.now()}`,
          ticketId: id,
          tipoEvento: updates.status ? 'mudanca_status' : updates.prioridade ? 'mudanca_prioridade' : updates.responsavel ? 'atribuicao' : 'comentario',
          descricao: eventDesc,
          usuario: state.currentUser.nome,
          visibilidade: isInternal ? 'interno' : 'publico',
          dataHora: now,
        };
        updatedEvents = [newEvent, ...state.events];
      }

      return {
        ...state,
        tickets: updatedTickets,
        events: updatedEvents,
      };
    }

    case 'RESOLVE_TICKET': {
      const now = new Date().toISOString();
      const { id, solucao } = action.payload;

      const updatedTickets = state.tickets.map(ticket => {
        if (ticket.id === id) {
          return {
            ...ticket,
            status: 'concluido' as const,
            solucao,
            dataResolucao: now,
            dataConclusao: now,
            dataAtualizacao: now,
          };
        }
        return ticket;
      });

      const resolutionEvent: TicketEvent = {
        id: `evt-${Date.now()}`,
        ticketId: id,
        tipoEvento: 'conclusao',
        descricao: `Atendimento finalizado com a solução registrada: ${solucao}`,
        usuario: state.currentUser.nome,
        visibilidade: 'publico',
        dataHora: now,
      };

      return {
        ...state,
        tickets: updatedTickets,
        events: [resolutionEvent, ...state.events],
      };
    }

    case 'ADD_EVENT': {
      const newEvent: TicketEvent = {
        ...action.payload,
        id: `evt-${Date.now()}`,
        dataHora: new Date().toISOString(),
      };

      return {
        ...state,
        events: [newEvent, ...state.events],
      };
    }

    case 'SAVE_EQUIPMENT': {
      const eq = action.payload;
      const exists = state.equipment.some(e => e.id === eq.id);
      const updatedEquipment = exists
        ? state.equipment.map(e => (e.id === eq.id ? eq : e))
        : [eq, ...state.equipment];

      return {
        ...state,
        equipment: updatedEquipment,
      };
    }

    case 'DELETE_EQUIPMENT': {
      return {
        ...state,
        equipment: state.equipment.filter(e => e.id !== action.payload),
      };
    }

    case 'SAVE_ARTICLE': {
      const art = action.payload;
      const exists = state.articles.some(a => a.id === art.id);
      const updatedArticles = exists
        ? state.articles.map(a => (a.id === art.id ? art : a))
        : [art, ...state.articles];

      return {
        ...state,
        articles: updatedArticles,
      };
    }

    case 'RECORD_EXECUTION': {
      const execution: DiagnosticExecution = {
        ...action.payload,
        id: `exec-${Date.now()}`,
        dataExecucao: new Date().toISOString(),
      };

      let updatedEvents = state.events;
      if (execution.ticketId) {
        const diagEvent: TicketEvent = {
          id: `evt-${Date.now()}`,
          ticketId: execution.ticketId,
          tipoEvento: 'diagnostico',
          descricao: `Executado diagnóstico técnico: "${execution.procedimentoTitulo}". Conclusão: ${execution.conclusao}`,
          usuario: execution.tecnico,
          visibilidade: 'interno',
          dataHora: execution.dataExecucao,
        };
        updatedEvents = [diagEvent, ...state.events];
      }

      return {
        ...state,
        executions: [execution, ...state.executions],
        events: updatedEvents,
      };
    }

    case 'SWITCH_USER': {
      const targetUser = state.availableUsers.find(u => u.id === action.payload);
      if (!targetUser) return state;
      return {
        ...state,
        currentUser: targetUser,
      };
    }

    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, () => LocalStorageRepository.loadState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistir alterações automaticamente sempre que o estado sofrer mutação
  useEffect(() => {
    if (state) {
      LocalStorageRepository.saveState(state);
    }
  }, [state]);

  const addToast = (tipo: ToastMessage['tipo'], titulo: string, mensagem: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, tipo, titulo, mensagem }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'numeroOS' | 'dataAbertura' | 'dataAtualizacao' | 'status'>): Ticket => {
    const now = new Date().toISOString();
    const newId = `tick-${Date.now()}`;
    const numeroOS = generateNextOSNumber(state.tickets);

    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      numeroOS,
      status: 'novo',
      dataAbertura: now,
      dataAtualizacao: now,
    };

    dispatch({
      type: 'ADD_TICKET',
      payload: {
        ticketData,
        eventDesc: `Chamado aberto por ${newTicket.solicitante} (${newTicket.setor}).`,
      },
    });

    addToast('sucesso', 'Chamado Registrado', `Ordem de Serviço ${numeroOS} gerada com sucesso.`);
    return newTicket;
  };

  const updateTicket = (id: string, updates: Partial<Ticket>, eventDesc?: string, isInternal?: boolean) => {
    dispatch({
      type: 'UPDATE_TICKET',
      payload: { id, updates, eventDesc, isInternal },
    });
    addToast('sucesso', 'Chamado Atualizado', 'Alterações salvas com sucesso.');
  };

  const resolveTicket = (id: string, solucao: string) => {
    dispatch({
      type: 'RESOLVE_TICKET',
      payload: { id, solucao },
    });
    addToast('sucesso', 'Chamado Concluído', 'Atendimento finalizado com solução registrada.');
  };

  const addTicketComment = (ticketId: string, descricao: string, visibilidade: 'publico' | 'interno') => {
    dispatch({
      type: 'ADD_EVENT',
      payload: {
        ticketId,
        tipoEvento: 'comentario',
        descricao,
        usuario: state.currentUser.nome,
        visibilidade,
      },
    });
    addToast('info', 'Comentário Registrado', visibilidade === 'interno' ? 'Nota técnica interna adicionada.' : 'Comentário público registrado.');
  };

  const saveEquipment = (equipment: Equipment) => {
    dispatch({ type: 'SAVE_EQUIPMENT', payload: equipment });
    addToast('sucesso', 'Equipamento Salvo', `Equipamento ${equipment.codigo} atualizado no inventário.`);
  };

  const deleteEquipment = (id: string) => {
    dispatch({ type: 'DELETE_EQUIPMENT', payload: id });
    addToast('info', 'Equipamento Removido', 'Registro excluído do inventário.');
  };

  const saveArticle = (article: KnowledgeArticle) => {
    dispatch({ type: 'SAVE_ARTICLE', payload: article });
    addToast('sucesso', 'Artigo Salvo', `Procedimento "${article.titulo}" registrado na base de conhecimento.`);
  };

  const recordDiagnosticExecution = (execution: Omit<DiagnosticExecution, 'id' | 'dataExecucao'>): DiagnosticExecution => {
    dispatch({ type: 'RECORD_EXECUTION', payload: execution });
    const fullExecution: DiagnosticExecution = {
      ...execution,
      id: `exec-${Date.now()}`,
      dataExecucao: new Date().toISOString(),
    };
    addToast('sucesso', 'Diagnóstico Registrado', `Checklist de "${execution.procedimentoTitulo}" concluído.`);
    return fullExecution;
  };

  const switchUser = (userId: string) => {
    dispatch({ type: 'SWITCH_USER', payload: userId });
    const user = state.availableUsers.find(u => u.id === userId);
    if (user) {
      addToast('info', 'Perfil Alternado', `Operando agora como ${user.nome} (${user.cargo}).`);
    }
  };

  const restoreDemoData = () => {
    const fresh = LocalStorageRepository.restoreDefaultState();
    dispatch({ type: 'SET_STATE', payload: fresh });
    addToast('info', 'Base Restaurada', 'Os dados demonstrativos de fábrica foram recarregados.');
  };

  const clearAllData = () => {
    const empty = LocalStorageRepository.clearState();
    dispatch({ type: 'SET_STATE', payload: empty });
    addToast('aviso', 'Dados Limpos', 'Todos os registros de chamados e histórico foram removidos.');
  };

  const importDataFromJSON = (jsonString: string) => {
    const result = LocalStorageRepository.importFromJSON(jsonString);
    if (result.success && result.state) {
      dispatch({ type: 'SET_STATE', payload: result.state });
      addToast('sucesso', 'Importação Concluída', 'Os dados foram restaurados com sucesso a partir do arquivo.');
      return { success: true };
    }
    addToast('erro', 'Falha na Importação', result.error || 'Não foi possível validar o arquivo.');
    return { success: false, error: result.error };
  };

  const exportDataToJSON = () => {
    return LocalStorageRepository.exportToJSON(state);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        toasts,
        addToast,
        removeToast,
        createTicket,
        updateTicket,
        resolveTicket,
        addTicketComment,
        saveEquipment,
        deleteEquipment,
        saveArticle,
        recordDiagnosticExecution,
        switchUser,
        restoreDemoData,
        clearAllData,
        importDataFromJSON,
        exportDataToJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider.');
  }
  return context;
}
