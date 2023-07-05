import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { FilesService } from '../../upload/upload.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ModalAlertComponent} from "../../../shared/material/modal-alert/modal-alert.component";
import {MatDialog} from "@angular/material/dialog";
import { tap, switchMap } from 'rxjs/operators';
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
  loading = true;
  filterAprobado: boolean;
  filterPendiente: boolean;

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private filesService: FilesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
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
      this.getPortafolio();
    }
  }

  searchPortafoliosByTerm(term: string): void {
    this.loading = true;

    if (!term) {
      this.handleEmptyTerm();
    } else if (this.filterPendiente === false) {
      this.searchPendienteByTerm(term);
    } else if (this.filterAprobado === true) {
      this.searchAprobadoByTerm(term);
    } else {
      this.searchPortafolioByTerm(term);
    }
  }

  handleEmptyTerm(): void {
    if (this.filterPendiente === false) {
      this.filterBriefcaseByState(this.filterPendiente.toString());
    } else if (this.filterAprobado === true) {
      this.filterBriefcaseByState(this.filterAprobado.toString());
    } else {
      this.getPortafolio();
    }
  }

  filterBriefcaseByState(state: string): void {
    this.loading = true;
    this.portafolioHttpService
      .filterBriefcaseByStatus(state)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
        this.loading = false;
      });
  }

  getPortafolio(): void {
    this.loading = true;
    this.portafolioHttpService.getBriefcase().subscribe((res: any) => {
      this.handleSearchResponse(res);
      this.loading = false;
    });
  }

  searchPortafolioByTerm(term: string): void {
    this.portafolioHttpService
      .searchBriefcaseByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  searchPendienteByTerm(term: string): void {
    this.portafolioHttpService
      .searchPendienteByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  searchAprobadoByTerm(term: string): void {
    this.portafolioHttpService
      .searchAprobadoByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  reversOrder(): void {
    this.portafolios.reverse();
    this.reverse = !this.reverse;
  }

  archiveBriefcases(briefcase: PortafoliosModels): void {
    this.portafolioHttpService
      .archiveBriefcase(briefcase.id)
      .pipe(
        tap((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
            console.log('archive id');
          }
        }),
        switchMap(() => this.router.navigate(['/system/portafolio/list/archived']))
      )
      .subscribe();
  }

  openDialogArchiveBriefcase(briefcase: PortafoliosModels): void {
    console.log('entraaaaaaaaaaaaaaaaaaaaa');
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'El portafolio será archivado y no podrá ser utilizado por los usuarios.',
        dato: ['Nombre:', briefcase.project_participant_id.participant_id.person.names],
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveBriefcases(briefcase);
        this.router.navigate(['/system/portafolio/list']);
        console.log('entra dialog');
      }
    });
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

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortPortafolio(): void {
    this.portafolios.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

}
