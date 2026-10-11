import type { TodoRepository } from '../ports/TodoRepository.js';
import type { Todo } from '../domain/Todo.js';

interface UpdateTodoInput {
  id: number;
  title: string;
}

export class UpdateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todoRepository.findById(input.id);

    if (!todo) {
      throw new Error('Tarefa não encontrada!');
    }

    todo.updateTitle(input.title);

    return await this.todoRepository.update(todo);
  }
}
