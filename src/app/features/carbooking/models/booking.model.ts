export interface City {
  id: number;
  name: string;
  state: string;
  flag: string;
  country: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface TimeSlot {
  label: string;
  time: string;
  icon: string;
}

/** A single seat inside a shared cab's seat map. */
export interface Seat {
  /** e.g. "A1", "B2" */
  id: string;
  /** Row label used to group seats visually, e.g. "A", "B", "C" */
  row: string;
  /** Position of the seat within its row, left to right */
  position: number;
  status: 'available' | 'booked' | 'selected';
}

export type SharedVehicleType = '4-seater' | '6-seater' | '7-seater';

export interface SharedCab {
  id: string;
  cabNumber: string;
  vehicleName: string;
  vehicleType: SharedVehicleType;
  driverName: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  farePerSeat: number;
  rating: number;
  seats: Seat[];
  distanceFromUser: number;   // in km
  directionFromUser: string;   // e.g. "North", "South-West"
  startTime: string;           // e.g. "08:15 AM"
  nearestPickupPoint: string;  // e.g. "Terminal 2 Gate 3"
  reachPickupTime: string;     // e.g. "09:15 AM"
}

export interface BookingState {
  selectedCountry: string;
  tripType: 'one-way' | 'round-trip';
  selectedFromCity: City | null;
  selectedToCity: City | null;
  fromInput: string;
  toInput: string;
  selectedDate: string;
  returnDate: string;
  selectedTime: TimeSlot | null;
  returnTime: TimeSlot | null;

  // Shared cab
  selectedSharedCab: SharedCab | null;
  selectedSeat: Seat | null;        // last selected (kept for compat)
  selectedSeats: Seat[];            // all chosen seats (multi-seat booking)
  seatCount: number;                // how many seats the user wants

  bookingRefId: string;
}