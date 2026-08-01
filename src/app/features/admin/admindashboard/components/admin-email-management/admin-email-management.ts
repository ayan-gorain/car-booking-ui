import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminEmailService } from '../../../services/admin-email.service';

@Component({
  selector: 'app-admin-email-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-email-management.html',
  styleUrl: './admin-email-management.css',
})
export class AdminEmailManagement implements OnInit, OnDestroy {
  adminEmails: string[] = [];
  addEmailForm: FormGroup;

  searchTerm: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;

  // Confirmation modal state for deletion
  emailToDelete: string | null = null;

  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private adminEmailService: AdminEmailService,
    private cdr: ChangeDetectorRef
  ) {
    this.addEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.sub = this.adminEmailService.adminEmails$.subscribe((emails) => {
      this.adminEmails = emails;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get filteredEmails(): string[] {
    if (!this.searchTerm.trim()) {
      return this.adminEmails;
    }
    const term = this.searchTerm.trim().toLowerCase();
    return this.adminEmails.filter((email) =>
      email.toLowerCase().includes(term)
    );
  }

  onAddEmail(): void {
    if (this.addEmailForm.invalid) {
      this.addEmailForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();

    const newEmail = this.addEmailForm.value.email;

    setTimeout(() => {
      const result = this.adminEmailService.addAdminEmail(newEmail);
      this.isSubmitting = false;

      if (result.success) {
        this.successMessage = result.message;
        this.addEmailForm.reset();
      } else {
        this.errorMessage = result.message;
      }

      this.cdr.detectChanges();

      // Clear alert messages after 4 seconds
      setTimeout(() => {
        this.successMessage = null;
        this.errorMessage = null;
        this.cdr.detectChanges();
      }, 4000);
    }, 400);
  }

  confirmDelete(email: string): void {
    this.emailToDelete = email;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.emailToDelete = null;
    this.cdr.detectChanges();
  }

  executeDelete(): void {
    if (!this.emailToDelete) return;

    const email = this.emailToDelete;
    this.emailToDelete = null;

    const result = this.adminEmailService.removeAdminEmail(email);

    if (result.success) {
      this.successMessage = result.message;
      this.errorMessage = null;
    } else {
      this.errorMessage = result.message;
      this.successMessage = null;
    }

    this.cdr.detectChanges();

    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 4000);
  }
}
