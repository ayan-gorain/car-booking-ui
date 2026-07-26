import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country, BookingState } from '../../models/booking.model';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-step.html',
})
export class ConfirmationStep {
  @Input() state!: BookingState;
  @Input() countries: Country[] = [];

  @Output() resetBooking = new EventEmitter<void>();

  getCountry(code: string): Country {
    return this.countries.find(c => c.code === code) ?? this.countries[0];
  }

  get calculatedPrice(): number {
    if (!this.state.selectedCar) return 0;
    const mult = this.state.tripType === 'round-trip' ? 1.8 : 1.0;
    return Math.round(this.state.selectedCar.basePrice * mult);
  }

  onReset() {
    this.resetBooking.emit();
  }
}
