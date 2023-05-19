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
 * Componente que muestra una lista desplegable de parroquias.
 */
@Component({
  selector: 'combobox-parishes',
  templateUrl: './parroquias.combobox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParishesComboboxComponent),
      multi: true,
    },
  ],
})
export class ParishesComboboxComponent
  implements OnChanges, OnDestroy, ControlValueAccessor
{
  // Variables de instancia que no son inyectadas
  parishFormControl = new FormControl({ value: '', disabled: true }, [
    Validators.required,
  ]);

  // Variables de clase que no son inyectadas
  parishes: any[] = [];

  // Variables de instancia que son inyectadas
  @Input() province: string;
  @Input() canton: string;
  @Input() parish: string;

  // Variables de clase que son inyectadas
  @Output() parishEmitter = new EventEmitter<string>();

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
    this.parishFormControl.setValue(obj);
  }

  /**
   * Registra una función para ser llamada cuando cambia el valor del control de formulario de provincia.
   * @param fn La función a ser llamada cuando cambia el valor del control de formulario de provincia.
   */
  registerOnChange(fn: any): void {
    this.sub = this.parishFormControl.valueChanges.subscribe(fn);
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
      ? this.parishFormControl.disable()
      : this.parishFormControl.enable();
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
    if (changes['province'] && !changes['province'].firstChange) {
      this.parishes = [];
    }

    if (changes['canton']) {
      this.getParishes();
    }

    if (this.parishes.length) {
      this.parishFormControl.enable();
    }
  }

  /**
   * Obtiene la lista de parroquias disponibles para el cantón seleccionado.
   */
  getParishes(): void {
    if (this.canton) {
      this.parishes = data
        .flatMap((p: any) => p.cantones)
        .filter((c) => c.canton === this.canton.toUpperCase())
        .flatMap((c) => Object.values(c.parroquias))
        .map((p: any) => capitalize(p))
        .sort();
    }
  }
}
