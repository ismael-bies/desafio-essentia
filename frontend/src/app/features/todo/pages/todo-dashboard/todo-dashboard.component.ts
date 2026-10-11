import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service.js';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule], // Libera pipes como o de data e diretivas condicionais
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss']
})
export class TodoDashboardComponent implements OnInit {
  // Injetando o serviço reativo do domínio do To-Do
  public todoService = inject(TodoService);

  ngOnInit(): void {
    // Dispara o gatilho que vai buscar a lista salva no MySQL assim que a tela abre
    this.todoService.fetchTodos();
  }

  public addTodo(input: HTMLInputElement): void {
    const title = input.value;
    if (!title || title.trim() === '') return;

    this.todoService.createTodo(title);
    input.value = ''; // Limpa o campo do formulário após o envio
  }
}
