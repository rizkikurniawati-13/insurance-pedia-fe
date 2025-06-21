import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Regulation } from './regulations.model';

@Injectable({
  providedIn: 'root'
})
export class RegulationService {
  private apiUrl = 'http://localhost:8080/api/regulations'; // sesuaikan endpoint Spring Boot Anda

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAll(): Observable<Regulation[]> {
    return this.http.get<Regulation[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<Regulation> {
    return this.http.get<Regulation>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(regulation: Regulation): Observable<Regulation> {
    return this.http.post<Regulation>(this.apiUrl, regulation, { headers: this.getHeaders() });
  }

  update(id: string, regulation: Regulation): Observable<Regulation> {
    return this.http.put<Regulation>(`${this.apiUrl}/${id}`, regulation, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
