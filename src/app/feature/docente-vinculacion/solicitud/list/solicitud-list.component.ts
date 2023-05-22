import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private solicitudHttpService: SolicitudHttpService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSolicitud();
  }

  public getSolicitud():void{
    this.loading = true;
    this.solicitudHttpService.getSolicitud().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.solicitudes = res.data.solicitudes;
        this.solicitudes.sort((a, b) => {
          if (a.type_of_request.toLowerCase() > b.type_of_request.toLowerCase()) {
            return 1;
          }
          if (a.type_of_request.toLowerCase() < b.type_of_request.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    })
  };

  public reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  };

  public searchSolicitudesByTerm(term:string):void{
    this.loading = true;
    this.solicitudHttpService.searchSolicitudByTerm(term).subscribe((res:any)=>{
      if(res.status == 'success'){
        this.solicitudes = res.data.solicitudes;
        if(term = ''){
          this.getSolicitud()
        }
        this.reverse = false;
      }
      this.loading = false;
    })
  };

  public archiveSolicitud(solicitud:SolicitudModels): void{
    this.solicitudHttpService.solicitudArchive(solicitud.id).subscribe((res:any) =>{
      if(res.status == 'success'){
        this.getSolicitud();
        console.log(this.getSolicitud())
      }
    })
  }


  public openDialogArchiveRol(solicitud: SolicitudModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato:['Nombre:', solicitud.created_by.person.names, 'Tipo de solicitud:', solicitud.type_of_request],
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
