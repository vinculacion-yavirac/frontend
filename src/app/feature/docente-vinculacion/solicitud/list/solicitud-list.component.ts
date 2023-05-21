import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../../../../app/feature/upload/upload.service';
import { PortafolioHttpService } from '../../../../../app/service/portafolio/portafolio-http.service';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';


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
  ) { }

  ngOnInit(): void {
    this.getSolicitud();
  }

  public getSolicitud():void{
    this.loading = true;
    this.solicitudHttpService.getSolicitud().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.solicitudes = res.data.solicitudes;
        console.log(res.data.solicitudes)
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
    this.solicitudHttpService.searchSolicitudByTerm(term).subscribe((rest:any)=>{
      if(rest.status == 'success'){
        this.solicitudes = rest.data.solicitudes;
        if(term = ''){
          this.getSolicitud()
        }
        this.reverse = false;
      }
      this.loading = false;
    })
  }


  
}
