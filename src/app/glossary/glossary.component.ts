import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { GlossariumService } from '../glossary-form/glossary.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
  standalone: true
})


export class GlossaryComponent implements OnInit {
  searchTerm: string = '';
  glossary: any[] = [];

  constructor(private glossaryService: GlossariumService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGlossary();
  }

   loadGlossary() {
    this.glossaryService.getAll().subscribe(
      (data: any[]) => {
        this.glossary = data;
      },
      error => {
        console.error('Error fetching glossary:', error);
      }
    );
  }
  
  
  get filteredGlossary() {
    return this.glossary.filter(item =>
      item.term.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addGlossary(){
    this.router.navigate(['/glossary-form']);
  }
}
