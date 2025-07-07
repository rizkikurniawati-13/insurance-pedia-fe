import { Component, OnInit } from '@angular/core';
import { FaqService } from '../faq.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.css'
})
export class FaqListComponent implements OnInit {
  questions: any[] = [];
  answers: { [questionId: string]: string } = {};
  userName = '';

  // Tambahan untuk fitur "Jawab"
  selectedQuestion: any = null;
  answerText: string = '';
  fileUploads: { [key: string]: File } = {};

  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  totalItems: number = 0;


  constructor(private faqService: FaqService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFaqs();
    this.userName = localStorage.getItem('userName') || 'Anonymous';
  }

  getQuestions() {
    this.faqService.getQuestions().subscribe(res => this.questions = res);

  }

  gotoQuestion() {
    this.router.navigate(['/faq-admin'])
  }

  openAnswerForm(q: any) {
    this.selectedQuestion = q;
    this.answerText = '';
  }

  cancelAnswer() {
    this.selectedQuestion = null;
    this.answerText = '';
  }

  formatAnswer(text: string): string {
    return text.replace(/\n/g, '<br>');
  }


  submitAnswer(q: string) {
    const answer = this.answers[q];
    const file = this.fileUploads?.[q]; // optional
    const formData = new FormData();

    formData.append('questionId', q);
    formData.append('answer', answer);
    formData.append('answeredBy', this.userName); // dari JWT decoded

    if (file) {
      formData.append('file', file);
    }

    this.faqService.submitAnswer(formData).subscribe({
      next: () => {
        this.answers[q] = '';
        delete this.fileUploads[q];
        this.selectedQuestion = null;
        this.getQuestions();
      },
      error: (err) => {
        console.error('Upload error:', err);
      }
    });

  }

  onFileChange(event: any, questionId: string) {
    const file = event.target.files[0];
    if (file) {
      this.fileUploads[questionId] = file;
    }
  }


  loadFaqs() {
  const backendPage = this.currentPage - 1;
  this.faqService.getFaqs(backendPage, this.pageSize, this.searchText).subscribe(
    (res) => {
      this.questions = res.data;
      this.totalPages = res.totalPages;
      this.totalItems = res.totalItems;
    },
    err => console.error('Gagal load FAQ', err)
  );
}

onSearchChange() {
  this.currentPage = 1;
  this.loadFaqs();
}

onPageSizeChange() {
  this.currentPage = 1;
  this.loadFaqs();
}

changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.loadFaqs();
}

get totalPagesArray(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

}
