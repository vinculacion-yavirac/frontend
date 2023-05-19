import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../usuario.service';

export function checkIdentificationIsAvailable(
  usuarioService: UsuarioService,
  user_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return usuarioService
      .checkIdentificationIsAvailable(control.value, user_id)
      .pipe(
        map((isAvailable) =>
          isAvailable ? null : { checkIdentificationIsAvailable: true }
        )
      );
  };
}
