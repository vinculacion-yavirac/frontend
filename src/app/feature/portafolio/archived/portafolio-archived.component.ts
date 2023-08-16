import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { FileHttpService } from '../../../../app/service/portafolio/files/file-http.service';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import {Router} from "@angular/router";
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from "rxjs/operators";

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
  loading = true;

  constructor(
      private portafolioHttpService: PortafolioHttpService,
      private router: Router,
      private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getPortafolios();
  }

  getPortafolios(): void {
    this.loading = true;
    this.portafolioHttpService.getArchivedBriefcase().subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
      }
      this.loading = false;
    });
  }

  searchPortafoliosByTerm(term: string): void {
    this.loading = true;

    if (term === '') {
      this.getPortafolios();
    } else {
      this.portafolioHttpService.searchArchivedBriefcaseByTerm(term).subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          this.reverse = false;
        }
        this.loading = false;
      });
    }
  }

  reversOrder(): void {
    this.portafolios.reverse();
    this.reverse = !this.reverse;
  }


  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortSolicitudes(): void {
    this.portafolios.sort((a, b) => {
      return a.created_by.person.names
          .toLowerCase()
          .localeCompare(b.created_by.person.names.toLowerCase());
    });
  }


  deletePortafolio(briefcase: PortafoliosModels): void {
    this.portafolioHttpService.deleteBriefcase(briefcase.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/portafolio/list']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }

  openDialogDeletePortafolio(briefcase: PortafoliosModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿ Está seguro de eliminar este portafolio ?',
        message:
          'El portafolio sera eliminada del sistema con sus archivos.',
        button: 'Eliminar Definitivamente',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePortafolio(briefcase);
      }
    });
  }

  restaurePortafolio(briefcase: PortafoliosModels): void {
    this.portafolioHttpService.restoreBriefcase(briefcase.id)
        .subscribe((res: any) => {
          if (res.portafolios.status === 'success') {
            this.handleSearchResponse(res);
          }
          this.router.navigate(['/system/portafolio/list']);
        });
  }


  restaureBriefcase(briefcase: PortafoliosModels): void {
    this.portafolioHttpService.restoreBriefcase(briefcase.id)
      .pipe(
        finalize(() => {
          this.router.navigate(['/system/portafolio/list']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
        }
      });
  }

  openDialogRestaurarPortafolio(briefcase: PortafoliosModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de restaurar este portafolio ?',
        message:
          'El portafolio sera restaurado y podrá ser utilizado por los usuarios.',
        dato: ['Portafolio realizado:', briefcase.created_by.person.names],
        button: 'Restaurar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaureBriefcase(briefcase);
      }
    });
  }
}
