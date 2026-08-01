import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Main } from '../../../service/main';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  forgotPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Main,
    private cdr: ChangeDetectorRef
  ) {

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

  }

  onSubmit() {

    if (this.forgotPasswordForm.valid) {

      this.isLoading = true;
      this.successMessage = null;
      this.errorMessage = null;

      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Password reset link has been sent. Redirecting to reset password...';
          const token = response.token || '';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/reset-password'], { queryParams: { token: token } });
          }, 2000);
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
            this.errorMessage = err.error.errors.join('\n');
          } else {
            this.errorMessage = err.error?.message || 'Failed to send password reset link.';
          }
          this.cdr.detectChanges();
        }
      });

    } else {

      this.forgotPasswordForm.markAllAsTouched();

    }

  }

  backToLogin() {
    this.router.navigate(['/auth']);
  }

}