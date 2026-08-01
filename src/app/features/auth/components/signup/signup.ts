import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { Main } from '../../../service/main';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  @Output() switchToLogin = new EventEmitter<void>();

  signupForm: FormGroup;

  showSignupPassword = false;
  showConfirmPassword = false;
  signupError: string | null = null;
  signupSuccess: string | null = null;
  isLoading = false;

 

  constructor(
    private fb: FormBuilder,
    private authService: Main,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

  }

 onSignup() {

  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    return;
  }

  if (
    this.signupForm.value.password !==
    this.signupForm.value.confirmPassword
  ) {
    this.signupError = 'Passwords do not match';
    return;
  }

  this.signupError = null;
  this.signupSuccess = null;
  this.isLoading = true;

  this.authService.register(this.signupForm.value).subscribe({

    next: (response: any) => {
      this.isLoading = false;
      console.log(response);

      this.signupSuccess =
        response.message ||
        'Registration successful. Please verify your email. Redirecting to login...';

      this.signupForm.reset();
      this.cdr.detectChanges();

      // Redirect after 2.5 seconds
      setTimeout(() => {
        this.onSwitchToLogin();
      }, 2500);
    },

    error: (err: any) => {
      this.isLoading = false;
      console.error('Signup error:', err);
      try {
        if (err?.error?.errors && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          this.signupError = err.error.errors.join('\n');
        } else {
          this.signupError = err?.error?.message || err?.message || 'Registration Failed';
        }
      } catch (e) {
        console.error('Error parsing signup response:', e);
        this.signupError = 'Registration Failed';
      }
      this.cdr.detectChanges();
    }

  });
}

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }
}