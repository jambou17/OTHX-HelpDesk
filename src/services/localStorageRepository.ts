import { AppState } from '../types';
import { INITIAL_STATE } from '../data/seedData';

const STORAGE_KEY = 'hq-techassist:v1';

export class LocalStorageRepository {
  /**
   * Carrega os dados persistidos ou inicializa com os dados demonstrativos
   */
  public static loadState(): AppState {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        this.saveState(INITIAL_STATE);
        return INITIAL_STATE;
      }

      const parsed = JSON.parse(rawData);

      // Validação defensiva de campos obrigatórios
      if (
        !parsed ||
        !Array.isArray(parsed.tickets) ||
        !Array.isArray(parsed.events) ||
        !Array.isArray(parsed.articles) ||
        !Array.isArray(parsed.equipment) ||
        !Array.isArray(parsed.diagnostics)
      ) {
        console.warn('Dados no localStorage com formato inconsistente. Restaurando base demonstrativa.');
        this.saveState(INITIAL_STATE);
        return INITIAL_STATE;
      }

      // Garantir compatibilidade e valores default se algum campo novo foi adicionado
      return {
        tickets: parsed.tickets || [],
        events: parsed.events || [],
        articles: parsed.articles || [],
        equipment: parsed.equipment || [],
        diagnostics: parsed.diagnostics || INITIAL_STATE.diagnostics,
        executions: parsed.executions || [],
        currentUser: parsed.currentUser || INITIAL_STATE.currentUser,
        availableUsers: parsed.availableUsers || INITIAL_STATE.availableUsers,
      };
    } catch (error) {
      console.error('Falha ao ler dados do localStorage:', error);
      return INITIAL_STATE;
    }
  }

  /**
   * Salva o estado completo no localStorage
   */
  public static saveState(state: AppState): boolean {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Falha ao persistir dados no localStorage (cota excedida ou restrição do navegador):', error);
      return false;
    }
  }

  /**
   * Restaura os dados para o padrão de demonstração de fábrica
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
      diagnostics: INITIAL_STATE.diagnostics, // Mantém os procedimentos técnicos padrão
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
        versao: '0.1.0',
        origem: 'HQ TechAssist | Health Quality',
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

      // Validação da estrutura mínima
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
