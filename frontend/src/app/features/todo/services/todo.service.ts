import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../../shared/models/Todo.js';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/todos';
  
  // State Management moderno com Angular 19 Signals
  public todos = signal<Todo[]>([]);
  public loading = signal<boolean>(false);

  // 1. Buscar todas as tarefas do MySQL
  public fetchTodos(): void {
    this.loading.set(true);
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todos.set(data),
      error: (err) => console.error('Erro ao buscar tarefas:', err),
      complete: () => this.loading.set(false)
    });
  }

  // 2. Criar uma nova tarefa
  public createTodo(title: string): void {
    this.http.post<Todo>(this.apiUrl, { title }).subscribe({
      next: (newTodo) => {
        // Atualiza o Signal adicionando o novo item no final (respeitando o ID asc)
        this.todos.update(current => [...current, newTodo]);
      },
      error: (err) => console.error('Erro ao criar tarefa:', err)
    });
  }

  // 3. Alternar status (Toggle)
  public toggleStatus(id: number): void {
    this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).subscribe({
      next: (updatedTodo) => {
        this.todos.update(current => 
          current.map(todo => todo.id === id ? updatedTodo : todo)
        );
      },
      error: (err) => console.error('Erro ao alternar status:', err)
    });
  }

  // 4. Deletar tarefa
  public deleteTodo(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todos.update(current => current.filter(todo => todo.id !== id));
      },
      error: (err) => console.error('Erro ao deletar tarefa:', err)
    });
  }
}
