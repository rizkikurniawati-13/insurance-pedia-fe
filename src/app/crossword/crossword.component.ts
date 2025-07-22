import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CrosswordService } from './crossword.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crossword',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './crossword.component.html',
  styleUrl: './crossword.component.css'
})
export class CrosswordComponent implements OnInit {

  puzzleId = '2354839e-f34b-4ed9-96ab-547639b7e922'; // nanti bisa dari route
  title = '';
  grid: any[][] = [];
  userGrid: (string | null)[][] = [];
  checked = false;
  score = 0;
  timeLeft = 180;
  timer: any;
  timeExpired = false;
  direction: 'across' | 'down' = 'across';

  @ViewChildren('inputBox') inputBoxes!: QueryList<ElementRef<HTMLInputElement>>;
  // @ViewChildren('inputBox') inputBoxes!: QueryList<ElementRef>;



  cluesAcross: any[] = [];
  cluesDown: any[] = [];

  constructor(private service: CrosswordService) { }

  ngOnInit(): void {
    this.loadPuzzle();
  }

  loadPuzzle() {
    this.service.getPuzzle(this.puzzleId).subscribe(puzzle => {
      this.title = puzzle.title;
      this.grid = JSON.parse(puzzle.gridJson);
      const clues = JSON.parse(puzzle.cluesJson);

      this.cluesAcross = clues.across;
      this.cluesDown = clues.down;

      // Init user grid
      this.userGrid = this.grid.map(row =>
        row.map(cell => (cell !== null ? '' : null))
      );
    });
    this.startTimer();
  }

  isEditableCell(row: number, col: number): boolean {
    return this.grid[row][col] !== null;
  }

  getClueNumber(row: number, col: number): number | null {
    const across = this.cluesAcross.find(c => c.row === row && c.col === col);
    const down = this.cluesDown.find(c => c.row === row && c.col === col);

    if (across && down && across.number === down.number) return across.number;
    if (across) return across.number;
    if (down) return down.number;

    return null;
  }

  isCorrect(row: number, col: number): boolean {
    if (!this.checked) return false;
    const correctLetter = this.grid[row][col];
    const userLetter = this.userGrid[row][col];
    return correctLetter?.toUpperCase() === userLetter?.toUpperCase();
  }

  checkAnswer() {
    // this.checked = true;
    this.checked = true;
    this.score = 0;

    const allClues = [...this.cluesAcross, ...this.cluesDown];

    for (const clue of allClues) {
      const { row, col, direction, answer } = clue;
      let correct = true;

      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        const expected = answer[i].toUpperCase();
        const actual = (this.userGrid[r][c] || '').toUpperCase();

        if (expected !== actual) {
          correct = false;
          break;
        }
      }

      if (correct) {
        this.score += 10;
      }
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
        this.timeExpired = true;
        this.checkAnswer();
      }
    }, 1000);
  }

  handleInput(row: number, col: number) {
    const nextCol = col + 1;
    const nextInput = this.inputBoxes.find(input => {
      const el = input.nativeElement;
      const r = el.dataset['row'] ? +el.dataset['row'] : -1;
      const c = el.dataset['col'] ? +el.dataset['col'] : -1;
      return r === row && c === nextCol;
    });
    if (nextInput) {
      nextInput.nativeElement.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, row: number, col: number) {
  let nextRow = row;
  let nextCol = col;

  switch (event.key) {
    case 'PageDown':
    case 'ArrowDown':
      nextRow++;
      break;
    case 'PageUp':
    case 'ArrowUp':
      nextRow--;
      break;
    case 'ArrowRight':
      nextCol++;
      break;
    case 'ArrowLeft':
      nextCol--;
      break;
    default:
      return;
  }

  event.preventDefault();

  // Batas valid grid
  const maxRow = this.grid.length;
  const maxCol = this.grid[0]?.length ?? 0;

  if (
    nextRow < 0 || nextRow >= maxRow ||
    nextCol < 0 || nextCol >= maxCol ||
    this.grid[nextRow][nextCol] === null
  ) {
    return;
  }

  const nextInput = this.inputBoxes.find(input => {
    const el = input.nativeElement;
    const r = +(el.dataset?.['row'] ?? -1);
    const c = +(el.dataset?.['col'] ?? -1);
    return r === nextRow && c === nextCol;
  });

  if (nextInput) {
    nextInput.nativeElement.focus();
  } else {
  }
}



}
