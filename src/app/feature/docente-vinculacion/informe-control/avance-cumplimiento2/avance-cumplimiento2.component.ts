import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadesModels } from 'src/app/models/actividades/actividades';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';

@Component({
  selector: 'app-avance-cumplimiento2',
  templateUrl: './avance-cumplimiento2.component.html',
  styleUrls: ['./avance-cumplimiento2.component.css']
})
export class AvanceCumplimiento2Component implements OnInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  addActividadesForm: actividadesForm = new actividadesForm();
  avanceList: any = [];
  idTodelete: number = 0;
  idToupdate: number = 0;
  @ViewChild("actividadesForm")

  actividadesForm!: NgForm;


  isSubmitted: boolean = false;
  post: ActividadesModels = {
    id: 0,
    actividades: '',
    avance: '',
    observacion: '',

  };
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: ActividadesService  ) { }

  ngOnInit(): void {
    this.getAllActividades();
  }
/*añadir actividades*/
  public addActividades(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider.addActividades(this.addActividadesForm).subscribe(async data => {

        if (data.data.avance != null && data.data.avance != null) {
          if (data.status === 'success') {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        }

      },
        async error => {
          console.log(error.message);

          // setTimeout(() => {
          //   this.router.navigate(['/Home']);
          // }, 500);
        });
    }
  }
/*obtener todas las actividades*/
  public getAllActividades() {
    this.httpProvider.getActividades().subscribe((data: any) => {
      console.log(data);
      
      if (data.data.avanzes != null && data.data.avanzes != null) {
        var resultData = data.data.avanzes;
        if (resultData) {
          console.log(resultData);

          this.avanceList = resultData;
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.avanceList = [];
            }
          }
        }
      });
  }

/*Eliminar actividades*/
  public openDeleteModal(id: number) {

    this.idTodelete = id;
  }

  public openUpdateModal(id: number) {
    this.idToupdate = id;

    this.getById(id);

  }
  public getById(id: number) {
    this.httpProvider.getActividadesById(id).subscribe((data) => {
      console.log(data);
      this.post = data.data.avanze[0];


    });
  }
/*Actualizar actividades*/
  public update() {
    this.httpProvider.updateActividades(this.idToupdate,this.post)
    .subscribe({
      next:(data) => {
        console.log(data);

        window.location.reload();
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
  /*confirmar eliminacion de registro*/
  public delete() {
    this.httpProvider.deleteActividadesById(this.idTodelete).subscribe((data: any) => {
      console.log(data);
      if (data.status === 'success') {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },
      (error: any) => { });
  }


}

export class actividadesForm {
  actividades: string = "";
  avance: string = "";
  observacion: string = "";
}
