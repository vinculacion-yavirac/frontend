import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { InstitucionBeneficiariaHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-http.service';
import { FileHttpService } from 'src/app/service/portafolio/files/file-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-archived-institucion',
  templateUrl: './archived-institucion.component.html',
  styleUrls: ['./archived-institucion.component.css']
})
export class ArchivedInstitucionComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

 institucionesBeneficiarias: InstitucionBeneficiariaModels[] = [];

  loading: boolean = true;

  constructor(
    private institucionBeneficiariaHttpService:InstitucionBeneficiariaHttpService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getArchivedInstitucion();
  }

  getArchivedInstitucion(): void {
    this.loading = true;
    this.institucionBeneficiariaHttpService.getArchivedInstitucion().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortInstitucion();
      }
      this.loading = false;
    }, (error) => {
      if (error.error && error.error.message === 'No se encontraron Beneficiary Institutions archivadas.') {
        this.handleSearchResponse(error);
        this.sortInstitucion();
      } else {
        // Manejar otros errores
        console.error('Error al obtener solicitudes archivadas:', error);
      }
    });
  }

  searchArchivedInstitucionByTerm(term: string): void {
    this.loading = true;

    this.institucionBeneficiariaHttpService.searchArchivedInstitucionByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        if (term === '') {
          this.getArchivedInstitucion();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.institucionesBeneficiarias.reverse();
    this.reverse = !this.reverse;
  }


  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.institucionesBeneficiarias = res.data.beneficiaryInstitutions;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortInstitucion(): void {
    this.institucionesBeneficiarias.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }


  restoreInstitucion(institucionesBeneficiarias: InstitucionBeneficiariaModels): void {
    this.institucionBeneficiariaHttpService.restoreInstitucion(institucionesBeneficiarias.id)
      .pipe(
        finalize(() => {
          this.router.navigate(['/system/institucion-beneficiaria/list']);
        })
      )
      .subscribe((res: any) => {
        if (res.solicitudes.status === 'success') {
          this.handleSearchResponse(res);
        }
      });

  }


  openDialogRestaurarInstitucion(institucionesBeneficiaria: InstitucionBeneficiariaModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de restaurar esta fundación ?',
        message:
          'La fundación sera restaura y podrá ser utilizado por los usuarios.',
        dato: [ institucionesBeneficiaria.archived_by.person.names],
        button: 'Restaurar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restoreInstitucion(institucionesBeneficiaria);
      }
    });
  }


  deleteInstitucion(institucionesBeneficiaria: InstitucionBeneficiariaModels): void {
    this.institucionBeneficiariaHttpService.deleteInstitucion(institucionesBeneficiaria.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/institucion-beneficiaria/list']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }



  openDialogDeleteInstitucion(institucionesBeneficiaria: InstitucionBeneficiariaModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿ Está seguro de eliminar esta Institución ?',
        message:
          'La institución sera eliminada del sistema.',
        button: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this. deleteInstitucion(institucionesBeneficiaria);
      }
    });
  }
}
