import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, Observer } from 'rxjs';

export interface Glossarium {
  id?: string;
  term: string;
  definition: string;
  category?: string;
  reference?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlossariumService {
  private apiUrl = 'http://localhost:8080/api/glossarium';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAll(): Observable<Glossarium[]> {
    return this.http.get<Glossarium[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  create(data: Glossarium): Observable<Glossarium> {
    return this.http.post<Glossarium>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  update(id: string, data: Glossarium): Observable<Glossarium> {
    return this.http.put<Glossarium>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<Glossarium> {
    return this.http.get<Glossarium>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}