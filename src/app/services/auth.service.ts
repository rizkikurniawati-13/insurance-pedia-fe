import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private roles: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);         
          this.fetchRoles(response.token);
        })
      );
  }

  register(data: { name: string; email: string; password: string; roles: string[] }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.fetchRoles(response.token);
        })
      );
  }

  private fetchRoles(token: string) {
    this.http.get<{ valid: boolean, roles?: string[] }>(`${this.baseUrl}/auth/verify-token`, {
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
