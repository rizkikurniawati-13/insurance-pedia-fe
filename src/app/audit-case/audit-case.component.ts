import { Component, OnInit } from '@angular/core';
import { AuditCaseService } from './audit-case.service';
import { Router } from '@angular/router';
import { AuditCase } from './audit-case.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-case',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './audit-case.component.html',
  styleUrl: './audit-case.component.css'
})
export class AuditCaseComponent implements OnInit {
  auditCase: AuditCase[] = [];

  constructor(private auditCaseService: AuditCaseService, private router: Router) {}

  ngOnInit(): void {
    this.loadAuditCase();
  }

   loadAuditCase() {
    this.auditCaseService.getAll().subscribe(
      (data: any[]) => {
        this.auditCase = data;
      },
      error => {
        console.error('Error fetching glossary:', error);
      }
    );
  }
  
  
  addAuditCase(){
    this.router.navigate(['/audit-case-form']);
  }
}

