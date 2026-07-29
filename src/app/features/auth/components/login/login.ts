import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
    private router: Router
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

        // Save JWT Token (change "token" if your backend returns another field)
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        this.router.navigate(['/dashboard']);
      },

      error: (err: { error: { message: string; }; }) => {
        this.isLoading = false;
        console.error(err);

        this.loginError =
          err.error?.message || 'Invalid email or password.';
      },
    });
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }
}