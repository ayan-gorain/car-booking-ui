import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

export interface VehicleSummary {
  id: string;
  registrationNumber: string;
  manufacturer: string;
  model: string;
  variant?: string;
  vehicleType: string;
  seatCapacity: number;
}

export interface TripBookingPayload {
  vehicleId: string;
  sourceCity: string;
  sourceAddress: string;
  destinationCity: string;
  destinationAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  pricePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  instantBooking: boolean;
  womenOnly: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  luggageAllowed: boolean;
  description: string;
}

@Component({
  selector: 'app-tripbookingdriver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tripbookingdriver.html',
  styleUrl: './tripbookingdriver.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tripbookingdriver implements OnInit {
  tripForm: FormGroup;

  vehicleId: string | null = null;
  vehicle: VehicleSummary | null = null;

  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private readonly navigationState: { vehicle?: VehicleSummary } | undefined;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Router.getCurrentNavigation() is only populated during the navigation
    // itself, so we have to capture it here in the constructor — by the time
    // ngOnInit runs it has already gone back to null.
    const nav = this.router.getCurrentNavigation();
    this.navigationState = (nav?.extras.state as { vehicle?: VehicleSummary }) ?? history.state;

    this.tripForm = this.fb.group(
      {
        sourceCity: ['', [Validators.required]],
        sourceAddress: ['', [Validators.required]],
        destinationCity: ['', [Validators.required]],
        destinationAddress: ['', [Validators.required]],
        departureTime: ['', [Validators.required]],
        estimatedArrivalTime: ['', [Validators.required]],
        pricePerSeat: [null, [Validators.required, Validators.min(1)]],
        totalSeats: [null, [Validators.required, Validators.min(1), Validators.max(60)]],
        availableSeats: [null, [Validators.required, Validators.min(1)]],
        instantBooking: [true],
        womenOnly: [false],
        smokingAllowed: [false],
        petsAllowed: [false],
        luggageAllowed: [true],
        description: [''],
      },
      { validators: [this.seatsValidator, this.arrivalAfterDepartureValidator] }
    );
  }

  ngOnInit(): void {
    // Vehicle id comes from the route, e.g. /trip-booking/:vehicleId
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId');

    // The fleet page passes a lightweight vehicle summary via router state so
    // this page can render instantly without waiting on another API call.
    if (this.navigationState?.vehicle) {
      this.vehicle = this.navigationState.vehicle;
      this.tripForm.patchValue({
        totalSeats: this.vehicle.seatCapacity,
        availableSeats: this.vehicle.seatCapacity,
      });
    }

    // TODO: if `this.vehicle` is still null (e.g. on a hard refresh with no
    // router state), fetch it with a real API call, e.g.
    // this.vehicleService.getById(this.vehicleId).subscribe(...)
  }

  get f() {
    return this.tripForm.controls;
  }

  private seatsValidator(group: AbstractControl): ValidationErrors | null {
    const available = group.get('availableSeats')?.value;
    const total = group.get('totalSeats')?.value;
    if (available != null && total != null && Number(available) > Number(total)) {
      return { seatsExceedTotal: true };
    }
    return null;
  }

  private arrivalAfterDepartureValidator(group: AbstractControl): ValidationErrors | null {
    const departure = group.get('departureTime')?.value;
    const arrival = group.get('estimatedArrivalTime')?.value;
    if (departure && arrival && new Date(arrival) <= new Date(departure)) {
      return { arrivalBeforeDeparture: true };
    }
    return null;
  }

  /** Bootstrap icon class for a given vehicle body type. */
  vehicleIcon(type: string | undefined): string {
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

  /** Accent color used to tint the vehicle summary card based on its type. */
  vehicleAccent(type: string | undefined): string {
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
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    if (!this.vehicleId) {
      this.errorMessage = 'No vehicle selected. Please go back and pick a vehicle to book a ride for.';
      this.cdr.detectChanges();
      setTimeout(() => { this.errorMessage = null; this.cdr.detectChanges(); }, 4000);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.cdr.detectChanges();

    const value = this.tripForm.value;
    const payload: TripBookingPayload = {
      vehicleId: this.vehicleId,
      sourceCity: value.sourceCity,
      sourceAddress: value.sourceAddress,
      destinationCity: value.destinationCity,
      destinationAddress: value.destinationAddress,
      departureTime: new Date(value.departureTime).toISOString(),
      estimatedArrivalTime: new Date(value.estimatedArrivalTime).toISOString(),
      pricePerSeat: Number(value.pricePerSeat),
      availableSeats: Number(value.availableSeats),
      totalSeats: Number(value.totalSeats),
      instantBooking: value.instantBooking,
      womenOnly: value.womenOnly,
      smokingAllowed: value.smokingAllowed,
      petsAllowed: value.petsAllowed,
      luggageAllowed: value.luggageAllowed,
      description: value.description,
    };

    // TODO: replace with a real API call, e.g.
    // this.tripBookingService.create(payload).subscribe({
    //   next: () => { ... },
    //   error: () => { ... },
    // });
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Ride published! Riders can now find and book this trip.';
      this.cdr.detectChanges();
      console.log('Trip booking payload', payload);
      setTimeout(() => { this.successMessage = null; this.cdr.detectChanges(); }, 4000);
    }, 600);
  }

  goBack(): void {
    this.router.navigate(['/driver-get-carbooking']);
  }
}