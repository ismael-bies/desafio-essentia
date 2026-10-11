import type { TodoRepository } from '../ports/TodoRepository.js';

export class DeleteTodo {
  constructor(private todoRepository: TodoRepository) {}

  // Garanta que o tipo aqui está como 'number' e não 'string'!
  async execute(id: number): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    
    if (!todo) {
      throw new Error('Tarefa não encontrada!');
    }

    await this.todoRepository.delete(id);
  }
}
