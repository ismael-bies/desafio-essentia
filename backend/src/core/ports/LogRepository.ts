export interface ActionLogProps {
  id?: string;
  userId?: string;     // Opcional, caso a ação seja feita por um visitante não logado
  action: string;      // Ex: "CREATE_TODO", "DELETE_TODO", "LOGIN_SUCCESS"
  resource: string;    // Ex: "todos", "auth"
  details: string;     // Detalhes em texto ou JSON (Ex: "Tarefa ID 123 criada")
  durationMs: number;  // Métrica de performance: quanto tempo a rota demorou para responder
  createdAt?: Date;
}

export interface LogRepository {
  save(log: ActionLogProps): Promise<void>;
}
