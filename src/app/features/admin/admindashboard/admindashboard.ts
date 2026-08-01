import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminEmailManagement } from './components/admin-email-management/admin-email-management';
import { AdminSlidebar } from './components/admin-slidebar/admin-slidebar';
import { DriverVerificationApproval } from './components/driver-verification-approval/driver-verification-approval';
import { AdminEmailService } from '../services/admin-email.service';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, AdminEmailManagement, AdminSlidebar, DriverVerificationApproval],
  templateUrl: './admindashboard.html',
  styleUrl: './admindashboard.css',
})
export class Admindashboard implements OnInit, OnDestroy {
  activeMenu: string = 'Driver Verification';
  adminCount: number = 0;

  private sub?: Subscription;

  constructor(
    private router: Router,
    private adminEmailService: AdminEmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.adminEmailService.adminEmails$.subscribe((emails) => {
      this.adminCount = emails.length;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  setMenu(menuName: string): void {
    this.activeMenu = menuName;
    this.cdr.detectChanges();
  }

  getMenuIcon(): string {
    switch (this.activeMenu) {
      case 'Dashboard Overview':
        return 'bi-speedometer2';
      case 'Admin Email Management':
        return 'bi-shield-lock-fill';
      case 'Driver Verification':
        return 'bi-person-badge-fill';
      case 'Car Bookings':
        return 'bi-car-front-fill';
      case 'System Settings':
        return 'bi-gear-fill';
      default:
        return 'bi-app-indicator';
    }
  }

  logout(): void {
    this.router.navigate(['/admin-login']);
  }
}
