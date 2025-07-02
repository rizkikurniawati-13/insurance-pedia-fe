import { Component, OnInit } from '@angular/core';
import { PuzzleService } from './puzzle.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-puzzle',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.css'
})
export class PuzzleComponent implements OnInit {

  puzzle: any;
  userAnswer: string = '';
  feedback: string = '';
  category: string = 'logic';
  level: number = 1;

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    this.loadPuzzle();
  }

  loadPuzzle() {
    this.feedback = '';
    this.userAnswer = '';
    this.puzzleService.getRandomPuzzle(this.category, this.level).subscribe({
      next: data => {
        console.log('Puzzle loaded:', data);
        this.puzzle = data;
      },
      error: err => {
        console.error('Failed to load puzzle:', err);
        this.feedback = 'Gagal mengambil puzzle.';
      }
    });
  }


  submit() {
    if (!this.userAnswer.trim()) return;
    this.puzzleService.submitAnswer(this.puzzle.id, this.userAnswer).subscribe({
      next: res => {
        this.feedback = res.message;
        if (res.correct) setTimeout(() => this.loadPuzzle(), 1500);
      },
      error: () => this.feedback = 'Gagal mengirim jawaban.'
    });
  }

}
