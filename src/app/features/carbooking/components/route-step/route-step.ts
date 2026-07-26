import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { City, Country, BookingState } from '../../models/booking.model';
import { RouteMap } from '../route-map/route-map';

@Component({
  selector: 'app-route-step',
  standalone: true,
  imports: [CommonModule, FormsModule, RouteMap],
  templateUrl: './route-step.html',
})
export class RouteStep {
  @Input() state!: BookingState;
  @Input() countries: Country[] = [];
  @Input() allCities: City[] = [];

  @Output() stateChange = new EventEmitter<BookingState>();
  @Output() nextStep = new EventEmitter<void>();

  fromDropdownOpen = false;
  toDropdownOpen = false;

  get selectedCountryObj(): Country {
    return this.countries.find(c => c.code === this.state.selectedCountry) ?? this.countries[0];
  }

  citiesForCountry(countryCode: string): City[] {
    return this.allCities.filter(c => c.country === countryCode);
  }

  fromSuggestions(): City[] {
    const pool = this.citiesForCountry(this.state.selectedCountry);
    if (!this.state.fromInput.trim()) return pool.slice(0, 6);
    const q = this.state.fromInput.toLowerCase();
    return pool.filter(c =>
      c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    ).slice(0, 8);
  }

  toSuggestions(): City[] {
    const pool = this.citiesForCountry(this.state.selectedCountry);
    if (!this.state.toInput.trim()) return pool.slice(0, 6);
    const q = this.state.toInput.toLowerCase();
    return pool.filter(c =>
      c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    ).slice(0, 8);
  }

  onCountryChange() {
    this.state.fromInput = '';
    this.state.toInput = '';
    this.state.selectedFromCity = null;
    this.state.selectedToCity = null;
    this.fromDropdownOpen = false;
    this.toDropdownOpen = false;
    this.emitChange();
  }

  onFromInput() {
    this.state.selectedFromCity = null;
    this.fromDropdownOpen = true;
    this.emitChange();
  }

  onToInput() {
    this.state.selectedToCity = null;
    this.toDropdownOpen = true;
    this.emitChange();
  }

  selectFromCity(city: City) {
    this.state.selectedFromCity = city;
    this.state.fromInput = city.name;
    this.fromDropdownOpen = false;
    this.emitChange();
  }

  selectToCity(city: City) {
    this.state.selectedToCity = city;
    this.state.toInput = city.name;
    this.toDropdownOpen = false;
    this.emitChange();
  }

  swapCities() {
    [this.state.selectedFromCity, this.state.selectedToCity] =
      [this.state.selectedToCity, this.state.selectedFromCity];
    [this.state.fromInput, this.state.toInput] =
      [this.state.toInput, this.state.fromInput];
    this.emitChange();
  }

  setTripType(type: 'one-way' | 'round-trip') {
    this.state.tripType = type;
    this.emitChange();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('#from-autocomplete-wrap')) this.fromDropdownOpen = false;
    if (!target.closest('#to-autocomplete-wrap')) this.toDropdownOpen = false;
  }

  isValid(): boolean {
    if (!this.state.selectedFromCity || !this.state.selectedToCity) return false;
    // Reject same city selection
    return this.state.selectedFromCity.id !== this.state.selectedToCity.id;
  }

  emitChange() {
    this.stateChange.emit(this.state);
  }

  onNext() {
    if (this.isValid()) {
      this.nextStep.emit();
    }
  }
}
