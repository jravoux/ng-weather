import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-selection-text-input',
  templateUrl: './selection-text-input.component.html',
  styleUrls: ['./selection-text-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionTextInputComponent),
      multi: true,
    },
  ],
})
export class SelectionTextInputComponent implements ControlValueAccessor {
  @Input() public inputClass = '';
  @Input() public placeholder = '';
  @Input() public itemLabel: string | undefined = undefined;
  @Input() public itemValue: string | undefined = undefined;
  @Input() public selectionList: Array<any> = [];

  @Output() public filterList: EventEmitter<any> = new EventEmitter<any>();

  public fieldValue: string | null = null;
  public currentValue = null;
  public showSelectionList = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private readonly cdr: ChangeDetectorRef) {}

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(value: any) {
    let valueFromList = null;
    if (value) {
      valueFromList = this.selectionList.find(
        (item) => UtilsService.getValueFromData(item, this.itemValue) === value
      );
    }
    this.setCurrentValue(valueFromList);
    this.cdr.markForCheck();
  }

  public onBlur() {
    this.onTouched();
    this.showSelectionList = false;
  }

  public onFocus() {
    this.showSelectionList = true;
  }

  public onInput(event: Event) {
    const value = (<HTMLInputElement>event.target).value;
    if (this.currentValue) {
      this.setCurrentValue(null);
      this.onChange(null);
    }
    this.fieldValue = value;
    this.filterList.emit(value);
  }

  public selectValue(value: any) {
    this.setCurrentValue(value);
    this.onChange(UtilsService.getValueFromData(value, this.itemValue));
    this.filterList.emit('');
  }

  private setCurrentValue(value: any) {
    this.currentValue = value;
    this.fieldValue = UtilsService.getValueFromData(value, this.itemLabel);
  }
}
