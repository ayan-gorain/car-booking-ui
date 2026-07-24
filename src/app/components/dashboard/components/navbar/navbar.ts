import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router) {}

  logout() {
    // Clear authentication data if stored
    localStorage.clear();
    sessionStorage.clear();

    // Navigate to login page
    this.router.navigate(['/login']);
  }
}