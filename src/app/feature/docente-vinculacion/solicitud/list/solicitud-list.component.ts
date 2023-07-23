import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap, tap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { CoincidenciaModalComponent } from '../coincidencia-modal/coincidencia-modal.component';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { PortafolioHttpService } from 'src/app/service/portafolio/portafolio-http.service';

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

  solicitudes: SolicitudModels[] = [];
  portafolios: PortafoliosModels[] = [];
  solicitud: SolicitudModels | null = null;

  //  showOptionsMenu = false;
  vinculacion = 'Vinculación';
  certificado = 'Certificado';
  loading: boolean = true;
  showOptionsMenu: { [key: number]: boolean } = {};

  filterVinculacion: string;
  filterCertificado: string;
  filterPendiente: string;
  filterAprobado: string;

  createdById: number;

  constructor(
    private solicitudHttpService: SolicitudHttpService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private portafolioHttpService: PortafolioHttpService,
  ) {
    this.filterVinculacion = this.route.snapshot.data['filterVinculacion'];
    this.filterCertificado = this.route.snapshot.data['filterCertificado'];
    this.filterPendiente = this.route.snapshot.data['filterPendiente'];
    this.filterAprobado = this.route.snapshot.data['filterAprobado'];
  }

  ngOnInit(): void {
    if (this.filterPendiente) {
      this.getSolicitudByStatus(this.filterPendiente);
    }
    else if (this.filterAprobado) {
      this.getSolicitudByStatus(this.filterAprobado);
    }
    else if (this.filterVinculacion) {
      this.getSolicitudByType(this.filterVinculacion);
    }
    else if (this.filterCertificado) {
      this.getSolicitudByType(this.filterCertificado);
    }
    else {
      this.getSolicitud();
      this.getPortafolio();
    }
  }

  getSolicitud(): void {
    this.loading = true;
    this.solicitudHttpService.getSolicitudes().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    })
  };


  getSolicitudByStatus(status: string): void {
    this.loading = true;
    this.solicitudHttpService.filterSolicitudeByStatus(status).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }


  getSolicitudByType(value: string): void {
    this.loading = true;
    this.solicitudHttpService.filterSolicitudeByValue(value).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }

  sortSolicitudes(): void {
    this.solicitudes.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  };
  searchSolicitudesByTerm(term: string): void {
    this.loading = true;

    if (!term) {
      this.handleEmptyTerm();
    } else if (this.filterVinculacion) {
      this.searchSolicitudeVinculacionByTerm(term);
    } else if (this.filterCertificado) {
      this.searchCertificateByTerm(term);
    } else if (this.filterPendiente) {
      this.searchPendienteByTerm(term);
    } else if (this.filterAprobado) {
      this.searchAprobadoByTerm(term);
    } else {
      this.searchSolicitudByTerm(term);
    }
  }

  private handleEmptyTerm(): void {
    if (!this.filterVinculacion && !this.filterCertificado && !this.filterPendiente && !this.filterAprobado) {
      this.getSolicitud();
    } else if (this.filterVinculacion) {
      this.getSolicitudByType(this.filterVinculacion);
    } else if (this.filterCertificado) {
      this.getSolicitudByType(this.filterCertificado);
    } else if (this.filterPendiente) {
      this.getSolicitudByStatus(this.filterPendiente);
    } else if (this.filterAprobado) {
      this.getSolicitudByStatus(this.filterAprobado);
    }
  }

  private searchSolicitudByTerm(term: string): void {
    this.solicitudHttpService.searchSolicitudeByTerm(term).subscribe((res: any) => {
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

  private searchAprobadoByTerm(term: string): void {
    this.solicitudHttpService.searchAprobadoByTerm(term).subscribe((res: any) => {
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



  archiveSolicitud(solicitud: SolicitudModels): void {
    this.solicitudHttpService.archiveSolicitud(solicitud.id).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
        }
      }),
      switchMap(() => this.router.navigate(['/system/solicitud/list/archived']))
    ).subscribe();
  }

  openDialogArchiveSolicitud(solicitud: SolicitudModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato: ['Nombre:', solicitud.created_by.person.names, 'Tipo de solicitud:', solicitud.created_by.person.names],
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveSolicitud(solicitud);
      }
    });
  }

  async checkParticipantMatch(createdById: number, solicitudId: number): Promise<void> {
    try {
      const projectParticipantUrl = `http://127.0.0.1:8000/api/project-participant/${createdById}`;
      await this.http.get(projectParticipantUrl).toPromise();
      this.openCoincidenciaModal(createdById, solicitudId);
    } catch (error) {
    }
  }


  openCoincidenciaModal(createdById: number, solicitudId: number): void {
    const estadoSolicitud = this.solicitudes.find(solicitud => solicitud.id === solicitudId)?.solicitudes_status_id.catalog_value;
    const tipoSolicitud = this.solicitudes.find(solicitud => solicitud.id === solicitudId)?.type_request_id.catalog_value;

    if (estadoSolicitud === 'Pendiente' && tipoSolicitud === 'Vinculación') {
      const dialogRef = this.dialog.open(CoincidenciaModalComponent, {
        height: '350px',
        width: '600px',
        data: { createdById: createdById, solicitudId: solicitudId }
      });
      dialogRef.afterClosed().subscribe(result => { });
    }
  }

  openOptionsMenu(solicitudId: number) {
    this.showOptionsMenu[solicitudId] = !this.showOptionsMenu[solicitudId];
  }

  private handleSearchResponsePortafolio(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  getPortafolio(): void {
    this.loading = true;
    this.portafolioHttpService.getBriefcase().subscribe((res: any) => {
      this.handleSearchResponsePortafolio(res);
      this.loading = false;
    });
  }

  getIdPortafolioFromSolicitud(solicitud: SolicitudModels, portafolios: PortafoliosModels[]): number | null {
    const creadorSolicitudId = solicitud.created_by.id;

    for (const portafolio of portafolios) {
      const creadorPortafolioId = portafolio.created_by.id;

      if (creadorSolicitudId === creadorPortafolioId) {
        return portafolio.id;
      }
    }
    return 0; // Si no se encuentra un portafolio con el mismo creador de la solicitud
  }
}
