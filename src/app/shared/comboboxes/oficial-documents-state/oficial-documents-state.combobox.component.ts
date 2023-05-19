import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { data } from './data';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

@Component({
  selector: 'combobox-oficial-documents-state',
  templateUrl: './oficial-documents-state.combobox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OficialDocumentsStatesComboboxComponent),
      multi: true,
    },
  ],
})
export class OficialDocumentsStatesComboboxComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  oficialDocumentsStateFormControl = new FormControl('', [Validators.required]);

  oficialDocumentsStates: any[] = data;

  private sub?: Subscription;
  onTouchedCb?: () => void;

  constructor() {}

  writeValue(obj: any): void {
    obj && this.oficialDocumentsStateFormControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.sub = this.oficialDocumentsStateFormControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.oficialDocumentsStateFormControl.disable()
      : this.oficialDocumentsStateFormControl.enable();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
     this.IsDisabled();
  }

  IsDisabled(): void {
    if (
      this.oficialDocumentsStates == null ||
      this.oficialDocumentsStates.length == 0
    ) {
      this.oficialDocumentsStateFormControl.disable();
    }
  }
}
