import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

export interface User {
  id?: string;
  name: string;
  email: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  getUsersPageable(page: number, size: number, search?: string, role?: string): Observable<any> {
  const params: any = {
    page,
    size
  };

  if (search) {
    params.search = search;
  }

  if (role && role !== 'ALL') {
    params.role = role;
  }

  return this.http.get<any>(`${this.baseUrl}/users/pageable`, {
    headers: this.getHeaders(),
    params
  });
  }



  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  getUsersbyUsername(username :any): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/${username}`, { headers: this.getHeaders() });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/register`, user, { headers: this.getHeaders() });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }
}
