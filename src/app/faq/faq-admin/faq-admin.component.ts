import { Component } from '@angular/core';
import { FaqService } from '../faq.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-faq-admin',
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './faq-admin.component.html',
  styleUrl: './faq-admin.component.css'
})
export class FaqAdminComponent {

  questions: any[] = [];
  newQuestion = '';
  createdBy = '';
  userName = '';
  fileUploads: { [key: string]: File } = {};

  answers: { [id: string]: string } = {};
  answerers: { [id: string]: string } = {};
  files: { [id: string]: File | null } = {};

  constructor(private faqService: FaqService, private router: Router) { }

  ngOnInit(): void {
    this.loadQuestions();
    this.userName = localStorage.getItem('userName') || 'Anonymous';
  }

  loadQuestions() {
    this.faqService.getQuestions().subscribe(res => this.questions = res);
  }

  submitQuestion() {
  const data = {
    question: this.newQuestion,
    createdBy: this.userName
  };

  this.faqService.submitQuestion(data).subscribe({
    next: () => {
      this.newQuestion = '';
      this.loadQuestions();

      Swal.fire({
        icon: 'success',
        title: 'Pertanyaan dikirim!',
        text: 'Pertanyaan Anda berhasil disimpan.',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/faq-list'])
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengirim!',
        text: 'Terjadi kesalahan saat menyimpan pertanyaan.',
      });
    }
  });
}

  submitAnswer(questionId: string) {
    const answer = this.answers[questionId];
    const file = this.fileUploads?.[questionId]; // optional
    const formData = new FormData();

    formData.append('questionId', questionId);
    formData.append('answer', answer);
    formData.append('answeredBy', this.userName); // dari JWT decoded

    if (file) {
      formData.append('file', file);
    }

    this.faqService.submitAnswer(formData).subscribe({
      next: () => {
        this.answers[questionId] = '';
        delete this.fileUploads[questionId];
        this.loadQuestions();
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



}
