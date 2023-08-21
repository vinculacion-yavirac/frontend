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

 async generatePDF() {

    const addFooters = pdf => {
      const pageCount = pdf.internal.getNumberOfPages()
      const pdfWidth = pdf.internal.pageSize.getWidth();
      let startY = 10;
      const headerImg = new Image();
      headerImg.src = 'assets/images/header.png';

      const footerImg = new Image();
    footerImg.src = 'assets/images/footer.png';

      for (var i = 1; i <= pageCount; i++) {
        pdf.setPage(i)

        pdf.addImage(headerImg, 'PNG', 0, 0, pdfWidth - 0, 30);
        startY += 30;

        pdf.addImage(footerImg, 'PNG',0,275, 210, 25,);

      }
    }
    const content = document.getElementById('content'); // Obtener el elemento por su ID

    if (!content) {
      console.error('El elemento de contenido no se encontró.');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = 1460;
    const imgData = await html2canvas(content, { useCORS: true });



    let yPosition = 0;

    while (yPosition < imgData.height) {

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = imgData.width;
      canvas.height = Math.min(pageHeight, imgData.height - yPosition);

      context.drawImage(imgData, 0, yPosition, imgData.width, canvas.height, 0, 0, imgData.width, canvas.height);

      const pdfData = canvas.toDataURL('image/jpeg',);
      pdf.addImage(pdfData, 'JPEG', 5, 30, pdf.internal.pageSize.getWidth() - 20, 0);
      yPosition += pageHeight - 20;

      if (yPosition < imgData.height) {
        pdf.addPage();
      }
    }
    addFooters(pdf)
    pdf.save('8.Encuesta de Percepcion.pdf');
  }

}
