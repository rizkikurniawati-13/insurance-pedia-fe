import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';

@Injectable({ providedIn: 'root' })
export class CrosswordService {
  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getPuzzle(id: string) {
    return this.http.get<any>(`${this.baseUrl}/crossword/${id}`, { headers: this.getHeaders() });
  }
}
