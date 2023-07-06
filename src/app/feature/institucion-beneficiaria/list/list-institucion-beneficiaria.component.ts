import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstitucionBeneficiariaDetalleModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria-detalle.models';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { InstitucionBeneficiariaHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalSolicitudesComponent } from '../modal-solicitudes/modal-solicitudes.component';
import { AsignarModalComponent } from '../asignar-modal/asignar-modal.component';

@Component({
  selector: 'app-list-institucion-beneficiaria',
  templateUrl: './list-institucion-beneficiaria.component.html',
  styleUrls: ['./list-institucion-beneficiaria.component.css']
})
export class ListInstitucionBeneficiariaComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  model: boolean;

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  institucionesBeneficiarias: InstitucionBeneficiariaModels[] = [];

  loading: boolean = true;

  filterActiva: boolean;
  filterInactiva: boolean;

  solicitudes: any[] = [];

  fundacionSeleccionadaId: number | null = null;

  constructor(
    private institucionBeneficiariaHttpService: InstitucionBeneficiariaHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.data.subscribe((data: any) => {
      this.filterActiva = data.filterActiva;
      this.filterInactiva = data.filterInactiva;
    });
  }

  ngOnInit(): void {
    if (this.filterActiva === true) {
      this.filterInstitucionBeneficiariaByState(this.filterActiva.toString());
    } else if (this.filterInactiva === false) {
      this.filterInstitucionBeneficiariaByState(this.filterInactiva.toString());
    } else {
      this.getInstitucionesBeneficiarias();
    }
  }

  //---------
  public openModal(institucionBeneficiariaId: number): void {
    const dialogRef = this.dialog.open(ModalSolicitudesComponent, {
      height: '500px',
      width: '800px',
      data: {
        fundacionSeleccionadaId: institucionBeneficiariaId, // Pasar el ID de la institución beneficiaria al modal
        solicitudes: this.solicitudes
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Realiza las acciones necesarias después de que el modal se cierre
      if (result) {
        // Código a ejecutar si se hizo clic en el botón o se cerró el modal
      }
    });
  }

  openAsignarModal(institucionBeneficiariaId: number): void {
    console.log(institucionBeneficiariaId);
    this.fundacionSeleccionadaId = institucionBeneficiariaId;
    const fundacion = this.getFundacionById(institucionBeneficiariaId);
    const dialogRef = this.dialog.open(AsignarModalComponent, {
      height: '500px',
      width: '800px',
      data: {
        fundacion: fundacion,
        solicitudes: this.solicitudes,
        fundacionSeleccionadaId: this.fundacionSeleccionadaId
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      // Realiza las acciones necesarias después de que el segundo modal se cierre
      if (result) {
        // Código a ejecutar si se hizo clic en el botón o se cerró el modal
      }
    });
  }

  isBeneficiaryInstitutionMatch(solicitud: any): boolean {
    // Verificar si fundacionSeleccionadaId y solicitud.project_id.beneficiary_institution_id son números válidos
    if (typeof this.fundacionSeleccionadaId === 'number' && typeof solicitud.project_id.beneficiary_institution_id === 'number') {
      // Realizar la comparación
      return this.fundacionSeleccionadaId === solicitud.project_id.beneficiary_institution_id;
    }
    // Si no se cumple la condición anterior, no hay coincidencia
    return false;
  }

  private getFundacionById(fundacionId: number): any {
    return this.institucionesBeneficiarias.find(institucion => institucion.id === fundacionId);
  }

  getNombreFundacion(fundacionId: number): string {
    const fundacion = this.institucionesBeneficiarias.find(
      institucion => institucion.id === fundacionId
    );
    return fundacion ? fundacion.name : '';
  }
  //---------

  public searchInstitucionBeneficiariaByTerm(term: string): void {
    this.loading = true;

    if (!term) {
      this.handleEmptyTerm();
    } else if (this.filterInactiva === false) {
      this.searchInactivaByTerm(term);
    } else if (this.filterActiva === true) {
      this.searchActivaByTerm(term);
    } else {
      this.searchInstitucionesBeneficiariasByTerm(term);
    }
  }

  private handleEmptyTerm(): void {
    if (this.filterInactiva === false) {
      this.filterInstitucionBeneficiariaByState(this.filterInactiva.toString());
    } else if (this.filterActiva === true) {
      this.filterInstitucionBeneficiariaByState(this.filterActiva.toString());
    } else {
      this.getInstitucionesBeneficiarias();
    }
  }

  public filterInstitucionBeneficiariaByState(state: string): void {
    this.loading = true;
    this.institucionBeneficiariaHttpService.filterInstitucionesBeneficiariaByStatus(state).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortInstitucionesBeneficiarias();
      }
      this.loading = false;
    });
  }

  public getInstitucionesBeneficiarias(): void {
    this.loading = true;
    this.institucionBeneficiariaHttpService.getInstitucionesBeneficiarias().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortInstitucionesBeneficiarias();
      }
      this.loading = false;
    });
  }

  private searchInstitucionesBeneficiariasByTerm(term: string): void {
    this.institucionBeneficiariaHttpService.searchInstitucionesBeneficiariaByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchInactivaByTerm(term: string): void {
    this.institucionBeneficiariaHttpService.searchInactivaByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  private searchActivaByTerm(term: string): void {
    this.institucionBeneficiariaHttpService.searchAprobadoByTerm(term).subscribe((res: any) => {
      this.handleSearchResponse(res);
    });
  }

  public reversOrder(): void {
    this.institucionesBeneficiarias.reverse();
    this.reverse = !this.reverse;
  };

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.institucionesBeneficiarias = res.data.beneficiaryInstitutions;
      this.reverse = false;
    }
    this.loading = false;
  }

  public sortInstitucionesBeneficiarias(): void {
    this.institucionesBeneficiarias.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  public openDialogArchiveRol(fundacionDetalle: InstitucionBeneficiariaDetalleModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivada y no podrá ser utilizada por los usuarios.',
        dato: ['Nombre:', fundacionDetalle.foundations.name, 'Tipo de solicitud:', fundacionDetalle.foundations],
        // dato: fundacionDetalle.foundations.name
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.archiveSolicitud(fundacionDetalle);
      }
    });
  }

}
