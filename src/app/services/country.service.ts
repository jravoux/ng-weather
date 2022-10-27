import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CountryCode {
  name: string;
  code: string;
}

@Injectable()
export class CountryService {
  private _countries!: Array<CountryCode>;

  constructor(private readonly http: HttpClient) {}

  public get countries(): Array<CountryCode> {
    return this._countries;
  }

  public init(): Observable<Array<CountryCode>> {
    return this.http
      .get<Array<CountryCode>>(`assets/countries.json`)
      .pipe(tap((countries) => (this._countries = countries)));
  }

  public getCountryCodeByCode(code: string): CountryCode | undefined {
    const upperCode = code.toUpperCase();
    return this._countries.find((c) => c.code === upperCode);
  }

  public filterCountries(value: string): Array<CountryCode> {
    const upperValue = value.toUpperCase();
    return this._countries.filter((c) =>
      c.name.toUpperCase().includes(upperValue)
    );
  }
}
