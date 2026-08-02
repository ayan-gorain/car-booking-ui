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

interface WizardStep {
  id: number;
  label: string;
  icon: string;
  // control names that must be valid before moving past this step
  fields: string[];
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

  // ── Wizard state ──
  steps: WizardStep[] = [
    { id: 1, label: 'Identity', icon: 'bi-car-front', fields: ['registrationNumber', 'manufacturer', 'model', 'color', 'manufacturingYear'] },
    { id: 2, label: 'Classification', icon: 'bi-tag-fill', fields: ['vehicleType', 'fuelType', 'transmission'] },
    { id: 3, label: 'Capacity', icon: 'bi-person-fill', fields: ['seatCapacity', 'luggageCapacity'] },
    { id: 4, label: 'Review', icon: 'bi-clipboard-check', fields: [] },
  ];
  currentStep = 1;
  furthestStepReached = 1;

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

  // ── Wizard navigation ──

  /** Is the given step's set of fields currently valid? */
  isStepValid(stepId: number): boolean {
    const step = this.steps.find((s) => s.id === stepId);
    if (!step) return true;
    return step.fields.every((name) => this.bookingForm.get(name)?.valid);
  }

  /** Mark all controls belonging to a step as touched (to surface errors). */
  private touchStep(stepId: number): void {
    const step = this.steps.find((s) => s.id === stepId);
    if (!step) return;
    step.fields.forEach((name) => this.bookingForm.get(name)?.markAsTouched());
  }

  nextStep(): void {
    if (!this.isStepValid(this.currentStep)) {
      this.touchStep(this.currentStep);
      this.cdr.detectChanges();
      return;
    }
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.furthestStepReached = Math.max(this.furthestStepReached, this.currentStep);
      this.cdr.detectChanges();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  /** Allow jumping back to any already-completed step via the progress bar. */
  goToStep(stepId: number): void {
    if (stepId <= this.furthestStepReached) {
      this.currentStep = stepId;
      this.cdr.detectChanges();
    }
  }

  /** Edit a specific step directly from the Review screen. */
  editStep(stepId: number): void {
    this.goToStep(stepId);
  }

  private resetWizard(): void {
    this.currentStep = 1;
    this.furthestStepReached = 1;
  }

  // ── Display helpers ──

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

  // ── Submit (fires only from the Review step) ──

  onSubmit(): void {
    // Guard: ensure every step is actually valid before final submit.
    const invalidStep = this.steps.find((s) => s.fields.length && !this.isStepValid(s.id));
    if (invalidStep) {
      this.touchStep(invalidStep.id);
      this.currentStep = invalidStep.id;
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();

    const value = this.bookingForm.value;

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
      this.resetWizard();
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