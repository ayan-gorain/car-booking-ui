import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from '../login/login';
import { Signup } from '../signup/signup';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, Login, Signup],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  activeTab: 'login' | 'signup' = 'login';

  setTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
  }
}
