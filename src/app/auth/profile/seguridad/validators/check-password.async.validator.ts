import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';


export function checkPasswordMatch(
  usuarioHttpService: UsuarioHttpService,
  user_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.value) {
      return usuarioHttpService
        .checkPasswordMatch(control.value, user_id)
        .pipe(map((isMatch) => (isMatch ? null : { checkPasswordMatch: true })));
    } else {
      return of(null);
    }
  };
}

