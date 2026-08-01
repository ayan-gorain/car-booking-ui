import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Main } from '../../../service/main';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.css',
})
export class ProfileModal implements OnInit {

  @Output() closeModal = new EventEmitter<void>();

  userProfile: any = null;
  userRole = '';

  isProfileLoading = false;
  isEditMode = false;

  isUpdating = false;
  updateSuccess = false;
  updateError: string | null = null;

  profileForm: FormGroup;

  constructor(
    private authService: Main,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      bio: [''],
    });

    // Start disabled by default — belt and suspenders, so the form
    // is never accidentally editable before/without a successful load.
    this.profileForm.disable();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isProfileLoading = true;
    this.cdr.detectChanges();

    this.authService.getUserProfile().subscribe({
      next: (res: any) => {
        this.isProfileLoading = false;

        // Handle both wrapped ({ success, data }) and unwrapped responses
        const data = res?.data ?? res;
        const success = res?.success !== undefined ? res.success : !!data;

        if (success && data) {
          this.userProfile = data;

          if (
            this.userProfile.roles &&
            Array.isArray(this.userProfile.roles) &&
            this.userProfile.roles.length
          ) {
            this.userRole = this.userProfile.roles[0];
          }

          this.profileForm.patchValue({
            firstName: this.userProfile.firstName || '',
            lastName: this.userProfile.lastName || '',
            dateOfBirth: this.userProfile.dateOfBirth || '',
            gender: this.userProfile.gender || '',
            bio: this.userProfile.bio || '',
          });
        } else {
          this.updateError = res?.message || 'Unable to load profile.';
        }

        // Always end up disabled after a load, success or not
        this.isEditMode = false;
        this.profileForm.disable();

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProfileLoading = false;
        this.updateError =
          err?.error?.message || err?.message || 'Unable to load profile. Please try again.';
        this.profileForm.disable();
        this.cdr.detectChanges();
      },
    });
  }

  /** First click: just unlock the fields, no API call yet */
  private enableEditMode(): void {
    this.isEditMode = true;
    this.updateError = null;
    this.updateSuccess = false;
    this.profileForm.enable();
    this.cdr.detectChanges();
  }

  /** Revert to read-only without saving */
  cancelEdit(): void {
    this.isEditMode = false;
    this.updateError = null;
    this.profileForm.patchValue({
      firstName: this.userProfile?.firstName || '',
      lastName: this.userProfile?.lastName || '',
      dateOfBirth: this.userProfile?.dateOfBirth || '',
      gender: this.userProfile?.gender || '',
      bio: this.userProfile?.bio || '',
    });
    this.profileForm.disable();
    this.cdr.detectChanges();
  }

  /**
   * Same button drives both steps:
   * - Not in edit mode  -> just switches to edit mode (no API call)
   * - In edit mode      -> validates + calls the update API
   */
  onSubmit(): void {
    if (!this.isEditMode) {
      this.enableEditMode();
      return;
    }

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = null;

    this.authService.updateUserProfile(this.profileForm.getRawValue()).subscribe({
      next: (res: any) => {
        this.isUpdating = false;

        const data = res?.data ?? res;
        const success = res?.success !== undefined ? res.success : !!data;

        if (success && data) {
          this.userProfile = data;
          this.profileForm.patchValue(data);
          this.updateSuccess = true;
          this.isEditMode = false;
          this.profileForm.disable();

          setTimeout(() => this.onClose(), 1500);
        } else {
          this.updateError = res?.message || 'Failed to update profile.';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUpdating = false;
        this.updateError = err?.error?.message || 'Failed to update profile.';
        this.cdr.detectChanges();
      },
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}