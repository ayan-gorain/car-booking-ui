import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City, Country } from '../../models/booking.model';

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './route-map.html',
})
export class RouteMap {
  @Input() fromCity: City | null = null;
  @Input() toCity: City | null = null;
  @Input() country: Country | null = null;
  @Input() tripType: 'one-way' | 'round-trip' = 'one-way';

  get isSameCity(): boolean {
    return !!this.fromCity && !!this.toCity && this.fromCity.id === this.toCity.id;
  }
}
