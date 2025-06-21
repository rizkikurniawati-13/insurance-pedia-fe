import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';
import { InsuranceCompaniesModel } from '../insurance-companies-detail/insurance-companies.model';

@Component({
  selector: 'app-insurance-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],  // ⬅️ Ini penting
  templateUrl: './insurance-companies.component.html',
  styleUrls: ['./insurance-companies.component.css']
})
export class InsuranceCompaniesComponent implements OnInit {
  companies: InsuranceCompaniesModel[] = [];

  searchTerm = '';
  selectedIndustry = '';
  constructor(private router: Router, private InsuranceCompanyService: InsuranceCompanyService) {}

  ngOnInit(): void {
    this.loadCompany();
    this.industryList;
  }

  loadCompany() {
    this.InsuranceCompanyService.getAll().subscribe(
      (data: any[]) => {      
        this.companies = data;
      },
      error => {
        console.error('Error fetching company', error)
      }
    )
  }

  get industryList(): string[] {
    const industries = this.companies.map(c => c.type);
    return Array.from(new Set(industries));
  }

  filteredCompanies() {
    return this.companies.filter(company =>
      company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedIndustry === '' || company.type === this.selectedIndustry)
    );
  }


  openAddForm() {
    alert('Open add form (to be implemented)');
  }

  editCompany(company: InsuranceCompaniesModel) {
    alert('Edit company: ' + company.name);
  }

  deleteCompany(id: string) {
    if (confirm('Are you sure to delete?')) {
      this.companies = this.companies.filter(c => c.id !== id);
    }
  }

  goToDetail(id: string) {
    localStorage.setItem('companyId', id);
    this.InsuranceCompanyService.getById(id).subscribe(
      data => {
        this.router.navigate(['/insurance-companies-detail']);
      },
      error => {
        alert(error);
      }
    )
  }

  onGoForm() {
    this.router.navigate(['/insurance-companies-form']);
  }
}
