import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  status: DocStatus;
  drivingLicenseNumber: string;
  drivingLicenseFrontUrl: string;
  drivingLicenseBackUrl: string;
  governmentIdType: string;
  governmentIdNumber: string;
  governmentIdFrontUrl: string;
  governmentIdBackUrl: string;
  selfieUrl: string;
  rejectionReason?: string;
  // Per-document reviews
  docReviews: {
    drivingLicenseFront: DocumentReview;
    drivingLicenseBack: DocumentReview;
    governmentIdFront: DocumentReview;
    governmentIdBack: DocumentReview;
    selfie: DocumentReview;
  };
}

const makePendingReviews = () => ({
  drivingLicenseFront: { status: 'PENDING' as DocStatus },
  drivingLicenseBack:  { status: 'PENDING' as DocStatus },
  governmentIdFront:   { status: 'PENDING' as DocStatus },
  governmentIdBack:    { status: 'PENDING' as DocStatus },
  selfie:              { status: 'PENDING' as DocStatus },
});

const makeApprovedReviews = () => ({
  drivingLicenseFront: { status: 'APPROVED' as DocStatus },
  drivingLicenseBack:  { status: 'APPROVED' as DocStatus },
  governmentIdFront:   { status: 'APPROVED' as DocStatus },
  governmentIdBack:    { status: 'APPROVED' as DocStatus },
  selfie:              { status: 'APPROVED' as DocStatus },
});

const makeRejectedReviews = () => ({
  drivingLicenseFront: { status: 'APPROVED' as DocStatus },
  drivingLicenseBack:  { status: 'APPROVED' as DocStatus },
  governmentIdFront:   { status: 'REJECTED' as DocStatus, rejectionReason: 'Blurred image' },
  governmentIdBack:    { status: 'REJECTED' as DocStatus, rejectionReason: 'Blurred image' },
  selfie:              { status: 'APPROVED' as DocStatus },
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
      status: 'REJECTED',
      rejectionReason: 'Blurred Driving License image provided.',
      drivingLicenseNumber: 'DL-0620200011223',
      drivingLicenseFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      drivingLicenseBackUrl:  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      governmentIdType: 'VOTER_ID',
      governmentIdNumber: 'VTR-9988776',
      governmentIdFrontUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      governmentIdBackUrl:  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      docReviews: makeRejectedReviews(),
    },
  ];

  selectedDriver: DriverVerificationItem | null = null;
  activeTab: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' = 'ALL';
  searchTerm: string = '';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Rejection reason input state
  rejectingDocKey: string | null = null;
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

  get pendingCount():  number { return this.drivers.filter((d) => d.status === 'PENDING').length;  }
  get approvedCount(): number { return this.drivers.filter((d) => d.status === 'APPROVED').length; }
  get rejectedCount(): number { return this.drivers.filter((d) => d.status === 'REJECTED').length; }

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

  // ===== PER-DOCUMENT ACTIONS =====

  approveDoc(driver: DriverVerificationItem, docKey: keyof DriverVerificationItem['docReviews']): void {
    driver.docReviews[docKey].status = 'APPROVED';
    driver.docReviews[docKey].rejectionReason = undefined;
    if (this.rejectingDocKey === docKey) {
      this.rejectingDocKey = null;
    }
    this.recomputeDriverStatus(driver);
    this.cdr.detectChanges();
  }

  startRejectDoc(docKey: string): void {
    this.rejectingDocKey = docKey;
    this.rejectReasonInput = '';
    this.cdr.detectChanges();
  }

  cancelRejectDoc(): void {
    this.rejectingDocKey = null;
    this.rejectReasonInput = '';
    this.cdr.detectChanges();
  }

  confirmRejectDoc(driver: DriverVerificationItem, docKey: keyof DriverVerificationItem['docReviews']): void {
    driver.docReviews[docKey].status = 'REJECTED';
    driver.docReviews[docKey].rejectionReason = this.rejectReasonInput.trim() || 'Document rejected by admin.';
    this.rejectingDocKey = null;
    this.rejectReasonInput = '';
    this.recomputeDriverStatus(driver);
    this.cdr.detectChanges();
  }

  /** Recomputes overall driver status from individual document statuses */
  private recomputeDriverStatus(driver: DriverVerificationItem): void {
    const reviews = Object.values(driver.docReviews);
    if (reviews.every((r) => r.status === 'APPROVED')) {
      driver.status = 'APPROVED';
      driver.rejectionReason = undefined;
      this.successMessage = `${driver.driverName}'s application is now fully APPROVED.`;
      setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
    } else if (reviews.some((r) => r.status === 'REJECTED')) {
      driver.status = 'REJECTED';
      const reasons = reviews
        .filter((r) => r.status === 'REJECTED' && r.rejectionReason)
        .map((r) => r.rejectionReason)
        .join('; ');
      driver.rejectionReason = reasons;
      this.errorMessage = `${driver.driverName}'s application has rejected documents.`;
      setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);
    } else {
      driver.status = 'PENDING';
      driver.rejectionReason = undefined;
    }
  }

  // ===== QUICK WHOLE-APPLICATION ACTIONS =====

  approveDriver(driver: DriverVerificationItem): void {
    Object.keys(driver.docReviews).forEach((key) => {
      const k = key as keyof DriverVerificationItem['docReviews'];
      driver.docReviews[k].status = 'APPROVED';
      driver.docReviews[k].rejectionReason = undefined;
    });
    driver.status = 'APPROVED';
    driver.rejectionReason = undefined;
    this.successMessage = `${driver.driverName} (${driver.id}) fully approved!`;
    this.cdr.detectChanges();
    setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
  }

  rejectDriver(driver: DriverVerificationItem): void {
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
