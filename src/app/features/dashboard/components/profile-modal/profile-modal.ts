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
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  loadProfile(): void {
    const userId = this.getUserId();

    if (!userId) {
      this.updateError = 'User not found. Please login again.';
      return;
    }

    this.isProfileLoading = true;

    this.authService.getUserById(userId).subscribe({
      next: (res: any) => {
        this.isProfileLoading = false;

        if (res.success) {
          this.userProfile = res.data;

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

          // Start in read-only mode every time the modal opens
          this.isEditMode = false;
          this.profileForm.disable();
        } else {
          this.updateError = res.message || 'Unable to load profile.';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProfileLoading = false;
        this.updateError =
          err?.error?.message || err?.message || 'Unable to load profile. Please try again.';
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

        if (res.success) {
          this.userProfile = res.data;
          this.profileForm.patchValue(res.data);
          this.updateSuccess = true;
          this.isEditMode = false;
          this.profileForm.disable();

          setTimeout(() => this.onClose(), 1500);
        } else {
          this.updateError = res.message || 'Failed to update profile.';
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