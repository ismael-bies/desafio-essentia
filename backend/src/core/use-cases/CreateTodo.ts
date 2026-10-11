import { Todo } from '../domain/Todo.js';
import type { TodoRepository } from '../ports/TodoRepository.js';

interface CreateTodoInput {
  userId: string;
  title: string;
}

export class CreateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(title: string, userId: string): Promise<Todo> {
    const todo = new Todo({
      title,
      userId,
      completed: false
    });
    return await this.todoRepository.create(todo);
  }
}
