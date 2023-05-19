// Importaciones de Angular
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

// Importaciones de terceros
import { data } from '../data';
import { capitalize } from '../../../helpers/capitalize.str.component';

/**
 * Componente que muestra una lista desplegable de provincias.
 */
@Component({
  selector: 'combobox-provinces',
  templateUrl: './provincias.combobox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProvincesComboboxComponent),
      multi: true,
    },
  ],
})
export class ProvincesComboboxComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  // Variables de instancia que no son inyectadas
  provinceFormControl = new FormControl('', [ Validators.required ]);

  // Variables de clase que no son inyectadas
  provinces: any[] = data;

  // Variables de instancia que son inyectadas
  @Input() province: string;

  // Variables de clase que son inyectadas
  @Output() provinceSelected = new EventEmitter<boolean>();

  private sub?: Subscription;
  onTouchedCb?: () => void;

  /**
   * Constructor del componente.
   */
  constructor() {}

  /**
   * Establece el valor del control de formulario de provincia.
   * @param obj El nuevo valor del control de formulario de provincia.
   */
  writeValue(obj: any): void {
    this.provinceFormControl.setValue(obj);
  }

  /**
   * Registra una función para ser llamada cuando cambia el valor del control de formulario de provincia.
   * @param fn La función a ser llamada cuando cambia el valor del control de formulario de provincia.
   */
  registerOnChange(fn: any): void {
    this.sub = this.provinceFormControl.valueChanges.subscribe(fn);
  }

  /**
   * Registra una función para ser llamada cuando el control de formulario de provincia es tocado.
   * @param fn La función a ser llamada cuando el control de formulario de provincia es tocado.
   */
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  /**
   * Establece el estado de deshabilitado del control de formulario de provincia.
   * @param isDisabled Si el control de formulario de provincia debe estar deshabilitado.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.provinceFormControl.disable()
      : this.provinceFormControl.enable();
  }
  /**
   * Realiza las tareas de limpieza necesarias cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.provinces = this.provinces.map((p) => capitalize(p.provincia)).sort();
  }

  /**
   * Emite un evento cuando se selecciona una provincia.
   */
  ProvinceSelected(): void {
    this.provinceSelected.emit(true);
  }
}
