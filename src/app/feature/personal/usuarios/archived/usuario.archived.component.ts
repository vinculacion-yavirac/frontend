import { Component, OnInit } from '@angular/core';
import { User } from '../usuario';
import { UsuarioService } from '../usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

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
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsuariosArchived();
  }

  public getUsuariosArchived(): void {
    this.loading = true;
    this.usuarioService.getUsuariosArchived().subscribe((res: any) => {
      if (res.status === 'success') {
        this.usuariosArchived = res.data.users;
      }
      this.loading = false;
    });
  }

  public searchUsuariosArchivedByTerm(term: string): void {
    this.loading = true;
    this.usuarioService
      .searchUsuariosArchivedByTerm(term)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.usuariosArchived = res.data.users;
        }
      this.loading = false;
      });
  }

  public restoreUsuario(usuario: User): void {
    this.usuarioService.restoreUsuario(usuario.id).subscribe((res: any) => {
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
    this.usuarioService.deleteUsuario(usuario.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.getUsuariosArchived();
      }
    });
  }
}
