import { Component } from '@angular/core';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
})
export class CurrentConditionsComponent {
  public locations$ = this.locationService.getLocations$();

  constructor(private readonly locationService: LocationService) {}
}
