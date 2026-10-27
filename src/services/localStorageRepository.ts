import { AppState } from '../types';
import { INITIAL_STATE } from '../data/seedData';

const CURRENT_STORAGE_KEY = 'othx-helpdesk:v1';
const LEGACY_STORAGE_KEY = 'hq-techassist:v1';

export class LocalStorageRepository {
  /**
   * Carrega os dados persistidos com migração segura a partir da chave legada se necessário
   */
  public static loadState(): AppState {
    try {
      // 1. Verificar a existência na chave atual 'othx-helpdesk:v1'
      const rawCurrent = localStorage.getItem(CURRENT_STORAGE_KEY);
      if (rawCurrent) {
        const parsed = JSON.parse(rawCurrent);
        if (this.isValidStateStructure(parsed)) {
          return this.sanitizeState(parsed);
        }
      }

      // 2. Se a chave nova não existir, verificar chave legada 'hq-techassist:v1'
      const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawLegacy) {
        try {
          const parsedLegacy = JSON.parse(rawLegacy);
          if (this.isValidStateStructure(parsedLegacy)) {
            // Migrar preservando backup e anonimizando dados legados
            const migratedState = this.anonymizeState(this.sanitizeState(parsedLegacy));
            this.saveState(migratedState);
            // Salvar uma cópia de segurança explícita da migração
            localStorage.setItem('othx-helpdesk:migration-backup', rawLegacy);
            console.info('Migração segura concluída de hq-techassist:v1 para othx-helpdesk:v1.');
            return migratedState;
          }
        } catch (migErr) {
          console.warn('Falha ao migrar chave legada, inicializando dados padrão OTHX:', migErr);
        }
      }

      // 3. Caso não haja dados válidos, inicializar com a base padrão OTHX
      this.saveState(INITIAL_STATE);
      return INITIAL_STATE;
    } catch (error) {
      console.error('Falha ao acessar localStorage:', error);
      return INITIAL_STATE;
    }
  }

  /**
   * Valida a estrutura mínima necessária de um objeto AppState
   */
  private static isValidStateStructure(data: unknown): data is AppState {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Partial<AppState>;
    return (
      Array.isArray(obj.tickets) &&
      Array.isArray(obj.events) &&
      Array.isArray(obj.articles) &&
      Array.isArray(obj.equipment) &&
      Array.isArray(obj.diagnostics)
    );
  }

  /**
   * Garante compatibilidade e preenchimento de campos obrigatórios
   */
  private static sanitizeState(data: Partial<AppState>): AppState {
    return {
      tickets: data.tickets || [],
      events: data.events || [],
      articles: data.articles || INITIAL_STATE.articles,
      equipment: data.equipment || [],
      diagnostics: data.diagnostics || INITIAL_STATE.diagnostics,
      executions: data.executions || [],
      currentUser: data.currentUser || INITIAL_STATE.currentUser,
      availableUsers: data.availableUsers || INITIAL_STATE.availableUsers,
    };
  }

  /**
   * Transforma referências a marcas ou dados anteriores em padrão fictício OTHX
   */
  public static anonymizeState(state: AppState): AppState {
    const sanitizeText = (txt?: string): string => {
      if (!txt) return '';
      return txt
        .replace(/Health\s*Quality/gi, 'OTHX Corp')
        .replace(/healthquality\.corp/gi, 'example.com')
        .replace(/healthquality\.com\.br/gi, 'example.com')
        .replace(/HQ-PC-TESTE-/gi, 'OTHX-PC-')
        .replace(/HQ-NB-TESTE-/gi, 'OTHX-NB-')
        .replace(/HQ-IMP-TESTE-/gi, 'OTHX-PRN-')
        .replace(/HQ-DESK-/gi, 'OTHX-PC-')
        .replace(/HQ-NOTE-/gi, 'OTHX-NB-')
        .replace(/HQ-PRN-/gi, 'OTHX-PRN-')
        .replace(/protheus-app\.hq\.corp/gi, 'erp.example.com')
        .replace(/vpn\.healthquality\.com\.br/gi, 'vpn.example.com');
    };

    return {
      ...state,
      tickets: state.tickets.map(t => ({
        ...t,
        titulo: sanitizeText(t.titulo),
        descricao: sanitizeText(t.descricao),
        solicitante: sanitizeText(t.solicitante),
        email: t.email ? t.email.replace(/@healthquality\.(corp|com\.br)/i, '@example.com') : 'usuario@example.com',
        setor: sanitizeText(t.setor),
        solucao: t.solucao ? sanitizeText(t.solucao) : undefined,
      })),
      events: state.events.map(e => ({
        ...e,
        descricao: sanitizeText(e.descricao),
        usuario: sanitizeText(e.usuario),
      })),
      equipment: state.equipment.map(eq => ({
        ...eq,
        codigo: eq.codigo.replace(/HQ-(PC|NB|IMP)-TESTE-/gi, 'OTHX-$1-'),
        hostname: sanitizeText(eq.hostname),
        usuario: sanitizeText(eq.usuario),
        setor: sanitizeText(eq.setor),
        observacoes: sanitizeText(eq.observacoes),
      })),
      articles: state.articles.map(a => ({
        ...a,
        titulo: sanitizeText(a.titulo),
        conteudo: sanitizeText(a.conteudo),
        autor: sanitizeText(a.autor),
      })),
      availableUsers: state.availableUsers.map(u => ({
        ...u,
        email: u.email.replace(/@healthquality\.(corp|com\.br)/i, '@example.com'),
        setor: sanitizeText(u.setor),
      })),
      currentUser: {
        ...state.currentUser,
        email: state.currentUser.email.replace(/@healthquality\.(corp|com\.br)/i, '@example.com'),
        setor: sanitizeText(state.currentUser.setor),
      },
    };
  }

  /**
   * Salva o estado completo no localStorage na chave OTHX
   */
  public static saveState(state: AppState): boolean {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(CURRENT_STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Falha ao persistir dados no localStorage (cota excedida ou restrição):', error);
      return false;
    }
  }

  /**
   * Restaura os dados para o padrão de demonstração de fábrica OTHX
   */
  public static restoreDefaultState(): AppState {
    this.saveState(INITIAL_STATE);
    return INITIAL_STATE;
  }

  /**
   * Limpa todos os dados salvos deixando a aplicação vazia
   */
  public static clearState(): AppState {
    const emptyState: AppState = {
      tickets: [],
      events: [],
      articles: [],
      equipment: [],
      diagnostics: INITIAL_STATE.diagnostics,
      executions: [],
      currentUser: INITIAL_STATE.currentUser,
      availableUsers: INITIAL_STATE.availableUsers,
    };
    this.saveState(emptyState);
    return emptyState;
  }

  /**
   * Exporta os dados atuais como uma string JSON formatada para download
   */
  public static exportToJSON(state: AppState): string {
    return JSON.stringify(
      {
        versao: '0.2.0',
        produto: 'OTHX Help Desk',
        empresa: 'OTHX Solutions',
        exportadoEm: new Date().toISOString(),
        dados: state,
      },
      null,
      2
    );
  }

  /**
   * Valida e importa um arquivo JSON previamente exportado
   */
  public static importFromJSON(jsonString: string): { success: boolean; state?: AppState; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const dataToValidate = parsed.dados ? parsed.dados : parsed;

      if (!dataToValidate || typeof dataToValidate !== 'object') {
        return { success: false, error: 'Arquivo JSON inválido ou vazio.' };
      }

      if (!Array.isArray(dataToValidate.tickets)) {
        return { success: false, error: 'Estrutura ausente: lista de chamados (tickets) não encontrada.' };
      }

      const validatedState: AppState = {
        tickets: dataToValidate.tickets || [],
        events: Array.isArray(dataToValidate.events) ? dataToValidate.events : [],
        articles: Array.isArray(dataToValidate.articles) ? dataToValidate.articles : INITIAL_STATE.articles,
        equipment: Array.isArray(dataToValidate.equipment) ? dataToValidate.equipment : [],
        diagnostics: Array.isArray(dataToValidate.diagnostics) ? dataToValidate.diagnostics : INITIAL_STATE.diagnostics,
        executions: Array.isArray(dataToValidate.executions) ? dataToValidate.executions : [],
        currentUser: dataToValidate.currentUser || INITIAL_STATE.currentUser,
        availableUsers: Array.isArray(dataToValidate.availableUsers) ? dataToValidate.availableUsers : INITIAL_STATE.availableUsers,
      };

      this.saveState(validatedState);
      return { success: true, state: validatedState };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao processar arquivo JSON';
      return { success: false, error: `Falha na leitura do arquivo: ${message}` };
    }
  }
}
