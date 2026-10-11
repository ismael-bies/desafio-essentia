import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component.js';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
      {
        path: 'todos',
        loadComponent: () => import('./features/todo/pages/todo-dashboard/todo-dashboard.component.js') // <-- Extensão .js no import!
          .then(m => m.TodoDashboardComponent)
      },
      // Rotas futuras mockadas para o menu não quebrar
      { 
        path: 'users', 
        loadComponent: () => import('./shared/components/app-layout/app-layout.component.js').then(m => m.AppLayoutComponent)
      },
      { 
        path: 'metrics', 
        loadComponent: () => import('./shared/components/app-layout/app-layout.component.js').then(m => m.AppLayoutComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'todos' }
];
