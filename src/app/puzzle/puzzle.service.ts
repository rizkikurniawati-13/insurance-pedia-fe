import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private apiUrl = 'http://localhost:8080/api/puzzle';


  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getRandomPuzzle(category: string, level: number) {
    return this.http.get<any>(`${this.apiUrl}/random?category=${category}&level=${level}`, { headers: this.getHeaders() });
  }

  submitAnswer(puzzleId: string, answer: string) {
    return this.http.post<any>(`${this.apiUrl}/submit`, {
      puzzleId,
      answer
    }, { headers: this.getHeaders() });
  }
}
