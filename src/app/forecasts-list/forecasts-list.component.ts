import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  countryCode: string;
  zipcode: string;
  forecast: any;

  constructor(
    public readonly weatherService: WeatherService,
    private readonly route: ActivatedRoute
  ) {
    route.params.subscribe((params) => {
      this.countryCode = params['countryCode'];
      this.zipcode = params['zipcode'];
      weatherService
        .getForecast(this.zipcode, this.countryCode)
        .subscribe((data) => (this.forecast = data));
    });
  }
}
