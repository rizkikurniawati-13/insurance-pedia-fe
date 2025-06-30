import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { RegulationService } from './regulation.service';
import { Regulation } from './regulations.model';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id-ID');


@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],  // ⬅️ Ini penting
  templateUrl: './regulations.component.html',
  styleUrl: './regulations.component.css'
})
export class RegulationsComponent implements OnInit {
  sidebarCollapsed = false;
  regulations: Regulation[] = [];

  filteredRegulations: Regulation[] = [];
  pagedRegulations: Regulation[] = [];

  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private router: Router, private regulationService: RegulationService) { }
  ngOnInit(): void {
    this.loadRegulation();
  }

  onSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  loadRegulation() { 
    this.regulationService.getAll().subscribe(
      (data: any[]) => {
        this.regulations = data;
        this.filteredRegulations = data;
        this.updatePagination();
        this.applyFilter();
        
      },
      error => {
        console.error('Error fetching company', error)
      }
    )
  }

  applyFilter() {
    const searchLower = this.searchText.toLowerCase().trim();
    this.filteredRegulations = this.regulations.filter(r =>
      r.title.toLowerCase().includes(searchLower)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRegulations.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedRegulations = this.filteredRegulations.slice(startIndex, endIndex);
  }

  onPageSizeChange() {
    this.currentPage = 1;         // ⬅️ Reset ke halaman pertama
    this.updatePagination();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  goToFormRegulation() {
    console.log('masuk sini');

    this.router.navigate(['/regulations-form'])
  }

}
