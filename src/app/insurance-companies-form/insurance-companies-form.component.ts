import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';
import { CommonModule } from '@angular/common';
import { InsuranceCompaniesModel, ProductCategoriesModel, ProductsModel } from '../insurance-companies-detail/insurance-companies.model';
import { Route } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-insurance-companies-form', 
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './insurance-companies-form.component.html',
  styleUrl: './insurance-companies-form.component.css'
})
export class InsuranceCompaniesFormComponent implements OnInit {
  companyForm!: FormGroup;
  insuranceTypes: string[] = [];
  insuranceCompany: InsuranceCompaniesModel[]= [];
  insuranceStatus: string[] = [];
  ownershipType: string[] =[];
  shariaType: string[]=[];
  investmentType: string[]= [];
  today: Date = new Date();
  todayString: string = '';
  products: ProductsModel[] = [];
  productsCategory: ProductCategoriesModel[]=[];
  selectedProductIds: string[] = [];

  constructor(private fb: FormBuilder, private InsuranceCompanyService: InsuranceCompanyService  ) {}

  ngOnInit(): void {
  this.getAllProducts();
  this.getAllProductsCategoris();
  this.insuranceTypes = ['UMUM', 'JIWA', 'REINSURANCE', 'BROKER', 'AGENT', 'SOSIAL', 'WAJIB', 'PENJAMINAN'];
  this.insuranceStatus = ['Aktif', 'Tidak Aktif'];
  this.ownershipType = ['BUMN', 'Non BUMN'];
  this.shariaType = ['Syariah', 'Konvensional'];
  this.investmentType = ['PMA', 'PMN'];

  this.companyForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      address: [''],
      contact: [''],
      npwp: [''],
      licenseNumber: [''],
      type: ['', Validators.required],
      establishedDate: [
        '',
        [
          Validators.required,
          this.maxDateValidator(this.today)
        ]
      ],
      status: ['',
        [
          Validators.required
        ]
      ],
      ownershipType: ['',
        [
          Validators.required
        ]],
      shariaType: ['',
        [
          Validators.required
        ]],
      investmentType: ['',
        [
          Validators.required
        ]],
      products: this.fb.array([])
    });
    
  }

  maxDateValidator(maxDate: Date) {
    return (control: any) => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      return inputDate > maxDate ? { max: true } : null;
    };
  }


  onSubmit(): void {
    if (this.companyForm.valid) {
      // ✨ Update nilai 'products' di form dari selectedProductIds
      const productArray = this.companyForm.get('products') as FormArray;
      productArray.clear();
      this.selectedProductIds.forEach(id => {
        productArray.push(new FormControl({ id })); // 👈 pastikan sesuai dengan yang diterima backend
      });
      this.InsuranceCompanyService.create(this.companyForm.value).subscribe({
        next: (data) => {
          alert('Company berhasil disimpan!');
          this.companyForm.reset();
          this.selectedProductIds = [];
        },
        error: (err) => {
          console.error(err);
          alert('Gagal menyimpan company');
        },
      });
    }
  }

  onProductCheck(event: any, category: any) {
  const productId = event.target.value;
  if (event.target.checked) {
    this.selectedProductIds.push(productId);
  } else {
    this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
  }
  }

  onCategoryCheck(event: any, category: any) {
    const isChecked = event.target.checked;
    const productIds: string[] = category.products.map((p: { id: string }) => p.id);

    if (isChecked) {
      this.selectedProductIds = [
        ...this.selectedProductIds,
        ...productIds.filter((id: string) => !this.selectedProductIds.includes(id))
      ];
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(
        (id: string) => !productIds.includes(id)
      );
    }
  } 

  isCategorySelected(category: any): boolean {
  return category.products.every((p: { id: string }) => 
    this.selectedProductIds.includes(p.id)
  );
  }

  getAllProducts() {
  this.InsuranceCompanyService.getAllProducts().subscribe({
    next: (data) => {
      this.products = data;
    },
    error: (err) => {
      console.error('Gagal mengambil produk:', err);
    }
  })};

getAllProductsCategoris() {
  this.InsuranceCompanyService.getAllProductCategories().subscribe({
    next: (data) => {
      this.productsCategory = data;
    },
    error: (err) => {
      console.error('Gagal mengambil kategori produk:', err);
    }
  })};



}
