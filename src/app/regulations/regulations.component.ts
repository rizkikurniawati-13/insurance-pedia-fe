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
  pagedRegulations: Regulation[] = [];

  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  totalItems: number = 0;

  constructor(private router: Router, private regulationService: RegulationService) { }

  ngOnInit(): void {
    this.loadRegulation();
  }

  onSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  loadRegulation() {
    this.regulationService.getRegulationPageable(this.currentPage, this.pageSize, this.searchText).subscribe(
      (response) => {
        this.pagedRegulations = response.data;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      },
      error => {
        console.error('Error fetching regulations', error);
      }
    );
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadRegulation();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRegulation();
  }

  get totalPagesArray(): number[] {
    const maxVisible = 10;
    const half = Math.floor(maxVisible / 2);

    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }


  onSearchChange() {
    this.currentPage = 1;
    this.loadRegulation();
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
    this.router.navigate(['/regulations-form'])
  }

}
