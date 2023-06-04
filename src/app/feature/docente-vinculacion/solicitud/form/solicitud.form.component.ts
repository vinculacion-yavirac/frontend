// importaciones de @angular
import { Component, OnInit } from '@angular/core';
import {SolicitudHttpService} from "../../../../service/docente-vinculacion/solicitud/solicitud-http.service";
import {SolicitudModels} from "../../../../models/docente-vinculacion/solicitud/solicitud";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Subscription} from "rxjs";
import {Person} from "../../../../models/auth/persona/persona";

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud.form.component.html',
  styleUrls: ['./solicitud.form.component.css'],
})
export class SolicitudFormComponent implements OnInit {

  currentSolicitude = {} as SolicitudModels;

  persons: Person [] = [];

  solicitudes: SolicitudModels [] = [];

  paramsSubscription: Subscription;

  public formGroup: FormGroup;
  title = 'Asignar EStudiante';
  loading: boolean = true;

  constructor(
    private solicitudeHttpService:SolicitudHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.initForm();
  }

  initForm() {

    this.formGroup = this.formBuilder.group({
      id: [0],
      type_of_request: ['', Validators.required],
      status: ['', Validators.required],
      created_by: this.formBuilder.group({
        id: [0],
        // Otros campos del modelo User
        email:[
          '',
          Validators.required,
        ],
        person: this.formBuilder.group({
          names:[
            '', Validators.required,
          ],
          identification:[
            '', Validators.required,
          ],
          last_names:[
            '',
            Validators.required
          ]
        })
      }),
      created_at: [
        '',
        Validators.required, Validators.pattern(/^(\\d{4}-\\d{2}-\\d{2})/),
      ],
      updated_at: [null],
    });
    this.formGroup.valueChanges.subscribe((values) => {
      this.currentSolicitude = values;
      console.log(this.currentSolicitude);
    });
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) =>{
        if (params['id']) {
          this.title = 'Asignar Estudiante';
          this.getSolicitudById(params['id']);
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    )
  }


  public onSubmit(): void {
    if (this.formGroup.valid) {
      if (!this.currentSolicitude.id) {
        this.asignarSolicitude();
      } else {
        this.asignarSolicitude();
      }
    }
  }

  public asignarSolicitude():void{
    this.solicitudeHttpService.asignarSolicitud(this.currentSolicitude).subscribe( (rest:any) => {
      if (rest.status === 'success'){
        console.log('creando');
        this.router.navigate(['system/solicitud/list']);
      }
    });
  }

  public getSolicitudById(id:number):void{
    this.solicitudeHttpService.getSolicitudById(id).subscribe((rest:any)=>{
      if(rest.status === 'success'){
        this.currentSolicitude = rest.data.solicitudes;
        this.formGroup.patchValue(this.currentSolicitude);
      }
    });
  }

}
