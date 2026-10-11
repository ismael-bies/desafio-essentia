import { Todo } from '../domain/Todo.js';
import type { TodoRepository } from '../ports/TodoRepository.js';

interface CreateTodoInput {
  userId: string;
  title: string;
}

export class CreateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    const todo = new Todo({
      userId: input.userId,
      title: input.title,
      completed: false
    });

    return await this.todoRepository.create(todo);
  }
}
