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

  filteredCompanies: InsuranceCompaniesModel[] = [];
  pagedCompanies: InsuranceCompaniesModel[] = [];

  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  
  constructor(private router: Router, private InsuranceCompanyService: InsuranceCompanyService) {}

  ngOnInit(): void {
    this.loadCompany();
    this.industryList;
  }

  loadCompany() {
    this.InsuranceCompanyService.getAll().subscribe(
      (data: any[]) => {      
        this.companies = data;
        this.filteredCompanies = data;
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
    this.filteredCompanies = this.companies.filter(r =>
      r.name.toLowerCase().includes(searchLower)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCompanies = this.filteredCompanies.slice(startIndex, endIndex);

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

  get industryList(): string[] {
    const industries = this.companies.map(c => c.type);
    return Array.from(new Set(industries));
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
