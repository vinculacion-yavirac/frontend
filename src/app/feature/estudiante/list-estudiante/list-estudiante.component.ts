import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth/users/usuario';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';

@Component({
  selector: 'app-list-estudiante',
  templateUrl: './list-estudiante.component.html',
  styleUrls: ['./list-estudiante.component.css']
})
export class ListEstudianteComponent implements OnInit {

  currentSolicitud: SolicitudModels = {} as SolicitudModels;
  solicitudes: SolicitudModels[] = [];
  reverse = false;
  pipe = new DatePipe('en-US');
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  loading: boolean = true;

  constructor(
    private solicitudianteService: SolicitudHttpService
  ) { }

  ngOnInit(): void {

  }

  // getSolicitud(): void {
  //   this.loading = true;
  //   this.solicitudianteService.getSolicitudes().subscribe((res: any) => {
  //     if (res.status == 'success') {
  //       const allPortafolios: SolicitudModels[] =  res.data.solicitudes;

  //       // // Obtener los participant_ids del resultado anterior
  //       // const participantIds: number[] = this.projectParticipants.map((projectParticipant: ProyectoParticipanteModels) => {
  //       //   return projectParticipant.participant_id.id;
  //       // });

  //       // Filtrar los portafolios donde created_by sea igual a uno de los participant_ids
  //       this.solicitudes = allPortafolios.filter((portafolio:  SolicitudModels) => {
  //         return participantIds.includes(portafolio.created_by.id);
  //       });
  //       // this.handleSearchResponse(res);
  //       // this.sortSolicitudes();
  //     }
  //     this.loading = false;
  //   })
  // };

  createSolicitudVinculacion(){
    this.solicitudianteService.createSolicitude(this.currentSolicitud).subscribe((response:any)=>{

    })
  }

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
      this.reverse = false;
    } else if(res.status === 'error'){
      this.solicitudes = res.data.solicitudes;
      this.reverse = false;
    }
    this.loading = false;
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  };

}
