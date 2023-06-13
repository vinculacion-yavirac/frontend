import {Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../matcher/error-state-matcher";
import {ProyectoParticipanteModels} from "../../../../models/proyecto/ProjectParticipant/proyecto-participante.moduls";
import {
  ProyectoParticipanteHttpService
} from "../../../../service/proyecto/participante/proyecto-participante-http.service";
import {Subscription} from "rxjs";
import {ProyectoService} from "../../../../service/proyecto/proyecto.service";
import {ProyectoModels} from "../../../../models/proyecto/proyecto.models";

@Component({
  selector: 'app-proyectos-combobox',
  templateUrl: './proyectos-combobox.component.html',
  styleUrls: ['./proyectos-combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProyectosComboboxComponent),
      multi: true,
    },
  ],
})
export class ProyectosComboboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

// validators
  proyectosFormControl = new FormControl('', [Validators.required]);

  //Validación de errores en el formulario
  matcher = new MyErrorStateMatcher();

  proyectos: ProyectoModels[] = [];

  constructor(private proyectoService: ProyectoService) {}

  private sub?: Subscription;
  //propiedad privada que contiene una referencia a la suscripción que se crea cuando roleFormControl cambia el valor.
  onTouchedCb?: () => void;
  writeValue(obj: any): void {
    obj && this.proyectosFormControl.setValue(obj.id);
  }
  //registra una función que será llamada cuando el valor de los roleFormControl cambia
  registerOnChange(fn: any): void {
    this.sub = this.proyectosFormControl.valueChanges.subscribe(fn);
  }


  //registra una función que será llamada cuando se toque el control. La función se almacena en la onTouchedCbpropiedad para su uso posterior
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  // este método se usa para habilitar o deshabilitar el control según el isDisabledState booleano pasado.
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.proyectosFormControl.disable() : this.proyectosFormControl.enable();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.getProyectos();
  }

  getProyectos(): void {
    this.proyectoService.getProyecto().subscribe((res: any) => {
      if (res.status === 'success') {
        this.proyectos = res.data.projects;
      }
    });
  }
}
