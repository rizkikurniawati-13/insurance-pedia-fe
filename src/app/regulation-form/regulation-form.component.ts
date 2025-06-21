import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RegulationService } from '../regulations/regulation.service';

@Component({
  selector: 'app-regulation-form',
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent],
  templateUrl: './regulation-form.component.html',
  styleUrl: './regulation-form.component.css'
})
export class RegulationFormComponent implements OnInit {
  regulationForm!: FormGroup;
  regulationsTypes: string[] = [];
  today: Date = new Date();
  todayString: string = '';

  constructor(private fb: FormBuilder, 
    private regulationService: RegulationService) {}

  ngOnInit() {
    this.regulationsTypes = ['Undang-Undang Dasar 1945 (UUD 1945)', 'Ketetapan Majelis Permusyawaratan Rakyat (Ketetapan MPR)', 'Undang-Undang/Peraturan Pemerintah Pengganti Undang-Undang (Perppu)', 'Peraturan Pemerintah (PP)', 'Peraturan Presiden (Perpres)', 'Peraturan Daerah (Perda)', 'Peraturan Internal Organisasi/ Perusahaan']
    this.regulationForm = this.fb.group({
      title: ['', Validators.required],
      number: [''],
      type: [''],
      issuedDate: [
        '',
        [
          Validators.required,
          this.maxDateValidator(this.today)
        ],
      ],
      description: [''],
      fileName: [''],
      fileType: [''],
      fileBase64: ['']
    });
  }

  maxDateValidator(maxDate: Date) {
    return (control: any) => {
      if (!control.value) return null;
      const inputDate = new Date(control.value);
      return inputDate > maxDate ? { max: true } : null;
    };
  }

   onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.regulationForm.patchValue({
        fileName: file.name,
        fileType: file.type
      });

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // ambil base64 tanpa metadata
        this.regulationForm.patchValue({ fileBase64: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.regulationForm.valid) {
      this.regulationService.create(this.regulationForm.value).subscribe({
        next: (res) => {
          alert('Regulasi berhasil disimpan');
          this.regulationForm.reset();
        },
        error: (err) => {
          alert('Gagal menyimpan regulasi');
        }
      });
    }
  }


}
