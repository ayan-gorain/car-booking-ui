import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-slidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-slidebar.html',
  styleUrl: './admin-slidebar.css',
})
export class AdminSlidebar {
  @Input() activeMenu: string = 'Driver Verification';
  @Output() menuSelected = new EventEmitter<string>();

  isExpanded = true;

  menus = [
    { name: 'Dashboard Overview', icon: 'bi-speedometer2' },
    { name: 'Admin Email Management', icon: 'bi-shield-lock-fill' },
    { name: 'Driver Verification', icon: 'bi-person-badge-fill' },
    { name: 'Car Bookings', icon: 'bi-car-front-fill' },
    { name: 'System Settings', icon: 'bi-gear-fill' },
  ];

  toggleSlidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  selectMenu(name: string): void {
    this.menuSelected.emit(name);
  }
}
