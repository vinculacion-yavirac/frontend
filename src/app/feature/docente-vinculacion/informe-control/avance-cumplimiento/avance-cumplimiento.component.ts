import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { AvanzeCumplimientoModels } from 'src/app/models/avanze/avanze_cumplimiento/avanze_cumplimiento';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { DatePipe } from '@angular/common';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';

@Component({
  selector: 'app-avance-cumplimiento',
  templateUrl: './avance-cumplimiento.component.html',
  styleUrls: ['./avance-cumplimiento.component.css']
})
export class AvanceCumplimientoComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  addAvanzeForm: avanzeForm = new avanzeForm();
  avanzeList: any = [];
  idTodelete: number = 0;
  idToupdate: number = 0;
  public doc: any;
  public doc2: any;
  public first: any;

  public activitiesData: any = [];

  @ViewChild("avanzeForm")

  avanzeForm!: NgForm;
  projectId: number;

  isSubmitted: boolean = false;
  post: AvanzeCumplimientoModels = {
    id: 0,
    resumen: '',
    indicadores: '',
    medios: '',
    observacion: '',

  };
  constructor(
    // private avanceCumplimientoHttpService:AvanceCumplimientoHttpService
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: ActividadesService,
    private miDatePipe: DatePipe
    // private alertService: AlertService
  ) { }





  // avance: AvanceCumplimiento = [4];


  esvacio: Boolean = false;


  ngOnInit(): void {

    this.route.queryParams
    .subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.projectId = params['id_proyecto'];
      console.log(this.projectId);
      
      if (this.projectId) {

        // this.getAllProyectoById(this.projectId);
        console.log(this.projectId);
      }
    }
    );

    this.getAllActividades();


  }



  public bodyRows(rowCount: any) {
    rowCount = rowCount || 10
    var body = []
    for (var j = 1; j <= rowCount; j++) {
      body.push({
        id: j,
        name: 'jose',
        email: 'joseostaiza  ',
        city: 'quito',
        expenses: 'd',
      })
    }
    return body
  }



  public getAllActividades() {
    this.httpProvider.getAllActivities().subscribe((data: any) => {

      console.log(data);


      if (data.data.activity != null && data.data.activity != null) {
        var resultData = data.data.activity;
        if (resultData) {
          console.log(resultData);

          this.activitiesData = resultData;
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              // this.activitiesData = [];
            }
          }
        }
      });
  }


  public openDeleteModal(id: number) {

    this.idTodelete = id;
  }

  public openUpdateModal(id: number) {
    this.idToupdate = id;

    // this.getById(id);

  }
  

  ngAfterViewInit() {
    // aqui
  }
  ngOnDestroy() {


  }
  getAvanceCumplimiento2() {
    this.router.navigate(['/system/docente-vinculacion/informe-control/avance-cumplimiento2'], { queryParams: { id_proyecto: this.projectId } });
  }
}
export class avanzeForm {
  resumen: string = "";
  indicadores: string = "";
  medios: string = "";
  observacion: string = "";
}
