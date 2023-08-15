import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDeTrabajo } from 'src/app/models/proyecto/plan-de-trabajo.models';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-form-plan-de-trabajo',
  templateUrl: './form-plan-de-trabajo.component.html',
  styleUrls: ['./form-plan-de-trabajo.component.css']
})
export class FormPlanDeTrabajoComponent implements OnInit {
  projectId: number;
  public proyectData: any = [];
  public updatedatos: any;
  constructor(
    private activatedRoute: ActivatedRoute, 
    private fb: FormBuilder,
     private route: ActivatedRoute,
       private proyectoService: ProyectoService,
        private httpProvider: AvanceCumplimientoService, 
        private router: Router,
  ) { }

  currentEntity: PlanDeTrabajo = {
    planTrabajoId: 0,
    descripcionGe: '',
    objetivoPro: '',
    analisisSi: '',
    justificacion: '',
    numObjetivos: '',
    nombreOb: '',
    objetivoOb: '',
    indicadorOb: '',
    metodosOb: '',
    numCriterios: '',
    nombreCriterios: '',
    criterioCriterios: '',
    objetivosEs: '',
    indicadoresVe: '',
    mediosVe: '',
    conclusiones: '',
    recomendaciones: '',
  };

  planTrabajoForm = this.fb.group({
    descripcionGe: [this.currentEntity.descripcionGe, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    objetivoPro: [this.currentEntity.objetivoPro, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    analisisSi: [this.currentEntity.analisisSi, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    justificacion: [this.currentEntity.justificacion, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    numObjetivos: [this.currentEntity.numObjetivos],
    nombreOb: [this.currentEntity.nombreOb, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    objetivoOb: [this.currentEntity.objetivoOb, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    indicadorOb: [this.currentEntity.indicadorOb, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    metodosOb: [this.currentEntity.metodosOb, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    numCriterios: [this.currentEntity.numCriterios],
    nombreCriterios: [this.currentEntity.nombreCriterios, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    criterioCriterios: [this.currentEntity.criterioCriterios, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    objetivosEs: [this.currentEntity.objetivosEs, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    indicadoresVe: [this.currentEntity.indicadoresVe, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    mediosVe: [this.currentEntity.mediosVe, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    conclusiones: [this.currentEntity.conclusiones, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
    recomendaciones: [this.currentEntity.recomendaciones, [Validators.required, Validators.pattern("[ñáéíóúA-Za-z ]+")]],
  });


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.projectId = params['id_proyecto'];
      if (this.projectId) { }
      console.log(this.projectId);
  });

  }

  onSubmit(): void {
    console.warn(this.planTrabajoForm.value);
    this.updatedatos = {
      'objetive': this.planTrabajoForm.value.objetivoPro,
      'description': this.planTrabajoForm.value.descripcionGe,
      'situational_analysis': this.planTrabajoForm.value.analisisSi,
      'justification': this.planTrabajoForm.value.justificacion,
      'conclusions': this.planTrabajoForm.value.conclusiones,
      'recommendation': this.planTrabajoForm.value.recomendaciones

  };
  this.proyectoService.updateProyectPlanTrabajo(this.projectId, this.updatedatos).subscribe(async (data: any) => {
    console.log(data);

    if (data.data.proyect != null && data.data.proyect != null) {
        if (data.status === 'success') {
            setTimeout(() => {
                var resultData = data.data.proyect;
                console.log(resultData);

                // this.router.navigate(['/system/proyecto/form-plan-de-trabajo'], { queryParams: { id_proyecto: resultData.id } });

            }, 500);
        }
    }
}, async (error) => {
    console.log(error.message);

    // setTimeout(() => {
    // this.router.navigate(['/Home']);
    // }, 500);
});

  }

  get descripcionGe() {
    return this.planTrabajoForm.get('descripcionGe');
  }
  get objetivoPro() {
    return this.planTrabajoForm.get('objetivoPro');
  }
  get analisisSi() {
    return this.planTrabajoForm.get('analisisSi');
  }
  get justificacion() {
    return this.planTrabajoForm.get('justificacion');
  }
  get numObjetivos() {
    return this.planTrabajoForm.get('numObjetivos');
  }
  get nombreOb() {
    return this.planTrabajoForm.get('nombreOb');
  }
  get objetivoOb() {
    return this.planTrabajoForm.get('objetivoOb');
  }
  get indicadorOb() {
    return this.planTrabajoForm.get('indicadorOb');
  }
  get metodosOb() {
    return this.planTrabajoForm.get('metodosOb');
  }
  get numCriterios() {
    return this.planTrabajoForm.get('numCriterios');
  }
  get nombreCriterios() {
    return this.planTrabajoForm.get('nombreCriterios');
  }
  get criterioCriterios() {
    return this.planTrabajoForm.get('criterioCriterios');
  }
  get objetivosEs() {
    return this.planTrabajoForm.get('objetivosEs');
  }
  get indicadoresVe() {
    return this.planTrabajoForm.get('indicadoresVe');
  }
  get mediosVe() {
    return this.planTrabajoForm.get('mediosVe');
  }
  get conclusiones() {
    return this.planTrabajoForm.get('conclusiones');
  }
  get recomendaciones() {
    return this.planTrabajoForm.get('recomendaciones');
  }



 

}
