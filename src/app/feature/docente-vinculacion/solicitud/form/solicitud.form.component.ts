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
import { format } from "date-fns";

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
  paramsSubscription: Subscription;
  formGroup: FormGroup;
  title = 'Asignar Estudiante';
  loading = true;
  selectedProject: any;
  selectedProjectIds: string | null;
  projectId: number;
  currentProject: ProyectoModels | null = null;
  selectedProjectId: number | null = null;

  constructor(
    private solicitudeHttpService: SolicitudHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getProyectos();

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
          this.formGroup.patchValue(this.currentSolicitude);
          if (this.currentSolicitude.project_id) {
            this.currentSolicitude= response.data.solicitudes;
            this.selectedProject = this.proyectos.find(proyecto => proyecto.id == this.currentSolicitude.project_id.id);
          }
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

  proyectosFormControl = new FormControl(

    '', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  proyectos: ProyectoModels[] = [];

  onProjectSelected(project_id: string) {
    const selectedProject = this.proyectos.find(project => project.id === parseInt(project_id));
    if (selectedProject) {
      this.selectedProject = selectedProject;
      this.solicitudeHttpService.setSelectedProject(selectedProject);
    }
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
    const fechaFormateada = format(fecha, "'Quito,' d 'de' MMMM 'del' yyyy");

    return fechaFormateada;
  }

  formatearFecha(fecha: string): string {
    const fechaFormateada = format(new Date(fecha), 'dd MMMM yyyy');
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

}
