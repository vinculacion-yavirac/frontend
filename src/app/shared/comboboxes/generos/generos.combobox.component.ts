import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { data } from './data';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'combobox-genders',
  templateUrl: './generos.combobox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GendersComboboxComponent),
      multi: true,
    },
  ],
})
export class GendersComboboxComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  // validators
  genderFormControl = new FormControl('');
  genders: any[] = data;

  private sub?: Subscription;
  onTouchedCb?: () => void;

  constructor() {}

  writeValue(obj: any): void {
    obj && this.genderFormControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.sub = this.genderFormControl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.genderFormControl.disable()
      : this.genderFormControl.enable();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.IsDisabled();
  }

  IsDisabled(): void {
    if (this.genders == null || this.genders.length == 0) {
      this.genderFormControl.disable();
    }
  }
}
