import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { name: string; email: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/auth';

  // Signals que gerenciam o estado reativo global do usuário logado
  public userSignal = signal<{ name: string; email: string } | null>(null);
  
  // Computed Signal: Sabe instantaneamente se o usuário está autenticado
  public isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    // Restaura a sessão se o usuário der F5 na página
    const token = localStorage.getItem('essentia_token');
    const userData = localStorage.getItem('essentia_user');
    if (token && userData) {
      this.userSignal.set(JSON.parse(userData));
    }
  }

  public register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.saveSession(res))
    );
  }

  public logout(): void {
    localStorage.removeItem('essentia_token');
    localStorage.removeItem('essentia_user');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem('essentia_token');
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('essentia_token', res.token);
    localStorage.setItem('essentia_user', JSON.stringify(res.user));
    this.userSignal.set(res.user);
    this.router.navigate(['/']); // Redireciona para a lista do To-Do List
  }
}
