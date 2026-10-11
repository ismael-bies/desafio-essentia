import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component.js';
import { authGuard } from './core/guards/auth.guard.js';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/todo/pages/todo-dashboard/todo-dashboard.component.js') // <-- Extensão .js no import!
      .then(m => m.TodoDashboardComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login.component.js').then(m => m.LoginComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];
