import type { TodoRepository } from '../ports/TodoRepository.js';
import type { Todo } from '../domain/Todo.js';

export class ToggleTodoStatus {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    
    if (!todo) {
      throw new Error('Tarefa não encontrada!');
    }

    todo.toggleStatus();
    return await this.todoRepository.update(todo);
  }
}
