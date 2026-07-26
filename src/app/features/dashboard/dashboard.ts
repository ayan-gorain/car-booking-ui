import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Slidebar } from './components/slidebar/slidebar';
import { Carbooking } from '../carbooking/carbooking';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Navbar, Slidebar, Carbooking],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  activeMenu: string = 'Car Booking';

  private iconMap: Record<string, string> = {
    'Dashboard': 'bi-speedometer2',
    'Car Booking': 'bi-car-front-fill',
    'Users': 'bi-people-fill',
    'Products': 'bi-box-seam',
    'Orders': 'bi-cart-fill',
    'Reports': 'bi-bar-chart-fill',
    'Settings': 'bi-gear-fill',
  };

  setMenu(menu: string) {
    this.activeMenu = menu;
  }

  getMenuIcon(): string {
    return this.iconMap[this.activeMenu] ?? 'bi-grid';
  }
}
