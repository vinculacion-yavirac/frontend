import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {data} from "../tipos-identificacion/data";
import {Subscription} from "rxjs";
import {tipoSolicitud} from "./tipo-solicitud";

@Component({
  selector: 'app-tipo-solicitudes-combobox',
  templateUrl: './tipo-solicitudes-combobox.component.html',
  styleUrls: ['./tipo-solicitudes-combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TipoSolicitudesComboboxComponent),
      multi: true,
    },
  ],
})
export class TipoSolicitudesComboboxComponent implements OnInit {

  tipoSolicitudesFormControl = new FormControl('', [Validators.required]);

  tipoSolicitudes: any[] = tipoSolicitud;

  private sub?: Subscription;
  onTouchedCb?: () => void;

  constructor() {}

  writeValue(obj: any): void {
    obj && this.tipoSolicitudesFormControl.setValue(obj);
  }

  registerOnChange(fn: any): void {
    this.sub = this.tipoSolicitudesFormControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.tipoSolicitudesFormControl.disable()
      : this.tipoSolicitudesFormControl.enable();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.IsDisabled();
  }

  IsDisabled(): void {
    if (
      this.tipoSolicitudes == null ||
      this.tipoSolicitudes.length == 0
    ) {
      this.tipoSolicitudesFormControl.disable();
    }
  }

}
