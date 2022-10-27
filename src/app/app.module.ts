import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ActionButtonComponent } from './action-button/action-button.component';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { CurrentConditionCardComponent } from './current-condition-card/current-condition-card.component';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CountryCodeToLabelPipe } from './pipes/country-code-to-label.pipe';
import { SelectionListLabelPipe } from './pipes/selection-list-label.pipe';
import { SelectionTextInputComponent } from './selection-text-input/selection-text-input.component';
import { CountryCode, CountryService } from './services/country.service';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    ActionButtonComponent,
    CountryCodeToLabelPipe,
    SelectionTextInputComponent,
    SelectionListLabelPipe,
    CurrentConditionCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    LocationService,
    WeatherService,
    CountryService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (countryService: CountryService) =>
        (): Observable<Array<CountryCode>> =>
          countryService.init(),
      deps: [CountryService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
