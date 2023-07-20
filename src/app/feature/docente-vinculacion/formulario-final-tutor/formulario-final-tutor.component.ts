import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';
@Component({
  selector: 'app-formulario-final-tutor',
  templateUrl: './formulario-final-tutor.component.html',
  styleUrls: ['./formulario-final-tutor.component.css']
})
export class FormularioFinalTutorComponent implements OnInit {

  public doc: any;
  proyectos: any[] = [];
  activities: any[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private httpProvider: AvanceCumplimientoService,
    private actividadesService: ActividadesService,

    private miDatePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAllProyectoById(1)
  }

  public getAllProyectoById(id:number): void {
    this.httpProvider.getProyectoById(id).subscribe((data: any) => {

      console.log(data);

      this.proyectos = Object.values(data);
      console.log(this.proyectos);
      if (data.data.projects != null && data.data.projects != null) {
        var resultData = data.data.projects;
        if (resultData) {
          
          
          this.proyectos = [resultData];
          console.log(this.proyectos);
         // this.getAllActividades(1);

        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.proyectos = [];
            }
          }
        }
      });
  }
  public getAllActividades(id:number) {
    this.actividadesService.getAllGoalssById(id).subscribe((data: any) => {

      console.log(data);


      if (data.data.activity != null && data.data.activity != null) {
        var resultData = data.data.activity;
        if (resultData) {
          console.log(resultData);

          this.activities = [resultData];
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              // this.activities = [];
            }
          }
        }
      });
  }
  /* pdf proyecto*/
  public Generar_Solicitud() {
    this.doc = new jsPDF('p', 'pt');
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
    this.doc.setFontSize(14);
    // this.doc.setFontStyle('bold');
    this.doc.setFont("Roboto", 'bold');
    this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 140);
    this.doc.text('D E  T U R I S M O   Y  P A T R I M O N I O', 155, 160);
    this.doc.text('“Y A V I R A C”', 250, 175);
    this.doc.setFontSize(12);
    this.doc.text('Informe de seguimiento y/o final de actividades de vinculación con la comunidad', 95, 210);


    this.doc.setFontSize(9);
    this.doc.line(45, 700, 200, 700);
    this.doc.text('TUTOR PROYECTO', 65, 710);
    this.doc.text('$F{Tutor}', 75, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(250, 700, 375, 700);
    this.doc.text('TUTOR ENTIDAD BENEFICIARIA', 240, 710);
    this.doc.text('$F{rector}', 295, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(450, 700, 550, 700);
    this.doc.text('ESTUDIANTE', 470, 710,);
    this.doc.text('$F{rector}', 475, 725, { maxWidth: 100, align: 'center' });
    this.doc.autoTable({
      html: '#table', startY: 255,
      margin: { top: 380, right: 60, bottom: 100 },
      styles: {
        cellPadding: 2,
        fontSize: 7,
        valign: 'middle',
        overflow: 'linebreak',
        tableWidth: 'auto',
        lineWidth: 0,
      }
    })
    this.doc.autoTable({
      html: '#table2', startY: 300,          margin: { top: 380, right: 60, bottom: 100 },
      styles: {
        cellPadding: 2,
        fontSize: 7,
        valign: 'middle',
        overflow: 'linebreak',
        tableWidth: 'auto',
        lineWidth: 0,
      }
    })
    this.doc.save("Informae_final.pdf");
    // location.reload();
  }


}
