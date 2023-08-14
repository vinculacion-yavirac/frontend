import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/auth/users/usuario';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { UsuarioHttpService } from 'src/app/service/auth/users/usuario-http.service';
import { ProyectoParticipanteHttpService } from 'src/app/service/proyecto/participante/proyecto-participante-http.service';
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
  projectParticipants: ProyectoParticipanteModels[] = [];
  projectParticipantsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  showUpdateForm: boolean = false;
  showAgregarTutorForm: boolean = false; // Agregado el flag para mostrar/ocultar el formulario de agregar tutor
  participantToUpdate: any = null;
  updatedProyecto: ProyectoModels | null = null;
  updatedUsuario: number | null = null;
  tutores: User[] = [];

  @Input() fundacionSeleccionadaId: number | null = null;

  nombreProyecto: string | null = null;
  nombreFundacion: string | null = null;
  datosCargados$: Observable<boolean> = of(false);

  fundacionSeleccionada: any = {};
  selectedProyecto: ProyectoModels | null = null;
  selectedTutor: number | null = null;

  errorAlertVisible = false;
  showAsignacionError = false;
  showUpdateError: boolean = false;



  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioHttpService: UsuarioHttpService,
    private proyectoService: ProyectoService,
    private proyectoParticipanteHttpService: ProyectoParticipanteHttpService,
    private toastr: ToastrService,
  ) {
    this.fundacionSeleccionadaId = data.fundacionSeleccionadaId;
  }

  ngOnInit(): void {
    this.getProject();
    this.getUsuarios();
    this.getTutores();
    this.obtenerProjectParticipants();
    this.route.paramMap.subscribe(params => {
      const participantId = params.get('participantId');
      if (participantId) {
        this.getParticipantById(participantId);
      }
    });

    this.selectedProyecto = this.proyectosFundacion[0] ?? null;
    this.updatedProyecto = this.proyectos.find(proyecto => proyecto.id === this.participantToUpdate.project_id) ?? null;
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

  getTutores(): void {
    this.loading = true;
    this.usuarioHttpService.getUsuarios().pipe(
      filter((res: any) => res.status === 'success'),
      filter((res: any) => Array.isArray(res.data.users))
    ).subscribe((res: any) => {
      const tutores = res.data.users.filter((usuario: User) => usuario.role.name === 'Docente Tutor');
      this.tutores = tutores.sort((a: User, b: User) => {
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
          participant_id: usuarioSeleccionado.id,
          role: 'Estudiante'
        };

        // Verificar si el usuario tiene el rol de "Estudiante"
        if (usuarioSeleccionado.role.name === 'Estudiante') {
          // Verificar si el estudiante ya está asignado a otro proyecto
          const estudianteAsignado = this.projectParticipants.some(participant => {
            return participant.participant_id.id === usuarioSeleccionado.id;
          });

          if (estudianteAsignado) {
            this.showAsignacionError = true;
            setTimeout(() => {
              this.showAsignacionError = false;
            }, 3000);
            return;
          } else {
            this.showAsignacionError = false;
          }
        }

        this.http.post('http://127.0.0.1:8000/api/project-participant/create', requestBody).subscribe(
          (response: any) => {
            if (response.status === 'success') {
              if (this.showAgregarTutorForm) {
              } else {
                this.usuariosSeleccionados.push(usuarioSeleccionado);
              }
              this.obtenerProjectParticipants();
              this.showAgregarTutorForm = false;
            } else if (response.status === 'error') {
              this.toastr.error(response.message, 'Error');
            }
          },
          (error: any) => {
            console.error('No se pudo crear:', error);
          }
        );
      }
    }
  }

  agregarTutor(): void {
    if (this.selectedTutor !== null && this.selectedProyecto) {
      const tutorSeleccionado = this.tutores.find(tutor => tutor.id == this.selectedTutor);
      if (tutorSeleccionado) {
        // Verificar si el proyecto ya tiene un tutor asignado
        const tutorAsignado = this.projectParticipants.some(participant => {
          return participant.project_id.id === this.selectedProyecto?.id &&
            this.tutores.some(tutor => {
              return tutor.id === participant.participant_id.id &&
                tutor.role.name === 'Docente Tutor';
            });
        });

        if (tutorAsignado) {
          // Mostrar mensaje de error utilizando ToastrService
          this.errorAlertVisible = true;
          setTimeout(() => {
            this.errorAlertVisible = false;
          }, 3000);
        } else {
          const requestBody = {
            project_id: this.selectedProyecto.id,
            participant_id: tutorSeleccionado.id,
            role: 'Tutor'
          };

          this.http.post('http://127.0.0.1:8000/api/project-participant/create', requestBody).subscribe(
            (response: any) => {
              if (response.status === 'success') {
                this.obtenerProjectParticipants();

                this.showAgregarTutorForm = false;
              } else if (response.status === 'error') {
                alert(response.message);
              }
            },
            (error: any) => {
              console.error('No se pudo crear al tutor:', error);
            }
          );
        }
      }
    }
  }


  obtenerProjectParticipants(): void {

    this.proyectoParticipanteHttpService.getProyectoParticipant().subscribe(
      (response: any) => {
        this.projectParticipants = response.data.projectParticipants;
        this.projectParticipantsSubject.next(this.projectParticipants);
      },
      (error: any) => {
        console.error('Error al obtener las Asignación:', error);
      }
    );
  }

  mostrarFormularioTutor(): void {
    this.showAgregarTutorForm = true;
  }


  loadParticipantData(participant: any): void {
    this.participantToUpdate = participant;
    this.updatedUsuario = participant.participant_id.id;

    const proyectoEncontrado = this.proyectos.find(proyecto => proyecto.id === participant.project_id.id);
    this.updatedProyecto = proyectoEncontrado || null;
    this.showUpdateForm = true;

    if (proyectoEncontrado) {
      this.selectedProyecto = proyectoEncontrado;
    } else {
      console.error("No se encontró el proyecto correspondiente");
    }
  }

  updateParticipant(participant: any): void {
    this.participantToUpdate = participant;
    this.updatedProyecto = this.proyectos.find(proyecto => proyecto.id === participant.project_id) ?? null;
    this.updatedUsuario = this.participantToUpdate.participant_id.id;
    this.loadParticipantData(participant);
    this.showUpdateForm = true;
  }

  updateParticipantData(): void {
    if (this.updatedProyecto && this.updatedUsuario && this.participantToUpdate) {
      const estudianteAsignado = this.projectParticipants.some(participant => {
        return participant.participant_id.id === this.updatedUsuario && participant.id !== this.participantToUpdate.id;
      });

      if (estudianteAsignado) {
        this.showUpdateError = true;
        return;
      } else {
        this.showUpdateError = false;
      }

      const requestBody = {
        project_id: this.updatedProyecto.id,
        participant_id: this.updatedUsuario
      };

      const participantId = this.participantToUpdate.id;
      const url = `http://127.0.0.1:8000/api/project-participant/${participantId}`;

      this.http.put(url, requestBody).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.obtenerProjectParticipants();
            this.showUpdateForm = false;
          } else if (response.status === 'error') {
            alert(response.message);
          }
        },
        (error: any) => {
          console.error('No se pudo actualizar la Asignación:', error);
        }
      );
    }
  }



  resetUpdateForm(): void {
    this.participantToUpdate = null;
    this.updatedProyecto = null;
    this.updatedUsuario = null;
    this.showUpdateForm = false;
  }

  getParticipantById(participantId: string): Observable<any> {
    const url = `http://127.0.0.1:8000/api/project-participant/by/${participantId}`;

    return this.http.get(url).pipe(
      filter((res: any) => res.status === 'success'),
      map((res: any) => res.data.projectParticipant),
      switchMap((participant: any) => {
        const userId = participant.participant_id;
        const projectId = participant.project_id;
        const userUrl = `http://127.0.0.1:8000/api/users/${userId}`;
        const projectUrl = `http://127.0.0.1:8000/api/project/${projectId}`;

        const user$ = this.http.get(userUrl).pipe(map((res: any) => res.data.user));
        const project$ = this.http.get(projectUrl).pipe(map((res: any) => res.data.project));

        return forkJoin([of(participant), user$, project$]);
      }),
      catchError((error: any) => {
        console.error('Error al obtener el participante:', error);
        return of(null);
      })
    );
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
          this.selectedProyecto = this.proyectosFundacion[0];
          this.nombreFundacion = this.selectedProyecto.beneficiary_institution_id?.name || null;
        } else {
          console.error('No se encontraron proyectos relacionados con la fundación seleccionada.');
        }
      }
    }

    this.loading = false;
  }

  eliminarParticipant(participant: any): void {
    const participantId = participant.id;
    const url = `http://127.0.0.1:8000/api/project-participant/delete/${participantId}`;

    this.http.delete(url).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.obtenerProjectParticipants();
        } else if (response.status === 'error') {
          alert(response.message);
        }
      },
      (error: any) => {
        console.error('No se pudo restablecer la asignación:', error);
      }
    );
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
