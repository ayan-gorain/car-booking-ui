import { Routes } from '@angular/router';

import { ForgotPassword } from './features/auth/components/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/components/reset-password/reset-password';
import { Auth } from './features/auth/auth';
import { Dashboard } from './features/dashboard/dashboard';
import { Carbooking } from './features/carbooking/carbooking';
import { Driververification } from './features/driver_verification/driververification';
import { Adminlogin } from './features/auth/components/admin-login/adminlogin';
import { Admindashboard } from './features/admin/admindashboard/admindashboard';
import { Drivercreatebooking } from './features/driver_create_booking/drivercreatebooking';
import { Getdriverdata } from './features/getdriverdata/getdriverdata';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'dashboard', component: Dashboard },
  { path: 'carbooking', component: Carbooking },
  { path: 'driver-verification', component: Driververification },

  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password/:token', component: ResetPassword },

  {
    path: 'admin-login',
    component: Adminlogin,
  },
  {
    path: 'admin-dashboard',
    component: Admindashboard,
  },
  {
    path: 'driver-create-carbooking',
    component: Drivercreatebooking,
  },
   {
    path: 'driver-get-carbooking',
    component: Getdriverdata,
  },

  { path: '**', redirectTo: 'auth' },
];
