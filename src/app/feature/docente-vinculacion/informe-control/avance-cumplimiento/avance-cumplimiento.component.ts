import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { AvanzeCumplimientoModels } from 'src/app/models/avanze/avanze_cumplimiento/avanze_cumplimiento';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { DatePipe } from '@angular/common';

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

  public proyectData: any = [];

  @ViewChild("avanzeForm")

  avanzeForm!: NgForm;

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
    private httpProvider: AvanceCumplimientoService,
    private miDatePipe: DatePipe
    // private alertService: AlertService
  ) { }





  // avance: AvanceCumplimiento = [4];


  esvacio: Boolean = false;


  ngOnInit(): void {

    /*Implementacion de data dinamica */
    // let data = [{
    //   "Instituto": "INSTIUTO TECONOLOGICO SUPERIOR YAVIRAC",
    //   "Nombre": "Maria Jose Ortega"
    // }];


    // this.avanzeData = data;

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
    this.httpProvider.getAvanze().subscribe((data: any) => {

      console.log(data);


      // if (data.data.avanzes != null && data.data.avanzes != null) {
      //   var resultData = data.data.avanzes;
      //   if (resultData) {
      //     console.log(resultData);

      //     this.avanzeList = resultData;
      //   }
      // }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              // this.avanzeList = [];
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
}
export class avanzeForm {
  resumen: string = "";
  indicadores: string = "";
  medios: string = "";
  observacion: string = "";
}
