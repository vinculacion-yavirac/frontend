import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
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
    this.getSolicitudStudent();
  }

 getSolicitudStudent(){
  this.solicitudianteService.getSolicitudesStudent().subscribe((response: any) =>{
    if(response.status === 'success'){
      this.handleSuccesResponse(response);
    }
  }, (e) =>{
    if (e.error && e.error.message === 'No  tiene solicitudes.') {
      this.solicitudes = e.error.data.solicitudes;
      this.loading = false;
    } else {
      // Manejar otros errores
      console.error(e.error.message, e);
    }
  })
 }

  createSolicitudVinculacion(){
    this.solicitudianteService.createSolicitudeVinculacion(this.currentSolicitud).subscribe((response:any)=>{
      if(response.status === 'success'){
        this.getSolicitudStudent();
      }
    }, (e) =>{
      if(e.error && e.error.message === 'Ya enviaste tu solicitud de vinculacion.'){
        this.solicitudes = e.error.data.solicitudes;
      } else {
        console.error(e.error.message, e);
      }
    })
  }


  createCertificadoVinculacion(){
    this.solicitudianteService.createCertificadoVinculacion(this.currentSolicitud).subscribe((response:any)=>{
      if(response.status === 'success'){
        this.getSolicitudStudent();
      }
    }, (e) =>{
      if(e.error && e.error.message === 'Ya enviaste tu solicitud de vinculacion.'){
        this.solicitudes = e.error.data.solicitudes;
      } else {
        console.error(e.error.message, e);
      }
    })
  }

  private handleSuccesResponse(res: any): void {
    if (res.status === 'success') {
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
