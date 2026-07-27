import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingState, SharedCab as SharedCabModel, Seat } from '../../../../models/booking.model';

@Component({
  selector: 'app-shared-cab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-cab.html',
})
export class SharedCab {
  @Input() state!: BookingState;
  @Input() sharedCabs: SharedCabModel[] = [];

  @Output() stateChange = new EventEmitter<BookingState>();
  /** Ask the parent to switch to the "Choose Seat" tab for the given cab. */
  @Output() chooseSeat = new EventEmitter<SharedCabModel>();

  /** Opens the seat map so the user can pick their own seat(s) for this cab. */
  onChooseSeat(cab: SharedCabModel, event: Event) {
    event.stopPropagation();
    this.chooseSeat.emit(cab);
  }

  seatSummary(cab: SharedCabModel): { available: Seat[]; booked: Seat[] } {
    return {
      available: cab.seats.filter((s: Seat) => s.status === 'available'),
      booked: cab.seats.filter((s: Seat) => s.status === 'booked'),
    };
  }

  /** True only when seats have actually been chosen for this cab. */
  isSelected(cab: SharedCabModel): boolean {
    return (
      this.state.selectedSharedCab?.id === cab.id &&
      this.state.selectedSeats.length > 0
    );
  }

  /** True when this cab's seat map is open but seats not yet confirmed. */
  isViewing(cab: SharedCabModel): boolean {
    return (
      this.state.selectedSharedCab?.id === cab.id &&
      this.state.selectedSeats.length === 0
    );
  }

  parseTimeToMinutes(timeStr: string): number {
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  }

  getCurrentTimeInMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  getCabTimeStatus(cab: SharedCabModel): 'past' | 'nearest' | 'upcoming' {
    const currentMins = this.getCurrentTimeInMinutes();
    const cabMins = this.parseTimeToMinutes(cab.departureTime);

    if (cabMins < currentMins) {
      return 'past';
    }

    const diff = cabMins - currentMins;

    // Highlight any cab departing within 30 minutes in green
    if (diff <= 30) {
      return 'nearest';
    }

    // Fallback: highlight the next single upcoming cab if none are within 30 minutes
    const upcomingCabs = this.sharedCabs.filter(c => {
      const mins = this.parseTimeToMinutes(c.departureTime);
      return mins >= currentMins;
    });

    if (upcomingCabs.length > 0) {
      const sorted = [...upcomingCabs].sort((a, b) => {
        return this.parseTimeToMinutes(a.departureTime) - this.parseTimeToMinutes(b.departureTime);
      });
      if (sorted[0].id === cab.id) {
        return 'nearest';
      }
    }

    return 'upcoming';
  }
}