import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectoModels } from '../../../../app/models/proyecto/proyecto.models';
import { FileHttpService } from '../../../../app/service/proyecto/files/file-http.service';
import { ProyectoService } from '../../../../app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-proyecto-archived',
  templateUrl: './proyecto-archived.component.html',
  styleUrls: ['./proyecto-archived.component.css']
})
export class ProyectoArchivedComponent implements OnInit {
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
    private fileHttpService: FileHttpService,
  ) { }

  ngOnInit(): void {
    this.getproyectos();
  }

  getproyectos(): void {
    this.loading = true;
    this.proyectoService.getProyecto().subscribe((res: any) => {
      if (res.status == 'success') {
        this.proyectos = res.data.official_documents;

        console.log(this.proyectos)

        this.proyectos.sort((a, b) => {
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

  searchproyectosByTerm(term: string): void {
    this.loading = true;

    this.proyectoService.searchProyectoByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.proyectos = res.data.proyectos;
        if (term === '') {
          this.getproyectos();
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
    this.fileHttpService.downloadFile(id).subscribe((blob: Blob) => {
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
