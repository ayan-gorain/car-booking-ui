import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarCategory, BookingState } from '../../models/booking.model';

@Component({
  selector: 'app-car-selection-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-selection-step.html',
})
export class CarSelectionStep {
  @Input() state!: BookingState;
  @Input() carCategories: CarCategory[] = [];

  @Output() stateChange = new EventEmitter<BookingState>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();

  Math = Math;

  selectCar(car: CarCategory) {
    this.state.selectedCar = car;
    this.stateChange.emit(this.state);
  }

  getCalculatedPrice(car: CarCategory): number {
    const mult = this.state.tripType === 'round-trip' ? 1.8 : 1.0;
    return Math.round(car.basePrice * mult);
  }

  onNext() {
    if (this.state.selectedCar) {
      this.nextStep.emit();
    }
  }

  onPrev() {
    this.prevStep.emit();
  }
}
