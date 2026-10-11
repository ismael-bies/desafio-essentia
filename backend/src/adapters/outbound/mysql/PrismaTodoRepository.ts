import type { PrismaClient } from '../../../generated/client/index.js';
import { Todo } from '../../../core/domain/Todo.js';
import type { TodoRepository } from '../../../core/ports/TodoRepository.js';

export class PrismaTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaClient) {}

  async create(todo: Todo): Promise<Todo> {
    const rawTodo = await this.prisma.todo.create({
      data: {
        userId: todo.userId,
        title: todo.title,
        completed: todo.completed
      }
    });

    return this.mapToDomain(rawTodo);
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const rawTodos = await this.prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'asc' }
    });

    return rawTodos.map(raw => this.mapToDomain(raw));
  }

  async findById(id: number): Promise<Todo | null> {
    const rawTodo = await this.prisma.todo.findUnique({
      where: { id }
    });

    if (!rawTodo) return null;
    return this.mapToDomain(rawTodo);
  }

  async update(todo: Todo): Promise<Todo> {
    if (todo.id === undefined) {
      throw new Error('Não é possível atualizar uma tarefa sem um ID válido!');
    }

    const rawTodo = await this.prisma.todo.update({
      where: { id: todo.id },
      data: {
        title: todo.title,
        completed: todo.completed,
        completedAt: todo.completedAt
      }
    });

    return this.mapToDomain(rawTodo);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.todo.delete({
      where: { id }
    });
  }

  private mapToDomain(raw: {
    id: number;
    userId: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date | null;
  }): Todo {
    return new Todo({
      id: raw.id,
      userId: raw.userId,
      title: raw.title,
      completed: raw.completed,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      completedAt: raw.completedAt ?? null
    });
  }
}
