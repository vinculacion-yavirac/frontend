import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordsMustBeEqual } from './validators/passwords-must-be-equal.validator';
import { checkPasswordMatch } from './validators/check-password.async.validator';
import { MyErrorStateMatcher } from '../../../../app/shared/matcher/error-state-matcher';
import { checkEmailIsAvailable } from '../../../feature/personal/usuarios/form/validators/check-email-available.async.validator';
import { AuthHttpService } from '../../../../app/service/auth/auth-http.service';
import { User } from 'src/app/models/auth/users/usuario';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';

@Component({
  selector: 'perfil-seguridad',
  templateUrl: './seguridad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSecurityComponent implements OnInit {
  // Variables de clase que son inyectadas
  currentUser = {} as User;
  loading: boolean = true;

  hide = true;

  // Variables de clase que son inyectadas por referencia
  matcher = new MyErrorStateMatcher();
  public formGroup: FormGroup;

  constructor(
    private authHttpService: AuthHttpService,
    private usuarioHttpService: UsuarioHttpService,
    public formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        id: [0],
        email: [
          '',
          {
            validators: [
              Validators.required,
              Validators.email,
              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'),
            ],
            asyncValidators: [
              (control: any) =>
                checkEmailIsAvailable(
                  this.usuarioHttpService,
                  this.currentUser.id
                )(control),
            ],
            updateOn: 'change',
          },
        ],
        password: [
          '',
          {
            validators: [Validators.minLength(8)],
            asyncValidators: [
              (control: any) =>
                checkPasswordMatch(
                  this.usuarioHttpService,
                  this.currentUser.id
                )(control),
            ],
            updateOn: 'change',
          },
        ],
        new_password: [
          {
            value: '',
            disabled: true,
          },
        ],
        new_password_confirmation: [
          {
            value: '',
            disabled: true,
          },
        ],
        role: [null],
        active: [true],
        created_at: [null],
        person: [null],
      },
      { validators: [passwordsMustBeEqual] }
    );

    this.formGroup.valueChanges.subscribe((value) => {
      value.person.identification_type = value.person.identification_type?.id;
      value.person.nationality = value.person.nationality?.id;

      this.currentUser = value;
    });
    this.formGroup.get('password')?.statusChanges.subscribe((status) => {
      if (status === 'VALID' && this.formGroup.get('password')?.value) {
        this.formGroup.get('new_password')?.enable();
        this.formGroup.get('new_password_confirmation')?.enable();
        this.formGroup
          .get('new_password')
          ?.setValidators([
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@.]{8,}$/),
          ]);
        this.formGroup
          .get('new_password_confirmation')
          ?.setValidators([Validators.required]);
      } else {
        this.formGroup.get('new_password')?.disable();
        this.formGroup.get('new_password_confirmation')?.disable();
        this.formGroup.get('new_password')?.clearValidators();
        this.formGroup.get('new_password_confirmation')?.clearValidators();
      }
      this.formGroup.get('new_password')?.updateValueAndValidity();
      this.formGroup.get('new_password_confirmation')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  onSubmit(): void {
    if (this.currentUser.id) {
      if (this.formGroup.valid) {
        this.updateUsuario();
        this.updatePassword();
      }
    }
  }

  getCurrentUser(): void {
    this.loading = true;

    this.authHttpService.getProfile().subscribe((res: any) => {
      if (res.status == 'success') {
        this.currentUser = res.data.user;
        this.formGroup.patchValue(this.currentUser);
      }
      this.loading = false;
    });
  }

  updateUsuario(): void {
    this.loading = true;

    this.usuarioHttpService
      .updateUsuario(this.currentUser)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.currentUser = res.data.user;
          this.formGroup.patchValue(this.currentUser);
        }
        this.loading = false;
      });
  }

  updatePassword(): void {
    this.loading = true;
    const password = {
      password: this.formGroup.get('new_password')?.value,
    };
    if (password.password) {
      this.usuarioHttpService
        .updatePassword(password, this.currentUser.id)
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.formGroup.get('password')?.reset();
            this.formGroup.get('new_password')?.reset();
            this.formGroup.get('new_password_confirmation')?.reset();
          }
        });
    }
    this.loading = true;
  }
}
