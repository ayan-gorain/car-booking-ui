import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, Login, Signup],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  activeTab: 'login' | 'signup' = 'login';

  constructor(private router: Router) {}

  setTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
  }

  goToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}