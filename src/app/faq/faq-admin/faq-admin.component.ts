import { Component } from '@angular/core';
import { FaqService } from '../faq.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

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

  answers: { [id: string]: string } = {};
  answerers: { [id: string]: string } = {};
  files: { [id: string]: File | null } = {};

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.faqService.getQuestions().subscribe(res => this.questions = res);
  }

  submitQuestion() {
    const data = { question: this.newQuestion, createdBy: this.createdBy };
    console.log(data);
    this.faqService.submitQuestion(data).subscribe(() => {          
      this.newQuestion = '';
      this.createdBy = '';
      this.loadQuestions();
    });
  }

  onFileChange(event: any, id: string) {
    this.files[id] = event.target.files[0];
  }

  submitAnswer(questionId: string) {
    const formData = new FormData();
    formData.append('answer', this.answers[questionId]);
    formData.append('answeredBy', this.answerers[questionId]);
    if (this.files[questionId]) {
      formData.append('file', this.files[questionId] as Blob);
    }

    this.faqService.submitAnswer(questionId, formData).subscribe(() => {
      this.answers[questionId] = '';
      this.answerers[questionId] = '';
      this.loadQuestions();
    });
  }

}
