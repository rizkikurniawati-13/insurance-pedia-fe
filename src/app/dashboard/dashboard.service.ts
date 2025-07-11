import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceOverview } from './dashboard.model';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  uploadOverview(file: File, periode: string, createdBy: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('periode', periode);
    formData.append('createdBy', createdBy);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.post(`${this.baseUrl}/dashboard/upload-overview`, formData, { headers, responseType: 'text' });
  }

  getOverviewByPeriode(periode?: string): Observable<InsuranceOverview[]> {
    let params = new HttpParams();
    if (periode) {
      params = params.set('periode', periode);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});

    return this.http.get<InsuranceOverview[]>(`${this.baseUrl}/dashboard/overview`, {
      headers,
      params
    });
  }

  getOverviewTrend(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return this.http.get<any[]>(`${this.baseUrl}/dashboard/overview/trend`, { headers });
  }
}
