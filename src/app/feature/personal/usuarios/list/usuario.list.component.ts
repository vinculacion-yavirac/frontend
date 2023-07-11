import { Component, OnInit } from '@angular/core';

// importaciones de angular material
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';

// importaciones de los servicios y modelos
import { User } from '../../../../../app/models/auth/users/usuario';
import { UsuarioHttpService } from '../../../../../app/service/auth/users/usuario-http.service';
import { ExporterService } from 'src/app/service/portafolio/exportar/exporter.service';
import { ImportadorService } from 'src/app/service/portafolio/exportar/importar.service';


@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario.list.component.html',
  styleUrls: ['./usuario.list.component.css'],
})
export class UsuariosListComponent implements OnInit {
  reverse = false;




  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  usuarios: User[] = [];
  loading: boolean = true;

  constructor(
    private usuarioHttpService:UsuarioHttpService,
    private dialog: MatDialog,
    private excellService:ExporterService,
    private importadorService: ImportadorService
  ) {}

  ngOnInit(): void {
    this.getUsuarios();

}



//EXPORTAR
exportAsXLSX(): void {
 const users = this.usuarios.map((usuario) =>{return {
  id: usuario.id ,
  cedula: usuario.person.identification,
  correo: usuario.email,
  nombres:usuario.person.names,
  apellidos: usuario.person.last_names,
  creado: usuario.person.created_at

}})
 this.excellService.exportToExcel(users,'excel');
}

  getUsuarios(): void {
    this.loading = true;
    this.usuarioHttpService.getUsuarios().subscribe((res: any) => {
      if (res.status === 'success') {
        this.usuarios = res.data.users;
        //ordenar por nombres
        this.usuarios.sort((a, b) => {
          if (a.person.names.toLowerCase() > b.person.names.toLowerCase()) {
            return 1;
          }
          if (a.person.names.toLowerCase() < b.person.names.toLowerCase()) {
            return -1;
          }
          return 0;
        });

      }
    this.loading = false;

    });
  }



  searchUsuariosByTerm(term: string): void {
    this.loading = true;

    this.usuarioHttpService.searchUsuariosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.usuarios = res.data.users;
        if (term === '') {
          this.getUsuarios();
        }
        this.reverse = false;
      }
    this.loading = false;

    });
  }

  archiveUsuario(usuario: User): void {
    this.usuarioHttpService.archiveUsuario(usuario.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.getUsuarios();
      }
    });
  }

  openDialogArchiveUsuario(usuario: User): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '320px',
      width: '600px',
      data: {
        title: '¿Está seguro de eliminar el usuario?',
        message: 'El usuario será eliminado y no podrá ser recuperado',
        dato: usuario.email,
        button: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveUsuario(usuario);
      }
    });
  }

  reversOrder(): void {
    this.usuarios.reverse();
    this.reverse = !this.reverse;
  }
}
