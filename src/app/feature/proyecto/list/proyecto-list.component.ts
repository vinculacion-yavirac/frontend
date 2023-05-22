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


  proyectos: ProyectoModels[] = [];

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
        this.proyectos = res.data.briefcases;

        // console.log(this.proyectos)

        this.proyectos.sort((a, b) => {
          if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
            return 1;
          }
          if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    });
  }

  searchproyectoByTerm(term: string): void {
    this.loading = true;

    this.proyectoService.searchProyectoByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.proyectos = res.data.briefcase;
        console.log(this.proyectos)
        if (term === '') {
          this.getproyecto();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.proyectos.reverse();
    this.reverse = !this.reverse;
  }

  downloadFile(id: number, name: string) {
    this.filesService.downloadFile(id).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}

}
