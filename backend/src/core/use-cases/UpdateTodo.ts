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

    // Aplica a regra de negócio e validação de título do domínio
    todo.updateTitle(input.title);

    // Manda o adaptador do Prisma persistir a alteração no MySQL
    return await this.todoRepository.update(todo);
  }
}
