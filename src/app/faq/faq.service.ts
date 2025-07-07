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
  private baseUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
  
  constructor(private http: HttpClient) {}

  getFaqs(page: number = 0, size: number = 10, search: string = ''): Observable<PageableFaqResponse> {
  let url = `${this.baseUrl}/faq/pageable?page=${page}&size=${size}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return this.http.get<PageableFaqResponse>(url, {
    headers: this.getHeaders()
  });
  }


  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/faq/questions`, { headers: this.getHeaders() });
  }

  getAnswers(questionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/faq/answers/${questionId}`, { headers: this.getHeaders() });
  }

  submitQuestion(data: questionModel): Observable<any> {   
    return this.http.post(`${this.baseUrl}/faq/questions`, data, { headers: this.getHeaders() });
  }

  submitAnswer(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/faq/answers`, data, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token // ✅ hanya token
    })
  });
  }
}
