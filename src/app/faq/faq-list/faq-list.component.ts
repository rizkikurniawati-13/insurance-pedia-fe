import { Component, OnInit } from '@angular/core';
import { FaqService } from '../faq.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-faq-list',
  imports: [FormsModule, CommonModule, SidebarComponent],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.css'
})
export class FaqListComponent implements OnInit{
  questions: any[] = [];

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqService.getQuestions().subscribe(res => this.questions = res);
  }

}
