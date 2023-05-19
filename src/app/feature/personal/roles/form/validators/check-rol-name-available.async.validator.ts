import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolService } from '../../rol.service';

//de validación personalizada que verifica si un nombre de rol está disponible o no rolServicey devuelve un error de validación si el nombre de rol no está disponible.
export function checkRolNameIsAvailable(
  rolService: RolService,
  role_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return rolService
      .checkRolNameIsAvailable(control.value, role_id)
      .pipe(
        map((isAvailable) =>
          isAvailable ? null : { checkRolNameIsAvailable: true }
        )
      );
  };
}

