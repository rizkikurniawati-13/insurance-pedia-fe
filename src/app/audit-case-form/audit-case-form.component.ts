import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditCaseService } from '../audit-case/audit-case.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { InsuranceCompanyService } from '../insurance-companies-detail/insurance-companies.service';
import { InsuranceCompaniesModel } from '../insurance-companies-detail/insurance-companies.model';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-audit-case-form',
  imports: [ReactiveFormsModule, SidebarComponent, CommonModule, NgSelectModule],
  templateUrl: './audit-case-form.component.html',
  styleUrl: './audit-case-form.component.css'
})
export class AuditCaseFormComponent implements OnInit {

  auditCaseForm!: FormGroup;
  companyId!: string;
  company: InsuranceCompaniesModel[]= [];
  violationTypes: string[] = [];
  formattedLossAmount: string = '0';
  years: number[] = [];
  instansiList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private auditCaseService: AuditCaseService,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: InsuranceCompanyService
  ) {}

  ngOnInit(): void {
    this.instansiList= [
    'BPK',
    'BPKP',
    'OJK',
    'KPK',
    'Kejaksaan Agung',
    'Inspektorat Jenderal',
    'Bareskrim Polri',
    'Auditor Independen (KAP)',
    'Komisi VI DPR RI',
    'Lembaga Swadaya Masyarakat (LSM)',
    'Internal Audit'
    ];
    this.generateYears();
    this.violationTypes = [
    'Korupsi',
    'Fraud (Kecurangan)',
    'Pelanggaran Prosedur',
    'Pelanggaran Hukum/Peraturan',
    'Kelalaian (Negligence)',
    'Benturan Kepentingan',
    'Tindak Pidana Lainnya'
    ];
    this.loadCompany();
    this.companyId = this.route.snapshot.paramMap.get('companyId') || '';
    this.auditCaseForm = this.fb.group({
      title: ['', Validators.required],
      companyId: ['', Validators.required],
      lossAmount: [0, [Validators.required, Validators.min(0)]],
      violationType: ['', Validators.required],
      violationYear: ['', [Validators.required, Validators.min(1900)]],
      discoveryYear: ['', [Validators.required, Validators.min(1900)]],
      discoveringInstitution: ['', Validators.required],
      defendants: ['', Validators.required],
      relatedProject: ['', Validators.required],
      findings: [''],
      recommendations: [''],
      followUp: [''],
    });
  }

  onSubmit(): void {
  if (this.auditCaseForm.valid) {
    const auditCase = this.auditCaseForm.value;
    this.auditCaseService.create(auditCase.companyId, auditCase).subscribe({
      next: () => {
        alert('Audit Case berhasil disimpan!');
        this.router.navigate(['/audit-case']);
      },
      error: (err) => {
        console.error(err);
        alert('Terjadi kesalahan saat menyimpan.');
      },
    });
  }
  }

  onLossAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Hapus semua karakter non-angka
  const cleaned = value.replace(/[^0-9]/g, '');
  const numeric = Number(cleaned);
  const validNumber = Math.max(numeric, 0);

  // Set ke form
  this.auditCaseForm.get('lossAmount')?.setValue(validNumber);

  // Format tampilan input
  this.formattedLossAmount = validNumber.toLocaleString('id-ID');
  }

  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.charCode;
  // Hanya izinkan angka (0–9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
  }


   loadCompany() {
    this.companyService.getAll().subscribe(
      (data: any[]) => {      
       this.company = data;
      },
      error => {
        console.error('Error fetching company', error)
      }
    )
  }


  generateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 1971;
    this.years = [];

    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

}
