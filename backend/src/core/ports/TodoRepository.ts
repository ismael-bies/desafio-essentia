import type { Todo } from '../domain/Todo.js';

export interface TodoRepository {
  create(todo: Todo): Promise<Todo>;
  findAllByUserId(userId: string): Promise<Todo[]>;
  findById(id: number): Promise<Todo | null>; // <-- Alterado para number
  update(todo: Todo): Promise<Todo>;
  delete(id: number): Promise<void>;  
}
