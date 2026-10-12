import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service.js';
import { AppLayoutComponent } from '../../../../shared/components/app-layout/app-layout.component.js';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AppLayoutComponent],
  template: `
    <app-layout>
      <div class="todo-widescreen-container">
        <h2>📋 Painel Avançado de Tarefas</h2>
        
        <!-- Grupo de Input Corporativo Moderno -->
        <div class="todo-input-group">
          <input #todoInput type="text" placeholder="Digite uma nova tarefa corporativa..." (keyup.enter)="addTodo(todoInput)">
          <button (click)="addTodo(todoInput)">Adicionar Tarefa</button>
        </div>

        <!-- Listagem de Tarefas Expandida Web -->
        <div class="todo-list-wrapper">
          <div *ngIf="todoService.loading()" class="todo-loading">
            🔄 Sincronizando dados transacionais com os containers...
          </div>
          
          <div class="todo-row-item" *ngFor="let todo of todoService.todos()">
            <div class="todo-item-left-block">
              <!-- ── EVENTO CLICK BLINDADO: Resolve o travamento do finalizar utilizando o método correto -->
              <input type="checkbox" 
                     [checked]="$any(todo).props?.completed ?? $any(todo).completed" 
                     (click)="todoService.toggleStatus($any(todo).props?.id ?? $any(todo).id)">
              
              <div class="todo-text-meta-group" style="display: flex; flex-direction: column; justify-content: center; min-height: 48px; height: 48px;">
                <!-- Título da Tarefa de Alto Contraste -->
                <span class="todo-title-text" 
                      [style.text-decoration]="$any(todo).props?.completed ?? $any(todo).completed ? 'line-through' : 'none'" 
                      [style.color]="$any(todo).props?.completed ?? $any(todo).completed ? '#64748b' : '#f8fafc'">
                  {{ $any(todo).props?.title ?? $any(todo).title }}
                </span>
                
                <!-- Exibição da data de conclusão formatada -->
                <small class="todo-completed-date" *ngIf="$any(todo).props?.completed ?? $any(todo).completed">
                  ✅ Concluída em: {{ ($any(todo).props?.completedAt ?? $any(todo).completedAt) | date: 'dd/MM/yyyy HH:mm' }}
                </small>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span (click)="editTodo(($any(todo).props?.id ?? $any(todo).id), ($any(todo).props?.title ?? $any(todo).title))" 
                    style="cursor: pointer; font-size: 1.1rem; padding: 4px;" class="btn-action-delete" 
                    title="Editar tarefa">✏️</span>
              <button class="btn-action-delete" (click)="todoService.deleteTodo($any(todo).props?.id ?? $any(todo).id)" title="Deletar tarefa">
                🗑️
              </button>

            </div>
          </div>

          <!-- Empty State Sênior -->
          <div *ngIf="!todoService.loading() && todoService.todos().length === 0" class="todo-empty-state">
            🎯 Nenhuma tarefa pendente para este usuário corporativo. Digite um título acima para iniciar!
          </div>
        </div>
      </div>
    </app-layout>
  `,
  styleUrl: './todo-dashboard.component.scss',
})
export class TodoDashboardComponent implements OnInit {
  public todoService = inject(TodoService);

  ngOnInit(): void {
    // Dispara o gatilho que vai buscar a lista salva no MySQL assim que a tela abre
    this.todoService.fetchTodos();
  }

  public addTodo(input: HTMLInputElement): void {
    const title = input.value;

    if (!title || title.trim() === '') {
      return;
    }

    this.todoService.createTodo(title.trim());

    input.value = '';
  }

  public editTodo(id: number, currentTitle: string): void {
  const newTitle = prompt('Editar o título da tarefa corporativa:', currentTitle);
  
  // Se o usuário cancelou ou deixou o texto em branco, interrompe o fluxo
  if (newTitle === null || newTitle.trim() === '') {
    return;
  }

  // Dispara o método do serviço que atualiza o banco de dados
  this.todoService.updateTodo(id, newTitle.trim());
  }
}
