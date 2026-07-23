import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  @Output() switchToLogin = new EventEmitter<void>();

  signupForm: FormGroup;
  showSignupPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup submitted:', this.signupForm.value);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }
}
