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

export interface CarCategory {
  id: string;
  name: string;
  type: string;
  icon: string;
  seats: number;
  bags: number;
  basePrice: number;
  badge?: string;
  features: string[];
  rating: number;
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
  selectedCar: CarCategory | null;
  bookingRefId: string;
}
