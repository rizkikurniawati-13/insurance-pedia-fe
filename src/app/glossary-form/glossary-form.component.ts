import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { GlossariumService, Glossarium } from './glossary.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';



@Component({
  selector: 'app-glossary-form',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './glossary-form.component.html',
  providers: [GlossariumService]
})
export class GlossaryFormComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private fb = inject(FormBuilder);
  private glossariumService = inject(GlossariumService);


  glossariumForm: FormGroup = this.fb.group({
    term: ['', Validators.required],
    definition: ['', Validators.required],
    category: [''],
    reference: [''],
    status: ['']
  });

  onSubmit(): void {
    if (this.glossariumForm.valid) {
      const data: Glossarium = this.glossariumForm.value;

      this.glossariumService.create(data).subscribe({
        next: (res) => {
          console.log('Sukses:', res);
          this.glossariumForm.reset();
        },
        error: (err) => {
          console.error('Gagal:', err);
        }
      });
    } else {
      console.warn('Form tidak valid!');
    }
  }
}
