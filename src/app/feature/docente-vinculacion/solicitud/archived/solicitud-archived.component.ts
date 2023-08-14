import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-solicitud-archived',
  templateUrl: './solicitud-archived.component.html',
  styleUrls: ['./solicitud-archived.component.css']
})
export class SolicitudArchivedComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  solicitudes: SolicitudModels[] = [];

  loading: boolean = true;

  constructor(
      private solicitudHttpService: SolicitudHttpService,
      private router: Router,
      private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getArchivedSolicituds();
  }

  getArchivedSolicituds(): void {
    this.loading = true;
    this.solicitudHttpService.getArchivedSolicitude().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          this.sortSolicitudes();
        }
      },
      (error) => {
        if (error.error && error.error.message === 'No se encontraron solicitudes archivadas.') {
          this.handleSearchResponse(error);
          this.sortSolicitudes();
        } else {
          // Manejar otros errores
          console.error('Error al obtener solicitudes archivadas:', error);
        }
      }
    );
  }
  

  searchArchivedSolicitudByTerm(term: string): void {
    this.loading = true;
    this.solicitudHttpService.searchArchivedSolicitudeByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        this.reverse = false;
      }
      this.loading = false;
    }, (error) =>{
      if (error.error && error.error.message === 'No se encontraron solicitudes archivadas.') {
        this.solicitudes = error.error.data.solicitudes;
        this.loading = false;
        this.sortSolicitudes();
      } else {
        // Manejar otros errores
        console.error('no se encontraron solicitudes:', error);
      }
    });
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  }

  sortSolicitudes(): void {
    this.solicitudes.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.solicitudes = res.data.solicitudes;
      this.reverse = false;
    } 
    this.loading = false;
  }


  restaureSolicitud(solicitud: SolicitudModels): void {
    this.solicitudHttpService.restoreSolicitud(solicitud.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/solicitud/list']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }



  openDialogRestaurarSocilicitud(solicitud: SolicitudModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de restaurar esta Solicitud ?',
        message:
          'La Solicitud sera restaura y podrá ser utilizado por los usuarios.',
        dato:['Solicitud realizada:',  solicitud.created_by.person.names],
        button: 'Restaurar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaureSolicitud(solicitud);
      }
    });
  }
}

