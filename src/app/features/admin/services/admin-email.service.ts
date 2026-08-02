import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminEmailService {
  private readonly STORAGE_KEY = 'car_booking_admin_emails';

  private defaultEmails: string[] = [
    'goraiayan108@gmail.com',
    'ayan.2025.gorain@gmail.com',
  ];

  private adminEmailsSubject: BehaviorSubject<string[]>;
  public adminEmails$: Observable<string[]>;

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    let initialEmails: string[];

    if (saved) {
      try {
        initialEmails = JSON.parse(saved);
      } catch (e) {
        initialEmails = [...this.defaultEmails];
      }
    } else {
      initialEmails = [...this.defaultEmails];
      this.saveToStorage(initialEmails);
    }

    this.adminEmailsSubject = new BehaviorSubject<string[]>(initialEmails);
    this.adminEmails$ = this.adminEmailsSubject.asObservable();
  }

  /** Get current list of admin emails synchronously */
  getAdminEmails(): string[] {
    return this.adminEmailsSubject.getValue();
  }

  /** Add a new admin email address */
  addAdminEmail(email: string): { success: boolean; message: string } {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      return { success: false, message: 'Email address cannot be empty.' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const currentEmails = this.getAdminEmails();
    if (currentEmails.some((e) => e.toLowerCase() === trimmed)) {
      return { success: false, message: 'This email is already an admin.' };
    }

    const updated = [...currentEmails, trimmed];
    this.saveToStorage(updated);
    this.adminEmailsSubject.next(updated);

    return { success: true, message: `Successfully added ${trimmed} as Admin.` };
  }

  /** Remove an admin email address */
  removeAdminEmail(email: string): { success: boolean; message: string } {
    if (this.adminEmailsSubject.value.length <= 1) {
    return { success: false, message: 'At least one admin email must remain in the system.' };
  }
    const currentEmails = this.getAdminEmails();

    if (currentEmails.length <= 1) {
      return {
        success: false,
        message: 'Cannot delete the last remaining admin account.',
      };
    }

    const updated = currentEmails.filter(
      (e) => e.toLowerCase() !== email.toLowerCase()
    );

    if (updated.length === currentEmails.length) {
      return { success: false, message: 'Email address not found.' };
    }

    this.saveToStorage(updated);
    this.adminEmailsSubject.next(updated);

    return { success: true, message: `Successfully removed ${email}.` };
  }

  private saveToStorage(emails: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emails));
  }
}
