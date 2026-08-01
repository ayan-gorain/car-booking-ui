import { Routes } from '@angular/router';

import { ForgotPassword } from './features/auth/components/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/components/reset-password/reset-password';
import { Auth } from './features/auth/auth';
import { Dashboard } from './features/dashboard/dashboard';
import { Carbooking } from './features/carbooking/carbooking';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'dashboard', component: Dashboard },
  { path: 'carbooking', component: Carbooking },

  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password/:token', component: ResetPassword },

  { path: '**', redirectTo: 'auth' },
];
