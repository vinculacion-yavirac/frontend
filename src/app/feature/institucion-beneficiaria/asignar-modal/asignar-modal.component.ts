import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable, of } from 'rxjs';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

@Component({
  selector: 'app-asignar-modal',
  templateUrl: './asignar-modal.component.html',
  styleUrls: ['./asignar-modal.component.css']
})
export class AsignarModalComponent implements OnInit {

 //--Solicitud- proyect-----
currentSolicitude: SolicitudModels = {} as SolicitudModels;
currentProyectoParticipante: ProyectoParticipanteModels = {} as ProyectoParticipanteModels;
proyectoParticipante: ProyectoParticipanteModels[] = [];
paramsSubscription: Subscription;
formGroup: FormGroup;
title = 'Asignar Estudiante';

//--------------------------
  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels [] = [];
  proyectos: ProyectoModels[] = [];

  loading: boolean = true;

  @Input() fundacionSeleccionadaId: number | null = null;

  //--------
  nombreProyecto: string | null = null;
  nombreFundacion: string | null = null;
  datosCargados$: Observable<boolean> = of(false);
  existeSolicitudPendiente$: Observable<boolean> = of(false);
  //--------

  fundacionSeleccionada: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solicitudHttpService: SolicitudHttpService,
    private proyectoService: ProyectoService,
  ) {
    this.fundacionSeleccionadaId = data.fundacionSeleccionadaId; // Verifica que esté asignado correctamente
  }

  ngOnInit(): void {
    this.getProject();

  }



  //------
  public existeProyectoFundacion(): boolean {
    return this.proyectos && this.proyectos.some(proyecto =>
      proyecto.beneficiary_institution_id.id === this.fundacionSeleccionadaId
    );
  }

//--------

getSolicitud(): void {
  this.loading = true;
  this.solicitudHttpService.getSolicitudes().subscribe((res:any) => {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
      this.handleSearchResponse(res);

    }
    this.loading = false;
  });
}



  getSolicitudByStatus(status: string): void {
    this.loading = true;
    this.solicitudHttpService.filterSolicitudeByStatus(status).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);

      }
      this.loading = false;
    });
  }



  reversOrder(): void {

    this.proyectos.reverse();
    this.reverse = !this.reverse;
  };



  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {

      this.proyectos = res.data.projects;
      this.reverse = false;
      this.sortProjects();

      if (Array.isArray(this.proyectos)) {
        let foundMatchingProject = false;
        let matchingProjects = []; // Arreglo para almacenar los proyectos coincidentes

        for (const proyecto of this.proyectos) {
          const beneficiarioInstitucionId = proyecto.beneficiary_institution_id?.id;

          if (this.fundacionSeleccionadaId === beneficiarioInstitucionId) {
            this.nombreProyecto = proyecto.name;
            this.nombreFundacion = proyecto.beneficiary_institution_id.name;
            foundMatchingProject = true;
            matchingProjects.push(proyecto); // Agregar el proyecto coincidente al arreglo
          }
        }

        if (!foundMatchingProject) {
          console.log('No se encontraron proyectos relacionados con la fundación seleccionada.');
        } else {
          this.datosCargados$ = of(true); // Se encontraron proyectos relacionados, los datos están cargados
          console.log(this.datosCargados$);
          console.log(matchingProjects); // Imprimir los proyectos coincidentes en la consola
        }
      }
    }

    this.loading = false;
  }




//-------proyecto--------

getProject(): void {
  this.loading = true;
  this.proyectoService.getProject().subscribe((res: any) => {
    if (res.status == 'success') {
      this.proyectos = res.data.proyectos; // Asegúrate de obtener correctamente los proyectos aquí
      this.handleSearchResponse(res);
    }
    this.loading = false;
  });
}


sortProjects(): void {
  if (this.proyectos) {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
}

}
