import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
@Component({
  selector: 'app-informe-final-estudiante',
  templateUrl: './informe-final-estudiante.component.html',
  styleUrls: ['./informe-final-estudiante.component.css']
})
export class InformeFinalEstudianteComponent {

  public doc: any;
  proyectos: any[] = [];
  activities: any[] = [];
  id_proyecto: any;
  projectId: number;
  public activitiesData: any = [];

  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: AvanceCumplimientoService,
    private actividadesService: ActividadesService,

  ) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe((params: { [x: string]: number; }) => {
      console.log(params); // { orderby: "price" }
      this.projectId = params['id_proyecto'];
      if (this.projectId) {

        this.getAllProyectoById(this.projectId)
      }
        console.log(this.projectId);
      });
      this.getAllActividades();



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
    public getAllActividades() {
      this.actividadesService.getAllActivities().subscribe((data: any) => {
  
        console.log(data);
  
  
        if (data.data.activity != null && data.data.activity != null) {
          var resultData = data.data.activity;
          if (resultData) {
            console.log(resultData);
            for (let index = 0; index < resultData.length; index++) {
              const element = resultData[index];
  
              resultData[index]["observacion"]=""
            }
            this.activitiesData = resultData;
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
      this.doc.save("Informe_Estudiante.pdf");
      // location.reload();
    }
  
}
