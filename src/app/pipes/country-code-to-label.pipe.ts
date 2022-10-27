import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode, CountryService } from '../services/country.service';

@Pipe({
  name: 'countryCodeToLabel',
})
export class CountryCodeToLabelPipe implements PipeTransform {
  constructor(private readonly countryService: CountryService) {}

  transform(countryCode: string | undefined | null): string {
    if ((countryCode?.length ?? 0) === 0) {
      return '';
    }

    const country: CountryCode | undefined =
      this.countryService.getCountryCodeByCode(countryCode);

    return country.name ?? '';
  }
}
