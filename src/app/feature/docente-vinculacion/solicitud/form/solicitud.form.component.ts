import {SolicitudHttpService} from "../../../../service/docente-vinculacion/solicitud/solicitud-http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SolicitudModels} from "../../../../models/docente-vinculacion/solicitud/solicitud";
import {ProyectoParticipanteModels} from "../../../../models/proyecto/ProjectParticipant/proyecto-participante.moduls";
import {Subscription} from "rxjs";
import {Component, forwardRef, OnInit} from "@angular/core";
import { MyErrorStateMatcher } from "src/app/shared/matcher/error-state-matcher";
import { ProyectoModels } from "src/app/models/proyecto/proyecto.models";
import { ProyectoService } from "src/app/service/proyecto/proyecto.service";
// import { format } from "date-fns";
import { DatePipe } from '@angular/common';
import { ProyectoParticipanteHttpService } from "src/app/service/proyecto/participante/proyecto-participante-http.service";

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud.form.component.html',
  styleUrls: ['./solicitud.form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SolicitudFormComponent),
      multi: true,
    },
  ],
})
export class SolicitudFormComponent implements OnInit {

  currentSolicitude: SolicitudModels = {} as SolicitudModels;
  currentProyectoParticipante: ProyectoParticipanteModels = {} as ProyectoParticipanteModels;
  proyectoParticipante: ProyectoParticipanteModels[] = [];
  solicitudes: SolicitudModels[] = [];
  paramsSubscription: Subscription;
  formGroup: FormGroup;
  title = 'Asignar Estudiante';
  loading = true;
  selectedProject: any;
  selectedProjectIds: string | null;
  projectId: number;
  currentProject: ProyectoModels | null = null;
  selectedProjectId: number | null = null;
  participantToUpdate: any = null;
  updatedProyecto: ProyectoModels | null = null;
  updatedUsuario: number | null = null;
  showUpdateForm: boolean = false;
  proyectosFormControl = new FormControl(

    '', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  proyectos: ProyectoModels[] = [];
 selectedParticipant: ProyectoParticipanteModels | null = null;
 ProyectoParticipant: ProyectoParticipanteModels[] =[];
 idParticipante: number = 0;
 idUserSolicitud:number = 0;

 creadorSolicitudId:SolicitudModels;
 projectSolicitud:number = 0;

  constructor(
    private solicitudeHttpService: SolicitudHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private miDatePipe: DatePipe,
    private participantHttpSerivice:ProyectoParticipanteHttpService

  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getProyectos();
    this.getParticipant();
    // this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
    //   if (params['id']) {
    //     this.title = 'Portafolio';
    //     this.getSolicitudById(params['id']);
    //   } else {
    //     setTimeout(() => {
    //       this.loading = false;
    //     }, 1000);
    //   }
    // });
    this.route.queryParams.subscribe(params => {
      this.projectId = Number(params['projectId']);

      if (this.projectId) {
        const selectedProject = this.proyectos.find(proyecto => proyecto.id === this.projectId);
        if (selectedProject) {
          this.selectedProject = selectedProject;
          this.formGroup.get('project_id')?.setValue(selectedProject.id);
        }
      }
    });

    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.title = 'Asignar Estudiante';
        this.getSolicitudById(params['id']);
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      approval_date: ['', Validators.nullValidator],
      project_id: [this.selectedProject ? this.selectedProject.id : '', Validators.required],
      type_request_id: this.formBuilder.group({
        id: [0],
        catalog_type: [''],
        catalog_value: ['']
      }),
      created_by: this.formBuilder.group({
        id: [0],
        email: [''],
        person: this.formBuilder.group({
          names: [''],
          identification: [''],
          last_names: [''],
        })
      })
    });
  }

  getNamesSurnamesComplete(): string {
    const person = this.formGroup.get('created_by.person')?.value;
    if (person) {
      const firstName = person.names || '';
      const lastName = person.last_names || '';
      return firstName + ' ' + lastName;
    }
    return'';
  }


  onSubmit(): void {
    if (this.formGroup.valid) {
      const id = this.currentSolicitude.id;
      this.assingSolicitud(id);
    } else if(!this.formGroup.valid){
      const id = this.currentSolicitude.id;
      this.assingSolicitud(id);
    }
  }


  getSolicitudById(id: number): void {
    this.loading = true;
    this.solicitudeHttpService.getSolicitudeById(id).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.currentSolicitude = response.data.solicitudes;
          this.idUserSolicitud = response.data.solicitudes.created_by.id;

          if (response.data.solicitudes.project_id) {
            this.projectSolicitud = response.data.solicitudes.project_id.id; 
            this.selectedProject = this.proyectos.find(proyecto => proyecto.id == this.projectSolicitud);
          }
  
          console.log('this.idUserSolicitud',response.data.solicitudes.created_by.id);
          this.getIdPortafolioFromSolicitud();
          // this. getParticipant();
          this.formGroup.patchValue(this.currentSolicitude);
        }
      },
      error: (error: any) => {
        console.error('Error al obtener la solicitud:', error.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  assingSolicitud(id:number ){
    this.currentSolicitude.project_id = this.selectedProject.id;
    this.solicitudeHttpService.assignSolicitude(id, this.currentSolicitude).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.updateProject();
          console.log('entraaaa')
          this.router.navigate(['system/solicitud/list']);
        }
      },
      (error: any) => {
        console.error('Error al actualizar la relación:', error.message);
      }
    );
  }


  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.sub?.unsubscribe();
  }


  onProjectSelected(project_id: string) {
    const selectedProject = this.proyectos.find(project => project.id === parseInt(project_id));
    if (selectedProject) {
      this.selectedProject = selectedProject;
      this.solicitudeHttpService.setSelectedProject(selectedProject);
      this.selectedParticipant = this.getSelectedParticipant(); // Obtén el participante 
    }
  }

  getSelectedParticipant(): ProyectoParticipanteModels | null {
    console.log()
    return this.selectedProject; // Asegúrate de almacenar el participante seleccionado en tu servicio
  }

  getSelectedProjectId(): number | null {
    if (this.selectedProject) {
      return this.selectedProject.id;
    }
    return 3;
  }
  
  private sub?: Subscription;
  onTouchedCb?: () => void;
  writeValue(obj: any): void {
    obj && this.proyectosFormControl.setValue(obj.id);
  }
  registerOnChange(fn: any): void {
    this.sub = this.proyectosFormControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.proyectosFormControl.disable() : this.proyectosFormControl.enable();
  }

  getProyectos(): void {
    this.proyectoService.getProject().subscribe((res: any) => {
      if (res.status === 'success') {
        this.proyectos = res.data.projects;
      }
    });
  }

  obtenerFechaActual() {
    const fecha = new Date();
    const fechaFormateada = this.miDatePipe.transform(fecha, "'Quito,' d 'de' MMMM 'del' yyyy");

    return fechaFormateada;
  }

  formatearFecha(fecha: string) {
    const fecha2 = new Date(fecha);
    const fechaFormateada = this.miDatePipe.transform(fecha2 ,'dd MMMM yyyy');
    return fechaFormateada;
  }

  onAssignProject(event: any): void {
    const projectId = event.target.value;

    this.selectedProject = this.proyectos.find(proyecto => proyecto.id === parseInt(projectId));
    if (this.proyectosFormControl.value !== null) {
      this.selectedProjectIds = projectId.toString();
    } else {
      this.selectedProjectIds = null;
    }

    this.formGroup.get('project_id')?.setValue(projectId);
  }


  getParticipant(){
    console.log('entra qui')
    this.participantHttpSerivice.getProyectoParticipants().subscribe((response:any) =>{
      if(response.status === 'success'){
        this.ProyectoParticipant = response.data.projectParticipants,
        console.log('this.idParticipante',this.ProyectoParticipant)
      }
    })
  }


  getIdPortafolioFromSolicitud(): number | null {
    const  solicitud = this.idUserSolicitud;
    console.log('SOLICITUD',solicitud);

    const participantes = this.ProyectoParticipant;
    console.log('PARTICIPANTE',participantes);
    for (const participante of participantes) {
      const participanteId = participante.participant_id.id;
      console.log('id participante',participanteId)
      if (solicitud === participanteId) {
        return participanteId;
      }
    }
    return 0; // Si no se encuentra un portafolio con el mismo creador de la solicitud
  }


  getIdUserParticipante(): number | null {
    const  solicitud = this.idUserSolicitud;
    console.log('SOLICITUD',solicitud);

    const participantes = this.ProyectoParticipant;
    console.log('PARTICIPANTE',participantes);
    for (const participante of participantes) {
      const participanteId = participante.participant_id.id;
      console.log('id participante',participanteId)
      if (solicitud === participanteId) {
        const participanteUser = participante.id;
        console.log('PARTICIPANTE',participanteId,'SOLICITUD',solicitud)
        console.log(' participanteUser', participanteUser);
        // console.log('selected',this.getSelectedParticipant())
        return participanteUser;
      }
    }
    return 0; // Si no se encuentra un portafolio con el mismo creador de la solicitud
  }


  updateProject() {
    console.log('perraaaaaaaaaaa',this.getIdPortafolioFromSolicitud())
    if (this.getIdPortafolioFromSolicitud() ===  this.idUserSolicitud) {
      console.log('seleccionado12',this.getSelectedProjectId());
      const project_ids = this.getSelectedProjectId();
      const proyectoParticipanteModels: any = {
        project_id: project_ids,
        participant_id:this.idUserSolicitud,
      };
      this.participantHttpSerivice.updateParticipant(this.getIdUserParticipante()!, proyectoParticipanteModels).subscribe( (response:any) => {
        if(response.status === 'success'){
          console.log('Actualización exitosa:', response);
          // Puedes realizar acciones adicionales aquí si es necesario
        }
          },
          error => {
            console.error('Error al actualizar:', error);
            console.log('seleccionado', this.getSelectedProjectId());
            // Puedes manejar el error de acuerdo a tus necesidades
          }
        );
    } else {

      console.log('entras quia',this.selectedParticipant?.participant_id,this.selectedProject)
    }
  }
}