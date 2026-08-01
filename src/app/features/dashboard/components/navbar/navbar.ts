import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Main } from '../../../service/main';
import { ProfileModal } from '../profile-modal/profile-modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ProfileModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  userProfile: any = null;
  userRole = '';

  isProfileModalOpen = false;
  isProfileLoading = false;

  constructor(
    private router: Router,
    private authService: Main,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  /**
   * Returns logged in user's UUID
   */
  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  /**
   * Load profile for navbar pill (name, avatar, role)
   */
  fetchUserProfile(): void {
    const userId = this.getUserId();

    if (!userId) {
      console.error('No userId found.');
      return;
    }

    this.isProfileLoading = true;
    this.cdr.detectChanges();

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
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProfileLoading = false;
        console.error('Failed to fetch profile', err);
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Open Profile Modal — all profile fetching/edit/update logic
   * lives inside ProfileModal itself.
   */
  openProfileModal(): void {
    this.isProfileModalOpen = true;
    this.cdr.detectChanges();
  }

  /**
   * Close Profile Modal — refresh navbar pill data (name/avatar/role
   * might have changed) and force change detection so the UI
   * reflects the latest state immediately.
   */
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
    this.cdr.detectChanges();

    // Re-fetch to reflect any profile updates made inside the modal
    this.fetchUserProfile();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.performLogout(),
      error: () => this.performLogout(),
    });
  }

  private performLogout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}