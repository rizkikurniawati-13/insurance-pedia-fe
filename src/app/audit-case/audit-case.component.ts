import { Component, OnInit } from '@angular/core';
import { AuditCaseService } from './audit-case.service';
import { Router } from '@angular/router';
import { AuditCase } from './audit-case.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Company, InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';

@Component({
  selector: 'app-audit-case',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './audit-case.component.html',
  styleUrl: './audit-case.component.css'
})
export class AuditCaseComponent implements OnInit {
  auditCase: AuditCase[] = [];
  companyMap: Map<string, string> = new Map();

  constructor(private auditCaseService: AuditCaseService, private router: Router,
    private companyService: InsuranceCompanyService
  ) { }

  ngOnInit(): void {
    this.loadAuditCase();
  }

  loadAuditCase() {
    this.auditCaseService.getAll().subscribe(
      (data: AuditCase[]) => {
        this.auditCase = data;
      },
      error => {
        console.error('Error fetching auditcase:', error);
      }
    );
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

