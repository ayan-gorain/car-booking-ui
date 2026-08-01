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
    this.loadCachedUser();
    this.fetchUserProfile();
  }

  /**
   * Returns logged in user's UUID
   */
  private getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  /**
   * Instantly populate the pill from the user object saved at login,
   * so there's no spinner flash on every page load.
   */
  private loadCachedUser(): void {
    const cached = localStorage.getItem('user');

    if (!cached) {
      return;
    }

    try {
      const user = JSON.parse(cached);
      this.userProfile = user;

      if (user.roles && Array.isArray(user.roles) && user.roles.length) {
        this.userRole = user.roles[0];
      }

      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to parse cached user', err);
    }
  }

  /**
   * Silently refresh from the API in the background so any profile
   * edits (bio, DOB, gender, picture) made elsewhere stay in sync.
   * Only shows the spinner if we had no cached user to display.
   */
  fetchUserProfile(): void {
  if (!this.userProfile) {
    this.isProfileLoading = true;
    this.cdr.detectChanges();
  }

  this.authService.getUserProfile().subscribe({
    next: (res: any) => {
      this.isProfileLoading = false;

      if (res.success) {
        this.userProfile = res.data;
        localStorage.setItem('user', JSON.stringify(res.data));

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
  openProfileModal(): void {
    this.isProfileModalOpen = true;
    this.cdr.detectChanges();
  }

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