import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slidebar.html',
  styleUrl: './slidebar.css',
})
export class Slidebar {
  @Input()  activeMenu: string = 'Car Booking';
  @Output() menuSelected = new EventEmitter<string>();

  isExpanded = true;

  menus = [
    { name: 'Dashboard',   icon: 'bi-speedometer2' },
    { name: 'Car Booking', icon: 'bi-car-front'     },
    { name: 'Users',       icon: 'bi-people'        },
    { name: 'Products',    icon: 'bi-box'           },
    { name: 'Orders',      icon: 'bi-cart'          },
    { name: 'Reports',     icon: 'bi-bar-chart'     },
    { name: 'Settings',    icon: 'bi-gear'          },
  ];

  toggleSlidebar() { this.isExpanded = !this.isExpanded; }

  selectMenu(name: string) { this.menuSelected.emit(name); }
}