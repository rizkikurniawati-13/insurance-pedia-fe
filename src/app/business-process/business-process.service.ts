import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

export interface BusinessProcess {
  id: string;
  nodeId?: string;
  label: string;
  actor: string;
  description: string;
  reference?: string;
  duration?: string;
  sequence?: number;
  category?: string;
  processBusiness: string;
  insuranceType: string;
  status?: string;
}

export interface ProcessLink {
  id: string;
  linkId: string;
  label: string;
  source: BusinessProcess;
  target: BusinessProcess;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessProcessService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return headers;
  }

  getAllNodes(): Observable<BusinessProcess[]> {
    return this.http.get<BusinessProcess[]>(`${this.baseUrl}/business-processes/nodes`, {
      headers: this.getHeaders()
    });
  }

  getFilteredNodes(insuranceType: string, processBusiness: string): Observable<BusinessProcess[]> {
    const params = new HttpParams()
      .set('insuranceType', insuranceType)
      .set('processBusiness', processBusiness);

    return this.http.get<BusinessProcess[]>(`${this.baseUrl}/business-processes/nodes/filter`, {
      headers: this.getHeaders(),
      params
    });
  }

  getAllLinks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-processes/links`, {
      headers: this.getHeaders()
    });
  }

  getFilteredLinks(insuranceType: string, processBusiness: string): Observable<ProcessLink[]> {
    const params = new HttpParams()
      .set('insuranceType', insuranceType)
      .set('processBusiness', processBusiness);

    return this.http.get<ProcessLink[]>(`${this.baseUrl}/business-processes/links/filter`, {
      headers: this.getHeaders(),
      params
    });
  }




}
