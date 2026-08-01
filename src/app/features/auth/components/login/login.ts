import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Main } from '../../../service/main';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @Output() switchToSignup = new EventEmitter<void>();

  loginForm: FormGroup;
  showLoginPassword = false;
  loginError: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Main,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError = null;
    this.isLoading = true;

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log('Login Success:', response);

        // Save JWT Token from login response (support both wrapped and unwrapped formats)
        if (response?.data?.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
        } else if (response?.accessToken) {
          localStorage.setItem('token', response.accessToken);
        }

        // Store userId for easy access (fallback for profile loading)
        const user = response?.data?.user || response?.user;
        console.log('Extracted user object:', user); 

        if (user?.id) {
          localStorage.setItem('userId', user.id);
        }

        // Cache the full user object so the navbar (and anywhere else)
        // can render instantly without waiting on a getUserById call
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        if (response?.data?.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        } else if (response?.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },

      error: (err: any) => {
        this.isLoading = false;
        console.error('Login error:', err);
        try {
          if (err?.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
            this.loginError = err.error.errors.join('\n');
          } else {
            this.loginError = err?.error?.message || err?.message || 'Invalid email or password.';
          }
        } catch (e) {
          console.error('Error parsing login response:', e);
          this.loginError = 'Invalid email or password.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }
}