import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { FileHttpService } from '../../../../app/service/portafolio/files/file-http.service';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';

@Component({
  selector: 'app-portafolio-archived',
  templateUrl: './portafolio-archived.component.html',
  styleUrls: ['./portafolio-archived.component.css']
})
export class PortafolioArchivedComponent implements OnInit {


  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  portafolios: PortafoliosModels[] = [];

  loading: boolean = true;

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private fileHttpService: FileHttpService,
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
    this.fileHttpService.downloadFile(id).subscribe((blob: Blob) => {
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
