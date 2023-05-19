// Importaciones de Angular
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
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
 * Componente que muestra una lista desplegable de cantones.
 */
@Component({
  selector: 'combobox-cantons',
  templateUrl: './cantones.combobox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CantonsComboboxComponent),
      multi: true,
    },
  ],
})
export class CantonsComboboxComponent
  implements OnChanges, OnDestroy, ControlValueAccessor
{
  // Variables de instancia que no son inyectadas
  cantonFormControl = new FormControl({ value: '', disabled: true }, [
    Validators.required,
  ]);

  // Variables de clase que no son inyectadas
  cantons: any[] = [];

  // Variables de clase que son inyectadas
  @Input() province: string;
  @Input() canton: string;

  // Variables de clase que son inyectadas
  @Output() cantonSelected = new EventEmitter<boolean>();

  private sub?: Subscription;
  onTouchedCb?: () => void;

  /**
   * Constructor del componente.
   */
  constructor() {}

  /**
   * Establece el valor del control de formulario de canton.
   * @param obj El nuevo valor del control de formulario de canton.
   */
  writeValue(obj: any): void {
    this.cantonFormControl.setValue(obj);
  }

  /**
   * Registra una función para ser llamada cuando cambia el valor del control de formulario de canton.
   * @param fn La función a ser llamada cuando cambia el valor del control de formulario de canton.
   */
  registerOnChange(fn: any): void {
    this.sub = this.cantonFormControl.valueChanges.subscribe(fn);
  }

  /**
   * Registra una función para ser llamada cuando el control de formulario de canton es tocado.
   * @param fn La función a ser llamada cuando el control de formulario de canton es tocado.
   */
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  /**
   * Establece el estado de deshabilitado del control de formulario de canton.
   * @param isDisabled Si el control de formulario de provincia debe estar deshabilitado.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.cantonFormControl.disable()
      : this.cantonFormControl.enable();
  }
  /**
   * Realiza las tareas de limpieza necesarias cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /**
   * Método llamado cuando cambia algún valor de entrada del componente.
   * @param changes Objeto que contiene información sobre los cambios realizados.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['province']) {
      this.getCantones();
    }

    if (this.cantons.length) {
      this.cantonFormControl.enable();
    }
  }

  /**
   * Obtiene la lista de cantones disponibles para la provincia seleccionada.
   */
  getCantones(): void {
    const provinces: any[] = data;
    if (this.province) {
      this.cantons = provinces
        .filter((p) => p.provincia === this.province.toUpperCase())
        .flatMap((p) => p.cantones)
        .map((c: any) => capitalize(c.canton))
        .sort();
    }
  }

  /**
   * Emite un evento cuando se selecciona un canton.
   */
  CantonSelected(): void {
    this.cantonSelected.emit(true);
  }
}
