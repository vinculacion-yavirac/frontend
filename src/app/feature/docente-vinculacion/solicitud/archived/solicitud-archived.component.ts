import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../../../../app/feature/upload/upload.service';
import { PortafolioHttpService } from '../../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from '../../../../../app/models/portafolio/portafolio.models';


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

  oficios: PortafoliosModels[] = [];

  loading: boolean = true;

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getOficios();
  }

  getOficios(): void {
    this.loading = true;
    this.portafolioHttpService.getPortafolios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.oficios = res.data.official_documents;

        console.log(this.oficios)

        this.oficios.sort((a, b) => {
          if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
            return 1;
          }
          if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    });
  }

  searchOficiosByTerm(term: string): void {
    this.loading = true;

    this.portafolioHttpService.searchPortafoliosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.oficios = res.data.oficios;
        if (term === '') {
          this.getOficios();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.oficios.reverse();
    this.reverse = !this.reverse;
  }

  downloadFile(id: number, name: string) {
    this.filesService.downloadFile(id).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}
}
