import { Component, OnInit } from '@angular/core';
import { OficiosService } from '../oficios.service';
import { Oficio } from '../oficio';
import { DatePipe } from '@angular/common';
import { FilesService } from 'src/app/feature/upload/upload.service';


@Component({
  selector: 'app-oficios-archived',
  templateUrl: './oficios-archived.component.html',
  styleUrls: ['./oficios-archived.component.css']
})
export class OficiosArchivedComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  oficios: Oficio[] = [];

  loading: boolean = true;

  constructor(
    private oficiosService: OficiosService,
    private filesService: FilesService,
  ) { }

  ngOnInit(): void {
    this.getOficios();
  }

  getOficios(): void {
    this.loading = true;
    this.oficiosService.getOficios().subscribe((res: any) => {
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

    this.oficiosService.searchOficiosByTerm(term).subscribe((res: any) => {
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
