import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper">
      <header class="top-navbar">
        <!-- ── SINTAXE DE SIGNAL CORRIGIDA: Lemos o sinal usando parênteses userSignal() -->
        <div class="user-greeting" *ngIf="authService.userSignal() as user">
          👤 Painel de Tarefas de: <strong>{{ user.name }}</strong> <span class="user-email">({{ user.email }})</span>
        </div>
        
        <button class="btn-logout" (click)="authService.logout()">
          🚪 Sair do Sistema
        </button>
      </header>

      <main class="content-container">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { display: flex; flex-direction: column; min-height: 100vh; background: #0f172a; color: #fff; font-family: sans-serif; }
    .top-navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1e293b; border-bottom: 1px solid #334155; }
    .user-greeting { font-size: 0.95rem; color: #e2e8f0; }
    .user-greeting strong { color: #38bdf8; }
    .user-email { color: #94a3b8; font-size: 0.85rem; margin-left: 0.4rem; }
    .btn-logout { padding: 0.5rem 1rem; background: #ef4444; border: none; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; transition: background 0.2s; font-size: 0.85rem; }
    .btn-logout:hover { background: #dc2626; }
    .content-container { padding: 2rem; flex: 1; display: flex; flex-direction: column; width: 100% !important; max-width: 100% !important; margin: 0 !important; box-sizing: border-box; }
  `]
})
export class AppLayoutComponent {
  // Injetamos publicamente para o template HTML ler o Signal de usuário e logout automaticamente
  public authService = inject(AuthService); 
}
