import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MfaComponent implements OnInit {
  otpForm: FormGroup;
  qrUrl: string = '';
  submitted = false;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    const email = localStorage.getItem('pendingMfaEmail');
    if (email) {
      this.http.get<{ qrUrl: string }>(`${this.authService['baseUrl']}/mfa/setup?email=${email}`).subscribe({
        next: (res) => {
          this.qrUrl = res.qrUrl;
        },
        error: () => {
          this.errorMessage = 'Gagal memuat QR Code';
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
  this.submitted = true;
  if (this.otpForm.invalid) return;

  const email = localStorage.getItem('pendingMfaEmail');
  if (!email) {
    this.errorMessage = 'Email tidak ditemukan. Silakan login ulang.';
    return;
  }

  const otp = this.otpForm.value.otp;

  this.authService.verifyMfa(email, otp).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.removeItem('pendingMfaEmail');
      this.authService.fetchRoles(res.token); // ⬅️ tambahkan ini
      this.router.navigate(['/glossary']);
    },
    error: () => {
      this.errorMessage = 'OTP salah atau sudah kadaluarsa.';
    }
  });
}

}
