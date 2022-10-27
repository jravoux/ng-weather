import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CountryCode, CountryService } from '../services/country.service';
import { LocationService } from '../services/location.service';
import { ZipcodeFormValidators } from '../validators/zipcode-form.validators';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css'],
})
export class ZipcodeEntryComponent implements OnInit, OnDestroy {
  public countries$: Subject<Array<CountryCode>> = new BehaviorSubject<
    Array<CountryCode>
  >(this.countryService.countries);

  public form: FormGroup = this.fb.group(
    {
      zipCode: this.fb.control(null, Validators.required),
      countryCode: this.fb.control(null, Validators.required),
    },
    {
      validators: ZipcodeFormValidators.codeAlreadyPresent(
        () => this.alreadyRegisteredLocations ?? []
      ),
    }
  );

  private readonly destroyed$: Subject<void> = new Subject<void>();

  private alreadyRegisteredLocations: Array<string> = [];

  constructor(
    private readonly locationService: LocationService,
    private readonly fb: FormBuilder,
    private readonly countryService: CountryService
  ) {}

  public ngOnInit() {
    this.locationService
      .getLocations$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (locations) =>
          (this.alreadyRegisteredLocations = locations.map(
            (location) => location.zipCountry
          ))
      );
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public addLocation(): Observable<void> {
    return this.locationService
      .addLocation(this.getZipcode(), this.getCountryCode())
      .pipe(tap(() => this.form.reset()));
  }

  public filterList(value: string) {
    this.countries$.next(
      value.length > 0
        ? this.countryService.filterCountries(value)
        : this.countryService.countries
    );
  }

  private getZipcode: () => string = () => this.form.value.zipCode;
  private getCountryCode: () => string = () => this.form.value.countryCode;
}
