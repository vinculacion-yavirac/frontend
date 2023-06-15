import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { FilesService } from '../../upload/upload.service';
import {ActivatedRoute, Params} from "@angular/router";

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

  filterAprobado: boolean;
  filterPendiente: boolean;

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private filesService: FilesService,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((data: any) => {
      this.filterAprobado = data.filterAprobado;
      this.filterPendiente = data.filterPendiente;
    });
  }

  ngOnInit(): void {
    if (this.filterAprobado === true) {
      this.filterBriefcaseByState(this.filterAprobado.toString());
    } else if (this.filterPendiente === false) {
      this.filterBriefcaseByState(this.filterPendiente.toString());
    } else {
      this.getportafolio();
    }
  }

  public  filterBriefcaseByState(state: string): void {
    this.loading = true;
    this.portafolioHttpService.filterBriefcaseByStatus(state).subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortPortafolio();
      }
      this.loading = false;
    });
  }

  public getportafolio(): void {
    this.loading = true;
    this.portafolioHttpService.getPortafolios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortPortafolio();
      }
      this.loading = false;
    });
  }

  searchportafolioByTerm(term: string): void {
    this.loading = true;

    this.portafolioHttpService.searchPortafoliosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
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

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  public sortPortafolio(): void {
    this.portafolios.sort((a, b) => {
      return a.project_participant_id.participant_id.person.names.toLowerCase().localeCompare(b.project_participant_id.participant_id.person.names.toLowerCase());
    });
  }

}
