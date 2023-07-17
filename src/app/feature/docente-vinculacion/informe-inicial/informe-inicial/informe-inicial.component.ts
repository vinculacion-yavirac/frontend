import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
@Component({
  selector: 'app-informe-inicial',
  templateUrl: './informe-inicial.component.html',
  styleUrls: ['./informe-inicial.component.css']
})
export class InformeInicialComponent implements OnInit {
  docente: FormGroup;
  public doc: any;

  constructor(

    private miDatePipe: DatePipe

  ) { }

  ngOnInit() {
    this.docente = new FormGroup({
      persona: new FormControl(''),
      asunto: new FormControl(''),
      fecha: new FormControl(''),
      name_docente: new FormControl(''),
      ci_docente: new FormControl(''),
      carrera: new FormControl(''),
      name_proyect: new FormControl(''),
      start_vinculacion: new FormControl(''),
      comments: new FormControl(''),

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
