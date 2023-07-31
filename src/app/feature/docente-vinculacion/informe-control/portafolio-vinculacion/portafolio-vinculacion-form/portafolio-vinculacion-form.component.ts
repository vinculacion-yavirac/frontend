import { DatePipe } from '@angular/common';
import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-portafolio-vinculacion-form',
  templateUrl: './portafolio-vinculacion-form.component.html',
  styleUrls: ['./portafolio-vinculacion-form.component.css']
})
export class PortafolioVinculacionFormComponent   implements OnInit, OnDestroy, AfterContentChecked {
  showModal = false;
  showModal2 = false;
  reverse = false;
  pipe = new DatePipe('en-US');
  projectId: number;

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  id?: string;
  public proyectData: any = [];
  id_proyecto: any;
  proyectos: ProyectoModels[] = [];
  loading: boolean = true;
  public testform: FormGroup;
  private subscription: Subscription;


  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private httpProvider: AvanceCumplimientoService,
    public fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,

  ) { }
 
 
  toggleModal() {

    this.showModal = !this.showModal;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.projectId = params['id_proyecto'];
        if (this.projectId) {

          this.subscription = this.httpProvider.getProyectoById(this.projectId).subscribe((data: any) => {

            console.log(data);
      
      
            if (data.data.projects != null && data.data.projects != null) {
              var resultData = data.data.projects;
              if (resultData) {
                console.log(resultData);
                this.proyectData = resultData;
              }
            }
            console.log(this.proyectData);
      
          },
            (error: any) => {
              if (error) {
                if (error.status == 404) {
                  if (error.error && error.error.message) {
                    this.proyectData = [];
                  }
                }
              }
            })
          console.log(this.projectId);
        }
      }
      );


  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
}
ngOnDestroy() {
  this.subscription.unsubscribe();
}
  getProject(): void {
    this.loading = true;
    this.proyectoService.getProject().subscribe((res: any) => {
      if (res.status == 'success') {
        console.log(res);

        this.handleSearchResponse(res);
      }
      this.loading = false;
    });
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.proyectos = res.data.projects;
      this.reverse = false;
      this.sortProjects();
    }
    this.loading = false;
  }

  sortProjects(): void {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  

  getAvanceCumplimiento() {
    this.router.navigate(['/system/docente-vinculacion/informe-control/avance-cumplimiento'], { queryParams: { id_proyecto: this.projectId } });
  }
 
}
