import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seat, BookingState, SharedCab } from '../../../../models/booking.model';

interface SeatRow {
  row: string;
  seats: Seat[];
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.html',
})
export class SeatSelection {
  @Input() state!: BookingState;

  @Output() stateChange = new EventEmitter<BookingState>();
  /** Emitted when user clicks "Proceed to Review" inside this component. */
  @Output() proceed = new EventEmitter<void>();

  get cab(): SharedCab | null {
    return this.state?.selectedSharedCab ?? null;
  }

  get seatCount(): number {
    return this.state?.seatCount ?? 1;
  }

  get selectedSeats(): Seat[] {
    return this.state?.selectedSeats ?? [];
  }

  get totalFare(): number {
    return (this.cab?.farePerSeat ?? 0) * this.selectedSeats.length;
  }

  get canProceed(): boolean {
    return this.selectedSeats.length === this.seatCount;
  }

  isChosen(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.id === seat.id);
  }

  get rows(): SeatRow[] {
    if (!this.cab) return [];
    const byRow = new Map<string, Seat[]>();
    for (const seat of this.cab.seats) {
      const list = byRow.get(seat.row) ?? [];
      list.push(seat);
      byRow.set(seat.row, list);
    }
    return Array.from(byRow.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, seats]) => ({ row, seats: seats.sort((a, b) => a.position - b.position) }));
  }

  selectSeat(seat: Seat) {
    if (!this.cab || seat.status === 'booked') return;

    const chosen = this.state.selectedSeats;
    const idx = chosen.findIndex(s => s.id === seat.id);

    if (idx !== -1) {
      // Deselect
      this.state.selectedSeats = chosen.filter(s => s.id !== seat.id);
      seat.status = 'available';
    } else {
      if (chosen.length >= this.seatCount) {
        // Deselect the oldest chosen seat to make room
        const removed = this.state.selectedSeats.shift()!;
        const original = this.cab.seats.find(s => s.id === removed.id);
        if (original) original.status = 'available';
      }
      seat.status = 'selected';
      this.state.selectedSeats = [...this.state.selectedSeats, { ...seat }];
    }

    this.state.selectedSeat = this.state.selectedSeats[this.state.selectedSeats.length - 1] ?? null;
    this.stateChange.emit(this.state);
  }

  onProceed() {
    this.proceed.emit();
  }

  trackBySeat(_index: number, seat: Seat): string {
    return seat.id;
  }
}