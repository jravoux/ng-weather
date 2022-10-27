import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UtilsService } from '../services/utils.service';

export class ZipcodeFormValidators {
  public static codeAlreadyPresent(valuesFn: () => Array<string>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const zipcode = control.get('zipCode')?.value;
      const countryCode = control.get('countryCode')?.value;
      const present = valuesFn().includes(
        UtilsService.formatZipCountryCode(zipcode, countryCode)
      );
      return present ? { codeAlreadyPresent: true } : null;
    };
  }
}
