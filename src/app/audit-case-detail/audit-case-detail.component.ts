import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuditCaseService } from '../audit-case/audit-case.service';
import { Router } from '@angular/router';
import { InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';
import { AuditCase } from '../audit-case/audit-case.model';
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-audit-case-detail',
  imports: [SidebarComponent, CurrencyPipe],
  templateUrl: './audit-case-detail.component.html',
  styleUrl: './audit-case-detail.component.css'
})
export class AuditCaseDetailComponent implements OnInit {

  auditCase: any;

  constructor(private auditCaseService: AuditCaseService, private router: Router,
    private companyService: InsuranceCompanyService
  ) { }

  ngOnInit(): void {
    this.getAuditCasebyId();

  }

  getAuditCasebyId() {
    const caseId = localStorage.getItem('caseId');
    if (caseId) {
      this.auditCaseService.getById(caseId).subscribe(
        data => {
          console.log(data);
          
          this.auditCase = data;         
        },
        error => {
          console.error('Gagal mengambil detail audit case', error);
        }
      );
    } else {
      console.error('caseId tidak ditemukan');
    }
  }

  goBack(){
    this.router.navigate(['/audit-case'])
  }

}
