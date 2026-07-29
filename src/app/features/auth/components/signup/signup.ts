import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private authService: Main,
    private router: Router
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

    this.authService.register(this.signupForm.value).subscribe({

      next: (response: any) => {
        console.log(response);

        alert('Registration Successful');

        this.onSwitchToLogin();
      },

      error: (err: { error: { message: string; }; }) => {
        console.log(err);
        this.signupError =
          err.error?.message || 'Registration Failed';
      }

    });
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }
}