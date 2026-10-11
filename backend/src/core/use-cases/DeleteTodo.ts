import type { TodoRepository } from '../ports/TodoRepository.js';

export class DeleteTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: number): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    
    if (!todo) {
      throw new Error('Tarefa não encontrada!');
    }

    await this.todoRepository.delete(id);
  }
}
