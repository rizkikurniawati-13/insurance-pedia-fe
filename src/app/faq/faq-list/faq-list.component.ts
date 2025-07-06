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
export class FaqListComponent implements OnInit{
  questions: any[] = [];
  answers: { [questionId: string]: string } = {};
  userName = '';

  // Tambahan untuk fitur "Jawab"
  selectedQuestion: any = null;
  answerText: string = '';
  fileUploads: { [key: string]: File } = {};

  constructor(private faqService: FaqService, 
              private router: Router
  ) {}

  ngOnInit(): void {
    this.getQuestions();
    this.userName = localStorage.getItem('userName') || 'Anonymous';
  }

  getQuestions(){
    this.faqService.getQuestions().subscribe(res => this.questions = res);

  }

  gotoQuestion(){
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

  

  

}
