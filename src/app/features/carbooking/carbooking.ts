import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Country, City, TimeSlot, CarCategory, BookingState } from './models/booking.model';
import { RouteStep } from './components/route-step/route-step';
import { ScheduleStep } from './components/schedule-step/schedule-step';
import { CarSelectionStep } from './components/car-selection-step/car-selection-step';
import { ReviewStep } from './components/review-step/review-step';
import { ConfirmationStep } from './components/confirmation-step/confirmation-step';
import { CAR_CATEGORIES, CITIES, COUNTRIES, TIME_SLOTS } from './constants';

@Component({
  selector: 'app-carbooking',
  standalone: true,
  imports: [
    CommonModule,
    RouteStep,
    ScheduleStep,
    CarSelectionStep,
    ReviewStep,
    ConfirmationStep
  ],
  templateUrl: './carbooking.html',
  styleUrl: './carbooking.css',
})
export class Carbooking {
  currentStep: number = 1;

  countries: Country[] = COUNTRIES;

  allCities: City[] = CITIES;

  timeSlots: TimeSlot[] = TIME_SLOTS;

  carCategories: CarCategory[] = CAR_CATEGORIES;

  state: BookingState = {
    selectedCountry: 'IN',
    tripType: 'one-way',
    selectedFromCity: null,
    selectedToCity: null,
    fromInput: '',
    toInput: '',
    selectedDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    selectedTime: null,
    returnTime: null,
    selectedCar: null,
    bookingRefId: 'CB-' + Math.floor(100000 + Math.random() * 900000)
  };

  goToStep(step: number) {
    this.currentStep = step;
  }

  confirmBooking() {
    this.state.bookingRefId = 'CB-' + Math.floor(100000 + Math.random() * 900000);
    this.currentStep = 5;
  }

  resetBooking() {
    this.state = {
      selectedCountry: 'IN',
      tripType: 'one-way',
      selectedFromCity: null,
      selectedToCity: null,
      fromInput: '',
      toInput: '',
      selectedDate: new Date().toISOString().split('T')[0],
      returnDate: '',
      selectedTime: null,
      returnTime: null,
      selectedCar: null,
      bookingRefId: 'CB-' + Math.floor(100000 + Math.random() * 900000)
    };
    this.currentStep = 1;
  }
}
