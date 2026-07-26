import { Routes } from '@angular/router';
import { Auth } from './components/auth/auth';
import { Dashboard } from './components/dashboard/dashboard';
import { ForgotPassword } from './components/auth/components/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'dashboard', component: Dashboard },

  { path: 'forgot-password', component: ForgotPassword },

  { path: '**', redirectTo: 'auth' },
];
