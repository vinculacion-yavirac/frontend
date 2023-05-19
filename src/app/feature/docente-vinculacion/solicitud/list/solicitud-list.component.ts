import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../../../../app/feature/upload/upload.service';
import { PortafolioHttpService } from '../../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from '../../../../../app/models/portafolio/portafolio.models';


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

  portafolios: PortafoliosModels [] = [];

  loading: boolean = true;

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getportafolios();
  }

  getportafolios(): void {
    this.loading = true;
    this.portafolioHttpService.getPortafolios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.portafolios = res.data.official_documents;

        console.log(this.portafolios)

        this.portafolios.sort((a, b) => {
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

  searchportafoliosByTerm(term: string): void {
    this.loading = true;

    this.portafolioHttpService.searchPortafoliosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.portafolios = res.data.portafolios;
        if (term === '') {
          this.getportafolios();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.portafolios.reverse();
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
