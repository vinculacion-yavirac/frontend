import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../../../../app/feature/upload/upload.service';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";


@Component({
  selector: 'app-solicitud-archived',
  templateUrl: './solicitud-archived.component.html',
  styleUrls: ['./solicitud-archived.component.css']
})
export class SolicitudArchivedComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels[] = [];

  loading: boolean = true;

  constructor(
      private solicitudHttpService: SolicitudHttpService,
      private filesService: FilesService,
      private router: Router,
  ) { }

  ngOnInit(): void {
    this.getArchivedSolicituds();
  }

  getArchivedSolicituds(): void {
    this.loading = true;
    this.solicitudHttpService.getArchivedSolicitude().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }

  searchArchivedSolicitudByTerm(term: string): void {
    this.loading = true;
    this.solicitudHttpService.searchArchivedSolicitudeByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        this.reverse = false;
      }
      this.loading = false;
    });
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  }

  sortSolicitudes(): void {
    this.solicitudes.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
      this.reverse = false;
    }
    this.loading = false;
  }

  restaureSolicitud(solicitud: SolicitudModels): void {
    this.solicitudHttpService.restoreSolicitud(solicitud.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/solicitud/list']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }
}

