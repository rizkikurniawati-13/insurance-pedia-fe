import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BusinessProcess {
  id: string;
  nodeId: string;
  label: string;
  actor: string;
  description: string;
  reference: string;
  duration: string;
  sequence: number;
  category: string;
  status: string;
}

export interface ProcessLink {
  id: string;
  source: string;
  target: string;
  label: string;
}

// Interface untuk node dari API
export interface ApiNode {
  id: string;
  label: string;
  actor?: string | null;
  description?: string | null;
  reference?: string | null;
  duration?: string | number | null;
  nodeId?: string | null;
  sequence?: string | null;
  category?: string | null;
  status?: string | null;
}

// Interface untuk link dari API
export interface ApiLink {
  id: string;
  linkId: string;
  label: string;
  source: ApiNode;
  target: ApiNode;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessProcessService {
  private apiUrl = 'http://localhost:8080/api/business-processes';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return headers;
  }

  getAll(): Observable<BusinessProcess[]> {
    return this.http.get<BusinessProcess[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getProcesses(): Observable<ApiNode[]> {
    return this.http.get<ApiNode[]>(`${this.apiUrl}/nodes`, { headers: this.getHeaders() });
  }

  getLinks(): Observable<ApiLink[]> {
    return this.http.get<ApiLink[]>(`${this.apiUrl}/links`, { headers: this.getHeaders() });
  }

  
}
