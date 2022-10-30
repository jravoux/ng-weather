import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import { retry, switchMap, takeUntil, tap } from 'rxjs/operators';
import { mapToVoid } from '../operators/map-to-void.operator';
import { UtilsService } from './utils.service';

export const POLLING_INTERVAL = 30000;

interface ConditionSubscription {
  data$: Subject<any>;
  subscription: Subscription;
}

@Injectable()
export class WeatherService implements OnDestroy {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private readonly destroyed$: Subject<void> = new Subject<void>();

  private conditionSubscriptions = new Map<string, ConditionSubscription>();

  constructor(private readonly http: HttpClient) {}

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public addCurrentConditions(
    zipcode: string,
    countryCode: string
  ): Observable<void> {
    return this.fetchConditionFromApi(zipcode, countryCode).pipe(
      tap((initialData) =>
        this.startPollingForCondition(initialData, zipcode, countryCode)
      ),
      mapToVoid()
    );
  }

  public removeCurrentConditions(zipCountryCode: string) {
    this.conditionSubscriptions.get(zipCountryCode)?.subscription.unsubscribe();
    this.conditionSubscriptions.delete(zipCountryCode);
  }

  public getCurrentCondition$(zipCountryCode: string): Observable<any> {
    return (
      this.conditionSubscriptions.get(zipCountryCode).data$.asObservable() ??
      EMPTY
    );
  }

  public getForecast(zipcode: string, countryCode: string): Observable<any> {
    return this.http.get(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},${countryCode}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  public getWeatherIcon(id) {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

  private startPollingForCondition(
    initialData: Object,
    zipcode: string,
    countryCode: string
  ) {
    const data$: Subject<any> = new BehaviorSubject<any>(initialData);

    const subscription = timer(POLLING_INTERVAL, POLLING_INTERVAL)
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(() => this.fetchConditionFromApi(zipcode, countryCode)),
        retry()
      )
      .subscribe((data: any) => data$.next(data));

    this.conditionSubscriptions.set(
      UtilsService.formatZipCountryCode(zipcode, countryCode),
      {
        data$,
        subscription,
      }
    );
  }

  private fetchConditionFromApi(zipcode: string, countryCode: string) {
    return this.http.get(
      `${WeatherService.URL}/weather?zip=${zipcode},${countryCode}&units=imperial&APPID=${WeatherService.APPID}`
    );
  }
}
