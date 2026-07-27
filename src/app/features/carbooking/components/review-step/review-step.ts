import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country, BookingState } from '../../models/booking.model';
import { RouteMap } from '../route-map/route-map';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, RouteMap],
  templateUrl: './review-step.html',
})
export class ReviewStep {
  @Input() state!: BookingState;
  @Input() countries: Country[] = [];

  @Output() prevStep = new EventEmitter<void>();
  @Output() confirmBooking = new EventEmitter<void>();

  get selectedCountryObj(): Country {
    return this.countries.find(c => c.code === this.state.selectedCountry) ?? this.countries[0];
  }

  get calculatedPrice(): number {
    if (!this.state.selectedSharedCab) return 0;
    const mult = this.state.tripType === 'round-trip' ? 1.8 : 1.0;
    return Math.round(this.state.selectedSharedCab.farePerSeat * (this.state.seatCount ?? 1) * mult);
  }

  onPrev() {
    this.prevStep.emit();
  }

  onConfirm() {
    this.confirmBooking.emit();
  }
}
