import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.prod';
import { FinancialReport } from './dashboard-bpui.model';

@Injectable({ providedIn: 'root' })
export class BpuiReportService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAllReports(): Observable<FinancialReport[]> {
    return this.http.get<FinancialReport[]>(`${this.baseUrl}/financial-reports`, {
      headers: this.getHeaders()
    });
  }
}
