import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableRegulationResponse, Regulation } from './regulations.model';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RegulationService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getAll(): Observable<Regulation[]> {
    return this.http.get<Regulation[]>(`${this.baseUrl}/regulations`, { headers: this.getHeaders() });
  }

  getRegulationPageable(page: number = 1, size: number = 10, search: string = ''): Observable<PageableRegulationResponse> {
      const backendPage = page - 1;
      let url = `${this.baseUrl}/regulations/pageable?page=${backendPage}&size=${size}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      return this.http.get<PageableRegulationResponse>(url, { headers: this.getHeaders() });

    }

  getById(id: string): Observable<Regulation> {
    return this.http.get<Regulation>(`${this.baseUrl}/regulations/${id}`, { headers: this.getHeaders() });
  }

  create(regulation: Regulation): Observable<Regulation> {
    return this.http.post<Regulation>(`${this.baseUrl}/regulations`, regulation, { headers: this.getHeaders() });
  }

  update(id: string, regulation: Regulation): Observable<Regulation> {
    return this.http.put<Regulation>(`${this.baseUrl}/regulations/${id}`, regulation, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/regulations/${id}`, { headers: this.getHeaders() });
  }
}
