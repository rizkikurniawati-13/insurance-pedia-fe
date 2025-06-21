import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { RegulationService } from './regulation.service';
import { Regulation } from './regulations.model';


@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],  // ⬅️ Ini penting
  templateUrl: './regulations.component.html',
  styleUrl: './regulations.component.css'
})
export class RegulationsComponent implements OnInit {
  sidebarCollapsed = false;
  regulations: Regulation[]= [];

  @Input() publishers: string[] = [];
  @Input() years: number[] = [];

  selectedPublisher: string = '';
  selectedYear: number | '' = '';

  @Output() filterChange = new EventEmitter<{ publisher: string, year: number | '' }>();

  constructor(private router: Router, private regulationService: RegulationService) {}
  ngOnInit(): void {
    this.loadRegulation();
  }

  filteredRegulations = [...this.regulations];

  applyFilter() {
    this.filteredRegulations = this.regulations.filter(reg => {
      const matchPublisher = this.selectedPublisher ? reg.type === this.selectedPublisher : true;
      // const matchYear = this.selectedYear ? reg.issuedDate === this.selectedYear : true;
      // return matchPublisher && matchYear;
    });
  }

  onSidebarCollapsed(collapsed: boolean) {
  this.sidebarCollapsed = collapsed;
  }

  loadRegulation() {
    this.regulationService.getAll().subscribe(
      (data: any[]) => {      
        this.regulations = data;       
      },
      error => {
        console.error('Error fetching company', error)
      }
    )
  }

  downloadFile(reg: Regulation): void {
  if (!reg.fileBase64 || !reg.fileName || !reg.fileType) {
    alert('File tidak tersedia.');
    return;
  }

  const byteCharacters = atob(reg.fileBase64);
  const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: reg.fileType });

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = reg.fileName;
  link.click();
  }

  previewPdf(reg: Regulation): void {
  if (!reg.fileBase64 || !reg.fileType) {
    alert('File tidak tersedia.');
    return;
  }

  const byteCharacters = atob(reg.fileBase64);
  const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: reg.fileType });

  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
  }

  goToFormRegulation(){
    console.log('masuk sini');
    
    this.router.navigate(['/regulations-form'])
  }





}
