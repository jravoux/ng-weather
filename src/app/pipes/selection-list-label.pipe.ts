import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'selectionListLabel',
})
export class SelectionListLabelPipe implements PipeTransform {
  transform(
    item: any,
    itemLabel: string | undefined,
    fieldValue: string | null
  ): string {
    if (!item) {
      return '';
    }

    const label: string = String(
      UtilsService.getValueFromData(item, itemLabel) ?? ''
    );

    return this.highlightMatchingPart(label, fieldValue);
  }

  private highlightMatchingPart(label: string, searchedValue: string) {
    if (label.length > 0 && searchedValue?.length > 0) {
      const searchResult = new RegExp(searchedValue, 'i').exec(label);

      if (searchResult) {
        const valueStartIndex = searchResult.index;
        const valueEndIndex = valueStartIndex + searchedValue.length;

        return `${label.slice(0, valueStartIndex)}<b>${label.slice(
          valueStartIndex,
          valueEndIndex
        )}</b>${label.slice(valueEndIndex)}`;
      }
    }
    return label;
  }
}
