import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstitucionBeneficiariaDetalleModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria-detalle.models';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { InstitucionBeneficiariaHttpService } from 'src/app/service/institucion-beneficiaria/institucion-beneficiaria-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-list-institucion-beneficiaria',
  templateUrl: './list-institucion-beneficiaria.component.html',
  styleUrls: ['./list-institucion-beneficiaria.component.css']
})
export class ListInstitucionBeneficiariaComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  model : boolean;

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  institucionesBeneficiarias: InstitucionBeneficiariaModels [] = [];

  loading: boolean = true;

  constructor(
    private institucionBeneficiariaHttpService: InstitucionBeneficiariaHttpService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getInstitucionBeneficiaria();
  }


  public getInstitucionBeneficiaria():void{
    this.loading = true;
    this.institucionBeneficiariaHttpService.getInstitucionesBeneficiarias().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.handleSearchResponse(res);
        this.sortInstitucionesBeneficiarias();
      }
      this.loading = false;
    })
  };

  public reversOrder(): void {
    this.institucionesBeneficiarias.reverse();
    this.reverse = !this.reverse;
  };

  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.institucionesBeneficiarias = res.data.beneficiaryInstitutions;
      this.reverse = false;
    }
    this.loading = false;
  }
  public sortInstitucionesBeneficiarias(): void {
    this.institucionesBeneficiarias.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }


  public openDialogArchiveRol(fundacionDetalle: InstitucionBeneficiariaDetalleModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato:['Nombre:', fundacionDetalle.foundations.name, 'Tipo de solicitud:', fundacionDetalle.foundations],
        // dato: fundacionDetalle.foundations.name
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.archiveSolicitud(fundacionDetalle);
      }
    });
  }

}
