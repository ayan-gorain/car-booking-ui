import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Main } from '../../../service/main';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {

  resetPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: Main,
    private cdr: ChangeDetectorRef
  ) {

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    // Read token from query parameters (e.g. ?token=xxx)
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
    });

    // Also fall back to route params (e.g. /reset-password/:token) if query param not present
    this.route.paramMap.subscribe(params => {
      const routeToken = params.get('token');
      if (routeToken) {
        this.token = routeToken;
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (
      this.resetPasswordForm.value.password !==
      this.resetPasswordForm.value.confirmPassword
    ) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Reset token is missing. Please check your reset link.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.resetPasswordForm.value.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Password has been reset successfully. Redirecting to login...';
        this.resetPasswordForm.reset();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 3000);
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Reset password error:', err);
        try {
          if (err?.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
            this.errorMessage = err.error.errors.join('\n');
          } else {
            this.errorMessage = err?.error?.message || err?.message || 'Failed to reset password.';
          }
        } catch (e) {
          console.error('Error parsing reset password response:', e);
          this.errorMessage = 'Failed to reset password.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/auth']);
  }
}
