import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { VOID } from '../operators/map-to-void.operator';
import { UtilsService } from './utils.service';
import { WeatherService } from './weather.service';

export const LOCATIONS = 'locations';
export const INIT_INTERVAL = 500;

export interface LocationData {
  zipCountry: string;
  zip: string;
  country: string;
}

@Injectable()
export class LocationService implements OnDestroy {
  private readonly locationsData$: Subject<Array<LocationData>> =
    new BehaviorSubject<Array<LocationData>>([]);
  private readonly destroyed$: Subject<void> = new Subject<void>();

  private locationsData: Array<LocationData> = [];

  constructor(private readonly weatherService: WeatherService) {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      const locationsToProcess: Array<string> = JSON.parse(locString);

      if (locationsToProcess.length > 0) {
        timer(0, INIT_INTERVAL)
          .pipe(
            takeUntil(this.destroyed$),
            takeWhile((i) => i < locationsToProcess.length),
            map((i) => locationsToProcess[i].split(',')),
            switchMap(([zipcode, countryCode]) =>
              this.addLocation(zipcode, countryCode)
            )
          )
          .subscribe();
      }
    }

    this.locationsData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((locations) =>
        localStorage.setItem(
          LOCATIONS,
          JSON.stringify(locations.map((location) => location.zipCountry))
        )
      );
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getLocations$(): Observable<Array<LocationData>> {
    return this.locationsData$.asObservable();
  }

  public addLocation(zipcode: string, countryCode: string): Observable<void> {
    if (!zipcode || !countryCode) {
      return VOID;
    }

    const zipCountry = UtilsService.formatZipCountryCode(zipcode, countryCode);
    if (this.locationsData.some((loc) => loc.zipCountry === zipCountry)) {
      return VOID;
    }

    return this.weatherService
      .addCurrentConditions(zipcode, countryCode)
      .pipe(
        tap(() => this.addLocationToList(zipCountry, zipcode, countryCode))
      );
  }

  public removeLocation(zipCountryCode: string) {
    this.locationsData = this.locationsData.filter(
      (location) => location.zipCountry !== zipCountryCode
    );
    this.locationsData$.next(this.locationsData);
    this.weatherService.removeCurrentConditions(zipCountryCode);
  }

  private addLocationToList(zipCountry: string, zip: string, country: string) {
    this.locationsData = [
      ...this.locationsData,
      {
        zipCountry,
        zip,
        country,
      },
    ];
    this.locationsData$.next(this.locationsData);
  }
}
