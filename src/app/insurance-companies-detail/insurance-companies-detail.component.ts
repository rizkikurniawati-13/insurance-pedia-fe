import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { InsuranceCompanyService } from './insurance-companies.service';
import { InsuranceCompaniesModel } from './insurance-companies.model';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance-companies-detail',
  imports: [SidebarComponent, CommonModule],
  templateUrl: './insurance-companies-detail.component.html',
  styleUrl: './insurance-companies-detail.component.css'
})
export class InsuranceCompaniesDetailComponent implements OnInit {
  company: InsuranceCompaniesModel = {} as InsuranceCompaniesModel;

  constructor(private InsuranceCompanyService: InsuranceCompanyService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.onGetCompanybyId();
  }

  onGetCompanybyId(): void {
  const companyId = localStorage.getItem('companyId');
  if (companyId) {
    this.InsuranceCompanyService.getById(companyId).subscribe({
      next: (data) => {
        this.company = data;        
      },
      error: (err) => {
        alert(err.message);
      }
    });
  } else {
    alert('ID perusahaan tidak ditemukan di localStorage!');
  }
}

}
