import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { customDateValidation } from 'src/app/shared/validators/custom-date-validation.directive';
import { DatosGenerales } from './../../../../models/proyecto/datos-generales.models';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { DatePipe } from '@angular/common';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

interface Carrera {
  id: number;
  carrera: string;
}

@Component({
  selector: 'app-form-datos-generales',
  templateUrl: './form-datos-generales.component.html',
  styleUrls: ['./form-datos-generales.component.css'],
})
export class FormDatosGeneralesComponent implements OnInit {
  /*Variables para generar pdfs*/
  public doc: any;
  public doc2: any;
  public avanceData: any;
  id?: string;
  public proyectData: any = [];
  public datos: any;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private httpProvider: AvanceCumplimientoService,
    private miDatePipe: DatePipe,
    private proyectoService: ProyectoService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    /*Array para generear  pdf con datos dinamicos*/
    this.getAllProyecto();
  }

  carreraId: Carrera[] = [];

  carrerasMapping: Carrera[] = [
    {
      id: 1,
      carrera: 'Software',
    },
    {
      id: 2,
      carrera: 'Turismo',
    },
    {
      id: 3,
      carrera: 'Diseño',
    },
    {
      id: 4,
      carrera: 'Bomberos',
    },
  ];

  currentEntity: DatosGenerales = {
    dgId: 0,
    codigo: '',
    nombrep: '',
    nombrei: '',
    ciclo: '',
    cobertura: '',
    carreraId: 1,
    modalidadId: 1,
    fecha: '',
    plazo: '',
    financiamiento: '',
    vigencia: '',
    fechaPresentacion: '',
    fechaInicio: '',
    fechaFinal: '',
  };

  datosGeneralesForm = this.fb.group({
    codigoProyecto: [
      this.currentEntity.codigo,
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]*$/)],
    ],
    nombreProyecto: [
      this.currentEntity.nombrep,
      [Validators.required, Validators.pattern('[ñáéíóúA-Za-z ]+')],
    ],
    nombreInstituto: [this.currentEntity.nombrei, [Validators.required]],
    ciclo: [this.currentEntity.ciclo, [Validators.required]],
    coberturaLocalizacion: [
      this.currentEntity.cobertura,
      [Validators.required, Validators.pattern('[ñáéíóúA-Za-z ]+')],
    ],
    carrera: [this.currentEntity.carreraId, [Validators.required]],
    modalidad: this.fb.group({ modalidadRadio: ['1'] }),
    // fecha: [
    //   this.currentEntity.fecha,
    //   [Validators.required, customDateValidation(3000)],
    // ],
    plazoEjecucion: [
      this.currentEntity.plazo,
      [Validators.required, customDateValidation(3000)],
    ],
    financiamiento: [
      this.currentEntity.financiamiento,
      [Validators.required, customDateValidation(3000)],
    ],
    // plazoVigenciaConvenio: [
    //   this.currentEntity.vigencia,
    //   [Validators.required, customDateValidation(3000)],
    // ],
    fechaPresentacion: [
      this.currentEntity.fechaPresentacion,
      [Validators.required, customDateValidation(3000)],
    ],
    fechaInicio: [
      this.currentEntity.fechaInicio,
      [Validators.required, customDateValidation(3000)],
    ],
    fechaFinal: [
      this.currentEntity.fechaFinal,
      [Validators.required, customDateValidation(3000)],
    ],
  });

  onSubmit() {
    console.log(this.datosGeneralesForm.value);
    this.datos = {
      'code': this.datosGeneralesForm.value.codigoProyecto,
      'name': this.datosGeneralesForm.value.nombreProyecto,
      'name_institute': this.datosGeneralesForm.value.nombreInstituto,
      'cicle': this.datosGeneralesForm.value.ciclo,
      'address': this.datosGeneralesForm.value.coberturaLocalizacion,
      'Modality': this.datosGeneralesForm.value.modalidad?.modalidadRadio,
      'field': 'Campo de proyecto',
      'term_execution': 5,
      'start_date': this.datosGeneralesForm.value.fechaInicio,
      'end_date': this.datosGeneralesForm.value.fechaFinal,
      'date_presentation': this.datosGeneralesForm.value.fechaPresentacion,
      'frequency_activity':'[\"Sector 1\",\"Sector 2\"]',
      'activity_vinculation':'[\"Sector 1\",\"Sector 2\"]',
      'intervention_sectors':'[\"Sector 1\",\"Sector 2\"]',
      'linking_activity':'[\"Sector 1\",\"Sector 2\"]',
     'schedule_crono':'[]',
      'financing':'[]',
      'sectors_intervention': '[\"Sector 1\",\"Sector 2\"]',
      'strategic_axes': '[\"Eje 1\",\"Eje 2\"]',
      'objetive':'objetivo del proyecto',
      'description': 'Descripción del proyecto',
      'situational_analysis': 'Análisis situacional',
      'foundation': 'Fundamentación del proyecto',
      'justification': 'Justificación del proyecto',
      'conclusions':'conclusiones del proyecto',
      'recommendation':'recomendaciones del proyecto',
      'direct_beneficiaries': '[\"Beneficiario 1\",\"Beneficiario 2\"]',
      'indirect_beneficiaries': '[\"Beneficiario indirecto 1\",\"Beneficiario indirecto 2\"]',
      'schedule': 'Horario del proyecto',
      'evaluation_monitoring_strategy': '[\"Estrategia de evaluaci\\u00f3n 1\",\"Estrategia de evaluaci\\u00f3n 2\"]',
      'bibliographies': '[\"Bibliograf\\u00eda 1\",\"Bibliograf\\u00eda 2\"]',
      'attached_project': '[\"Proyecto adjunto 1\",\"Proyecto adjunto 2\"]',
      'convention_id': 1,
      'school_period_id': 2,
      'beneficiary_institution_id': 1,
      'career_id': 2,
      'sub_line_investigation_id': 2,
      'authorized_by': 2,
      'made_by': 1,
      'approved_by': 1,
      'catalogue_id': 1,
      'state_id': 2,
      'stateTwo_id': 7,
      'frequency_id': 1,
      'created_by': 9,
      'archived': false,
      'archived_at': null,
      'archived_by': null,
    };
    this.proyectoService.addProyecto(this.datos).subscribe(
      async (data: any) => {
        console.log(data);

        if (data.data.proyect != null && data.data.proyect != null) {
          if (data.status === 'success') {
            setTimeout(() => {
              var resultData = data.data.proyect;
              this.router.navigate(['/system/proyecto/form-empresa'], { queryParams: { id_proyecto: resultData.id } });

            }, 500);
          }
        }
      },
      async (error) => {
        console.log(error.message);

        // setTimeout(() => {
        // this.router.navigate(['/Home']);
        // }, 500);
      }
    );
  }

  get codigoProyecto() {
    return this.datosGeneralesForm.get('codigoProyecto');
  }
  get nombreProyecto() {
    return this.datosGeneralesForm.get('nombreProyecto');
  }

  get nombreInstituto() {
    return this.datosGeneralesForm.get('nombreInstituto');
  }

  get ciclo() {
    return this.datosGeneralesForm.get('ciclo');
  }

  get coberturaLocalizacion() {
    return this.datosGeneralesForm.get('coberturaLocalizacion');
  }

  get carrera() {
    return this.datosGeneralesForm.get('carrera');
  }

  get modalidad() {
    return this.datosGeneralesForm.get('modalidad');
  }

  get fecha() {
    return this.datosGeneralesForm.get('fecha');
  }

  get plazoEjecucion() {
    return this.datosGeneralesForm.get('plazoEjecucion');
  }

  get financiamiento() {
    return this.datosGeneralesForm.get('financiamiento');
  }

  get plazoVigenciaConvenio() {
    return this.datosGeneralesForm.get('plazoVigenciaConvenio');
  }

  get fechaPresentacion() {
    return this.datosGeneralesForm.get('fechaPresentacion');
  }

  get fechaInicio() {
    return this.datosGeneralesForm.get('fechaInicio');
  }

  get fechaFinal() {
    return this.datosGeneralesForm.get('fechaFinal');
  }

  public getAllProyecto() {
    this.httpProvider.getProyecto().subscribe(
      (data: any) => {
        console.log(data);

        if (data.data.projects != null && data.data.projects != null) {
          var resultData = data.data.projects;
          if (resultData) {
            console.log(resultData);
            console.log(resultData);

            this.proyectData = resultData;
          }
        }
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.proyectData = [];
            }
          }
        }
      }
    );
  }

}
