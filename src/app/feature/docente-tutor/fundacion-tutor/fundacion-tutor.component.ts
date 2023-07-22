import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionBeneficiariaDetalleModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria-detalle.models';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { InstitucionBeneficiariaHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { AsignarModalComponent } from '../../institucion-beneficiaria/asignar-modal/asignar-modal.component';
import { ModalSolicitudesComponent } from '../../institucion-beneficiaria/modal-solicitudes/modal-solicitudes.component';
import { HttpClient } from '@angular/common/http';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';

@Component({
  selector: 'app-fundacion-tutor',
  templateUrl: './fundacion-tutor.component.html',
  styleUrls: ['./fundacion-tutor.component.css']
})
export class FundacionTutorComponent implements OnInit {


  reverse = false;
  pipe = new DatePipe('en-US');
  model: boolean;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  institucionesBeneficiarias: InstitucionBeneficiariaModels[] = [];
  projectParticipants : ProyectoParticipanteModels [] = []
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
    private http: HttpClient,
  ) {
    this.route.data.subscribe((data: any) => {
      this.filterActiva = data.filterActiva;
      this.filterInactiva = data.filterInactiva;
    });
  }

  ngOnInit(): void {
    this.getAllProjectParticipantsTutor();
    if (this.filterActiva === true) {
      this.filterInstitucionBeneficiariaByState(this.filterActiva.toString());
    } else if (this.filterInactiva === false) {
      this.filterInstitucionBeneficiariaByState(this.filterInactiva.toString());
    } else {
      this.getInstitucionesBeneficiarias();
    }

    const institucionBeneficiariaMap = new Map<number, ProyectoParticipanteModels[]>();

    for (const projectParticipant of this.projectParticipants) {
      const beneficiaryInstitutionId = projectParticipant.project_id.beneficiary_institution_id?.id;
      if (beneficiaryInstitutionId) {
        if (institucionBeneficiariaMap.has(beneficiaryInstitutionId)) {
          institucionBeneficiariaMap.get(beneficiaryInstitutionId)?.push(projectParticipant);
        } else {
          institucionBeneficiariaMap.set(beneficiaryInstitutionId, [projectParticipant]);
        }
      }
    }
  }


  private getAllProjectParticipantsTutor(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/project-participant/lista';
    this.http.get<any>(apiUrl).subscribe((res: any) => {
      if (res.status === 'success') {
        const uniqueBeneficiaryIds: { [id: number]: boolean } = {};
        const uniqueProjectParticipants: ProyectoParticipanteModels[] = [];

        res.data.projectParticipants.forEach((projectParticipant: ProyectoParticipanteModels) => {
          // Verificamos si beneficiary_institution_id no es null
          if (projectParticipant.project_id.beneficiary_institution_id !== null) {
            const beneficiaryId = projectParticipant.project_id.beneficiary_institution_id.id;
            if (!uniqueBeneficiaryIds[beneficiaryId]) {
              uniqueBeneficiaryIds[beneficiaryId] = true;
              uniqueProjectParticipants.push(projectParticipant);
            }
          }
        });

        this.projectParticipants = uniqueProjectParticipants;
      }
      this.loading = false;
    });
  }





  public openModal(institucionBeneficiariaId: number | undefined): void {
    const dialogRef = this.dialog.open(ModalSolicitudesComponent, {
      height: '500px',
      width: '800px',
      data: {
        fundacionSeleccionadaId: institucionBeneficiariaId,
        solicitudes: this.solicitudes
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  isBeneficiaryInstitutionMatch(solicitud: any): boolean {
    if (typeof this.fundacionSeleccionadaId === 'number' && typeof solicitud.project_id.beneficiary_institution_id === 'number') {
      return this.fundacionSeleccionadaId === solicitud.project_id.beneficiary_institution_id;
    }
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
}
