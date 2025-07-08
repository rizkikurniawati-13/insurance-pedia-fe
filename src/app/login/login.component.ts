import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  loading = false; 
  showPassword = false; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
  return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if ('token' in res) {
      // Login langsung sukses
      if (res.token) {
          localStorage.setItem('token', res.token);
        } else {
          console.error('Token undefined saat login tanpa MFA');
        }

      localStorage.setItem('userName', this.loginForm.value.email);
      this.router.navigate(['/glossary']);
      } else if ('mfaRequired' in res) {
        // Butuh MFA → simpan email sementara & redirect ke halaman OTP
        localStorage.setItem('pendingMfaEmail', this.loginForm.value.email);
        this.router.navigate(['/mfa']);
      }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Email atau password salah';
      }
    });
  }




  
}
