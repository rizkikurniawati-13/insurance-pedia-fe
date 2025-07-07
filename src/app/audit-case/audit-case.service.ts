import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuditCase } from './audit-case.model';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuditCaseService {
  // private baseUrl = 'http://localhost:8080/api/audit-cases';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAll(): Observable<AuditCase[]> {
    return this.http.get<AuditCase[]>(`${this.baseUrl}/audit-cases`, { headers: this.getHeaders() });
  }

  getByCompany(companyId: string): Observable<AuditCase[]> {
    return this.http.get<AuditCase[]>(`${this.baseUrl}/audit-cases/company/${companyId}`, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<AuditCase> {
    return this.http.get<AuditCase>(`${this.baseUrl}/audit-cases/${id}`, { headers: this.getHeaders() });
  }

  create(companyId: string, auditCase: AuditCase): Observable<AuditCase> {
    return this.http.post<AuditCase>(`${this.baseUrl}/audit-cases/company/${companyId}`, auditCase, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/audit-cases/${id}`, { headers: this.getHeaders() });
  }
}
