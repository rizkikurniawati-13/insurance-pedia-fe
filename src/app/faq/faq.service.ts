import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment.prod';

export interface questionModel {
  question: string;
  createdBy: string;
}

export interface FaqAnswer {
  id: number;
  answer: string;
  answeredBy: string;
  fileUrl?: string;
}

export interface FaqQuestion {
  id: number;
  question: string;
  createdBy: string;
  answers: FaqAnswer[];
}

export interface PageableFaqResponse {
  data: FaqQuestion[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class FaqService {
  private apiUrl = 'http://localhost:8080/api/faq';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
  
  constructor(private http: HttpClient) {}

  getFaqs(page: number = 0, size: number = 10, search: string = ''): Observable<PageableFaqResponse> {
  let url = `${this.apiUrl}/pageable?page=${page}&size=${size}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return this.http.get<PageableFaqResponse>(url, {
    headers: this.getHeaders()
  });
  }


  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/questions`, { headers: this.getHeaders() });
  }

  getAnswers(questionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/answers/${questionId}`, { headers: this.getHeaders() });
  }

  submitQuestion(data: questionModel): Observable<any> {   
    return this.http.post(`${this.apiUrl}/questions`, data, { headers: this.getHeaders() });
  }

  submitAnswer(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/answers`, data, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token // ✅ hanya token
    })
  });
  }
}
