import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../../shared/models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/todos';

  public todos = signal<Todo[]>([]);
  public loading = signal<boolean>(false);

  public fetchTodos(): void {
    this.loading.set(true);
    // O jwtInterceptor global injeta o Token automaticamente no cabeçalho
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todos.set(data),
      error: (err) => console.error('Erro ao buscar tarefas:', err),
      complete: () => this.loading.set(false)
    });
  }

  public createTodo(title: string): void {
    // ── RETORNO AO PADRÃO NATIVO: Enviamos o payload puro sem interferir na assinatura do HttpClient
    this.http.post<Todo>(this.apiUrl, { title }).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => console.error('Erro ao criar tarefa:', err)
    });
  }

  public toggleStatus(id: number): void {
    this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => console.error('Erro ao alterar status:', err)
    });
  }

  public deleteTodo(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.fetchTodos(),
      error: (err) => console.error('Erro ao deletar tarefa:', err)
    });
  }
}
