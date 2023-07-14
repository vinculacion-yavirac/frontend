import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-portafolio-vinculacion-form',
  templateUrl: './portafolio-vinculacion-form.component.html',
  styleUrls: ['./portafolio-vinculacion-form.component.css']
})
export class PortafolioVinculacionFormComponent {
  showModal = false;
  showModal2 = false;
  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  id?: string;
  public proyectData: any = [];

  proyectos: ProyectoModels[] = [];
  loading: boolean = true;
  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private httpProvider: AvanceCumplimientoService,

  ) { }
  toggleModal() {
    this.showModal = !this.showModal;
  }

  ngOnInit(): void {
    this.getProject();
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

  onChange(value: any) {
    var id = value.target.value;
    console.log(id);
    this.getAllProyectoById(id);
  }

  public getAllProyectoById(id: number): void {
    this.httpProvider.getProyectoById(id).subscribe((data: any) => {

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
      });
  }
}
