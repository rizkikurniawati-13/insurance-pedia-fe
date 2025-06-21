import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private roles: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);         
          this.fetchRoles(response.token);
        })
      );
  }

  register(data: { name: string; email: string; password: string; roles: string[] }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          // Ambil peran setelah register
          this.fetchRoles(response.token);
        })
      );
  }

  private fetchRoles(token: string) {
    this.http.get<{ valid: boolean, roles?: string[] }>(`${this.apiUrl}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(response => {
      if (response.valid && response.roles) {      
        this.roles = response.roles;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.roles = [];
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRoles(): string[] {
    return this.roles;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
