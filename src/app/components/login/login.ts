import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  @Output() switchToSignup = new EventEmitter<void>();

  loginForm: FormGroup;
  showLoginPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Login submitted:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSwitchToSignup() {
    this.switchToSignup.emit();
  }
}
