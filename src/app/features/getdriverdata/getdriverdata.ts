import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-getdriverdata',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './getdriverdata.html',
  styleUrl: './getdriverdata.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Getdriverdata implements OnInit {
  currentYear = new Date().getFullYear();

  vehicleTypes: VehicleType[] = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'LUXURY', 'VAN'];
  fuelTypes: FuelType[] = ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID'];
  transmissions: TransmissionType[] = ['MANUAL', 'AUTOMATIC'];

  vehicles: VehicleBooking[] = [];
  isLoading = true;

  editingId: string | null = null;
  editForm: FormGroup;
  isSaving = false;

  vehicleToDelete: VehicleBooking | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.editForm = this.fb.group({
      registrationNumber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      manufacturer: ['', [Validators.required]],
      model: ['', [Validators.required]],
      variant: [''],
      vehicleType: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      manufacturingYear: [null, [Validators.required, Validators.min(1980), Validators.max(this.currentYear)]],
      color: ['', [Validators.required]],
      seatCapacity: [null, [Validators.required, Validators.min(1), Validators.max(60)]],
      luggageCapacity: [0, [Validators.required, Validators.min(0)]],
      airConditioned: [true],
    });
  }

  ngOnInit(): void {
    this.fetchVehicles();
  }

  get f() {
    return this.editForm.controls;
  }

  // TODO: replace with a real API call (e.g. this.driverService.getVehicles())
  fetchVehicles(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.vehicles = [
        {
          id: 'VEH-1042',
          registrationNumber: 'TS09AB1234',
          manufacturer: 'Maruti Suzuki',
          model: 'Swift',
          variant: 'VXI',
          vehicleType: 'HATCHBACK',
          fuelType: 'PETROL',
          transmission: 'MANUAL',
          manufacturingYear: 2022,
          color: 'White',
          seatCapacity: 4,
          luggageCapacity: 2,
          airConditioned: true,
          createdAt: new Date().toLocaleString(),
        },
        {
          id: 'VEH-1077',
          registrationNumber: 'TS10CD5678',
          manufacturer: 'Hyundai',
          model: 'Creta',
          variant: 'SX',
          vehicleType: 'SUV',
          fuelType: 'DIESEL',
          transmission: 'AUTOMATIC',
          manufacturingYear: 2023,
          color: 'Grey',
          seatCapacity: 5,
          luggageCapacity: 3,
          airConditioned: true,
          createdAt: new Date().toLocaleString(),
        },
        {
          id: 'VEH-1103',
          registrationNumber: 'TS11EF9012',
          manufacturer: 'Toyota',
          model: 'Innova',
          variant: 'Crysta',
          vehicleType: 'MUV',
          fuelType: 'DIESEL',
          transmission: 'MANUAL',
          manufacturingYear: 2021,
          color: 'Silver',
          seatCapacity: 7,
          luggageCapacity: 4,
          airConditioned: true,
          createdAt: new Date().toLocaleString(),
        },
      ];
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 500);
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

  isEditing(vehicle: VehicleBooking): boolean {
    return this.editingId === vehicle.id;
  }

  get editingVehicle(): VehicleBooking | null {
    return this.vehicles.find((v) => v.id === this.editingId) || null;
  }

  startEdit(vehicle: VehicleBooking): void {
    this.editingId = vehicle.id;
    this.errorMessage = null;
    this.editForm.reset({
      registrationNumber: vehicle.registrationNumber,
      manufacturer: vehicle.manufacturer,
      model: vehicle.model,
      variant: vehicle.variant,
      vehicleType: vehicle.vehicleType,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      manufacturingYear: vehicle.manufacturingYear,
      color: vehicle.color,
      seatCapacity: vehicle.seatCapacity,
      luggageCapacity: vehicle.luggageCapacity,
      airConditioned: vehicle.airConditioned,
    });
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.cdr.detectChanges();
  }

  saveEdit(vehicle: VehicleBooking): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    this.cdr.detectChanges();

    const value = this.editForm.value;

    const isDuplicate = this.vehicles.some(
      (v) => v.id !== vehicle.id && v.registrationNumber.toUpperCase() === value.registrationNumber.toUpperCase()
    );

    setTimeout(() => {
      this.isSaving = false;

      if (isDuplicate) {
        this.errorMessage = `A vehicle with registration number "${value.registrationNumber}" already exists.`;
        this.cdr.detectChanges();
        setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);
        return;
      }

      // TODO: replace with a real API call (e.g. this.driverService.updateVehicle(vehicle.id, value))
      const index = this.vehicles.findIndex((v) => v.id === vehicle.id);
      if (index > -1) {
        this.vehicles[index] = {
          ...this.vehicles[index],
          ...value,
          registrationNumber: value.registrationNumber.toUpperCase(),
        };
      }

      this.editingId = null;
      this.successMessage = `Vehicle "${value.manufacturer} ${value.model}" updated successfully!`;
      this.cdr.detectChanges();
      setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
    }, 400);
  }

  confirmDelete(vehicle: VehicleBooking): void {
    this.vehicleToDelete = vehicle;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.vehicleToDelete = null;
    this.cdr.detectChanges();
  }

  executeDelete(): void {
    if (!this.vehicleToDelete) return;
    // TODO: replace with a real API call (e.g. this.driverService.deleteVehicle(id))
    const id = this.vehicleToDelete.id;
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    if (this.editingId === id) {
      this.editingId = null;
    }
    this.vehicleToDelete = null;
    this.successMessage = 'Vehicle removed successfully.';
    this.cdr.detectChanges();
    setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
  }
}