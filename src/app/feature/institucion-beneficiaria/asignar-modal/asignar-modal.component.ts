import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/models/auth/users/usuario';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-asignar-modal',
  templateUrl: './asignar-modal.component.html',
  styleUrls: ['./asignar-modal.component.css']
})
export class AsignarModalComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  proyectos: ProyectoModels[] = [];
  proyectosFundacion: ProyectoModels[] = [];

  loading: boolean = true;
  usuarios: User[] = [];
  selectedUsuario: number | null = null;
  usuariosSeleccionados: User[] = [];
  usuarioAsignado = false;

  @Input() fundacionSeleccionadaId: number | null = null;

  nombreProyecto: string | null = null;
  nombreFundacion: string | null = null;
  datosCargados$: Observable<boolean> = of(false);

  fundacionSeleccionada: any = {};
  selectedProyecto: ProyectoModels | null = null;

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioHttpService:UsuarioHttpService,
    private proyectoService: ProyectoService,
  ) {
    this.fundacionSeleccionadaId = data.fundacionSeleccionadaId;
  }

  ngOnInit(): void {
    this.getProject();
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.loading = true;
    this.usuarioHttpService.getUsuarios().pipe(
      filter((res: any) => res.status === 'success'),
      filter((res: any) => Array.isArray(res.data.users))
    ).subscribe((res: any) => {
      const estudiantes = res.data.users.filter((usuario: User) => usuario.role.name === 'Estudiante');
      this.usuarios = estudiantes.sort((a: User, b: User) => {
        return a.person.names.toLowerCase().localeCompare(b.person.names.toLowerCase());
      });
      this.loading = false;
    });
  }

  filterUsers = (rol: string) => {
    const result = this.usuarios.filter((user) => user.role.name === rol);
    this.usuarios = result;
    return result;
  }

  agregarUsuario(): void {
    if (this.selectedUsuario !== null && this.selectedProyecto) {
      const usuarioSeleccionado = this.usuarios.find(usuario => usuario.id.toString() === this.selectedUsuario!.toString());

      if (usuarioSeleccionado) {
        const requestBody = {
          project_id: this.selectedProyecto.id,
          participant_id: usuarioSeleccionado.id
        };

        this.http.post('http://127.0.0.1:8000/api/project-participant/create', requestBody).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              console.log('Estuante asignado exitosamente:', response.data.projectParticipant);
              this.usuariosSeleccionados.push(usuarioSeleccionado);
            } else if (response.status === 'error') {
              alert(response.message);
            }
          },
          (error: any) => {
            console.log('No se pudo crear el ProjectParticipant:', error);
          }
        );
      }
    }
  }

  existeProyectoFundacion(): boolean {
    return this.proyectosFundacion.length > 0;
  }

  reversOrder(): void {

    this.proyectos.reverse();
    this.reverse = !this.reverse;
  };

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.proyectos = res.data.projects;
      this.reverse = false;
      this.sortProjects();

      if (Array.isArray(this.proyectos)) {
        this.proyectosFundacion = this.proyectos.filter(proyecto =>
          proyecto.beneficiary_institution_id?.id === this.fundacionSeleccionadaId
        );

        if (this.proyectosFundacion.length > 0) {
          this.datosCargados$ = of(true);
          console.log(this.datosCargados$);
          console.log(this.proyectosFundacion);

          this.selectedProyecto = this.proyectosFundacion[0]; // Asignar el primer proyecto por defecto
          this.nombreFundacion = this.selectedProyecto.beneficiary_institution_id?.name;
        } else {
          console.log('No se encontraron proyectos relacionados con la fundación seleccionada.');
        }
      }
    }

    this.loading = false;
  }

getProject(): void {
  this.loading = true;
  this.proyectoService.getProject().subscribe((res: any) => {
    if (res.status == 'success') {
      this.proyectos = res.data.proyectos; 
      this.handleSearchResponse(res);
    }
    this.loading = false;
  });
}


sortProjects(): void {
  if (this.proyectos) {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
}

}
