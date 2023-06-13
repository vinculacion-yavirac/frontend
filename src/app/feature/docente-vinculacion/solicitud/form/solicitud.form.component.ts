import {SolicitudHttpService} from "../../../../service/docente-vinculacion/solicitud/solicitud-http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  ProyectoParticipanteHttpService
} from "../../../../service/proyecto/participante/proyecto-participante-http.service";
import {SolicitudModels} from "../../../../models/docente-vinculacion/solicitud/solicitud";
import {ProyectoParticipanteModels} from "../../../../models/proyecto/ProjectParticipant/proyecto-participante.moduls";
import {Subscription} from "rxjs";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud.form.component.html',
  styleUrls: ['./solicitud.form.component.css'],
})
export class SolicitudFormComponent implements OnInit {

  currentSolicitude: SolicitudModels = {} as SolicitudModels;
  currentProyectoParticipante: ProyectoParticipanteModels = {} as ProyectoParticipanteModels;
  proyectoParticipante: ProyectoParticipanteModels[] = [];
  paramsSubscription: Subscription;
  formGroup: FormGroup;
  title = 'Asignar Estudiante';
  loading = true;


  constructor(
    private solicitudeHttpService: SolicitudHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private proyectoParticipanteHttpService: ProyectoParticipanteHttpService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getProyectoParticipante();
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
      project_id: ['', Validators.required],
      //created_at: ['', [Validators.required, Validators.pattern(/^(\\d{4}-\\d{2}-\\d{2})/)]],
      created_by:this.formBuilder.group({
        id:[0],
        email:[''],
        person:this.formBuilder.group({
          name:[''],
          identification:[''],
          last_names:[''],
        })
      })
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const id = this.currentSolicitude.id || 0;
      this.solicitudeHttpService.asignarSolicitud(id, this.formGroup.value).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            console.log('Relación actualizada correctamente');
            this.router.navigate(['system/solicitud/list']);
          }
        },
        (error: any) => {
          console.log('Error al actualizar la relación:', error.message);
        }
      );
    }
  }

  getProyectoParticipante(): void {
    this.proyectoParticipanteHttpService.getProyectoParticipante().subscribe((rest:any) => {
      this.proyectoParticipante = rest.data.projectParticipants;
    });
  }

  getSolicitudById(id: number): void {
    this.loading = true;
    this.solicitudeHttpService.getSolicitudById(id).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.currentSolicitude = response.data.solicitudes;
          this.formGroup.patchValue(this.currentSolicitude);
        }
      },
      error: (error: any) => {
        console.log('Error al obtener la solicitud:', error.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }



}
