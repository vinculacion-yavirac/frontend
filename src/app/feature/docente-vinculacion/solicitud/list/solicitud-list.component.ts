import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-solicitud-list',
  templateUrl: './solicitud-list.component.html',
  styleUrls: ['./solicitud-list.component.css']
})
export class SolicitudListComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels [] = [];

  loading: boolean = true;

  filterVinculacion: string;
  filterCertificado: string;
  filterPendiente: string;
  filterPreAprobado: string;

  constructor(
    private solicitudHttpService: SolicitudHttpService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.filterVinculacion = this.route.snapshot.data['filterVinculacion'];
    this.filterCertificado = this.route.snapshot.data['filterCertificado'];
    this.filterPendiente = this.route.snapshot.data['filterPendiente'];
    this.filterPreAprobado = this.route.snapshot.data['filterPreAprobado'];
  }

  ngOnInit(): void {
    if (this.filterPendiente) {
      this.getSolicitudByStatus(this.filterPendiente);
    }
    else if (this.filterPreAprobado) {
      this.getSolicitudByStatus(this.filterPreAprobado);
    }
    else if(this.filterVinculacion){
      this.getSolicitudByType(this.filterVinculacion);
    }
    else if(this.filterCertificado){
      this.getSolicitudByType(this.filterCertificado);
    }
    else {
      this.getSolicitud();
    }
  }

  public getSolicitud():void{
    this.loading = true;
    this.solicitudHttpService.getSolicitud().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    })
  };


 public  getSolicitudByStatus(status: string): void {
    this.loading = true;
    this.solicitudHttpService.getSolicitudByStatus(status).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }


  public  getSolicitudByType(value: string): void {
    this.loading = true;
    this.solicitudHttpService.getSolicitudByType(value).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }

  public sortSolicitudes(): void {
    this.solicitudes.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

  public reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  };
  public searchSolicitudesByTerm(term: string): void {
    this.loading = true;

    if (!term) {
      this.handleEmptyTerm();
    } else if (this.filterVinculacion) {
      this.searchSolicitudeVinculacionByTerm(term);
    } else if (this.filterCertificado) {
      this.searchCertificateByTerm(term);
    } else if (this.filterPendiente) {
      this.searchPendienteByTerm(term);
    } else if (this.filterPreAprobado) {
      this.searchPreAprobadoByTerm(term);
    } else {
      this.searchSolicitudByTerm(term);
    }
  }

  private handleEmptyTerm(): void {
    if (!this.filterVinculacion && !this.filterCertificado && !this.filterPendiente && !this.filterPreAprobado) {
      this.getSolicitud();
    } else if (this.filterVinculacion) {
      this.getSolicitudByType(this.filterVinculacion);
    } else if (this.filterCertificado) {
      this.getSolicitudByType(this.filterCertificado);
    } else if (this.filterPendiente) {
      this.getSolicitudByStatus(this.filterPendiente);
    } else if (this.filterPreAprobado) {
      this.getSolicitudByStatus(this.filterPreAprobado);
    }
  }

  private searchSolicitudByTerm(term: string): void {
    this.solicitudHttpService.searchSolicitudByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchSolicitudeVinculacionByTerm(term: string): void {
    this.solicitudHttpService.searchSolicitudeVinculacionByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchCertificateByTerm(term: string): void {
    this.solicitudHttpService.searchCertificateByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchPendienteByTerm(term: string): void {
    this.solicitudHttpService.searchPendienteByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchPreAprobadoByTerm(term: string): void {
    this.solicitudHttpService.searchPreAprobadoByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
      this.reverse = false;
    }
    this.loading = false;
  }

  public archiveSolicitud(solicitud:SolicitudModels): void {
    this.solicitudHttpService.solicitudArchive(solicitud.id).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          console.log('archive id');
        }
      }),
      switchMap(() => this.router.navigate(['/system/solicitud/list/archived']))
    ).subscribe();
  }


  public openDialogArchiveSolicitud(solicitud: SolicitudModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato:['Nombre:', solicitud.created_by.person.names, 'Tipo de solicitud:', solicitud.created_by.person.names],
        // dato: solicitud.type_of_request,
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveSolicitud(solicitud);
      }
    });
  }
}
