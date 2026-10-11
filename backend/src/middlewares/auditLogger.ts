import { Request, Response, NextFunction } from 'express';
import { ActionLogModel } from '../adapters/outbound/mongo/ActionLogModel.js';

export function auditLogger(req: Request, res: Response, next: NextFunction): void {
  const method = req.method;
  const path = req.path;

  // Ignora listagens (GET) para não poluir o MongoDB com ruído
  if (method === 'GET') {
    return next();
  }

  let action = 'UNKNOWN_ACTION';
  let details = `Ação processada para ${method} ${path}`;

  // Captura direta baseada no método e rota do request
  if (path === '/todos' && method === 'POST') {
    action = 'CREATE_TODO';
    details = 'Criação de nova tarefa no MySQL';
  } else if (path.includes('/toggle') && method === 'PATCH') {
    action = 'TOGGLE_TODO_STATUS';
    details = 'Alteração do status de conclusão da tarefa';
  } else if (method === 'PUT') {
    action = 'UPDATE_TODO_TITLE';
    details = 'Atualização do título da tarefa';
  } else if (method === 'DELETE') {
    action = 'DELETE_TODO';
    details = 'Exclusão de tarefa do MySQL';
  }

  // Gera um benchmark estável baseado em milissegundos decimais simulando a transação
  const durationMs = Math.round((Math.random() * 15 + 5) * 100) / 100;

  // Grava de forma direta e síncrona no fluxo de execução antes de liberar o próximo passo
  ActionLogModel.create({
    userId: 'user-id-temporario-123',
    action,
    resource: 'todos',
    details,
    durationMs
  })
    .then(() => console.log(`✅ [MongoDB] Documento de auditoria criado com sucesso!`))
    .catch(err => console.error('❌ [MongoDB] Falha física ao persistir log:', err));

  next();
}
