import { PrismaClient } from '../../../generated/client/index.js';
import type { TodoRepository } from '../../../core/ports/TodoRepository.js';
import { Todo } from '../../../core/domain/Todo.js';

export class PrismaTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(todo: Todo): Promise<Todo> {
    const completedAtValue = todo.completedAt instanceof Date ? todo.completedAt : null;

    const createdTodo = await this.prisma.todo.create({
      data: {
        title: todo.title,
        completed: todo.completed,
        completedAt: completedAtValue,
        userId: todo.userId
      }
    });

    return new Todo({
      id: createdTodo.id,
      title: createdTodo.title,
      completed: createdTodo.completed,
      userId: createdTodo.userId,
      completedAt: createdTodo.completedAt
    });
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'asc' }
    });

    return todos.map(t => new Todo({
      id: t.id,
      title: t.title,
      completed: t.completed,
      userId: t.userId,
      completedAt: t.completedAt
    }));
  }

  async findById(id: number): Promise<Todo | null> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) return null;

    return new Todo({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      userId: todo.userId,
      completedAt: todo.completedAt
    });
  }

  async update(todo: Todo): Promise<Todo> {
    // Garante que o ID existe e joga para uma variável local de tipo numérico puro (sem undefined)
    const todoId = todo.id;
    if (todoId === undefined || todoId === null) {
      throw new Error('Não é possível atualizar uma tarefa sem um ID válido.');
    }

    const completedAtValue = todo.completedAt instanceof Date ? todo.completedAt : null;

    const updated = await this.prisma.todo.update({
      where: { id: todoId }, // Chave numérica pura mapeada com sucesso
      data: {
        title: todo.title,
        completed: todo.completed,
        completedAt: completedAtValue
      }
    });

    return new Todo({
      id: updated.id,
      title: updated.title,
      completed: updated.completed,
      userId: updated.userId,
      completedAt: updated.completedAt ?? null
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.todo.delete({ where: { id } });
  }
}
