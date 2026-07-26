import { Country, City, TimeSlot, CarCategory } from './models/booking.model';

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India',          flag: '🇮🇳' },
  { code: 'US', name: 'United States',  flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'UAE',            flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore',      flag: '🇸🇬' },
  { code: 'AU', name: 'Australia',      flag: '🇦🇺' },
  { code: 'CA', name: 'Canada',         flag: '🇨🇦' },
  { code: 'DE', name: 'Germany',        flag: '🇩🇪' },
  { code: 'FR', name: 'France',         flag: '🇫🇷' },
  { code: 'JP', name: 'Japan',          flag: '🇯🇵' },
];

export const CITIES: City[] = [
  // India
  { id: 1,  name: 'Mumbai',        state: 'Maharashtra',   flag: '🇮🇳', country: 'IN' },
  { id: 2,  name: 'Delhi',         state: 'NCR',           flag: '🇮🇳', country: 'IN' },
  { id: 3,  name: 'Bangalore',     state: 'Karnataka',     flag: '🇮🇳', country: 'IN' },
  { id: 4,  name: 'Chennai',       state: 'Tamil Nadu',    flag: '🇮🇳', country: 'IN' },
  { id: 5,  name: 'Hyderabad',     state: 'Telangana',     flag: '🇮🇳', country: 'IN' },
  { id: 6,  name: 'Kolkata',       state: 'West Bengal',   flag: '🇮🇳', country: 'IN' },
  { id: 7,  name: 'Pune',          state: 'Maharashtra',   flag: '🇮🇳', country: 'IN' },
  { id: 8,  name: 'Ahmedabad',     state: 'Gujarat',       flag: '🇮🇳', country: 'IN' },
  { id: 9,  name: 'Jaipur',        state: 'Rajasthan',     flag: '🇮🇳', country: 'IN' },
  { id: 10, name: 'Surat',         state: 'Gujarat',       flag: '🇮🇳', country: 'IN' },
  { id: 11, name: 'Lucknow',       state: 'Uttar Pradesh', flag: '🇮🇳', country: 'IN' },
  { id: 12, name: 'Goa',           state: 'Goa',           flag: '🇮🇳', country: 'IN' },
  { id: 13, name: 'Kochi',         state: 'Kerala',        flag: '🇮🇳', country: 'IN' },
  { id: 14, name: 'Chandigarh',    state: 'Punjab',        flag: '🇮🇳', country: 'IN' },
  { id: 15, name: 'Bhopal',        state: 'Madhya Pradesh',flag: '🇮🇳', country: 'IN' },
  // USA
  { id: 16, name: 'New York',      state: 'New York',      flag: '🇺🇸', country: 'US' },
  { id: 17, name: 'Los Angeles',   state: 'California',    flag: '🇺🇸', country: 'US' },
  { id: 18, name: 'Chicago',       state: 'Illinois',      flag: '🇺🇸', country: 'US' },
  { id: 19, name: 'Houston',       state: 'Texas',         flag: '🇺🇸', country: 'US' },
  { id: 20, name: 'San Francisco', state: 'California',    flag: '🇺🇸', country: 'US' },
  // UK
  { id: 21, name: 'London',        state: 'England',       flag: '🇬🇧', country: 'GB' },
  { id: 22, name: 'Manchester',    state: 'England',       flag: '🇬🇧', country: 'GB' },
  { id: 23, name: 'Birmingham',    state: 'England',       flag: '🇬🇧', country: 'GB' },
  { id: 24, name: 'Edinburgh',     state: 'Scotland',      flag: '🇬🇧', country: 'GB' },
  // UAE
  { id: 25, name: 'Dubai',         state: 'Dubai',         flag: '🇦🇪', country: 'AE' },
  { id: 26, name: 'Abu Dhabi',     state: 'Abu Dhabi',     flag: '🇦🇪', country: 'AE' },
  { id: 27, name: 'Sharjah',       state: 'Sharjah',       flag: '🇦🇪', country: 'AE' },
  // Singapore
  { id: 28, name: 'Singapore',     state: 'Central',       flag: '🇸🇬', country: 'SG' },
  { id: 29, name: 'Jurong',        state: 'West Region',   flag: '🇸🇬', country: 'SG' },
  // Australia
  { id: 30, name: 'Sydney',        state: 'New South Wales',flag: '🇦🇺', country: 'AU' },
  { id: 31, name: 'Melbourne',     state: 'Victoria',      flag: '🇦🇺', country: 'AU' },
  { id: 32, name: 'Brisbane',      state: 'Queensland',    flag: '🇦🇺', country: 'AU' },
  // Canada
  { id: 33, name: 'Toronto',       state: 'Ontario',       flag: '🇨🇦', country: 'CA' },
  { id: 34, name: 'Vancouver',     state: 'BC',            flag: '🇨🇦', country: 'CA' },
  { id: 35, name: 'Montreal',      state: 'Quebec',        flag: '🇨🇦', country: 'CA' },
  // Germany
  { id: 36, name: 'Berlin',        state: 'Berlin',        flag: '🇩🇪', country: 'DE' },
  { id: 37, name: 'Munich',        state: 'Bavaria',       flag: '🇩🇪', country: 'DE' },
  { id: 38, name: 'Frankfurt',     state: 'Hesse',         flag: '🇩🇪', country: 'DE' },
  // France
  { id: 39, name: 'Paris',         state: 'Île-de-France', flag: '🇫🇷', country: 'FR' },
  { id: 40, name: 'Lyon',          state: 'Auvergne',      flag: '🇫🇷', country: 'FR' },
  { id: 41, name: 'Marseille',     state: 'PACA',          flag: '🇫🇷', country: 'FR' },
  // Japan
  { id: 42, name: 'Tokyo',         state: 'Tokyo',         flag: '🇯🇵', country: 'JP' },
  { id: 43, name: 'Osaka',         state: 'Osaka',         flag: '🇯🇵', country: 'JP' },
  { id: 44, name: 'Kyoto',         state: 'Kyoto',         flag: '🇯🇵', country: 'JP' },
];

export const TIME_SLOTS: TimeSlot[] = [
  { label: 'Early Morning', time: '06:00 AM', icon: 'bi-sunrise-fill' },
  { label: 'Morning',       time: '09:00 AM', icon: 'bi-sun-fill' },
  { label: 'Noon',          time: '12:00 PM', icon: 'bi-brightness-high-fill' },
  { label: 'Afternoon',     time: '03:00 PM', icon: 'bi-sun' },
  { label: 'Evening',       time: '06:00 PM', icon: 'bi-sunset-fill' },
  { label: 'Night',         time: '09:00 PM', icon: 'bi-moon-stars-fill' },
];

export const CAR_CATEGORIES: CarCategory[] = [
  {
    id: 'sedan',
    name: 'Sedan Executive',
    type: 'Swift Dzire, Toyota Etios or similar',
    icon: 'bi-car-front-fill',
    seats: 4,
    bags: 2,
    basePrice: 1850,
    badge: 'Popular',
    features: ['Air Conditioning', 'GPS Tracking', 'Luggage Carrier', 'Free Cancellation'],
    rating: 4.8
  },
  {
    id: 'suv',
    name: 'SUV Premium',
    type: 'Ertiga, Innova Crysta or similar',
    icon: 'bi-truck-front-fill',
    seats: 6,
    bags: 4,
    basePrice: 2850,
    badge: 'Spacious',
    features: ['Extra Legroom', 'Reclining Seats', 'Roof Carrier', 'Clean Sanitized'],
    rating: 4.9
  },
  {
    id: 'luxury',
    name: 'Luxury Suite',
    type: 'Mercedes E-Class, BMW 5 Series',
    icon: 'bi-gem',
    seats: 4,
    bags: 3,
    basePrice: 5500,
    badge: 'VIP',
    features: ['Leather Upholstery', 'Chauffeur in Suit', 'Free Wi-Fi', 'Bottled Water'],
    rating: 5.0
  },
  {
    id: 'hatchback',
    name: 'Economy Compact',
    type: 'WagonR, Swift Hatchback',
    icon: 'bi-car-front',
    seats: 4,
    bags: 1,
    basePrice: 1250,
    features: ['Fuel Included', 'Standard AC', 'Basic GPS', 'Compact Parking'],
    rating: 4.6
  },
];
