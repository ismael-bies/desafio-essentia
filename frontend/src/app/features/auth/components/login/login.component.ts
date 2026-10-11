import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>🚀 Desafio To-Do List</h2>
        <p class="subtitle">{{ isLoginMode() ? 'Entre na sua conta para gerenciar tarefas' : 'Crie sua conta transacional' }}</p>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group" *ngIf="!isLoginMode()">
            <label>Nome Completo</label>
            <input type="text" [(ngModel)]="name" name="name" required placeholder="Digite seu nome">
          </div>

          <div class="form-group">
            <label>E-mail Corporativo</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="seu.email@essentia.com">
          </div>

          <div class="form-group">
            <label>Senha de Acesso</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="••••••••">
          </div>

          <p class="error-msg" *ngIf="errorMessage()">⚠️ {{ errorMessage() }}</p>

          <button type="submit" class="btn-primary">
            {{ isLoginMode() ? 'Acessar Painel' : 'Concluir Cadastro' }}
          </button>
        </form>

        <div class="toggle-mode">
          <button (click)="toggleMode()">
            {{ isLoginMode() ? 'Não tem uma conta? Cadastre-se aqui' : 'Já possui uma conta? Faça login' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; font-family: sans-serif; }
    .auth-card { background: #1e293b; padding: 2.5rem; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); color: #f8fafc; }
    h2 { text-align: center; margin-bottom: 0.5rem; color: #38bdf8; }
    .subtitle { text-align: center; color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 1.2rem; }
    label { font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.4rem; font-weight: 600; }
    input { padding: 0.75rem; border-radius: 6px; border: 1px solid #475569; background: #334155; color: #fff; font-size: 0.95rem; }
    input:focus { outline: none; border-color: #38bdf8; }
    .btn-primary { width: 100%; padding: 0.8rem; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s; margin-top: 0.5rem; }
    .btn-primary:hover { background: #0369a1; }
    .error-msg { color: #f87171; font-size: 0.85rem; margin-bottom: 1rem; text-align: center; }
    .toggle-mode { text-align: center; margin-top: 1.5rem; }
    .toggle-mode button { background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 0.85rem; text-decoration: underline; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);

  public isLoginMode = signal<boolean>(true);
  public errorMessage = signal<string>('');

  public name = '';
  public email = '';
  public password = '';

  public toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.errorMessage.set('');
  }

  public onSubmit(): void {
    if (!this.email || !this.password || (!this.isLoginMode() && !this.name)) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isLoginMode()) {
      this.authService.login(this.email, this.password).subscribe({
        error: (err) => this.errorMessage.set(err.error?.error || 'Falha ao realizar login.')
      });
    } else {
      this.authService.register(this.name, this.email, this.password).subscribe({
        error: (err) => this.errorMessage.set(err.error?.error || 'Falha ao realizar cadastro.')
      });
    }
  }
}
