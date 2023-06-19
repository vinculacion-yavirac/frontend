import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {ProyectoModels} from "../../../models/proyecto/proyecto.models";
import {ProyectoService} from "../../../service/proyecto/proyecto.service";
import {MyErrorStateMatcher} from "../../matcher/error-state-matcher";


@Component({
  selector: 'app-proyecto-combobox',
  templateUrl: './proyecto-combobox.component.html',
  styleUrls: ['./proyecto-combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProyectoComboboxComponent),
      multi: true,
    },
  ],
})
export class ProyectoComboboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

// validators
  proyectoFormControl = new FormControl('', [Validators.required]);

  //Validación de errores en el formulario
  matcher = new MyErrorStateMatcher();

  proyectos: ProyectoModels[] = [];

  constructor(private proyectoService: ProyectoService) {}

  private sub?: Subscription;
  //propiedad privada que contiene una referencia a la suscripción que se crea cuando roleFormControl cambia el valor.
  onTouchedCb?: () => void;
  writeValue(obj: any): void {
    obj && this.proyectoFormControl.setValue(obj.id);
  }
  //registra una función que será llamada cuando el valor de los roleFormControl cambia
  registerOnChange(fn: any): void {
    this.sub = this.proyectoFormControl.valueChanges.subscribe(fn);
  }
  //registra una función que será llamada cuando se toque el control. La función se almacena en la onTouchedCbpropiedad para su uso posterior
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  // este método se usa para habilitar o deshabilitar el control según el isDisabledState booleano pasado.
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.proyectoFormControl.disable() : this.proyectoFormControl.enable();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getProyectos();
  }

  getProyectos(): void {
    this.proyectoService. getProject().subscribe((res: any) => {
      if (res.status === 'success') {
        this.proyectos = res.data.projects;
      }
    });
  }
}
