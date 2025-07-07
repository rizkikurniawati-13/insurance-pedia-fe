import { Component, OnInit } from '@angular/core';
import { AuditCaseService } from './audit-case.service';
import { Router } from '@angular/router';
import { AuditCase } from './audit-case.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Company, InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-case',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './audit-case.component.html',
  styleUrl: './audit-case.component.css'
})
export class AuditCaseComponent implements OnInit {
  companyMap: Map<string, string> = new Map();
  auditCases: AuditCase[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private auditCaseService: AuditCaseService, private router: Router,
    private companyService: InsuranceCompanyService
  ) { }

  ngOnInit(): void {
    this.loadAuditCase();
  }

  loadAuditCase() {
  this.auditCaseService.getPaged(this.currentPage - 1, this.pageSize).subscribe(
    (response) => {
      this.auditCases = response.data;
      this.totalPages = response.totalPages;
    },
    error => {
      console.error('Error fetching auditcase:', error);
    }
  );
  }

  changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.loadAuditCase();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadAuditCase();
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }





  addAuditCase() {
    this.router.navigate(['/audit-case-form']);
  }

  gotoDetail(id: string | undefined) {

    if (!id) {
      console.error('ID tidak valid');
      return;
    }

    localStorage.setItem('caseId', id);
    this.router.navigate(['/audit-case-detail']);

  }
}

