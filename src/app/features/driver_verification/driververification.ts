import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Main } from '../service/main';

type UploadField =
  | 'drivingLicenseFrontUrl'
  | 'drivingLicenseBackUrl'
  | 'governmentIdFrontUrl'
  | 'governmentIdBackUrl'
  | 'selfieUrl';

const FIELD_LABELS: Record<string, string> = {
  drivingLicenseNumber: 'Driving License Number',
  drivingLicenseFrontUrl: 'Driving License (Front)',
  drivingLicenseBackUrl: 'Driving License (Back)',
  governmentIdType: 'Government ID Type',
  governmentIdNumber: 'Government ID Number',
  governmentIdFrontUrl: 'Government ID (Front)',
  governmentIdBackUrl: 'Government ID (Back)',
  selfieUrl: 'Selfie',
};

@Component({
  selector: 'app-driververification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './driververification.html',
  styleUrl: './driververification.css',
})
export class Driververification {

  @ViewChild('cameraVideo') cameraVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('cameraCanvas') cameraCanvasRef!: ElementRef<HTMLCanvasElement>;

  verificationForm: FormGroup;

  governmentIdTypes = ['AADHAAR', 'PAN', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE'];

  previews: Record<UploadField, string | null> = {
    drivingLicenseFrontUrl: null,
    drivingLicenseBackUrl: null,
    governmentIdFrontUrl: null,
    governmentIdBackUrl: null,
    selfieUrl: null,
  };

  uploading: Record<UploadField, boolean> = {
    drivingLicenseFrontUrl: false,
    drivingLicenseBackUrl: false,
    governmentIdFrontUrl: false,
    governmentIdBackUrl: false,
    selfieUrl: false,
  };

  fileErrors: Record<UploadField, string | null> = {
    drivingLicenseFrontUrl: null,
    drivingLicenseBackUrl: null,
    governmentIdFrontUrl: null,
    governmentIdBackUrl: null,
    selfieUrl: null,
  };

  isSubmitting = false;
  verificationError: string | null = null;
  verificationSuccess: string | null = null;
  missingFields: string[] = [];

  // ── Camera state (selfie only) ──
  isCameraOpen = false;
  cameraError: string | null = null;
  private cameraStream: MediaStream | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: Main,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.verificationForm = this.fb.group({
      drivingLicenseNumber: ['', Validators.required],
      drivingLicenseFrontUrl: ['', Validators.required],
      drivingLicenseBackUrl: ['', Validators.required],
      governmentIdType: ['AADHAAR', Validators.required],
      governmentIdNumber: ['', Validators.required],
      governmentIdFrontUrl: ['', Validators.required],
      governmentIdBackUrl: ['', Validators.required],
      selfieUrl: ['', Validators.required],
    });
  }

  getFieldError(controlName: string): string | null {
    const control = this.verificationForm.get(controlName);

    if (!control || !(control.touched || control.dirty) || control.valid) {
      return null;
    }

    const label = FIELD_LABELS[controlName] || controlName;

    if (control.hasError('required')) {
      const isUploadField = controlName.endsWith('Url');
      return isUploadField
        ? `Please upload the ${label}.`
        : `${label} is required.`;
    }

    return `${label} is invalid.`;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.verificationForm.get(controlName);
    return !!control && (control.touched || control.dirty) && control.invalid;
  }

  isFormReadyToSubmit(): boolean {
    const anyUploading = Object.values(this.uploading).some((v) => v);
    return this.verificationForm.valid && !anyUploading && !this.isCameraOpen;
  }

  private computeMissingFields(): string[] {
    const missing: string[] = [];

    Object.keys(this.verificationForm.controls).forEach((key) => {
      const control = this.verificationForm.get(key);
      if (control && control.invalid) {
        missing.push(FIELD_LABELS[key] || key);
      }
    });

    return missing;
  }

  /**
   * STATIC — no upload API yet. Previews the image locally and
   * fills the field with the local preview URL. Used by license
   * and government ID uploads, and by the selfie's "Upload Photo" option.
   */
  onFileSelected(event: Event, controlName: UploadField): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.applyLocalFile(file, controlName);
  }

  private applyLocalFile(file: File | Blob, controlName: UploadField): void {
    const previewUrl = URL.createObjectURL(file);
    this.previews[controlName] = previewUrl;
    this.fileErrors[controlName] = null;
    this.uploading[controlName] = true;

    const control = this.verificationForm.get(controlName);
    control?.setValue('');
    control?.markAsTouched();
    control?.markAsDirty();

    this.cdr.detectChanges();

    setTimeout(() => {
      this.uploading[controlName] = false;
      control?.setValue(previewUrl);
      this.fileErrors[controlName] = null;
      this.cdr.detectChanges();
    }, 400);
  }

  // ── Camera controls (selfie only) ──

  async openCamera(): Promise<void> {
    this.cameraError = null;

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      this.isCameraOpen = true;
      this.cdr.detectChanges();

      // Wait for the <video> element to render, then attach the stream
      setTimeout(() => {
        if (this.cameraVideoRef?.nativeElement) {
          this.cameraVideoRef.nativeElement.srcObject = this.cameraStream;
        }
      });
    } catch (err) {
      this.cameraError = 'Unable to access camera. Please check permissions or use "Upload Photo" instead.';
      this.cdr.detectChanges();
    }
  }

  capturePhoto(): void {
    const video = this.cameraVideoRef?.nativeElement;
    const canvas = this.cameraCanvasRef?.nativeElement;

    if (!video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        this.applyLocalFile(blob, 'selfieUrl');
      }
      this.closeCamera();
    }, 'image/jpeg', 0.9);
  }

  closeCamera(): void {
    this.cameraStream?.getTracks().forEach((track) => track.stop());
    this.cameraStream = null;
    this.isCameraOpen = false;
    this.cdr.detectChanges();
  }

  retakeSelfie(): void {
    if (this.previews.selfieUrl) {
      URL.revokeObjectURL(this.previews.selfieUrl);
    }
    this.previews.selfieUrl = null;
    this.verificationForm.get('selfieUrl')?.setValue('');
    this.verificationForm.get('selfieUrl')?.markAsTouched();
  }

  // ── Submit ──

  onSubmit(): void {
    if (!this.isFormReadyToSubmit()) {
      this.verificationForm.markAllAsTouched();
      this.missingFields = this.computeMissingFields();

      this.verificationError =
        this.missingFields.length > 0
          ? `Please complete the following before submitting: ${this.missingFields.join(', ')}.`
          : 'Please wait for all uploads to finish.';

      this.cdr.detectChanges();
      return;
    }

    this.missingFields = [];
    this.isSubmitting = true;
    this.verificationError = null;
    this.verificationSuccess = null;

    this.authService.submitDriverVerification(this.verificationForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.verificationSuccess =
          res?.message || 'Verification submitted successfully! Redirecting...';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.verificationError =
          err?.error?.message || err?.message || 'Submission failed. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.closeCamera();
  }
}