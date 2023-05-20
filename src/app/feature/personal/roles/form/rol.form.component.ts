import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { checkRolNameIsAvailable } from './validators/check-rol-name-available.async.validator';
import { MyErrorStateMatcher } from '../../../../../app/shared/matcher/error-state-matcher';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';
import { Role } from 'src/app/models/auth/role/rol';
import { RolHttpService } from 'src/app/service/auth/role/rol-http.service';

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol.form.component.html',
})
export class RolesFormComponent implements OnInit {
  public formGroup: FormGroup;

  //validación de errores en el formulario
  matcher = new MyErrorStateMatcher();

  currentRole: Role = {} as Role;

  //loading
  loading = true;
  //title
  title = 'Nuevo Rol';

  constructor(
    private RolHttpService: RolHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      name: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern('[A-Za-záéíóúñÁÉÍÓÚÑ0-9,.!?\\-_\\s]{3,}'),
          ],
          asyncValidators: [
            (control: any) =>
              checkRolNameIsAvailable(
                this.RolHttpService,
                this.currentRole.id
              )(control),
          ],
          updateOn: 'change',
        },
      ],
      permissions: [[], [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.currentRole = data;
    });
  }

  ngOnInit(): void {
    // obtención de los parámetros de la url para la edición de un rol
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.title = 'Editar Rol';
        this.getRole(params.id);
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  // función para enviar los datos del formulario
  onSubmit() {
    if (this.formGroup.valid) {
      if (this.currentRole.id) {
        this.updateRole();
      } else {
        this.addRole();
      }
    }
  }

  // función para obtener un rol
  getRole(id: number) {
    this.RolHttpService.getRol(id).subscribe((res: any) => {
      if (res.status == 'success') {
        this.currentRole = res.data.role;
        this.formGroup.patchValue(this.currentRole);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  }

  // función para agregar un rol
  addRole() {
    this.RolHttpService.addRol(this.currentRole).subscribe((res: any) => {
      if (res.status == 'success') {
        this.router.navigate(['system/personal/roles']);
      }
    });
  }

  // función para actualizar un rol
  updateRole() {
    this.RolHttpService.updateRol(this.currentRole).subscribe((res: any) => {
      if (res.status == 'success') {
        this.router.navigate(['system/personal/roles']);
      }
    });
  }

  public archiveRol(rol: Role): void {
    this.RolHttpService.archiveRol(rol.id).subscribe((res: any) => {
      if (res.status == 'success') {
        this.router.navigate(['system/personal/roles']);
      }
    });
  }

  public openDialogArchiveRol(rol: Role): void {
    window.scrollTo(0, 0);
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar el rol?',
        message:
          'El rol será archivado y no podrá ser utilizado por los usuarios.',
        dato: rol.name,
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveRol(rol);
      }
    });
  }

  //función para recibir los permisos del componente hijo
  receivePermissions($event: any) {
    this.currentRole.permissions = $event;
    this.formGroup.get('permissions')?.setValue($event);
  }
}
