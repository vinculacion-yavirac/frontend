import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';


@Component({
  selector: 'app-modal-solicitudes',
  templateUrl: './modal-solicitudes.component.html',
  styleUrls: ['./modal-solicitudes.component.css']
})
export class ModalSolicitudesComponent implements OnInit {

  fundacionSeleccionadaId: number | null = null;
  reverse = false;
  pipe = new DatePipe('en-US');
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels[] = [];
  loading: boolean = true;
  filterVinculacion: string;
  filterCertificado: string;
  filterPendiente: string;
  filterAprobado: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solicitudHttpService: SolicitudHttpService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.fundacionSeleccionadaId = data.fundacionSeleccionadaId;
    this.filterVinculacion = this.route.snapshot.data['filterVinculacion'];
    this.filterCertificado = this.route.snapshot.data['filterCertificado'];
    this.filterPendiente = this.route.snapshot.data['filterPendiente'];
    this.filterAprobado = this.route.snapshot.data['filterAprobado'];
  }

  ngOnInit(): void {
    this.fundacionSeleccionadaId = this.data.fundacionSeleccionadaId;
    if (this.filterPendiente) {
      this.getSolicitudByStatus(this.filterPendiente);
    } else if (this.filterAprobado) {
      this.getSolicitudByStatus(this.filterAprobado);
    } else if (this.filterVinculacion) {
      this.getSolicitudByType(this.filterVinculacion);
    } else if (this.filterCertificado) {
      this.getSolicitudByType(this.filterCertificado);
    } else {
      this.getSolicitud();
    }
  }

  isBeneficiaryInstitutionMatch(solicitud: any): boolean {
    if (solicitud && solicitud.project_id && solicitud.project_id.beneficiary_institution_id) {
      return this.fundacionSeleccionadaId === solicitud.project_id.beneficiary_institution_id;
    }
    return false;
  }

  getSolicitud(): void {
    this.loading = true;
    this.solicitudHttpService.getSolicitudes().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortSolicitudes();
      }
      this.loading = false;
    });
  }

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
    if (Array.isArray(this.solicitudes)) {
      this.solicitudes.sort((a, b) => {
        return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
      });
    }
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  }

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

  goToDetails(id: number): void {
    this.router.navigate(['solicitud-detalle', id]);
  }

  trackById(index: number, solicitud: SolicitudModels): number {
    return solicitud.id;
  }
}
