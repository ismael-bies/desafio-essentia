import type { Todo } from '../domain/Todo.js';
import type { TodoRepository } from '../ports/TodoRepository.js';

export class GetTodos {
  constructor(private todoRepository: TodoRepository) {}

  async execute(userId: string): Promise<Todo[]> {
    return await this.todoRepository.findAllByUserId(userId);
  }
}
