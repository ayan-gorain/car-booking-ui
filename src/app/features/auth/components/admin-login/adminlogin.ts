import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminEmailService } from '../../../admin/services/admin-email.service';


@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./adminlogin.html",
  styleUrl: "./adminlogin.css",
})
export class Adminlogin implements OnInit, OnDestroy {
  adminEmails: string[] = [];

  otpForm: FormGroup;

  // Email Selection State
  selectedEmail: string | null = null;
  emailSelectionError: string | null = null;
  isSendingOTP = false;

  // OTP State
  otpSent = false;
  otpError: string | null = null;
  isVerifyingOTP = false;
  isResendingOTP = false;
  loginSuccess: string | null = null;

  // OTP Timer
  otpTimeRemaining = 300; // 5 minutes
  private otpTimer: any = null;

  // Resend Timer
  resendTimer = 0;
  canResendOTP = false;
  private resendTimerInterval: any = null;

  // Demo OTP for testing
  demoOTP = '123456';
  private generatedOTP = '123456';
  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private adminEmailService: AdminEmailService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/)]],
    });
  }

  ngOnInit(): void {
    this.sub = this.adminEmailService.adminEmails$.subscribe((emails) => {
      this.adminEmails = emails;
      if (emails.length > 0 && !this.selectedEmail) {
        this.selectedEmail = emails[0];
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.stopOtpTimer();
    this.stopResendTimer();
    this.sub?.unsubscribe();
  }

  // ========== EMAIL SELECTION ==========

  selectEmail(email: string): void {
    this.selectedEmail = email;
    this.emailSelectionError = null;
  }

  sendOTP(): void {
    if (!this.selectedEmail) {
      this.emailSelectionError = 'Please select an email address.';
      this.cdr.detectChanges();
      return;
    }

    this.isSendingOTP = true;
    this.emailSelectionError = null;
    this.cdr.detectChanges();

    // Demo: Simulate OTP sending & auto-fill fake OTP
    setTimeout(() => {
      this.isSendingOTP = false;
      this.otpSent = true;
      this.fillDemoOTP();
      this.startOtpTimer();
      this.startResendTimer();
      this.cdr.detectChanges();
      console.log('OTP sent to:', this.selectedEmail);
      console.log('Demo OTP:', this.generatedOTP);
    }, 1200);
  }

  fillDemoOTP(): void {
    this.otpForm.get('otp')?.setValue(this.demoOTP);
    this.otpForm.get('otp')?.markAsTouched();
    this.cdr.detectChanges();
  }

  // ========== OTP VERIFICATION ==========

  onOTPInput(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    this.otpForm.get('otp')?.setValue(value);
    this.cdr.detectChanges();
  }

  getFieldError(controlName: string): string | null {
    const control = this.otpForm.get(controlName);

    if (!control || !(control.touched || control.dirty) || control.valid) {
      return null;
    }

    if (controlName === 'otp') {
      if (control.hasError('required')) {
        return 'OTP is required.';
      }
      if (control.hasError('minlength') || control.hasError('maxlength')) {
        return 'OTP must be 6 digits.';
      }
      if (control.hasError('pattern')) {
        return 'OTP must contain only digits.';
      }
    }

    return null;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.otpForm.get(controlName);
    return !!control && (control.touched || control.dirty) && control.invalid;
  }

  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isVerifyingOTP = true;
    this.otpError = null;
    this.cdr.detectChanges();

    const enteredOTP = this.otpForm.get('otp')?.value;

    // Demo: Verify OTP
    setTimeout(() => {
      this.isVerifyingOTP = false;

      if (enteredOTP === this.generatedOTP) {
        this.loginSuccess = 'Login successful! Redirecting to admin dashboard...';
        this.stopOtpTimer();
        this.stopResendTimer();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 1500);
      } else {
        this.otpError = 'Invalid OTP. Please check and try again.';
        this.otpForm.get('otp')?.setValue('');
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  resendOTP(): void {
    if (!this.canResendOTP) {
      return;
    }

    this.isResendingOTP = true;
    this.otpError = null;
    this.cdr.detectChanges();

    // Demo: Resend OTP
    setTimeout(() => {
      this.isResendingOTP = false;
      this.fillDemoOTP();
      this.otpTimeRemaining = 300; // Reset timer to 5 minutes
      this.startOtpTimer();
      this.resetResendTimer();
      this.cdr.detectChanges();
      console.log('OTP resent to:', this.selectedEmail);
      console.log('Demo OTP:', this.generatedOTP);
    }, 1000);
  }

  backToEmailSelection(): void {
    this.otpSent = false;
    this.otpError = null;
    this.otpForm.reset();
    this.stopOtpTimer();
    this.stopResendTimer();
    this.otpTimeRemaining = 300;
    this.cdr.detectChanges();
  }

  // ========== TIMERS ==========

  private startOtpTimer(): void {
    this.stopOtpTimer();

    this.otpTimer = setInterval(() => {
      this.otpTimeRemaining--;

      if (this.otpTimeRemaining <= 0) {
        this.stopOtpTimer();
        this.otpError = 'OTP expired. Please request a new OTP.';
        this.backToEmailSelection();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  private stopOtpTimer(): void {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
      this.otpTimer = null;
    }
  }

  private startResendTimer(): void {
    this.resetResendTimer();
  }

  private resetResendTimer(): void {
    this.stopResendTimer();
    this.canResendOTP = false;
    this.resendTimer = 60; // 60 seconds before can resend

    this.resendTimerInterval = setInterval(() => {
      this.resendTimer--;

      if (this.resendTimer <= 0) {
        this.stopResendTimer();
        this.canResendOTP = true;
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  private stopResendTimer(): void {
    if (this.resendTimerInterval) {
      clearInterval(this.resendTimerInterval);
      this.resendTimerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ========== NAVIGATION ==========

  goBackToAuth(): void {
    this.router.navigate(['/auth']);
  }

  // ========== API CALLS (TODO) ==========

  // private loadAdminEmails(): void {
  //   this.authService.getAdminEmails().subscribe({
  //     next: (emails: string[]) => {
  //       this.adminEmails = emails;
  //     },
  //     error: (err: any) => {
  //       console.error('Failed to load admin emails:', err);
  //     },
  //   });
  // }
}