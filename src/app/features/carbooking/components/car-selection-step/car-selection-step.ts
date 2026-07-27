import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatSelection } from './components/seat-selection/seat-selection';

import { MOCK_SHARED_CABS } from '../../constants';
import { BookingState, SharedCab as SharedCabModel } from '../../models/booking.model';
import { SharedCab } from './components/shared-cab/shared-cab';

@Component({
  selector: 'app-car-selection-step',
  standalone: true,
  imports: [CommonModule, SharedCab, SeatSelection],
  templateUrl: './car-selection-step.html',
})
export class CarSelectionStep {
  @Input() state!: BookingState;
  @Input() sharedCabs: SharedCabModel[] = MOCK_SHARED_CABS;

  @Output() stateChange = new EventEmitter<BookingState>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();

  get filteredCabs(): SharedCabModel[] {
    const needed = this.state.seatCount ?? 1;
    return this.sharedCabs.filter(cab => cab.availableSeats >= needed);
  }

  /** Step 1 = pick a cab, Step 2 = pick seat(s) */
  activeTab: 'shared' | 'seat' = 'shared';

  readonly tabs: { id: 'shared' | 'seat'; label: string; icon: string }[] = [
    { id: 'shared', label: 'Choose Cab', icon: 'bi-truck-front-fill' },
    { id: 'seat', label: 'Choose Seat', icon: 'bi-grid-3x3-gap-fill' },
  ];

  isTabDisabled(tab: 'shared' | 'seat'): boolean {
    return tab === 'seat' && !this.state.selectedSharedCab;
  }

  selectTab(tab: 'shared' | 'seat') {
    if (this.isTabDisabled(tab)) return;
    this.activeTab = tab;
  }

  /** Bubbled up from any child component after it mutates the shared state. */
  onStateChange(updated: BookingState) {
    this.state = updated;
    this.stateChange.emit(this.state);
  }

  /** Click on a cab → switch to seat selection page. */
  onChooseSeat(cab: SharedCabModel) {
    this.state.selectedSharedCab = cab;
    // Reset seats when switching cabs
    this.state.selectedSeat = null;
    this.state.selectedSeats = [];
    this.stateChange.emit(this.state);
    this.activeTab = 'seat';
  }

  get canProceed(): boolean {
    const needed = this.state.seatCount ?? 1;
    return (
      !!this.state.selectedSharedCab &&
      this.state.selectedSeats.length >= needed
    );
  }

  onNext() {
    if (this.canProceed) {
      this.nextStep.emit();
    }
  }

  onPrev() {
    if (this.activeTab === 'seat') {
      this.activeTab = 'shared';
    } else {
      this.prevStep.emit();
    }
  }
}