import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type DriverStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_RESUBMISSION';

export interface DocumentReview {
  status: DocStatus;
  rejectionReason?: string;
}

export interface DriverVerificationItem {
  id: string;
  driverName: string;
  email: string;
  phoneNumber: string;
  submittedAt: string;
  status: DriverStatus;
  drivingLicenseNumber: string;
  drivingLicenseFrontUrl: string;
  drivingLicenseBackUrl: string;
  governmentIdType: string;
  governmentIdNumber: string;
  governmentIdFrontUrl: string;
  governmentIdBackUrl: string;
  selfieUrl: string;
  rejectionReason?: string;
  // Grouped per-document-type reviews (one decision per section, not per photo)
  docReviews: {
    drivingLicense: DocumentReview;
    governmentId: DocumentReview;
    selfie: DocumentReview;
  };
}

type DocGroupKey = keyof DriverVerificationItem['docReviews'];

const makePendingReviews = () => ({
  drivingLicense: { status: 'PENDING' as DocStatus },
  governmentId:   { status: 'PENDING' as DocStatus },
  selfie:         { status: 'PENDING' as DocStatus },
});

const makeApprovedReviews = () => ({
  drivingLicense: { status: 'APPROVED' as DocStatus },
  governmentId:   { status: 'APPROVED' as DocStatus },
  selfie:         { status: 'APPROVED' as DocStatus },
});

const makeWaitingResubmissionReviews = () => ({
  drivingLicense: { status: 'REJECTED' as DocStatus, rejectionReason: 'Blurred image, please resubmit.' },
  governmentId:   { status: 'APPROVED' as DocStatus },
  selfie:         { status: 'APPROVED' as DocStatus },
});

@Component({
  selector: 'app-driver-verification-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-verification-approval.html',
  styleUrl: './driver-verification-approval.css',
})
export class DriverVerificationApproval implements OnInit {

  drivers: DriverVerificationItem[] = [
    {
      id: 'DVR-1092',
      driverName: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phoneNumber: '9876543210',
      submittedAt: '2026-08-01 14:30',
      status: 'PENDING',
      drivingLicenseNumber: 'DL-1420110012345',
      drivingLicenseFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      drivingLicenseBackUrl:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      governmentIdType: 'AADHAAR',
      governmentIdNumber: '5412-8921-9012',
      governmentIdFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      governmentIdBackUrl:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      docReviews: makePendingReviews(),
    },
    {
      id: 'DVR-1093',
      driverName: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phoneNumber: '9812345678',
      submittedAt: '2026-08-01 11:15',
      status: 'PENDING',
      drivingLicenseNumber: 'DL-0420180098765',
      drivingLicenseFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      drivingLicenseBackUrl:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      governmentIdType: 'PAN',
      governmentIdNumber: 'ABCDE1234F',
      governmentIdFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      governmentIdBackUrl:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      docReviews: makePendingReviews(),
    },
    {
      id: 'DVR-1088',
      driverName: 'Amit Verma',
      email: 'amit.verma@example.com',
      phoneNumber: '9765432109',
      submittedAt: '2026-07-31 16:45',
      status: 'APPROVED',
      drivingLicenseNumber: 'DL-0920150054321',
      drivingLicenseFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      drivingLicenseBackUrl:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      governmentIdType: 'AADHAAR',
      governmentIdNumber: '9012-3456-7890',
      governmentIdFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      governmentIdBackUrl:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      docReviews: makeApprovedReviews(),
    },
    {
      id: 'DVR-1085',
      driverName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phoneNumber: '9123456780',
      submittedAt: '2026-07-30 09:20',
      status: 'WAITING_RESUBMISSION',
      rejectionReason: 'Blurred image, please resubmit.',
      drivingLicenseNumber: 'DL-0620200011223',
      drivingLicenseFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      drivingLicenseBackUrl:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      governmentIdType: 'VOTER_ID',
      governmentIdNumber: 'VTR-9988776',
      governmentIdFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      governmentIdBackUrl:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      docReviews: makeWaitingResubmissionReviews(),
    },
  ];

  selectedDriver: DriverVerificationItem | null = null;
  activeTab: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_RESUBMISSION' = 'ALL';
  searchTerm: string = '';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Rejection reason input state (now keyed by doc GROUP, not individual photo)
  rejectingDocKey: DocGroupKey | null = null;
  rejectReasonInput: string = '';

  // Image zoom modal
  zoomedImageUrl: string | null = null;
  zoomedImageTitle: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  // ===== FILTERED LIST =====

  get filteredDrivers(): DriverVerificationItem[] {
    return this.drivers.filter((driver) => {
      const matchesTab = this.activeTab === 'ALL' || driver.status === this.activeTab;
      const term = this.searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        driver.driverName.toLowerCase().includes(term) ||
        driver.email.toLowerCase().includes(term) ||
        driver.phoneNumber.includes(term) ||
        driver.drivingLicenseNumber.toLowerCase().includes(term);
      return matchesTab && matchesSearch;
    });
  }

  get pendingCount():            number { return this.drivers.filter((d) => d.status === 'PENDING').length; }
  get approvedCount():           number { return this.drivers.filter((d) => d.status === 'APPROVED').length; }
  get rejectedCount():           number { return this.drivers.filter((d) => d.status === 'REJECTED').length; }
  get waitingResubmissionCount(): number { return this.drivers.filter((d) => d.status === 'WAITING_RESUBMISSION').length; }

  /**
   * Whether the card/modal-level Approve All / Reject All actions should be visible.
   * Once any section has been rejected (status = WAITING_RESUBMISSION), these
   * whole-application shortcuts are hidden — the admin must act per-section
   * from that point on, since the driver still needs to resubmit something.
   */
  canTakeQuickAction(driver: DriverVerificationItem): boolean {
    return driver.status === 'PENDING';
  }

  /** Friendly label for a driver-level status */
  statusLabel(status: DriverStatus | DocStatus): string {
    if (status === 'WAITING_RESUBMISSION') return 'Waiting Resubmission';
    return status;
  }

  // ===== MODAL =====

  openDocumentModal(driver: DriverVerificationItem): void {
    this.selectedDriver = driver;
    this.rejectingDocKey = null;
    this.rejectReasonInput = '';
    this.cdr.detectChanges();
  }

  closeDocumentModal(): void {
    this.selectedDriver = null;
    this.rejectingDocKey = null;
    this.cdr.detectChanges();
  }

  // ===== PER-DOCUMENT-GROUP ACTIONS =====

  approveDoc(driver: DriverVerificationItem, docKey: DocGroupKey): void {
    driver.docReviews[docKey].status = 'APPROVED';
    driver.docReviews[docKey].rejectionReason = undefined;
    if (this.rejectingDocKey === docKey) {
      this.rejectingDocKey = null;
    }
    this.recomputeDriverStatus(driver);
    this.cdr.detectChanges();
  }

  startRejectDoc(docKey: DocGroupKey): void {
    this.rejectingDocKey = docKey;
    this.rejectReasonInput = '';
    this.cdr.detectChanges();
  }

  cancelRejectDoc(): void {
    this.rejectingDocKey = null;
    this.rejectReasonInput = '';
    this.cdr.detectChanges();
  }

  confirmRejectDoc(driver: DriverVerificationItem, docKey: DocGroupKey): void {
    driver.docReviews[docKey].status = 'REJECTED';
    driver.docReviews[docKey].rejectionReason = this.rejectReasonInput.trim() || 'Document rejected by admin.';
    this.rejectingDocKey = null;
    this.rejectReasonInput = '';
    this.recomputeDriverStatus(driver);
    this.cdr.detectChanges();
  }

  /**
   * Recomputes overall driver status from the 3 grouped document statuses.
   * A rejected document no longer marks the whole application as terminally
   * REJECTED — it puts the driver into WAITING_RESUBMISSION so they can
   * re-upload just the flagged document(s).
   */
  private recomputeDriverStatus(driver: DriverVerificationItem): void {
    const reviews = Object.values(driver.docReviews);

    if (reviews.every((r) => r.status === 'APPROVED')) {
      driver.status = 'APPROVED';
      driver.rejectionReason = undefined;
      this.successMessage = `${driver.driverName}'s application is now fully APPROVED.`;
      setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);

    } else if (reviews.some((r) => r.status === 'REJECTED')) {
      driver.status = 'WAITING_RESUBMISSION';
      const reasons = reviews
        .filter((r) => r.status === 'REJECTED' && r.rejectionReason)
        .map((r) => r.rejectionReason)
        .join('; ');
      driver.rejectionReason = reasons;
      this.errorMessage = `${driver.driverName}'s application is waiting for document resubmission.`;
      setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);

    } else {
      driver.status = 'PENDING';
      driver.rejectionReason = undefined;
    }
  }

  // ===== QUICK WHOLE-APPLICATION ACTIONS =====

  approveDriver(driver: DriverVerificationItem): void {
    (Object.keys(driver.docReviews) as DocGroupKey[]).forEach((key) => {
      driver.docReviews[key].status = 'APPROVED';
      driver.docReviews[key].rejectionReason = undefined;
    });
    driver.status = 'APPROVED';
    driver.rejectionReason = undefined;
    this.successMessage = `${driver.driverName} (${driver.id}) fully approved!`;
    this.cdr.detectChanges();
    setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
  }

  rejectDriver(driver: DriverVerificationItem): void {
    (Object.keys(driver.docReviews) as DocGroupKey[]).forEach((key) => {
      driver.docReviews[key].status = 'REJECTED';
      driver.docReviews[key].rejectionReason = 'Application rejected by admin.';
    });
    driver.status = 'REJECTED';
    driver.rejectionReason = 'Application rejected by admin.';
    this.errorMessage = `${driver.driverName} (${driver.id}) application rejected.`;
    this.cdr.detectChanges();
    setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);
  }

  // ===== HELPERS =====

  docProgress(driver: DriverVerificationItem): { approved: number; rejected: number; pending: number; total: number } {
    const reviews = Object.values(driver.docReviews);
    return {
      total:    reviews.length,
      approved: reviews.filter((r) => r.status === 'APPROVED').length,
      rejected: reviews.filter((r) => r.status === 'REJECTED').length,
      pending:  reviews.filter((r) => r.status === 'PENDING').length,
    };
  }

  zoomImage(url: string, title: string): void {
    this.zoomedImageUrl = url;
    this.zoomedImageTitle = title;
    this.cdr.detectChanges();
  }

  closeZoom(): void {
    this.zoomedImageUrl = null;
    this.zoomedImageTitle = null;
    this.cdr.detectChanges();
  }
}