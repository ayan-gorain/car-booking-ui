import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

  }

  onSubmit() {

    if (this.forgotPasswordForm.valid) {

      console.log(this.forgotPasswordForm.value);

      // API Call Here

      alert('Password reset link has been sent.');

    } else {

      this.forgotPasswordForm.markAllAsTouched();

    }

  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

}