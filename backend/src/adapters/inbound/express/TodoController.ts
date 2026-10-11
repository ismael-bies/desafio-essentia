import type { Request, Response } from 'express';
import type { CreateTodo } from '../../../core/use-cases/CreateTodo.js';
import type { GetTodos } from '../../../core/use-cases/GetTodos.js';
import type { ToggleTodoStatus } from '../../../core/use-cases/ToggleTodoStatus.js';
import type { DeleteTodo } from '../../../core/use-cases/DeleteTodo.js';
import type { UpdateTodo } from '../../../core/use-cases/UpdateTodo.js';

export class TodoController {
  constructor(
    private createTodo: CreateTodo,
    private getTodos: GetTodos,
    private toggleTodoStatus: ToggleTodoStatus,
    private deleteTodo: DeleteTodo,
    private updateTodo: UpdateTodo
  ) {}

  private MOCK_USER_ID = 'user-id-temporario-123';

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.body;
      
      const todo = await this.createTodo.execute({
        userId: this.MOCK_USER_ID,
        title
      });

      res.status(201).json({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt,
        completedAt: todo.completedAt // <-- ADICIONADO NO CADASTRO
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const todos = await this.getTodos.execute(this.MOCK_USER_ID);
      
      const formattedTodos = todos.map(todo => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        createdAt: todo.createdAt,
        completedAt: todo.completedAt // <-- ADICIONADO NA LISTAGEM (GET ALL)
      }));

      res.status(200).json(formattedTodos);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public toggle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'O ID da tarefa precisa ser um texto válido!' });
        return;
      }

      const todo = await this.toggleTodoStatus.execute(Number(id));

      res.status(200).json({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        updatedAt: todo.updatedAt,
        completedAt: todo.completedAt // <-- ADICIONADO NO TOGGLE
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'O ID da tarefa precisa ser um texto válido!' });
        return;
      }

      if (!title || title.trim() === '') {
        res.status(400).json({ error: 'O novo título da tarefa é obrigatório!' });
        return;
      }

      const todo = await this.updateTodo.execute({
        id: Number(id),
        title
      });

      res.status(200).json({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        updatedAt: todo.updatedAt,
        completedAt: todo.completedAt // <-- ADICIONADO NO UPDATE TRADICIONAL
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'O ID da tarefa precisa ser um texto válido!' });
        return;
      }

      await this.deleteTodo.execute(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
