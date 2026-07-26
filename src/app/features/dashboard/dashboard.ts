import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Slidebar } from "./components/slidebar/slidebar";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Navbar, Slidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard  {

}
