import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {StatusSolicitud} from "./estado-solicitud";

@Component({
  selector: 'app-estados-solicitud-combobox',
  templateUrl: './estados-solicitud-combobox.component.html',
  styleUrls: ['./estados-solicitud-combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EstadosSolicitudComboboxComponent),
      multi: true,
    },
  ],
})
export class EstadosSolicitudComboboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

  estadosSolicitudFormControl = new FormControl('', [Validators.required]);

  estadoSolicitudes: any[] = StatusSolicitud;

  private sub?: Subscription;
  onTouchedCb?: () => void;

  constructor() {}

  writeValue(obj: any): void {
    obj && this.estadosSolicitudFormControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.sub = this.estadosSolicitudFormControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.estadosSolicitudFormControl.disable()
      : this.estadosSolicitudFormControl.enable();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.IsDisabled();
  }

  IsDisabled(): void {
    if (
      this.estadoSolicitudes == null ||
      this.estadoSolicitudes.length == 0
    ) {
      this.estadosSolicitudFormControl.disable();
    }
  }
}
