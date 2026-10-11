import { Request, Response, NextFunction } from 'express';
import { ActionLogModel } from '../adapters/outbound/mongo/ActionLogModel.js';

export function auditLogger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime();
  const method = req.method;
  const path = req.path;

  // Intercepta o momento em que a resposta HTTP é finalizada e enviada ao cliente
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = Math.round((diff[0] * 1e3 + diff[1] * 1e-6) * 100) / 100;

    // Ignora logs de leitura (GET) para não poluir o Mongo com ruído, foca em mutações
    if (method === 'GET') return;

    let action = 'UNKNOWN_ACTION';
    let details = `Requisição processada para ${method} ${path}`;

    if (path === '/todos' && method === 'POST') {
      action = 'CREATE_TODO';
      details = 'Criação de nova tarefa no MySQL';
    } else if (path.endsWith('/toggle') && method === 'PATCH') {
      action = 'TOGGLE_TODO_STATUS';
      details = 'Alteração do status de conclusão da tarefa';
    } else if (method === 'PUT') {
      action = 'UPDATE_TODO_TITLE';
      details = 'Atualização do título da tarefa';
    } else if (method === 'DELETE') {
      action = 'DELETE_TODO';
      details = 'Exclusão de tarefa do MySQL';
    }

    // Grava de forma assíncrona em background no MongoDB (sem travar a resposta do usuário)
    ActionLogModel.create({
      userId: 'user-id-temporario-123', // ID do admin fixado nesta etapa
      action,
      resource: 'todos',
      details,
      durationMs
    }).catch(err => console.error('Erro ao salvar log no MongoDB:', err));
  });

  next();
}
