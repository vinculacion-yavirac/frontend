import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../usuario.service';

export function checkEmailIsAvailable(
  usuarioService: UsuarioService,
  user_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return usuarioService
      .checkEmailIsAvailable(control.value, user_id)
      .pipe(
        map((isAvailable) =>
          isAvailable ? null : { checkEmailIsAvailable: true }
        )
      );
  };
}

