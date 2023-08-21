import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';

@Component({
  selector: 'app-solicitud-aprobado',
  templateUrl: './solicitud-aprobado.component.html',
  styleUrls: ['./solicitud-aprobado.component.css']
})
export class SolicitudAprobadoComponent implements OnInit {

  pipe = new DatePipe('en-US');
  reverse = false;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels[] = [];
  loading: boolean = true;
  certificado = 'Certificado';

  constructor(
    private solicitudHttpService: SolicitudHttpService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getSolicitud();
   }

  getSolicitud(): void {
    this.loading = true;
    this.solicitudHttpService.getSolicitudeCertificadoAprobado().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        console.log(this.handleSearchResponse(res))
      }
      this.loading = false;
    })
  };

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
     // this.reverse = false;
    }
    this.loading = false;
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

}
