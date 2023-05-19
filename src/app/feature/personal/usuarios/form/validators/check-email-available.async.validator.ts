import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';


export function checkEmailIsAvailable(
  usuarioHttpService: UsuarioHttpService,
  user_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return usuarioHttpService
      .checkEmailIsAvailable(control.value, user_id)
      .pipe(
        map((isAvailable) =>
          isAvailable ? null : { checkEmailIsAvailable: true }
        )
      );
  };
}

