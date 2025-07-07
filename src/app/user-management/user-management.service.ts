import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private apiUrlRegister = 'http://localhost:8080/api/auth/register';
  private baseUrl = environment.apiUrl;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }
}
