import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectoModels } from '../../../models/proyecto/proyecto.models';
import { ProyectoService } from '../../../service/proyecto/proyecto.service';
import { FilesService } from '../../upload/upload.service';


@Component({
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };


  projects: ProyectoModels[] = [];

  loading: boolean = true;


  constructor(
    private proyectoService: ProyectoService,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getproyecto();
  }

  getproyecto(): void {
    this.loading = true;
    this.proyectoService.getProyecto().subscribe((res: any) => {
      if (res.status == 'success') {
        this.projects = res.data.projects;

        // console.log(this.proyectos)

        this.projects.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    });
  }


  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.projects = res.data.projects;
      this.reverse = false;
    }
    this.loading = false;
  }
  searchproyectoByTerm(term: string): void {
    this.loading = true;

    this.proyectoService.searchProyectoByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.projects = res.data.briefcase;
        console.log(this.projects)
        if (term === '') {
          this.getproyecto();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.projects.reverse();
    this.reverse = !this.reverse;
  }



}
