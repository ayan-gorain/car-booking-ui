import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeSlot, BookingState } from '../../models/booking.model';

@Component({
  selector: 'app-schedule-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-step.html',
})
export class ScheduleStep implements OnInit {
  @Input() state!: BookingState;
  @Input() timeSlots: TimeSlot[] = [];

  @Output() stateChange = new EventEmitter<BookingState>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();

  today = new Date().toISOString().split('T')[0];
  customTimeValue = '';

  ngOnInit() {
    // Automatically set today's date if empty
    if (!this.state.selectedDate) {
      this.state.selectedDate = this.today;
    }

    // Automatically set current time slot if not selected
    if (!this.state.selectedTime && this.timeSlots.length > 0) {
      this.state.selectedTime = this.getDefaultTimeSlot();
    }

    // Sync custom time input value
    if (this.state.selectedTime) {
      this.customTimeValue = this.convert12hTo24h(this.state.selectedTime.time);
    }
  }

  getDefaultTimeSlot(): TimeSlot {
    const currentHour = new Date().getHours();
    if (currentHour < 8) return this.timeSlots[0];  // 06:00 AM
    if (currentHour < 11) return this.timeSlots[1]; // 09:00 AM
    if (currentHour < 14) return this.timeSlots[2]; // 12:00 PM
    if (currentHour < 17) return this.timeSlots[3]; // 03:00 PM
    if (currentHour < 20) return this.timeSlots[4]; // 06:00 PM
    return this.timeSlots[5];                       // 09:00 PM
  }

  selectTime(slot: TimeSlot) {
    this.state.selectedTime = slot;
    this.customTimeValue = this.convert12hTo24h(slot.time);
    this.emitChange();
  }

  onCustomTimeChange() {
    if (this.customTimeValue) {
      const time12h = this.formatTime12Hour(this.customTimeValue);
      // Check if matches an existing slot label
      const matchedSlot = this.timeSlots.find(s => s.time === time12h);
      this.state.selectedTime = {
        label: matchedSlot ? matchedSlot.label : 'Custom Time',
        time: time12h,
        icon: matchedSlot ? matchedSlot.icon : 'bi-clock-history'
      };
      this.emitChange();
    }
  }

  convert12hTo24h(time12: string): string {
    if (!time12) return '12:00';
    const parts = time12.trim().split(' ');
    if (parts.length < 2) return time12;
    const [time, modifier] = parts;
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
    if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
    const hStr = h < 10 ? '0' + h : '' + h;
    return `${hStr}:${minutes || '00'}`;
  }

  formatTime12Hour(time24: string): string {
    if (!time24) return '12:00 PM';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const formattedH = h < 10 ? '0' + h : '' + h;
    return `${formattedH}:${m} ${ampm}`;
  }

  isValid(): boolean {
    const base = !!this.state.selectedDate && !!this.state.selectedTime;
    return this.state.tripType === 'round-trip' ? base && !!this.state.returnDate : base;
  }

  emitChange() {
    this.stateChange.emit(this.state);
  }

  onNext() {
    if (this.isValid()) {
      this.nextStep.emit();
    }
  }

  onPrev() {
    this.prevStep.emit();
  }
}
