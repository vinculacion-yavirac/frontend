import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectoModels } from '../../../models/proyecto/proyecto.models';
import { ProyectoService } from '../../../service/proyecto/proyecto.service';
import { finalize, switchMap, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalAlertComponent } from "../../../shared/material/modal-alert/modal-alert.component";
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { noop } from 'rxjs';

@Component({
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  /*Variables para generar pdfs*/
  public doc: any;
  public doc2: any;
  public avanceData: any;
  id?: string;
  public proyectData: any = [];
  proyectos: ProyectoModels[] = [];
  public proyectID: number;
  loading: boolean = true;
  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private httpProvider: AvanceCumplimientoService,
    private miDatePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getProject();/*Iniciamos obteniendo toso los proyectos*/
  }

  /*Funcion para obtener todo los proyectos*/
  getProject(): void {
    this.loading = true;
    this.proyectoService.getProject().subscribe((res: any) => {
      if (res.status == 'success') {
        console.log(res);

        this.handleSearchResponse(res);
      }
      this.loading = false;
    });
  }



  searchProjectByTerms(term: string): void {
    this.loading = true;
    this.proyectoService.searchProjectByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        console.log(this.proyectos);
        if (term === '') {
          this.getProject();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.proyectos.reverse();
    this.reverse = !this.reverse;
  }

  archiveProject(proyecto: ProyectoModels): void {
    this.proyectoService.archiveProject(proyecto.id)
      .pipe(
        finalize(() => {
          this.router.navigate(['/system/proyecto/list/archived']);
        })
      )
      .subscribe((res: any) => {
        if (res.solicitudes.status === 'success') {
          this.handleSearchResponse(res);
        }
      });
  }



  openDialogArchiveProject(proyecto: ProyectoModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato: ['Nombre:', proyecto.name, 'Tipo de solicitud:', proyecto.name],
        // dato: solicitud.type_of_request,
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveProject(proyecto);
      }
    });
  }


  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.proyectos = res.data.projects;
      this.reverse = false;
      this.sortProjects();
    }
    this.loading = false;
  }

  sortProjects(): void {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  /*mETODO PARA OBTENER PROYECTO CON ID*/
  getIdProyect(proyecto: ProyectoModels): void {
    console.log(proyecto);
    this.proyectID = proyecto.id;
    this.getAllProyectoById(proyecto.id)
  }

  getDocenteForms(proyecto: ProyectoModels): void {
    this.proyectID = proyecto.id;
  }
  generar_informeControl() {


    this.router.navigate(['/system/docente-vinculacion/informe-control/'], { queryParams: { id_proyecto: this.proyectID } });
  }

  generar_informeFinal() {
    this.router.navigate(['/system/docente-vinculacion/formulario-final-tutor/'], { queryParams: { id_proyecto: this.proyectID } });
  }


  generar_informeInicail() {

    console.log(this.proyectID);
    this.router.navigate(['/system/docente-vinculacion/informe-inicial/'], { queryParams: { id_proyecto: this.proyectID } });
  }

  generar_informeEstudiante() {
    this.router.navigate(['/system/estudiante/informe-final-estudiante/'], { queryParams: { id_proyecto: this.proyectID } });

  }


  replace(str: any, regex: any) {
    let matched = str.match(regex);
    matched ? matched.forEach((foundString: any) => {
      foundString = foundString.substring(1, foundString.length - 1);
      str = str.replace(regex, `<b>${foundString}</b>`);
    }) : noop;
    return str;
  }


  /*PETICIO AL BACKEND POR ID */
  public getAllProyectoById(id: number): void {
    this.httpProvider.getProyectoById(id).subscribe((data: any) => {

      console.log(data);


      if (data.data.projects != null && data.data.projects != null) {
        var resultData = data.data.projects;
        if (resultData) {
          console.log(resultData);
          console.log(resultData);
          this.proyectData = resultData;
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.proyectData = [];
            }
          }
        }
      });
  }

  /*Seccion generear reportes Convenio,Itv,Proyecto  */

  /* pdf proyecto*/
  public pdf() {

    this.doc = new jsPDF('p', 'pt');
    let rows: never[] = [];

    const pageContent = (data: any) => {
      // HEADER
      this.doc.setFontSize(16);/*Tamaño de la letra*/
      // this.doc.setFontStyle('bold');
      this.doc.setFont("Roboto", 'bold');/*Tipo de letra*/
      this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 85);/*Coordenadas que para estilo saltos de liena , espacios*/
      this.doc.text('D E   T U R I S M O   Y	P A T R I M O N I O', 155, 115);
      this.doc.text('“Y A V I R A C”', 255, 145);

      // this.doc.setFontSize(7);
      // this.doc.text('Quito- Ecuador', 215, 165);

      this.doc.setFontSize(11);
      // this.doc.setFontStyle('bold');
      this.doc.text('DEPARTAMENTO DE VINCULACIÓN CON LA  SOCIEDAD ', 155, 210);
      // this.doc.setFontSize(11);
      // this.doc.setFontStyle('normal');
      // this.doc.text('VINCULACIÓN CON LA  SOCIEDAD', 280, 210);

      this.doc.setFontSize(11);
      this.doc.text('CARRERA:', 155, 230);/*155 el espacio  del borde izquierdo al borde derecho  230 este margen top y marget bot */
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.career_id.name, 215, 230);

      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('NOMBRE DEL PROYECTO:', 115, 255);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.name, 260, 255, { maxWidth: 250, align: 'justify' });

      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('COORDINADOR DE CARRERA:', 45, 355);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('ING. DIEGO YANEZ', 215, 355);
      this.doc.setFontSize(10);

      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('ACTORES:/TUTORES:', 45, 380);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('BYRON MORENO / YOGLEDIS HERRERA', 170, 380);
      this.doc.setFontSize(10);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('INSTITUCIÓN BENEFICIARIA:', 45, 405);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.name, 210, 405);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('COORDINADOR(ES) INSTITUCIÓN BENEFICIARIA:', 45, 435);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 320, 435);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('CODIGO DEL PROYECTO:', 45, 465);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.code, 190, 465);


      var d = new Date();
      var s = new Date();
      var dia = s.getUTCDate();
      var ed = this.id
      const month_value = d.getMonth();
      var months = new Array(12);
      months[0] = "Enero";
      months[1] = "Febrero";
      months[2] = "Marzo";
      months[3] = "Abril";
      months[4] = "Mayo";
      months[5] = "Junio";
      months[6] = "Julio";
      months[7] = "Agosto";
      months[8] = "Septiembre";
      months[9] = "Octubre";
      months[10] = "Noviembre";
      months[11] = "Diciembre";
      this.doc.setFontSize(16);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Quito-Ecuador', 255, 575);
      this.doc.setFontSize(16);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text(months[month_value] + '- 2023', 255, 600);

    }
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);/*Linea para agregar imagen de contorno del pdf*/

    const pageContent2 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 150, 550, 150);
      this.doc.line(40, 150, 40, 650);
      this.doc.line(550, 150, 550, 650);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('1. PROYECTO/ACTIVIDAD', 45, 165);
      this.doc.line(40, 170, 550, 170);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('TITULO:', 45, 185);
      this.doc.setFontSize(6);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Debe responder a estas tres preguntas: ¿Qué se va a hacer? ¿Sobre qué? ¿Dónde?', 85, 185);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.name, 45, 200, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 230, 550, 230);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('CARRERA:', 45, 240);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.career_id.name, 95, 240);
      this.doc.line(40, 250, 550, 250);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('CICLO:', 45, 260);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.cicle, 85, 260, { maxWidth: 250, align: 'justify' });
      this.doc.line(40, 275, 550, 275);


      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('COBERTURA Y LOCALIZACION:', 45, 295);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.address, 200, 285, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 315, 550, 315);

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('PLAZO DE EJECUCION:', 45, 340);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('3 años', 200, 340, { maxWidth: 345, align: 'justify' });
      this.doc.line(40, 355, 550, 355);
      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA PRESENTACIÓN:', 45, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.miDatePipe.transform(this.proyectData.date_presentation, 'dd/MM/yyyy'), 200, 375, { maxWidth: 345, align: 'justify' });

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA INICIO:', 250, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.miDatePipe.transform(this.proyectData.start_date, 'dd/MM/yyyy'), 325, 375, { maxWidth: 345, align: 'justify' });

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FECHA FIN:', 385, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.miDatePipe.transform(this.proyectData.end_date, 'dd/MM/yyyy'), 450, 375, { maxWidth: 345, align: 'justify' });

      this.doc.line(40, 390, 550, 390);
      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(9);
      this.doc.text('FRECUENCIA ACTIVIDADES:', 240, 410);
      this.doc.line(40, 420, 550, 420);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('DIARIA', 80, 440);
      this.doc.text('SEMANAL', 195, 440);
      this.doc.text('QUINCENAL', 320, 440);
      this.doc.text('MENSUAL', 440, 440);
      this.doc.line(140, 420, 140, 510);
      this.doc.line(260, 420, 260, 510);
      this.doc.line(400, 420, 400, 510);
      var actividades = JSON.parse(this.proyectData.frequency_activity);

      this.doc.line(40, 460, 550, 460);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      for (let i = 0; i < actividades.length; i++) {
        const element = actividades[i];
        console.log(element);
        if (element === 'diaria') {
          this.doc.text('X', 95, 480);
        } else if (element === 'semanal') {
          this.doc.text('X', 210, 480);
        } else if (element === 'quincenal') {
          this.doc.text('X', 340, 480);
        } else if (element === 'mensual') {
          this.doc.text('X', 450, 480);
        }

      }

      this.doc.line(40, 510, 550, 510);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('ACTIVIDADE DE VINCULACIÓN', 55, 530);
      this.doc.line(170, 550, 170, 650);
      this.doc.line(210, 510, 210, 650);
      this.doc.text('SECTORES DE INTERVENCIÓN', 230, 530);
      this.doc.line(345, 550, 345, 650);
      this.doc.line(385, 510, 385, 650);
      this.doc.text('EJES ESTRATEGICOS DE VINCULACION CON LA COLECTIVIDAD', 475, 525, { maxWidth: 120, align: 'center' });

      var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
      for (let i = 0; i < secor_actividades.length; i++) {
        const element = secor_actividades[i];
        if (element === 'educacion') {
          this.doc.text('X', 365, 570);
        } else if (element === 'salud') {
          this.doc.text('X', 365, 605);
        } else if (element === 'sa') {
          this.doc.text('X', 365, 635);
        }
      }

      var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
      for (let i = 0; i < actividades_vincu.length; i++) {
        const element = actividades_vincu[i];
        if (element === 'correos') {
          this.doc.text('X', 190, 570);
        } else if (element === 'acuerdo') {
          this.doc.text('X', 190, 605);
        } else if (element === 'pvpij') {
          this.doc.text('X', 190, 635);
        }
      }
      this.doc.line(40, 550, 550, 550);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Convenios institucionales', 42, 570);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Educación', 270, 570);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Ambiental', 395, 570);
      this.doc.text('', 510, 570);

      this.doc.line(40, 585, 550, 585);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Acuerdo', 80, 605);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Salud', 260, 605);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Interculturalidad/género', 395, 605);
      this.doc.text('', 510, 605);


      this.doc.line(40, 620, 550, 620);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Proyecto de vinculación propio  IST JME', 42, 635, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Saneamiento Ambiental', 240, 635, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Investigativo Académico', 395, 635, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 510, 635);
      this.doc.line(40, 650, 555, 650);

    }


    const pageContent3 = (data: any) => {
      // HEADER

      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 750);
      this.doc.line(555, 150, 555, 750);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text(' Programa de capacitación a la  comunidad', 42, 165, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.line(170, 150, 170, 510);
      this.doc.line(210, 150, 210, 510);

      var secor_actividades = JSON.parse(this.proyectData.intervention_sectors);
      for (let i = 0; i < secor_actividades.length; i++) {
        const element = secor_actividades[i];
        console.log(element);

        if (element === 'ds') {
          this.doc.text('X', 365, 165);
        } else if (element === 'ap') {
          this.doc.text('X', 365, 170);

        } else if (element === 'agyp') {
          this.doc.text('X', 365, 195);

        } else if (element === 'vivienda') {
          this.doc.text('X', 365, 220);

        } else if (element === 'pma') {
          this.doc.text('X', 365, 250);

        } else if (element === 'rne') {
          this.doc.text('X', 365, 280);

        } else if (element === 'tcv') {
          this.doc.text('X', 365, 310);

        } else if (element === 'desarrolloU') {
          this.doc.text('X', 365, 340);

        } else if (element === 'turismo') {
          this.doc.text('X', 365, 370);

        } else if (element === 'cultura') {
          this.doc.text('X', 365, 400);

        } else if (element === 'dic') {
          this.doc.text('X', 365, 430);

        } else if (element === 'deportes') {
          this.doc.text('X', 365, 460);

        } else if (element === 'jys') {
          this.doc.text('X', 365, 490);

        }
      }


      var actividades_vincu = JSON.parse(this.proyectData.activity_vinculation);
      for (let i = 0; i < actividades_vincu.length; i++) {
        const element = actividades_vincu[i];
        if (element === 'pcc') {
          this.doc.text('X', 190, 165);

        } else if (element === 'pvc') {
          this.doc.text('X', 190, 195);

        } else if (element === 'pvpij') {
          this.doc.text('X', 365, 635);
        }
      }
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Desarrollo Social', 240, 165, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.line(345, 150, 345, 510);
      this.doc.line(385, 150, 385, 510);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text(' Desarrollo social, comunitario', 395, 165, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 165);
      this.doc.line(510, 150, 510, 510);

      this.doc.line(40, 185, 555, 185);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Practicas Vinculación con la comunidad', 42, 195, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Apoyo Productivo', 240, 195, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Desarrollo local', 395, 195, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 195);


      this.doc.line(40, 210, 555, 210);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 220, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 220);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Vivienda', 240, 220, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Desarrollo técnico y tecnológico', 395, 220, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 220);

      this.doc.line(40, 240, 555, 240);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 250, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 250);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Protección del medio ambiente y desastres naturales', 270, 250, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Innovación', 395, 250, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 250);



      this.doc.line(40, 270, 555, 270);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 280, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 280);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Recursos naturales y energía', 270, 280, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Responsabilidad social  universitaria', 440, 280, { maxWidth: 120, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 280);

      this.doc.line(40, 300, 555, 300);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 310, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 310);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Transporte, comunicación y viabilidad', 270, 310, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Matriz productiva.', 395, 310, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 310);


      this.doc.line(40, 330, 555, 330);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 340, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 340);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text(' Desarrollo Urbano', 240, 340, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 395, 340, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 340);

      this.doc.line(40, 360, 555, 360);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 370, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 370);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Turismo', 240, 370, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 395, 370, { maxWidth: 120, align: 'justify' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 370);


      this.doc.line(40, 390, 555, 390);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 400, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 400);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Cultura', 260, 400, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 395, 400, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 400);

      this.doc.line(40, 420, 555, 420);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 430, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 430);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Desarrollo de investigación científica', 270, 430, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 395, 430, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 430);

      this.doc.line(40, 450, 555, 450);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 42, 460, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 460);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Deportes', 260, 460, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 395, 460, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 460);

      this.doc.line(40, 480, 555, 480);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Otros', 55, 490, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 190, 490);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Justicia y Seguridad', 270, 490, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Otros', 395, 490, { maxWidth: 100, align: 'center' });
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 525, 490);

      this.doc.line(40, 510, 555, 510);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('2.-DESCRIPCION GENERAL  DEL PROYECTO', 45, 530, { maxWidth: 400, align: 'justify' });
      this.doc.line(40, 540, 555, 540);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(11);
      this.doc.text(this.proyectData.description, 45, 555, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 750, 555, 750);

    }
    const pageContent4 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 730);
      this.doc.line(555, 150, 555, 730);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('3.-ANALISIS SITUACIONAL (DIAGNOSTICO)', 45, 165);
      this.doc.line(40, 170, 550, 170);
      this.doc.text(this.proyectData.situational_analysis, 95, 180, { maxWidth: 550, align: 'center' });

      this.doc.line(40, 430, 555, 430);
      this.doc.text('4.-JUSTIFICACIÓN ', 45, 445);
      this.doc.line(40, 450, 555, 450);
      this.doc.text(this.proyectData.justification, 95, 460, { maxWidth: 550, align: 'center' });


      this.doc.line(40, 540, 555, 540);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('5.-PARTICIPANTES', 45, 555);
      this.doc.line(40, 570, 555, 570);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);

      /*liena vertical */
      this.doc.line(150, 570, 150, 730);
      this.doc.line(265, 570, 265, 730);
      this.doc.line(395, 570, 395, 730);
      // this.doc.line(440, 570, 440, 730);

      /*--------------*/
      this.doc.text('Docentes', 80, 585);
      this.doc.text('Nombre y título profesional ', 195, 585, { maxWidth: 100, align: 'center' });
      this.doc.text('Horario de trabajo para el proyecto.', 320, 585, { maxWidth: 100, align: 'center' });
      this.doc.text('Funciones asignadas', 440, 585, { maxWidth: 100, align: 'center' });
      this.doc.line(40, 600, 555, 600);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Coordinador del proyecto', 50, 615);
      this.doc.text('$F{campo_dato}', 195, 615, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 320, 615, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 440, 615, { maxWidth: 100, align: 'center' });
      this.doc.line(40, 630, 555, 630);
      this.doc.text('$F{campo_dato}', 195, 650, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 320, 650, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 440, 650, { maxWidth: 100, align: 'center' });

      this.doc.line(150, 660, 555, 660);
      this.doc.text('$F{campo_dato}', 195, 680, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 320, 680, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 440, 680, { maxWidth: 100, align: 'center' });

      this.doc.line(150, 690, 555, 690);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('Docentes miembros del equipo de trabajo', 90, 690, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 195, 710, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 320, 710, { maxWidth: 100, align: 'center' });
      this.doc.text('$F{campo_dato}', 440, 710, { maxWidth: 100, align: 'center' });

      this.doc.line(40, 730, 555, 730);
    }
    const pageContent5 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 730);
      this.doc.line(555, 150, 555, 730);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 195, 160, { maxWidth: 100, align: 'center' });
      this.doc.text('', 320, 160, { maxWidth: 100, align: 'center' });
      this.doc.text('', 460, 160, { maxWidth: 100, align: 'center' });

      // this.doc.setFontSize(9);
      // this.doc.setFont("Roboto", 'bold');
      // this.doc.text('4.-DESCRIPCIÓN GENERAL  DE LA REALIZACION DEL PROYECTO POR PARTE DEL TUTOR ACADEMICO', 45, 165);
      this.doc.line(150, 170, 555, 170);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('', 195, 180, { maxWidth: 100, align: 'center' });
      this.doc.text('', 320, 180, { maxWidth: 100, align: 'center' });
      this.doc.text('', 460, 180, { maxWidth: 100, align: 'center' });

      /*participantes*/
      /*liena vertical */
      this.doc.line(150, 150, 150, 230);
      this.doc.line(270, 150, 270, 230);
      this.doc.line(420, 150, 420, 230);

      /*lienas horizontales*/
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.line(150, 190, 555, 190);

      this.doc.text('', 195, 200, { maxWidth: 100, align: 'center' });
      this.doc.text('', 320, 200, { maxWidth: 100, align: 'center' });
      this.doc.text('', 460, 200, { maxWidth: 100, align: 'center' });

      this.doc.line(150, 210, 555, 210);
      this.doc.text('', 195, 220, { maxWidth: 100, align: 'center' });
      this.doc.text('', 320, 220, { maxWidth: 100, align: 'center' });
      this.doc.text('', 460, 220, { maxWidth: 100, align: 'center' });

      /*Estudiantes*/
      this.doc.line(40, 230, 555, 230);

      this.doc.line(40, 250, 555, 250);
      this.doc.text('Estudiantes ', 45, 260,);
      /*titulo*/
      this.doc.line(40, 270, 555, 270);
      this.doc.text('Datos Personales ', 110, 280,);

      this.doc.line(40, 290, 270, 290);
      this.doc.text('Nombres Apellidos', 45, 300,);
      this.doc.text('CI', 220, 300,);

      /*titulo otra tabla*/
      this.doc.text('Especialidad', 320, 290,);
      this.doc.text('Funciones asignadas/con horas de trabajo', 485, 290, { maxWidth: 100, align: 'center' });


      /*liena vertical */
      this.doc.line(150, 290, 150, 460);
      this.doc.line(270, 270, 270, 460);
      this.doc.line(420, 270, 420, 460);
      /*Especialidad*/
      this.doc.line(40, 320, 555, 320);
      this.doc.text('$F{campo_dato}', 45, 330,);
      this.doc.text('$F{campo_dato}', 195, 330,);
      this.doc.text('$F{campo_dato}', 320, 330,);
      this.doc.text('$F{campo_dato}', 460, 330,);

      this.doc.line(40, 340, 555, 340);
      this.doc.text('$F{campo_dato}', 45, 350,);
      this.doc.text('$F{campo_dato}', 195, 350,);
      this.doc.text('$F{campo_dato}', 320, 350,);
      this.doc.text('$F{campo_dato}', 460, 350,);

      this.doc.line(40, 360, 555, 360);
      this.doc.text('$F{campo_dato}', 45, 370,);
      this.doc.text('$F{campo_dato}', 195, 370,);
      this.doc.text('$F{campo_dato}', 320, 370,);
      this.doc.text('$F{campo_dato}', 460, 370,);

      this.doc.line(40, 380, 555, 380);
      this.doc.text('$F{campo_dato}', 45, 390,);
      this.doc.text('$F{campo_dato}', 195, 390,);
      this.doc.text('$F{campo_dato}', 320, 390,);
      this.doc.text('$F{campo_dato}', 460, 390,);

      this.doc.line(40, 400, 555, 400);
      this.doc.text('$F{campo_dato}', 45, 410,);
      this.doc.text('$F{campo_dato}', 195, 410,);
      this.doc.text('$F{campo_dato}', 320, 410,);
      this.doc.text('$F{campo_dato}', 460, 410,);

      this.doc.line(40, 420, 555, 420);
      this.doc.text('$F{campo_dato}', 45, 430,);
      this.doc.text('$F{campo_dato}', 195, 430,);
      this.doc.text('$F{campo_dato}', 320, 430,);
      this.doc.text('$F{campo_dato}', 460, 430,);

      this.doc.line(40, 440, 555, 440);
      this.doc.text('$F{campo_dato}', 45, 450,);
      this.doc.text('$F{campo_dato}', 195, 450,);
      this.doc.text('$F{campo_dato}', 320, 450,);
      this.doc.text('$F{campo_dato}', 460, 450,);

      /*liena vertical */
      this.doc.line(220, 480, 220, 730);
      this.doc.line(320, 480, 320, 540);
      this.doc.line(380, 540, 380, 730);
      this.doc.line(420, 480, 420, 540);

      this.doc.line(40, 460, 555, 460);
      /* 6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA*/
      this.doc.text('6.-ORGANIZACIÓN/ INSTITUCIÓN BENEFICIARIA', 45, 475,);
      this.doc.line(40, 480, 555, 480);
      this.doc.text('Nombre completo organización/institución beneficiaria', 120, 490, { maxWidth: 175, align: 'center' });
      this.doc.text('Provincia', 275, 490, { maxWidth: 175, align: 'center' });
      this.doc.text('Cantón', 375, 490, { maxWidth: 175, align: 'center' });
      this.doc.text('Parroquia', 475, 490, { maxWidth: 175, align: 'center' });

      this.doc.line(40, 515, 555, 515);
      this.doc.text(this.proyectData.beneficiary_institution_id.name, 120, 525, { maxWidth: 175, align: 'center' });
      this.doc.text('PICHINCHA', 275, 525, { maxWidth: 175, align: 'center' });
      this.doc.text('QUITO', 375, 525, { maxWidth: 175, align: 'center' });
      this.doc.text('LOS VALLES', 475, 525, { maxWidth: 175, align: 'center' });

      this.doc.line(40, 540, 555, 540);
      this.doc.text('Lugar de ubicación', 110, 560, { maxWidth: 175, align: 'center' });
      this.doc.text('Beneficiarios Directos', 300, 560, { maxWidth: 175, align: 'center' });
      this.doc.text('Beneficiarios Indirectos', 460, 560, { maxWidth: 175, align: 'center' });

      this.doc.line(40, 580, 555, 580);
      this.doc.text('LOS VALLES', 80, 610, { maxWidth: 175, align: 'center' });
      this.doc.text(this.proyectData.beneficiary_institution_id["Direct beneficiaries"]
        , 260, 610, { maxWidth: 175, align: 'center' });
      this.doc.text(this.proyectData.beneficiary_institution_id["Indirect beneficiaries"], 410, 610, { maxWidth: 175, align: 'center' });


      this.doc.line(40, 650, 555, 650);
      this.doc.setFontSize(9);
      this.doc.text('NOMBRES Y APELLIDOS DE COORDINADOR(ES) DE INSTITUCIÓN BENEFICIARIA: ', 110, 660, { maxWidth: 150, align: 'center' });
      this.doc.text('CARGO O FUNCIÓN EN LA INSTITUCIÓN BENEFICIARIA', 300, 660, { maxWidth: 150, align: 'center' });
      this.doc.text('FUNCIÓN QUE CUMPLE EN EL PROYECTO DE VINCULACIÓN CON LA COMUNIDAD.', 460, 660, { maxWidth: 150, align: 'center' });
      this.doc.line(40, 685, 555, 685);
      this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 80, 710, { maxWidth: 175, align: 'center' });
      this.doc.text('COORDINADOR', 280, 710, { maxWidth: 175, align: 'center' });
      this.doc.text('TUTOR', 410, 710, { maxWidth: 175, align: 'center' });


      this.doc.line(40, 730, 555, 730);
    }
    const pageContent6 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 730);
      this.doc.line(555, 150, 555, 730);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('7.-MATRIZ DE MARCO LÓGICO (PLAN DE TRABAJO)', 45, 165);
      this.doc.line(40, 170, 555, 170);
      /*liena vertical */
      this.doc.line(225, 170, 225, 730);
      this.doc.line(395, 170, 395, 730);

      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('RESUMEN NARRATIVO DE OBJETIVOS', 50, 185, { maxWidth: 200, align: 'justify' });
      this.doc.text('INDICADORES VERIFICABLES', 230, 185, { maxWidth: 150, align: 'justify' });
      this.doc.text('MEDIOS DE VERIFICACIÓN', 400, 185, { maxWidth: 150, align: 'justify' });
      this.doc.line(40, 190, 555, 190);
      this.doc.text('Proposito:$F{obj_general}', 50, 200, { maxWidth: 200, align: 'justify' });
      this.doc.text('$F{ind_verificables}', 230, 200, { maxWidth: 150, align: 'justify' });
      this.doc.text('$F{medios_verificacion}', 400, 200, { maxWidth: 150, align: 'justify' });

      /*Especialidad*/
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.line(40, 320, 555, 320);
      this.doc.text('COMPONENTES: (Objetivos Específicos)', 45, 330,);
      this.doc.text('$F{campo_dato}', 230, 330,);
      this.doc.text('$F{campo_dato}', 400, 330,);
      this.doc.line(40, 460, 555, 460);
      this.doc.text('ACTIVIDADES', 45, 475,);
      this.doc.text('AVANCE Y CUMPLIMIENTO', 235, 475,);
      this.doc.text('OBSERVACIONES ', 440, 475,);

      this.doc.line(40, 485, 555, 485);
      this.doc.text('$F{actividad}', 45, 500);
      this.doc.text('$F{avance}', 230, 500);
      this.doc.text('$F{observaciones}', 420, 500);

      this.doc.line(40, 515, 555, 515);
      this.doc.text('$F{actividad}', 45, 530);
      this.doc.line(40, 540, 555, 540);
      this.doc.text('$F{actividad}', 45, 555);
      this.doc.line(40, 570, 555, 570);
      this.doc.text('$F{actividad}', 45, 580);
      this.doc.line(40, 600, 555, 600);
      this.doc.text('$F{actividad}', 45, 620);
      this.doc.line(40, 630, 555, 630);
      this.doc.text('$F{actividad}', 45, 650);
      this.doc.line(40, 660, 555, 660);
      this.doc.text('$F{actividad}', 45, 680);
      this.doc.line(40, 690, 555, 690);
      this.doc.text('$F{actividad}', 45, 715);
      this.doc.line(40, 730, 555, 730);
    }
    const pageContent7 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 550);
      this.doc.line(555, 150, 555, 550);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('8.-CRONOGRAMA', 45, 165);
      this.doc.line(40, 170, 555, 170);

      var cronograma = JSON.parse(this.proyectData.schedule_crono);

      const img_cronograma = "data:image/png;base64," + cronograma.base64textString;
      console.log(img_cronograma);
      this.doc.addImage(img_cronograma, 'JPG', 45, 180, 450, 350);

      this.doc.line(40, 550, 555, 550);


    }
    const pageContent8 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 550);
      this.doc.line(555, 150, 555, 550);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('9.-FINANCIAMIENTO', 45, 165);
      this.doc.line(40, 170, 555, 170);
      var financiamiento = JSON.parse(this.proyectData.financing);
      const img_cronograma = "data:image/png;base64," + financiamiento.base64textString;
      console.log(img_cronograma);
      this.doc.addImage(img_cronograma, 'JPG', 45, 180, 450, 350);
      this.doc.line(40, 550, 555, 550);

      this.doc.line(150, 680, 250, 680);
      this.doc.text('FIRMA TUTOR DEL PROYECTO', 195, 695, { maxWidth: 100, align: 'center' });

      this.doc.line(350, 680, 450, 680);
      this.doc.text('FIRMA RESPONSABLE DE VINCULACION ', 400, 695, { maxWidth: 100, align: 'center' });



    }
    const pageContent9 = (data: any) => {
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc.line(40, 150, 555, 150);
      this.doc.line(40, 150, 40, 550);
      this.doc.line(555, 150, 555, 550);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('10.-Estrategia de Seguimiento y Evaluación', 45, 165);
      this.doc.line(40, 170, 555, 170);

      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text('$F{estrategia}', 45, 180, { maxWidth: 550, align: 'justify' });
      this.doc.line(40, 550, 555, 550);

      this.doc.line(40, 350, 555, 350);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('11.-Bibliografía', 45, 365);
      this.doc.line(40, 370, 555, 370);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.setFontSize(9);
      this.doc.text(this.proyectData.bibliographies, 45, 385, { maxWidth: 550, align: 'justify' });


      this.doc.line(45, 620, 200, 620);
      this.doc.text('RECTOR IST', 75, 630);
      this.doc.text('IVÁN BORJA', 75, 645, { maxWidth: 100, align: 'center' });

      this.doc.line(250, 620, 375, 620);
      this.doc.text('COORDINADORA DE VINCULACIÓN', 240, 630,);
      this.doc.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 275, 645, { maxWidth: 100, align: 'center' });

      this.doc.line(450, 620, 550, 620);
      this.doc.text('COORDINADOR DE CARRERA', 440, 630,);
      this.doc.text('YOUGLEDIS HERRERA', 475, 645, { maxWidth: 100, align: 'center' });

      // this.doc.line(480, 620, 200, 620);


      this.doc.line(45, 700, 200, 700);
      this.doc.text('DOCENTE SUPERVISOR', 65, 710);
      this.doc.text('$F{rector}', 75, 725, { maxWidth: 100, align: 'center' });

      this.doc.line(250, 700, 375, 700);
      this.doc.text('REPRESENTANTE LEGAL INSTITUCIONAL', 230, 710);
      this.doc.text('$F{rector}', 285, 725, { maxWidth: 100, align: 'center' });

      this.doc.line(450, 700, 550, 700);
      this.doc.text('ESTUDIANTE', 470, 710,);
      this.doc.text('$F{rector}', 475, 725, { maxWidth: 100, align: 'center' });



    }
    this.doc.autoTable({
      addPageContent: pageContent,

    })


    this.doc.autoTable({
      addPageContent: pageContent2,

      head: [['Name', 'Email', 'Country']],

      body: [
        ['David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Spain'],
        // ...
      ],
      startY: 1100,
      // Default for all columns
      styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
      // Override the default above for the text column
      columnStyles: { text: { cellWidth: 'auto' } },

    })

    this.doc.autoTable({
      addPageContent: pageContent3,
      startY: 2100,


    })
    this.doc.autoTable({
      addPageContent: pageContent4,
      startY: 3100,


    })

    this.doc.autoTable({
      addPageContent: pageContent5,
      startY: 4100,


    })
    this.doc.autoTable({
      addPageContent: pageContent6,
      startY: 5100,

    })
    this.doc.autoTable({
      addPageContent: pageContent7,
      startY: 6100,

    })
    this.doc.autoTable({
      addPageContent: pageContent8,
      startY: 7100,

    })
    this.doc.autoTable({
      addPageContent: pageContent9,
      startY: 8100,

    })
    this.doc.save("Reportes.pdf");




  }
  /*pdf convenio */

  public pdf_convenio() {
    var d = new Date();
    var s = new Date();
    var dia = s.getUTCDate();
    var ed = this.id
    const month_value = d.getMonth();
    const month_dia = d.getDate();
    const año = d.getFullYear();


    var months = new Array(12);
    months[0] = "Enero";
    months[1] = "Febrero";
    months[2] = "Marzo";
    months[3] = "Abril";
    months[4] = "Mayo";
    months[5] = "Junio";
    months[6] = "Julio";
    months[7] = "Agosto";
    months[8] = "Septiembre";
    months[9] = "Octubre";
    months[10] = "Noviembre";
    months[11] = "Diciembre";
    this.doc2 = new jsPDF('p', 'pt');
    let rows: never[] = [];

    const pageContent = (data: any) => {

      // HEADER
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.setFontSize(9);
      this.doc2.text('VC-ISTBJ-2023-003', 250, 140);

      this.doc2.setFont("Roboto", 'bold');
      this.doc2.setFontSize(11);
      this.doc2.text('CONVENIO DE VINCULACIÓN CON LA SOCIEDAD ENTRE EL   ', 120, 210);

      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('INSTITUTO TECNOLOGICO SUPERIOR YAVIRAC', 175, 230);


      this.doc2.setFontSize(11);
      this.doc2.text('Y', 275, 245);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(this.proyectData.beneficiary_institution_id.name, 300, 260, { maxWidth: 555, align: 'center' });
      const regex = /[\*][\w\W]*[\*]/gmi;
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Comparecen a la celebración del presente Convenio, por una parte el ' + this.proyectData.beneficiary_institution_id.name + ', legalmente representado por el ' + this.proyectData.beneficiary_institution_id.name +
        ', en su calidad de Rector, de conformidad con lo establecido en la Resolución No. ' +
        320 + ' y Acción de Personal No. '+this.proyectData.code +'de '+month_dia +' de '+months[month_value]+' de '+ año+'; delegado del Secretario de' +
        ' Educación Superior, Ciencia, Tecnología e Innovación, para suscribir el presente ' +
        'instrumento conforme al Acuerdo No. 2020-048 de 15 de mayo de 2020,' +
        'a quien en adelante para los efectos del presente instrumento se denominará “INSTITUTO”;' +
        'y, por otra parte la empresa "' + this.replace(this.proyectData.beneficiary_institution_id.name, regex) + '" con RUC No. ' + this.proyectData.beneficiary_institution_id.ruc +
        ', representada legalmente por ' + this.proyectData.authorized_by.user_id.person.names + 'en calidad de Gerente General a quien en adelante y' +
        ' para los efectos del presente instrumento se denominará “ENTIDAD RECEPTORA”', 110, 285, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Las partes libre y voluntariamente, acuerdan celebrar el presente convenio al tenor de las siguientes cláusulas: ', 110, 425, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA PRIMERA.- ANTECEDENTES:', 110, 450);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('1.  El artículo 26 de la Constitución de la República del Ecuador determina: “La educación es un derecho de las personas a lo largo de la vida y un deber ineludible e inexcusable del Estado. Constituye un área prioritaria de la política pública y de la inversión estatal, garantía de la igualdad e inclusión social y condición indispensable para el buen vivir; las personas, la familia y la sociedad tienen el derecho y la responsabilidad de participar en el proceso educativo”;', 115, 470, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('2.  El artículo 28 de la Carta Suprema establece: “La educación responderá al interés público y no estará al servicio de intereses individuales y corporativos. Se garantizará el acceso universal, permanencia, movilidad y egreso sin discriminación alguna y la obligatoriedad en el nivel inicial, básico y bachillerato o su equivalente. Es derecho de toda persona y comunidad interactuar entre culturas y participar en una sociedad que aprende. El Estado promoverá el diálogo intercultural en sus múltiples dimensiones. El aprendizaje se desarrollará de forma escolarizada y no escolarizada. La educación pública será universal y laica en todos sus niveles, y gratuita hasta el tercer nivel de educación superior inclusive”;', 115, 550, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('3.  El artículo 350 de la Constitución establece que: “El sistema de educación superior tiene como finalidad la formación académica y profesional con visión científica y humanista; la investigación científica y tecnológica; la innovación, promoción, desarrollo y difusión de los saberes y las culturas; la construcción de soluciones para los problemas del país, en relación con los objetivos del régimen de desarrollo”;', 115, 670, { maxWidth: 400, align: 'justify' });

    }
    this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);

    const pageContent2 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('4.  El artículo 352 de la Carta Suprema dispone que: “El sistema de educación superior estará integrado por universidades y escuelas politécnicas; institutos superiores técnicos, tecnológicos y pedagógicos; y, conservatorios de música y artes, debidamente acreditados y evaluados. / Estas instituciones, sean públicas o particulares, no tendrán fines de lucro”;', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('5.  El artículo 13 de la Ley Orgánica de Educación Superior determina como una de las funciones del Sistema de Educación Superior es: “a) Garantizar el derecho a la educación superior mediante la docencia, la investigación y su vinculación con la sociedad, y asegurar crecientes niveles de calidad, excelencia académica y pertinencia;”', 115, 210, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('6.  El artículo 125 de la Ley Orgánica de Educación Superior establece que: “Las instituciones del Sistema de Educación Superior realizarán programas y cursos de vinculación  con las sociedad guiados por el personal académico”.', 115, 265, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('7.  El artículo 182 de la Ley Orgánica Educación Superior dispone que: “La Secretaría de Educación Superior, Ciencia, Tecnología e Innovación, es el órgano que tiene por objeto ejercer la rectoría de la política pública de educación superior y coordinar acciones entre la Función Ejecutiva y las instituciones del Sistema de Educación Superior. Estará dirigida por el Secretario Nacional de Educación Superior, Ciencia, Tecnología e Innovación de Educación Superior, designado por el Presidente de la República. Esta Secretaría Nacional contará con el personal necesario para su funcionamiento”;', 115, 315, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('8.  Artículo 40 del Reglamento de Régimen Académico expedido por el Consejo de Educación Superior mediante Resolución RPC-SE-08-No.023-2022 de 27 de julio de 2022 manifiesta que:” La vinculación con la sociedad hace referencia a la planificación, ejecución y difusión de actividades que garantizan la participación efectiva en la sociedad y la responsabilidad social de las instituciones del Sistema de Educación Superior con el fin de contribuir a la satisfacción de necesidades y la solución de problemáticas del entorno, desde el ámbito académico e investigativo. La vinculación con la sociedad deberá articularse al resto de funciones sustantivas, oferta académica, dominios académicos, investigación, formación y extensión de las IES en cumplimiento del principio de pertinencia. En el marco del desarrollo de la investigación científica o artística de las IES, se considerará como vinculación con la' +
        'sociedad a las actividades de divulgación científica, a los aportes a la mejora y actualización de los planes de desarrollo local, regional y nacional, y a la transferencia de conocimiento y tecnología. La divulgación científica o artística consiste en transmitir resultados, avances, ideas, hipótesis, teorías, conceptos, productos artísticos y en general cualquier actividad científica, artística, tecnológica a la sociedad; utilizando los canales, recursos y lenguajes adecuados para que ésta los pueda comprender y asimilar la sociedad”.', 115, 410, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('9.  El artículo 41 del Reglamento de Régimen Académico establece en lo referente a la “Planificación de la vinculación con la sociedad.- “La planificación de la función de vinculación con la sociedad, podrá estar determinada en las siguientes líneas operativas: a) Educación continua. b) Prácticas preprofesionales; c) Proyectos y servicios especializados; d) Investigación; e) Divulgación y resultados de aplicación de conocimientos científicos o artísticos; f) Ejecución de proyectos de innovación; g) Ejecución de proyectos de servicios comunitarios o sociales; y h) Otras determinadas por la IES en correspondencia con su naturaleza y en ejercicio de su autonomía responsable. Las IES podrán crear instancias institucionales específicas, incorporar personal académico y establecer alianzas estratégicas de cooperación interinstitucional para gestionar la vinculación con la sociedad”.', 115, 630, { maxWidth: 400, align: 'justify' });



    }


    const pageContent3 = (data: any) => {
      // HEADER
      // this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('10. A través de Acuerdo No. 2012-065, publicado en el Registro Oficial No. 834, de 20 de noviembre de 2012, el Secretario de Educación Superior, Ciencia, Tecnología e Innovación, declaró a: “(…) los institutos superiores técnicos, tecnológicos, pedagógicos, de artes y conservatorios superiores de música públicos, como entidades operativas desconcentradas de la Secretaría de Educación Superior, Ciencia,Tecnología e Innovación (…)”; entre los cuales consta el Instituto Tecnológico Superior de Patrimonio y Turismo Yavirac.', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('11.  A través de Acuerdo No. 2016-118, de 25 de julio de 2016, con su posterior reforma, el Secretario de Educación Superior, Ciencia, Tecnología e Innovación, determinó a favor de los rectores y rectoras de los Institutos Superiores Técnicos, Tecnológicos, Pedagógicos, de Artes y los Conservatorios Superiores Públicos; entre otras atribuciones y obligaciones las siguientes: “Artículo 1.- (…) la suscripción, modificación y extinción de los convenios que tengan por objeto la realización de programas de pasantías y/o prácticas pre profesionales; implementación de carreras de modalidad dual que garanticen la gestión del aprendizaje práctico con tutorías' +
        'profesionales y académicas integrales in situ; uso gratuito de instalaciones para beneficio de institutos públicos; y la implementación de proyectos de vinculación con la sociedad, y/o convenios de cooperación a celebrarse entre los mencionados institutos y las diferentes personas naturales y jurídicas nacionales, con la finalidad fortalecer la educación técnica y tecnológica pública del Ecuador. (…) Artículo 6.- Los rectores y rectoras de los institutos superiores técnicos, tecnológicos, pedagógicos, de artes y conservatorios superiores públicos, usarán obligatoriamente las plantillas de convenios autorizadas por la Coordinación General de Asesoría Jurídica de esta Cartera de Estado para la suscripción de los actos jurídicos mencionados en el artículo 1 del' +
        'presente Acuerdo”;', 115, 250, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('12.  El ' + this.proyectData.name_institute + ', ubicado en la provincia de Pichincha es una Institución de Educación Superior Pública con licencia de funcionamiento otorgada mediante Acuerdo No. XXX de fecha xx de xx de xx, conferido por xxxxxxxxxxxxx, que se dedica a la formación de profesionales de nivel tecnológico;', 115, 485, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('13. Mediante acción de personal No. ' + this.proyectData.code+', de fecha '+month_dia +' de '+año+', la Secretaría de Educación Superior, Ciencia, Tecnología e Innovación, otorgó el nombramiento al Iván Borja, portador de la cédula de ciudadanía No. XXXXXXXXXXX en calidad de Rector del ' + this.proyectData.name_institute + ' posesionado en sus funciones mediante acto administrativo por el periodo comprendido entre el 2022 y el 2023.', 115, 550, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('14.EL ' + this.proyectData.name_institute + ', ubicado en la ciudad de Quito, provincia de pichincha, es una Institución de Educación Superior Pública, con licencia de funcionamiento otorgada mediante Acuerdo Nro. Xxx y registro institucionalNro.Xxxxx conferido por el Consejo de Educación Superior CONESUP, que se dedica a la formación de profesionales de nivel tecnológico.;', 115, 650, { maxWidth: 400, align: 'justify' });



    }

    const pageContent4 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      // this.doc2.line(40, 150, 550, 150);
      // this.doc2.line(40, 150, 40, 650);
      // this.doc2.line(550, 150, 550, 650);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('15.   Mediante Informe Técnico Académico de Viabilidad para la firma de Convenio No. Xxxxxx de fecha xx de xxxxxxxx de 202x, se concluye que: “Conclusiones y Recomendaciones:”.', 115, 150, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('16.  Mediante memorando No. SENESCYT-xx-2020-xxxxx-M del fecha xx de xxxxxxxxx del 202x8, el xxxxxxxxxx, Coordinador/a Zonal (zonas 1,2,4,5,6,7,8)/ Subsecretario de Formación Técnica y Tecnológica (en el caso de zona 3 y 9), aprueba el Informe Técnico Nro. XXXXXXXXXXXXXX de xx de xxxxxxxxx de 202x, para la suscripción del Convenio entre el XXXXXXXXXXXXXXX y el Instituto Tecnológico Superior XXXXXXXXXXX.', 115, 195, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      'a la implementación de un programa de vinculación con la colectividad que versará' +
        this.doc2.text('17.  Con los antecedentes expuestos, el Instituto Tecnológico Superior xxxxxx y el' + this.proyectData.beneficiary_institution_id.name + ' acuerdan suscribir el presente convenio referente' +
          'a la implementación de un programa de vinculación con la colectividad que versará' +
          'sobre el proyecto que tiene como objetivo:”', +this.proyectData.beneficiary_institution_id.name + ', por parte de las carreras de xxxxxxxxxxxxxxxxxxxxxx.', 115, 290, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA SEGUNDA.- OBJETO::', 110, 360);


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Por medio del presente convenio, las partes, en el ámbito de sus competencias, se comprometen a realizar la implementación del proyecto de vinculación con la colectividad'
        + 'propuesto por el INSTITUTO, referente a (NOMBRE DEL PROYECTO).', 115, 385, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA TERCERA.- OBLIGACIONES DE LAS PARTES:', 110, 440);
      this.doc2.setFontSize(10);
      this.doc2.text('3.1 DEL INSTITUTO:', 110, 455);

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Son obligaciones del INSTITUTO:', 110, 470);

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('a) Designar a las y los estudiantes del INSTITUTO a fin de que accedan a las actividades de vinculación  en la ENTIDAD RECEPTORA, remitiendo para el efecto la base de datos con la información que acuerden las partes.', 155, 490, { maxWidth: 350, align: 'justify' });

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('b) Asegurar que la  unidad de vinculación pueda desarrollar los distintos programas y actividades en las instalaciones existentes en la ENTIDAD RECEPTORA.', 155, 540, { maxWidth: 350, align: 'justify' });

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('c) Cumplir a cabalidad las horas establecidas para el proyecto.', 155, 580, { maxWidth: 350, align: 'justify' });

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('3.2  DE LA ENTIDAD RECEPTORA:', 110, 600);

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Son obligaciones de la ENTIDAD RECEPTORA  las siguientes:', 110, 615);

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('a) Permitir que los estudiantes del Instituto Tecnológico Superior xxxxxxxxx efectúen actividades de vinculación en las instalaciones de acuerdo a los lineamientos pedagógicos establecidos.', 155, 640, { maxWidth: 350, align: 'justify' });


      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('b) Vincular a las y los estudiantes a las áreas relacionadas con la carrera que se encuentren cursando la correspondiente actividad de vinculación en sus instalaciones, de acuerdo a las necesidades de la ENTIDAD RECEPTORA y de conformidad a la normativa vigente.', 155, 685, { maxWidth: 350, align: 'justify' });

      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('c) Otorgar el apoyo necesario para el desarrollo de los estudiantes y sus actividades, además de evaluar el desarrollo de las actividades que se asignen a los estudiantes dentro de las actividades de vinculación  a realizarse en la ENTIDAD RECEPTORA', 155, 735, { maxWidth: 350, align: 'justify' });

    }

    const pageContent5 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA CUARTA.- PLAZO:', 115, 150);


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('El presente Convenio de Vinculación con la Sociedad tendrá la vigencia de (1) un año contados a partir de la fecha de suscripción, mismo que podrá ser renovado previo ' +
        'consentimiento de las partes de manera escrita con un mínimo de quince (15) días de anticipación a la fecha de terminación, para lo cual las partes deberán suscribir el instrumento pertinente prorrogando' +
        +'el mismo y estableciendo, de existir, las nuevas condiciones.', 110, 165, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA QUINTA.- RÉGIMEN FINANCIERO:', 110, 235);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Debido a la naturaleza del Convenio, el presente convenio no generará obligaciones financieras recíprocas, erogación alguna ni transferencias de recursos económicos' +
        ' entre las partes; las erogaciones generadas por las acciones ejecutadas por el cumplimiento de las obligaciones contraídas en el presente instrumento serán asumidas con cargo a la Institución que las ejecute.', 110, 250, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA SEXTA.- MODIFICACIONES:', 110, 320);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Los términos de este convenio podrán ser modificados, ampliados o reformados de mutuo acuerdo durante su vigencia, siempre que dichas modificaciones no alteren la naturaleza ni el objeto del convenio y sean justificadas técnica, legal o académicamente; para cuyo efecto, las PARTES suscribirán el instrumento jurídico pertinente.'
        + 'Ninguna modificación podrá ir en detrimento de los derechos de los estudiantes que se encuentren vinculados en la ENTIDAD RECEPTORA. ', 110, 335, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA SÉPTIMA.- ADMINISTRADOR DEL CONVENIO:', 110, 420);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Para realizar la coordinación, ejecución y seguimiento del presente convenio, las partes designan a los funcionarios que a continuación se detallan para que actúen en calidad de administradores, quienes velarán por la cabal y oportuna ejecución de todas y cada una de las obligaciones derivadas del mismo, así como de su seguimiento y coordinación, debiendo informar por escrito a la máxima autoridad del INSTITUTO y al/la representante de la ENTIDAD RECEPTORA, mediante informes semestrales por cada ciclo académico respecto del cumplimiento del objeto del presente instrumento:', 110, 440, { maxWidth: 400, align: 'justify' });
      this.doc2.text('Por el INSTITUTO se designa al Coordinador de la Carrera.', 110, 530, { maxWidth: 400, align: 'justify' });
      this.doc2.text('Por la ENTIDAD RECEPTORA  se designa al Asistente Administrativo', 110, 540, { maxWidth: 400, align: 'justify' });
      this.doc2.text('Los Administradores del Convenio a la conclusión del plazo, presentarán un informe consolidado sobre la  ejecución del Convenio.', 110, 550, { maxWidth: 400, align: 'justify' });
      this.doc2.text('En caso de presentarse cambios del personal asignado para la administración, serán designados con la debida antelación, notificando a la parte contraria de manera inmediata y sin que sea necesaria la modificación del texto convencional, a fin de no interrumpir la ejecución y el plazo del convenio; para lo cual el o los administradores salientes deberán presentar un informe de su gestión y la entrega recepción de actividades.', 110, 585, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA OCTAVA.- TERMINACIÓN DEL CONVENIO: ', 110, 655);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('1.  Por vencimiento del plazo;', 110, 675, { maxWidth: 400, align: 'justify' });
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('2.  Por mutuo acuerdo de las partes, siempre que se evidencie que no pueda continuarse su ejecución por motivos técnicos, económicos, legales, sociales o físicos para lo cual celebrarán una acta de terminación por mutuo acuerdo. La parte que por los motivos antes expuestos no pudiere continuar con la ejecución del presente Convenio, deberá poner en conocimiento de su contraparte su intención de dar por terminado el convenio por mutuo con al menos treinta (30) días de antelación a la fecha de terminación del convenio;', 110, 695, { maxWidth: 400, align: 'justify' });
      // this.doc2.setFontSize(11);
      // this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      // this.doc2.text('3.  Por terminación unilateral por incumplimiento de una de las partes, lo cual deberá ser técnicamente y legalmente justificado por quien lo alegaré; y, ', 110,710, { maxWidth: 400, align: 'justify' });
      // this.doc2.setFontSize(11);
      // this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      // this.doc2.text('4.  Por fuerza mayor o caso fortuito debidamente justificado por la parte que lo alegare, y notificado dentro del plazo de cuarenta y ocho (48) horas de ocurrido el hecho. En estos casos, se suscribirá la respectiva acta de terminación en el que se determinarán las causas descritas como causales de terminación del Convenio. Se considerarán causas de fuerza mayor o caso fortuito '+
      // 'las establecidas en el artículo 30 del Código Civil. ', 110,685, { maxWidth: 400, align: 'justify' });
    }


    const pageContent6 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('3.  Por terminación unilateral por incumplimiento de una de las partes, lo cual deberá ser técnicamente y legalmente justificado por quien lo alegaré; y, ', 110, 150, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('4.  Por fuerza mayor o caso fortuito debidamente justificado por la parte que lo alegare, y notificado dentro del plazo de cuarenta y ocho (48) horas de ocurrido el hecho. En estos casos, se suscribirá la respectiva acta de terminación en el que se determinarán las causas descritas como causales de terminación del Convenio. Se considerarán causas de fuerza mayor o caso fortuito ' +
        'las establecidas en el artículo 30 del Código Civil. ', 110, 185, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('La terminación del presente convenio, por cualquiera de las causales antes señaladas, generará la obligación de las partes a suscribir un acta de finiquito; sin embargo, no afectará la conclusión del objeto y las obligaciones que las partes hubieren adquirido y que se encuentren ejecutando en ese momento, salvo que éstas lo acuerden de otra forma. No obstante, la terminación del presente convenio no implicará el pago de indemnización alguna ni entre las partes ni entre éstas y los estudiantes o terceros.', 110, 255, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA NOVENA. -INEXISTENCIA DE RELACIÓN LABORAL:', 110, 340);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Por la naturaleza del presente Convenio, se entiende que ninguna de las partes comparecientes, adquieren relación laboral ni de dependencia respecto del personal de la otra institución que trabaje en el cumplimiento de este instrumento.' +
        'De igual manera, la ENTIDAD RECEPTORA no tendrá relación laboral ni obligaciones laborales  con los estudiantes que se vinculen a ella, ni éstos tendrán subordinación ni dependencia laboral para con la ENTIDAD RECEPTORA, se aclara que la relación estudiante-entidad receptora es  únicamente de formación académica.', 110, 360, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA DÉCIMA.- CONTROVERSIAS: ', 110, 455);
      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Basándose en la buena fe como fundamental para la ejecución de este convenio para el caso de controversias derivadas de su interpretación, aplicación, ejecución o terminación, las partes aceptan solucionarlas de manera amistosa a través de las máximas autoridades de las instituciones comparecientes; de no ser posible una solución amistosa, las controversias producto del presente Convenio se ventilarán ante el Centro de Mediación de la Procuraduría General del Estado, con sede en la Quito provincia de Pichincha, y a la falta de acuerdo se ventilarán las controversias de conformidad con lo establecido en el Código Orgánico General de Procesos (COGEP); siendo competente para conocer dichas controversias el/la Tribunal de lo Contencioso Administrativo o la Unidad Judicial de lo Contencioso Administrativo.', 110, 475, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA DÉCIMA PRIMERA.- DOCUMENTOS HABILITANTES:', 110, 605);
      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Forman parte integrante del convenio los siguientes documentos:', 110, 620, { maxWidth: 400, align: 'justify' });
      this.doc2.text('a)	Los que acreditan la calidad y capacidad de los comparecientes; y,', 120, 635, { maxWidth: 400, align: 'justify' });
      this.doc2.text('b)	Los documentos a que se hace referencia en la cláusula de antecedentes', 120, 645, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA DÉCIMA SEGUNDA.- COMUNICACIONES Y NOTIFICACIONES:', 110, 665);
      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Todas las comunicaciones y notificaciones entre las partes, se realizarán por escrito y serán entregadas a las siguientes direcciones:', 110, 680, { maxWidth: 400, align: 'justify' });


    }

    const pageContent7 = (data: any) => {
      // HEADER
      this.doc2.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);



      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('INSTITUTO TECNOLOGICO SUPERIOR DE PATRIMONIO Y TURISMO YAVIRAC', 110, 150);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Dirección:', 110, 170);
      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 170, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Ciudad-Provincia:', 110, 185);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 185, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Teléfono:', 110, 200);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 200, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Mail:', 110, 215);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 215, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('NOMBRE DE LA PERSONA NATURAL O JURIDICA', 110, 235);

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Dirección:', 110, 250);
      this.doc2.setFontSize(10);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 250, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Ciudad-Provincia:', 110, 265);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 265, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Teléfono:', 110, 280);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 280, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Mail:', 110, 295);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text(' direccion', 195, 295, { maxWidth: 400, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('CLÁUSULA DECIMA TERCERA.- ACEPTACIÓN:', 110, 320);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Libre y voluntariamente, previo el cumplimiento de los requisitos de Ley, los comparecientes expresan su aceptación a todo lo convenido en el presente instrumento, a cuyas estipulaciones se someten, por convenir a sus legítimos intereses institucionales, en fe de lo cual proceden a suscribirlo en tres (3) ejemplares de igual tenor y valor jurídico.', 110, 335, { maxWidth: 400, align: 'justify' });
      this.doc2.text('Dado, en la ciudad de Quito a los           días del mes de            de 202', 110, 395, { maxWidth: 400, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('“Por delegación del Secretario de Educación Superior, Ciencia, Tecnología e Innovación”:', 110, 415, { maxWidth: 185, align: 'justify' });


      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('Por la Entidad Receptora:', 350, 415, { maxWidth: 200, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('Mgs.', 110, 460,);
      this.doc2.text('RECTOR', 110, 480);
      this.doc2.setFontSize(9);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('INSTITUTO TECNÓLOGICO SUPERIOR', 110, 500, { maxWidth: 200, align: 'justify' });

      this.doc2.setFontSize(11);
      this.doc2.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc2.text('SR.', 350, 460,);
      this.doc2.text(this.proyectData.beneficiary_institution_id.name_autorize_by, 410, 460,);

      this.doc2.text('RUC', 350, 480);
      this.doc2.text(this.proyectData.beneficiary_institution_id.ruc, 410, 480);

      this.doc2.setFontSize(9);
      this.doc2.setFont("Roboto", 'bold');
      this.doc2.text('EMPRESA:', 350, 500, { maxWidth: 200, align: 'justify' });
      this.doc2.text(this.proyectData.beneficiary_institution_id.name, 410, 500, { maxWidth: 200, align: 'justify' });

    }
    this.doc2.autoTable({
      addPageContent: pageContent,

    })

/*Imprimir paginas */
    this.doc2.autoTable({
      addPageContent: pageContent2,

      head: [['Name', 'Email', 'Country']],
      startY: 1100,
      // Default for all columns
      styles: { overflow: 'ellipsize', cellWidth: 'wrap' },
      // Override the default above for the text column
      columnStyles: { text: { cellWidth: 'auto' } },

    })
    this.doc2.autoTable({
      addPageContent: pageContent3,
      startY: 2100,

    })
    this.doc2.autoTable({
      addPageContent: pageContent3,
      startY: 3100,

    })


    this.doc2.autoTable({
      addPageContent: pageContent5,
      startY: 3100,

    })
    this.doc2.autoTable({
      addPageContent: pageContent6,
      startY: 3100,

    })

    this.doc2.autoTable({
      addPageContent: pageContent7,
      startY: 3100,

    })


    this.doc2.save("Convenio.pdf");




  }
  /*pdf documento itv*/
  public pdf_itv() {
    console.log(this.proyectData);
    this.doc = new jsPDF('p', 'pt');
    let rows: never[] = [];

    const pageContent = (data: any) => {

      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 130, 555, 130);
      this.doc.line(40, 130, 40, 750);
      this.doc.line(555, 130, 555, 750);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('INFORME TÉCNICO - ACADÉMICO DE VIABILIDAD', 170, 145);
      this.doc.text('PARA LA FIRMA DE CONVENIO DE VINCULACIÓN CON LA SOCIEDAD', 125, 155);
      this.doc.line(40, 160, 555, 160);
      this.doc.line(40, 180, 555, 180);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('No. Informe', 40, 195);
      this.doc.line(40, 200, 555, 200);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.code, 160, 195);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre del IST:', 40, 215);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.name_institute, 160, 215, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 220, 555, 220);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Fecha:', 40, 235);
      this.doc.line(40, 240, 555, 240);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.miDatePipe.transform(this.proyectData.start_date, 'dd/MM/yyyy'), 160, 235, { maxWidth: 100, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('PARA LA FIRMA DE CONVENIO DE VINCULACIÓN CON LA SOCIEDAD', 125, 255);
      this.doc.line(40, 260, 555, 260);

      this.doc.line(155, 260, 155, 750);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre de la Entidad Emisora:', 40, 270, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.name_institute, 160, 270);
      this.doc.line(40, 290, 555, 290);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre de la Entidad Receptora:', 40, 300, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.name, 160, 300);
      this.doc.line(40, 320, 555, 320);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre de la persona  autorizada legalmente  para la suscripción del Convenio:', 40, 330, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.authorized_by.user_id.person.names + " " + this.proyectData.authorized_by.user_id.person.last_names, 160, 330);
      this.doc.line(40, 365, 555, 365);


      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Actividad económica que consta en el RUC:', 40, 385, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.activity_ruc, 160, 385);
      this.doc.line(40, 410, 555, 410);





      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Plazo de vigencia del convenio:', 40, 430, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.miDatePipe.transform(this.proyectData.end_date, 'dd/MM/yyyy'), 160, 430);
      this.doc.line(40, 455, 555, 455);

      this.doc.line(280, 455, 280, 630);
      this.doc.line(395, 455, 395, 630);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('N° de estudiantes que recibiría inicialmente la Entidad Receptora:', 40, 480, { maxWidth: 100, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.number_students_start, 160, 490, { maxWidth: 100, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Total de estudiantes proyectados que recibirá la Entidad Receptora durante la vigencia del convenio:', 290, 470, { maxWidth: 100, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.number_students_ability, 405, 490, { maxWidth: 100, align: 'justify' });
      this.doc.line(40, 510, 555, 510);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Datos: Tutor Académico', 40, 550, { maxWidth: 150, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('BARRIGA OLIVO SUSANJAC QUELINE', 160, 540, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Contacto: 022342563', 160, 560, { maxWidth: 150, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Datos: Tutor Académico', 290, 550, { maxWidth: 150, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('BARRIGA OLIVO SUSANJAC QUELINE', 395, 540, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Contacto: 022342563', 395, 560, { maxWidth: 150, align: 'justify' });

      this.doc.line(40, 570, 555, 570);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Correo electrónico de la empresa: (información obligatoria que constará en el  Convenio)', 40, 585, { maxWidth: 100, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.email, 160, 600, { maxWidth: 150, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Número de contacto:(información obligatoria que constará en el Convenio)', 290, 585, { maxWidth: 75, align: 'justify' });



      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('NOMBRE: ' + this.proyectData.beneficiary_institution_id.name_autorize_by, 395, 585, { maxWidth: 150, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Contacto: ' + this.proyectData.beneficiary_institution_id.phone, 395, 610, { maxWidth: 150, align: 'justify' });
      this.doc.line(40, 630, 555, 630);

      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Provincia:', 160, 645, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Pichincha', 225, 645, { maxWidth: 100, align: 'justify' });

      this.doc.line(155, 650, 555, 650);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Canton:', 160, 665, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Quito', 225, 665, { maxWidth: 100, align: 'justify' });


      this.doc.line(155, 670, 555, 670);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Dirección Matriz:', 40, 655, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Direccion:', 160, 685, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Guayabamba', 225, 685, { maxWidth: 100, align: 'justify' });

      this.doc.line(40, 690, 555, 690);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Provincia:', 160, 705, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Pichincha', 225, 705, { maxWidth: 100, align: 'justify' });


      this.doc.line(155, 710, 555, 710);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Dirección Matriz2:', 40, 725, { maxWidth: 100, align: 'justify' });
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Canton', 160, 725, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Quito', 225, 725, { maxWidth: 100, align: 'justify' });

      this.doc.line(155, 730, 555, 730);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Dirección', 160, 745, { maxWidth: 100, align: 'justify' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Guayabamba', 225, 745, { maxWidth: 100, align: 'justify' });

      this.doc.line(40, 750, 555, 750);


    }

    const pageContent2 = (data: any) => {

      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 130, 555, 130);
      this.doc.line(40, 130, 40, 750);
      this.doc.line(555, 130, 555, 750);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Criterios Generales', 255, 145);

      this.doc.line(40, 150, 555, 150);
      this.doc.line(150, 150, 150, 750);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Objetivo:', 45, 190);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.description, 160, 170, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 225, 555, 225);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Ley Orgánica de Educación Superior -LOES', 45, 270, { maxWidth: 120, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Art. 87.- Requisitos previos a la obtención del grado académico.- Como requisito previo a la obtención del '
        + 'grado académico, los y las estudiantes deberán acreditar servicios a la comunidad mediante programas,'
        + 'proyectos de vinculación con la sociedad, prácticas o pasantías pre profesionales con el debido '
        + 'acompañamiento pedagógico, en los campos de su especialidad.', 160, 240, { maxWidth: 350, align: 'justify' });

      this.doc.line(40, 300, 555, 300);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Obligaciones Conjuntas:', 45, 340);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Las partes de común acuerdo diseñarán un plan de actividades académicas que'
        + 'desarrollarán los estudiantes en la ENTIDAD RECEPTORA de acuerdo al número'
        + 'de horas de vinculación establecidas en el proyecto de carrera y malla curricular'
        + 'de la carrera de Tecnología en DESARROLLO DE SOFTWARE, dicho plan de'
        + 'actividades complementará el aprendizaje y la aplicación de conocimientos,'
        + 'desarrollo de destrezas y habilidades que se consideren necesarias para un'
        + 'adecuado desempeño de su futura profesión.', 160, 315, { maxWidth: 350, align: 'justify' });


      this.doc.line(40, 375, 555, 375);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Obligaciones de las partes:', 45, 390);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Del Instituto:', 160, 385, { maxWidth: 350, align: 'justify' });
      this.doc.text('a) Determinar el número de estudiantes participantes en la realización del proyecto de'
        + 'vinculación con la sociedad conforme a las áreas y espacios definidos por la entidad'
        + 'receptor', 160, 395, { maxWidth: 350, align: 'justify' });

      this.doc.text('b) Considerar el número de horas determinados para la realización del proyecto de'
        + 'vinculación con la sociedad conforme establece al proyecto de carrera y/o '
        + 'planificación en el ciclo académico', 160, 420, { maxWidth: 350, align: 'justify' });

      this.doc.text('c) Definir un cronograma de actividades para la ejecución del proyecto de vinculación'
        + 'con la sociedad acorde al perfil de la carrera', 160, 445, { maxWidth: 350, align: 'justify' });

      this.doc.text('d) Designar a los estudiantes de las carreras de Tecnología en DESARROLLO'
        + 'DE SOFTWARE, a fin de que implementen el proyecto de vinculación'
        + 'conforme a las competencias y conocimientos adquiridos en el lugar o'
        + 'ubicación definido por la ENTIDAD RECEPTORA, remitiendo para el efecto'
        + 'la base de datos con la información que acuerden las partes;', 160, 470, { maxWidth: 350, align: 'justify' });


      this.doc.text('e) Planificar, monitorear, y evaluar la ejecución del proyecto de vinculación en '
        + 'coordinación con el tutor que designe la ENTIDAD RECEPTORA;', 160, 520, { maxWidth: 350, align: 'justify' });
      this.doc.line(160, 670, 555, 670);

      this.doc.text('f) Designar un tutor, cuya responsabilidad es el debido seguimiento a los '
        + 'estudiantes que acoja la ENTIDAD RECEPTORA;     ', 160, 555, { maxWidth: 350, align: 'justify' });

      this.doc.text('g) Velar para que los estudiantes de la carrera de Tecnología DESARROLLO '
        + 'DE SOFTWARE, ejecuten las actividades del proyecto de vinculación y se '
        + 'sometan a las políticas, directrices, reglamentos e instrucciones del '
        + 'INSTITUTO y de la ENTIDAD RECEPTORA;', 160, 580, { maxWidth: 350, align: 'justify' });
      this.doc.line(160, 670, 555, 670);

      this.doc.text('h) Cumplir a cabalidad las horas establecidas para el proyecto;', 160, 620, { maxWidth: 350, align: 'justify' });
      this.doc.line(160, 670, 555, 670);
      this.doc.text('De la entidad receptora:', 160, 680, { maxWidth: 350, align: 'justify' });
      this.doc.text('a) Definir el número de estudiantes participantes en la realización del proyecto de'
        + 'vinculación con la sociedad conforme a las áreas, espacios y/o actividad '
        + 'económica de la entidad receptora', 160, 695, { maxWidth: 350, align: 'justify' });
      this.doc.text('b) El número de estudiantes que acoja la ENTIDAD RECEPTORA se '
        + 'determinará al inicio del ciclo académico según su capacidad;', 160, 720, { maxWidth: 350, align: 'justify' });
      this.doc.line(160, 670, 555, 670);
      this.doc.line(40, 750, 555, 750);




    }

    const pageContent3 = (data: any) => {

      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 130, 555, 130);
      this.doc.line(40, 130, 40, 750);
      this.doc.line(555, 130, 555, 750);
      this.doc.line(150, 130, 150, 730);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Static Text', 45, 150);



      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('c) Garantizar que los estudiantes de la carrera de Tecnología EN'
        + 'DESARROLLO DE SOFTWARE, efectúen las actividades planificadas'
        + 'del proyecto de vinculación en las áreas y  espacios acordados por las '
        + 'partes;', 160, 150, { maxWidth: 350, align: 'justify' });


      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('d) Otorgar el apoyo necesario para el desarrollo de los estudiantes y sus'
        + 'actividades, además de evaluar el desarrollo de las actividades que se '
        + 'asignen a los estudiantes dentro de las actividades de vinculación a '
        + 'realizarse.', 160, 195, { maxWidth: 350, align: 'justify' });


      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('e) Emitir un informe de evaluación a los estudiantes que participaron en la'
        + 'ejecución del proyecto de vinculación con la sociedad conforme a las '
        + 'actividades planificadas y principio de retribución de conocimientos.', 160, 240, { maxWidth: 350, align: 'justify' });


      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('f) Emitir los certificados correspondientes a los estudiantes que hayan '
        + 'cumplido exitosamente con la ejecución del proyecto de vinculación.', 160, 290, { maxWidth: 350, align: 'justify' });





      this.doc.line(40, 670, 555, 670);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Administradores del convenio.', 40, 685, { maxWidth: 75, align: 'justify' });

      this.doc.text('Por el Instituto:', 160, 685, { maxWidth: 75, align: 'justify' });

      this.doc.text('Coordinador de Carrera', 265, 685, { maxWidth: 150, align: 'justify' });

      this.doc.text('Por le Entidad Receptora: ', 385, 685, { maxWidth: 150, align: 'justify' });

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.line(40, 730, 555, 730);
      this.doc.text('Nota: Los administradores y/o delegados del convenio no podrán ser los mismos suscribientes', 45, 745, { maxWidth: 450, align: 'justify' });

      this.doc.line(40, 750, 555, 750);




    }


    const pageContent4 = (data: any) => {

      // HEADER
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 130, 555, 130);
      this.doc.line(40, 130, 40, 750);
      this.doc.line(555, 130, 555, 750);

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Criterios Academicos', 255, 145);

      this.doc.line(40, 150, 555, 150);
      this.doc.line(150, 150, 150, 750);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Justificación:(Explique la pertinencia de '
        + 'la suscripción del Convenio)', 45, 190, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.justification, 160, 170, { maxWidth: 500, align: 'justify' });
      // this.doc.line(40, 225, 555, 225);


      this.doc.line(40, 300, 555, 300);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Documento de creación del IST', 45, 310, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.code, 160, 315, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 325, 555, 325);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre del Rector/a del IST:', 45, 335, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Iván Borja', 160, 335, { maxWidth: 350, align: 'justify' });

      this.doc.line(40, 350, 555, 350);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('No. De acción de personal del Rector/a del IST:', 45, 360, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.code, 160, 360, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 380, 555, 380);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre de la/s carrera/s:', 45, 395, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.career_id.name, 160, 395, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 410, 555, 410);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('No. Resolución de aprobación, de cada carrera:', 45, 420, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.code, 160, 430, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 445, 555, 445);
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Vinculación con la sociedad', 255, 460, { maxWidth: 250, align: 'left' });
      this.doc.line(40, 465, 555, 465);

      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Nombre del proyecto: ', 45, 480, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.name, 160, 480, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 500, 555, 500);

      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Objeto del Proyecto:', 45, 520, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.description, 160, 520, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 530, 555, 530);

      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Número de Participantes:', 45, 550, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.beneficiary_institution_id.number_students_start, 160, 550, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 560, 555, 560);

      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Financiamiento:', 45, 580, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.foundation, 160, 580, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 590, 555, 590)

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Conclusiones y Recomendaciones', 250, 605, { maxWidth: 350, align: 'left' });
      this.doc.line(40, 615, 555, 615)

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Recomendaciones: (deberá constar en los antecedentes del '
        + 'convenio a suscribir)', 40, 640, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.recommendation, 160, 640, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 685, 555, 685)

      this.doc.setFontSize(9);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Conclusiones: (deberá constar en los antecedentes del '
        + 'convenio a suscribir)', 40, 700, { maxWidth: 100, align: 'left' });
      this.doc.setFontSize(9);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.proyectData.conclusions, 160, 700, { maxWidth: 350, align: 'justify' });
      this.doc.line(40, 750, 555, 750);



    }

    const pageContent5 = (data: any) => {

      // HEADER
      // HEADER
      this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
      this.doc.line(40, 130, 555, 130);
      this.doc.line(40, 130, 40, 750);
      this.doc.line(555, 130, 555, 750);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Elaborado y Revisado por:', 250, 145);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Yogledis Herrera', 270, 235,);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Docente del Instituto Superior Tecnológico Yavira', 220, 250,);

      this.doc.line(40, 255, 555, 255);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Aprobado por:', 275, 275);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Iván Borja Carrera ', 270, 360,);
      this.doc.text('Rector/a del Instituto', 260, 380,);
      this.doc.line(40, 390, 555, 390);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('ANEXOS I: Documentos habilitantes', 40, 410);
      this.doc.line(40, 415, 555, 415);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Copia simple de los documentos que acrediten la calidad del Representante Legal/ delegado o apoderado.', 40, 430,);
      this.doc.text('Nota:', 40, 440,);
      this.doc.text('*Para el caso de la persona jurídica de derecho privado solicitará el nombramiento debidamente inscrito en el Registro Mercantil.', 40, 450, { maxWidth: 500, align: 'justify' });
      this.doc.text('*Para el caso de la persona jurídica de derecho público solicitará el nombramiento, acción de personal o credencial para el caso de'
        + 'dignidades de elección popular.', 40, 470, { maxWidth: 500, align: 'justify' });
      this.doc.text('* Para el caso de los delegados se presentará el documento que le acredite. (Acuerdo de Delegación Resolución, otros).', 40, 495, { maxWidth: 500, align: 'justify' });
      this.doc.text('* Para el caso de los mandatarios, se deberá presentar el poder debidamente notariado.', 40, 510, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 520, 555, 520);
      this.doc.text('Copia simple de la cédula de identidad o pasaporte del representante legal/ delegado o apoderado legalmente'
        + 'facultado para suscribir convenio', 40, 540, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 570, 555, 570);
      this.doc.text('Copia simple del Registro Único de Contribuyente (RUC)', 40, 590, { maxWidth: 500, align: 'justify' });
      this.doc.line(40, 620, 555, 620);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Del instituto', 275, 630);
      this.doc.line(40, 635, 555, 635);

      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Copia simple de la acción de personal del Rector vigente y debidamente legalizado', 40, 645,);
      this.doc.line(40, 655, 555, 655);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Copia simple de la cédula de identidad del rector ', 40, 665,);
      this.doc.line(40, 675, 555, 675);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Resolución de creación del Instituto ', 40, 685,);
      this.doc.line(40, 695, 555, 695);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Resolución de aprobación, registro o regularización de la/s carrera/s expedido por el CES', 40, 705,);
      this.doc.line(40, 715, 555, 715);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Resolución de aprobación, registro o regularización de la/s carrera/s expedido por el CES', 40, 725,);
      this.doc.line(40, 735, 555, 735);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Adjunto al informe deberá presentar:', 40, 745);
      this.doc.setFontSize(10);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Proyecto de vinculación ', 255, 745,);

      this.doc.line(40, 750, 555, 750);



    }


    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);



    this.doc.autoTable({
      addPageContent: pageContent,

    })
    this.doc.autoTable({
      addPageContent: pageContent2,
      startY: 1100,

    })

    this.doc.autoTable({
      addPageContent: pageContent3,
      startY: 2100,

    })

    this.doc.autoTable({
      addPageContent: pageContent4,
      startY: 3100,

    })

    this.doc.autoTable({
      addPageContent: pageContent5,
      startY: 4100,

    })



    this.doc.save("Itv.pdf");




  }
}
