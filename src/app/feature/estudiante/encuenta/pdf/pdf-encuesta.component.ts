import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-encuesta',
  templateUrl: './pdf-encuesta.component.html',
  styleUrls: ['./pdf-encuesta.component.css']
})
export class PdfEncuestaComponent implements OnInit {

  constructor(private encuestaHttpService: EncuestaHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,) { }


  encuestas: EncuestaModel[] = [];
  currentEntity: EncuestaModel = {
    id: 0,
    nombre_institucion: '',
    actividad_realizada: '',
    docente_tutor: '',
    tutor_entidad_financiera: '',
    proyecto: '',
    codigo_proyecto: '',
    genero: '',
    rango_edad: '',
    fecha: '',
    objetivo: '',
    instructivo: '',
    informacion_general: '',
    tipo: ''
  };

  preguntas: PreguntaModel[] = [];
  currentEntityPregunta: PreguntaModel = {
    id: 0,
    descripcion: '',
    encuestas_id: 0
  };

  respuestas: RespuestaModel[] = [];
  currentEntityRespuesta: RespuestaModel = {
    id: 0,
    descripcion: '',
    preguntas_id: 0,
    encuestas_id: 0
  };



  ngOnInit(): void {
    this.getencuesta();
    this.getpregunta();
    this.getrespuesta();
  }

  public getencuesta(): void {
    this.encuestaHttpService.getAll().subscribe(
      (response) => {
        this.encuestas = response;
        console.log(response);
      });
  }

  // seccionPreguntas
  public getpregunta(): void {
    this.encuestaHttpService.getAllP().subscribe(
      (response) => {
        this.preguntas = response;
        console.log(response);
      });
  }

  //seccion respuestas
  public getrespuesta(): void {
    this.encuestaHttpService.getAllR().subscribe(
      (response) => {
        this.respuestas = response;
        console.log(response);
      });
  }

  generatePDF() {

    const addFooters = pdf => {
      const pageCount = pdf.internal.getNumberOfPages()

      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(8)

      for (var i = 1; i <= pageCount; i++) {
        pdf.setPage(i)

        pdf.text('Page ' + String(i) + ' of ' + String(pageCount), pdf.internal.pageSize.width / 2, 287, {
          align: 'center'
        })

      }
    }
    var data = document.getElementById('pdf');

    html2canvas(data).then(canvas => {
      let pdf = new jsPDF('p', 'mm', 'a4');

      var imgWidth = 208;
      var imgHeight = 766;
      var pageHeight = 195;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      var position = 1;
      var image1 = new Image();
      image1.src = "imagen.jpg"; /// URL de la imagen



      var pageHeight = pdf.internal.pageSize.height; // Tamaño de una
      var pageHeightLeft = pageHeight;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;


      while (heightLeft >= 0) {


        if (pageHeightLeft - imgHeight <= 0) {
          pdf.addPage();
          position = heightLeft - imgHeight; // Pintaremos en el inicio de la nueva pagina

        }

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        position += canvas.height;
        heightLeft -= pageHeight;

      }

      addFooters(pdf);
      pdf.save('documento.pdf');
    });
  }

}
