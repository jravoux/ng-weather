import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationData, LocationService } from '../services/location.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-current-condition-card',
  templateUrl: './current-condition-card.component.html',
  styleUrls: ['./current-condition-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionCardComponent implements OnInit {
  @Input() public location: LocationData;

  public currentCondition$: Observable<any>;

  constructor(
    public readonly weatherService: WeatherService,
    public readonly locationService: LocationService,
    private readonly router: Router
  ) {}

  public ngOnInit() {
    this.currentCondition$ = this.weatherService.getCurrentCondition$(
      this.location.zipCountry
    );
  }

  public showForecast(zipcode: string, countryCode: string) {
    this.router.navigate(['/forecast', countryCode, zipcode]);
  }
}
