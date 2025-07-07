import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';

@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getRandomPuzzle(category: string, level: number) {
    return this.http.get<any>(`${this.baseUrl}/puzzle/random?category=${category}&level=${level}`, { headers: this.getHeaders() });
  }

  submitAnswer(puzzleId: string, answer: string) {
    return this.http.post<any>(`${this.baseUrl}/puzzle/submit`, {
      puzzleId,
      answer
    }, { headers: this.getHeaders() });
  }
}
