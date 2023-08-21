import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
@Component({
  selector: 'app-informe-inicial',
  templateUrl: './informe-inicial.component.html',
  styleUrls: ['./informe-inicial.component.css']
})
export class InformeInicialComponent implements OnInit {
  docente: FormGroup;
  public doc: any;
  projectId: number;
  proyectos: any[] = [];

  constructor(

    private miDatePipe: DatePipe,
    private route: ActivatedRoute,
    private httpProvider: AvanceCumplimientoService,

  ) { }

  ngOnInit() {
    this.docente = new FormGroup({
      persona: new FormControl(''),
      asunto: new FormControl('Informe de inicio de actividades '),
      fecha: new FormControl(''),
      name_docente: new FormControl(''),
      ci_docente: new FormControl(''),
      carrera: new FormControl(''),
      name_proyect: new FormControl(''),
      start_vinculacion: new FormControl(''),
      comments: new FormControl(''),

    });

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.projectId = params['id_proyecto'];
        if (this.projectId) {

          this.getAllProyectoById(this.projectId)
        }
        console.log(this.projectId);
      });
  }
  public getAllProyectoById(id: number): void {
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



  /* pdf proyecto*/
  public Generar_Solicitud() {
    console.log(this.docente.value);


    this.doc = new jsPDF('p', 'pt');
    const pageContent = () => {
      // HEADER

      this.doc.setFont("Roboto", 'bold');
      this.doc.setFontSize(11);
      this.doc.text('A:', 45, 210);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.persona, 215, 210);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Coordinadora de Carrera', 215, 225);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('DE:', 45, 255);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.name_docente, 215, 255, { maxWidth: 250, align: 'justify' });
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('Tutor de Proyecto', 215, 265, { maxWidth: 250, align: 'justify' });


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('ASUNTO:', 45, 295);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.asunto, 215, 295);


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('PROYECTO:', 45, 325);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.name_proyect, 215, 325, { maxWidth: 250, align: 'justify' });



      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('FECHA:', 45, 355);
      this.doc.setFontSize(11);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.fecha, 215, 355, { maxWidth: 250, align: 'justify' });

      const fechaFormateada = this.miDatePipe.transform(this.docente.value.fecha, "'Quito,' d 'de' MMMM 'del' yyyy");

      this.doc.setFontSize(12);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text('Yo ' + this.docente.value.name_docente + ' con CI: ' + this.docente.value.ci_docente + ' docente de la carrera ' + this.docente.value.carrera + ', tengo bien a informar que,' +
        'siguiendo con el cronograma de actividades establecido en el proyecto vinculación ' + this.docente.value.name_proyect + ', le informó que el día de hoy ' + fechaFormateada + ', se procedió ' +
        'a dar inicio con el desarrollo del mismo.', 45, 455, { maxWidth: 500, align: 'justify' });


      this.doc.setFontSize(11);
      this.doc.setFont("Roboto", 'bold');
      this.doc.text('ATENTAMENTE', 45, 660);
      this.doc.setFont("Roboto-Regular-normal.ttf", "Roboto-Regular", "normal");
      this.doc.text(this.docente.value.name_docente, 45, 675);

    }
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);






    this.doc.autoTable({
      addPageContent: pageContent,

    })

    this.doc.save("Solicitud.pdf");
    location.reload();
  }


}
