import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  public static getValueFromData(
    data: any,
    fieldToRetrieve: string | undefined
  ): any {
    if (data && fieldToRetrieve && data.hasOwnProperty(fieldToRetrieve)) {
      return data[fieldToRetrieve];
    }
    return data;
  }

  public static formatZipCountryCode(zipcode: string, countryCode: string) {
    return `${zipcode},${countryCode}`;
  }
}
