import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../../../feature/personal/usuarios/usuario.service';

export function checkPasswordMatch(
  usuarioService: UsuarioService,
  user_id: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (control.value) {
      return usuarioService
        .checkPasswordMatch(control.value, user_id)
        .pipe(map((isMatch) => (isMatch ? null : { checkPasswordMatch: true })));
    } else {
      return of(null);
    }
  };
}

