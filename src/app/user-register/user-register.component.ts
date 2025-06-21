import { Component, OnInit } from '@angular/core';
import { User } from '../user-management/user-management.service';
import { FormControl, FormArray, FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { UserService } from '../user-management/user-management.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  imports: [SidebarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  users: User[] = [];
  availablerole: string[] = []; 
  selectedrole: string[] = [];
  showPassword: boolean = true;
  showConfirmPassword: boolean = true;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required],
      role: this.fb.array([], Validators.required) // Initialize as FormArray
    }, { validators: this.passwordMatchValidator });

    // Add personalInfoValidator separately to ensure it updates dynamically
    this.registrationForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator(),
      this.personalInfoValidator()
    ]);
  }

  ngOnInit(): void {
  this.availablerole = ['ADMIN', 'AUDITOR'];

  this.registrationForm.get('name')?.valueChanges.subscribe(() => {
      this.registrationForm.get('password')?.updateValueAndValidity();
    });
    this.registrationForm.get('email')?.valueChanges.subscribe(() => {
      this.registrationForm.get('password')?.updateValueAndValidity();
    });

  }

  passwordStrengthValidator() {
    return (control: any) => {
      const value = control.value || '';
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) ? null : { passwordStrength: true };
    };
  }

  personalInfoValidator() {
    return (control: any) => {
      const password = control.value || '';
      const name = this.registrationForm?.get('name')?.value || '';
      const email = this.registrationForm?.get('email')?.value || '';
      const emailName = email.split('@')[0];

      const nameParts = name.toLowerCase().split(' ').filter((part: string) => part.length > 2);
      const containsName = nameParts.some((part: string) => password.toLowerCase().includes(part));
      const containsEmail = emailName && password.toLowerCase().includes(emailName.toLowerCase());

      return (containsName || containsEmail) ? { containsPersonalInfo: true } : null;
    };
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  return group.get('password')?.value === group.get('confirmPassword')?.value
    ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
  this.submitted = true;
  if (this.registrationForm.invalid) {
    return;
  }
  if (this.registrationForm.valid) {
    const userData = {
      ...this.registrationForm.value,
      role: this.registrationForm.value.role // This is now an array
    };
    this.userService.createUser(userData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.onReset();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: error.error.error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
} 

  onReset() {
  this.submitted = false;
  this.registrationForm.reset();
  const roleArray = this.registrationForm.get('role') as FormArray;
  roleArray.clear(); // Clear all controls in the FormArray
  this.selectedrole = [];
  }

  get f() {
  return this.registrationForm.controls;
  }

  onRoleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const roleArray = this.registrationForm.get('role') as FormArray;

  if (target.checked) {
    roleArray.push(this.fb.control(target.value));
  } else {
    const index = roleArray.controls.findIndex(x => x.value === target.value);
    if (index !== -1) {
      roleArray.removeAt(index);
    }
  }
}


}
