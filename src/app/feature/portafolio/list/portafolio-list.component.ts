import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { FilesService } from '../../upload/upload.service';

@Component({
  selector: 'app-portafolio-list',
  templateUrl: './portafolio-list.component.html',
  styleUrls: ['./portafolio-list.component.css']
})
export class PortafolioListComponent implements OnInit {

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
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getportafolio();
  }

  getportafolio(): void {
    this.loading = true;
    this.portafolioHttpService.getPortafolios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.portafolios = res.data.briefcases;

        // console.log(this.portafolios)

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

  searchportafolioByTerm(term: string): void {
    this.loading = true;

    this.portafolioHttpService.searchPortafoliosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.portafolios = res.data.briefcase;
        console.log(this.portafolios)
        if (term === '') {
          this.getportafolio();
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
