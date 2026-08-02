import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

export type VehicleType = 'HATCHBACK' | 'SEDAN' | 'SUV' | 'MUV' | 'LUXURY' | 'VAN';
export type FuelType = 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
export type TransmissionType = 'MANUAL' | 'AUTOMATIC';

export interface VehicleBooking {
  id: string;
  registrationNumber: string;
  manufacturer: string;
  model: string;
  variant: string;
  vehicleType: VehicleType;
  fuelType: FuelType;
  transmission: TransmissionType;
  manufacturingYear: number;
  color: string;
  seatCapacity: number;
  luggageCapacity: number;
  airConditioned: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-drivercreatebooking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drivercreatebooking.html',
  styleUrl: './drivercreatebooking.css',
})
export class Drivercreatebooking {
  currentYear = new Date().getFullYear();

  vehicleTypes: VehicleType[] = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'VAN'];
  fuelTypes: FuelType[] = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
  transmissions: TransmissionType[] = ['MANUAL', 'AUTOMATIC'];

  bookingForm: FormGroup;
  isSubmitting = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  bookings: VehicleBooking[] = [];
  bookingToDelete: VehicleBooking | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.bookingForm = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      manufacturer: ['', [Validators.required]],
      model: ['', [Validators.required]],
      variant: [''],
      vehicleType: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      manufacturingYear: [
        null,
        [Validators.required, Validators.min(1980), Validators.max(this.currentYear)],
      ],
      color: ['', [Validators.required]],
      seatCapacity: [null, [Validators.required, Validators.min(1), Validators.max(60)]],
      luggageCapacity: [0, [Validators.required, Validators.min(0)]],
      airConditioned: [true],
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  /** Bootstrap icon class for a given vehicle body type. */
  vehicleIcon(type: VehicleType | ''): string {
    switch (type) {
      case 'SUV': return 'bi-truck-front';
      case 'MUV': return 'bi-truck-front-fill';
      case 'LUXURY': return 'bi-gem';
      case 'VAN': return 'bi-truck';
      case 'SEDAN': return 'bi-car-front-fill';
      case 'HATCHBACK': return 'bi-car-front';
      default: return 'bi-car-front';
    }
  }

  /** Bootstrap icon class for a given fuel type. */
  fuelIcon(type: FuelType | string): string {
    switch (type) {
      case 'PETROL': return 'bi-fuel-pump-fill';
      case 'DIESEL': return 'bi-fuel-pump';
      case 'CNG': return 'bi-cloud-fill';
      case 'ELECTRIC': return 'bi-lightning-charge-fill';
      case 'HYBRID': return 'bi-battery-charging';
      default: return 'bi-fuel-pump';
    }
  }

  /** Accent color used to tint a vehicle's card/badge based on its type. */
  vehicleAccent(type: VehicleType | string): string {
    switch (type) {
      case 'SUV': return '#0ea5e9';
      case 'MUV': return '#0891b2';
      case 'LUXURY': return '#a855f7';
      case 'VAN': return '#f59e0b';
      case 'SEDAN': return '#6366f1';
      case 'HATCHBACK': return '#16a34a';
      default: return '#6366f1';
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();

    const value = this.bookingForm.value;

    // Duplicate registration number check
    const isDuplicate = this.bookings.some(
      (b) => b.registrationNumber.toUpperCase() === value.registrationNumber.toUpperCase()
    );

    setTimeout(() => {
      this.isSubmitting = false;

      if (isDuplicate) {
        this.errorMessage = `A vehicle with registration number "${value.registrationNumber}" already exists.`;
        this.cdr.detectChanges();
        setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);
        return;
      }

      const newBooking: VehicleBooking = {
        id: 'VEH-' + Math.floor(1000 + Math.random() * 9000),
        registrationNumber: value.registrationNumber.toUpperCase(),
        manufacturer: value.manufacturer,
        model: value.model,
        variant: value.variant,
        vehicleType: value.vehicleType,
        fuelType: value.fuelType,
        transmission: value.transmission,
        manufacturingYear: value.manufacturingYear,
        color: value.color,
        seatCapacity: value.seatCapacity,
        luggageCapacity: value.luggageCapacity,
        airConditioned: value.airConditioned,
        createdAt: new Date().toLocaleString(),
      };

      this.bookings.unshift(newBooking);
      this.successMessage = `Vehicle "${newBooking.manufacturer} ${newBooking.model}" added successfully!`;
      this.bookingForm.reset({ luggageCapacity: 0, airConditioned: true });
      this.cdr.detectChanges();

      setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
    }, 400);
  }

  confirmDelete(booking: VehicleBooking): void {
    this.bookingToDelete = booking;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.bookingToDelete = null;
    this.cdr.detectChanges();
  }

  executeDelete(): void {
    if (!this.bookingToDelete) return;
    const id = this.bookingToDelete.id;
    this.bookings = this.bookings.filter((b) => b.id !== id);
    this.bookingToDelete = null;
    this.successMessage = 'Vehicle removed successfully.';
    this.cdr.detectChanges();
    setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
  }
}