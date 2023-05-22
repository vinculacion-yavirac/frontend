import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../../../../app/feature/upload/upload.service';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { SolicitudHttpService } from 'src/app/service/docente-vinculacion/solicitud/solicitud-http.service';


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
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getArchivedSolicituds();
  }

  public getArchivedSolicituds(): void {
    this.loading = true;
    this.solicitudHttpService.getArchivedSolicitud().subscribe((res: any) => {
      if (res.status == 'success') {
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
    });
  }

  public searchArchivedSolicitudByTerm(term: string): void {
    this.loading = true;

    this.solicitudHttpService.searchArchivedSolicitud(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.solicitudes = res.data.solicitudes;
        if (term === '') {
          this.getArchivedSolicituds();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.solicitudes.reverse();
    this.reverse = !this.reverse;
  }

  public restaureSolicitud(solicitud:SolicitudModels): void{
    this.solicitudHttpService.restaureSolicitud(solicitud.id).subscribe((res:any) =>{
      if(res.solicitudes.status == 'success'){
        this.getArchivedSolicituds()
      }
    })
  }


//   downloadFile(id: number, name: string) {
//     this.filesService.downloadFile(id).subscribe((blob: Blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = name;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     });
// }
}
