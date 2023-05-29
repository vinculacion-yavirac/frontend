import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FundacionDetalleModels } from 'src/app/models/fundacion/fundacion-detalle.models';
import { FundacionModels } from 'src/app/models/fundacion/fundacion.models';
import { FundacionDetalleHttpService } from 'src/app/service/fundacion/fundacion-detalle-http.service';
import { FundacionHttpService } from 'src/app/service/fundacion/fundacion-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-list-fundacion',
  templateUrl: './list-fundacion.component.html',
  styleUrls: ['./list-fundacion.component.css']
})
export class ListFundacionComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  model : boolean;

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  fundaciones: FundacionModels [] = [];

  fundacionesDetalle: FundacionDetalleModels [] = [];

  loading: boolean = true;
  
  constructor(
    private fundacionHttpService: FundacionHttpService,
    private dialog: MatDialog,
    private fundacionDetalleHttpService:FundacionDetalleHttpService,
  ) { }

  ngOnInit(): void {
    this.getSolicitud()
    this.getSolicitudDettale();
  }


  openModel(){
    this.model = true
  }

  public getSolicitud():void{
    this.loading = true;
    this.fundacionHttpService.getFundaciones().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.fundaciones = res.data.foundations;
        console.log('aquixcd'+' '+this.fundaciones);
        this.fundaciones.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    })
  };

  public getSolicitudDettale():void{
    this.loading = true;
    this.fundacionDetalleHttpService.getFundacionesDetalle().subscribe((res:any) =>{
      if(res.status == 'success'){
        this.fundacionesDetalle = res.data.foundationsSolicitudes;
        console.log('aquixcd'+' '+this.fundaciones);
        // this.fundacionesDetalle.sort((a, b) => {
        //   if (a.foundations.toLowerCase() > b.foundations.toLowerCase()) {
        //     return 1;
        //   }
        //   if (a.name.toLowerCase() < b.name.toLowerCase()) {
        //     return -1;
        //   }
        //   return 0;
        // });
      }
      this.loading = false;
    })
  };

  public reversOrder(): void {
    this.fundaciones.reverse();
    this.reverse = !this.reverse;
  };

  // public archiveSolicitud(solicitud:SolicitudModels): void{
  //   this.solicitudHttpService.solicitudArchive(solicitud.id).subscribe((res:any) =>{
  //     if(res.status == 'success'){
  //       this.getSolicitud();
  //       console.log(this.getSolicitud())
  //     }
  //   })
  // };


  public openDialogArchiveRol(fundacionDetalle: FundacionDetalleModels): void {
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
