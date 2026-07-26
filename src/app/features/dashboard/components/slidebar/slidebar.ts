import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-slidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slidebar.html',
  styleUrl: './slidebar.css',
})
export class Slidebar {
  isExpanded=true;

  menus = [
    { name: 'Dashboard', icon: 'bi-speedometer2' },
    { name: 'Users', icon: 'bi-people' },
    { name: 'Products', icon: 'bi-box' },
    { name: 'Orders', icon: 'bi-cart' },
    { name: 'Reports', icon: 'bi-bar-chart' },
    { name: 'Settings', icon: 'bi-gear' }
  ];

  toggleSlidebar(){
    this.isExpanded=!this.isExpanded
  }

}