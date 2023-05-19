import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';
import { User } from 'src/app/models/auth/users/usuario';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';

@Component({
  selector: 'app-usuario-archived',
  templateUrl: './usuario.archived.component.html',
  styleUrls: ['./usuario.archived.component.css'],
})
export class UsuariosArchivedComponent implements OnInit {
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  usuariosArchived: User[] = [];

  //loading
  loading: boolean = true;

  constructor(
    private usuarioHttpService: UsuarioHttpService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsuariosArchived();
  }

  public getUsuariosArchived(): void {
    this.loading = true;
    this.usuarioHttpService.getUsuariosArchived().subscribe((res: any) => {
      if (res.status === 'success') {
        this.usuariosArchived = res.data.users;
      }
      this.loading = false;
    });
  }

  public searchUsuariosArchivedByTerm(term: string): void {
    this.loading = true;
    this.usuarioHttpService
      .searchUsuariosArchivedByTerm(term)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.usuariosArchived = res.data.users;
        }
      this.loading = false;
      });
  }

  public restoreUsuario(usuario: User): void {
    this.usuarioHttpService.restoreUsuario(usuario.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.getUsuariosArchived();
      }
    });
  }

  public openDialogDeleteUsuario(usuario: User): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de eliminar definitivamente el usuario?',
        message:
          'El usuario será eliminado definitivamente de la base de datos y no podrá ser recuperado nunca más.',
        dato: usuario.email,
        button: 'Eliminar definitivamente',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUsuario(usuario);
      }
    });
  }

  public deleteUsuario(usuario: User): void {
    this.usuarioHttpService.deleteUsuario(usuario.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.getUsuariosArchived();
      }
    });
  }
}
