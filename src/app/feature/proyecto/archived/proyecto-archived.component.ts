import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectoModels } from '../../../../app/models/proyecto/proyecto.models';
import { FileHttpService } from '../../../../app/service/proyecto/files/file-http.service';
import { ProyectoService } from '../../../../app/service/proyecto/proyecto.service';
import {SolicitudModels} from "../../../models/docente-vinculacion/solicitud/solicitud";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";

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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getproyectos();
  }

  getproyectos(): void {
    this.loading = true;
    this.proyectoService.getArchivedProject().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortProjects();
      }
      this.loading = false;
    });
  }

  searchprojectsByTerm(term: string): void {
    this.loading = true;

    this.proyectoService.searchArchivedProjectByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        if (term === '') {
          this.getproyectos();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  restaureProjects(proyecto: ProyectoModels): void {
    this.proyectoService.restoreProject(proyecto.id)
      .pipe(
        finalize(() => {
          this.router.navigate(['/system/proyecto/list']);
        })
      )
      .subscribe((res: any) => {
        if (res.solicitudes.status === 'success') {
          this.handleSearchResponse(res);
        }
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

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.proyectos = res.data.projects;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortProjects(): void {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
}
