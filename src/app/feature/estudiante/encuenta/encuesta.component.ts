import { Component, ElementRef, OnInit,  } from '@angular/core';
import { ActivatedRoute,  } from '@angular/router';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { RespuestaHttpService } from 'src/app/service/estudiante/encuesta/respuesta-http.service';




@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {


  constructor(private encuestaHttpService: EncuestaHttpService,
    respuestaHttpService: RespuestaHttpService,

    private activatedRoute: ActivatedRoute,
  ) {
    //this.downloadPDF();
  }

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

  findById(id: number):void{
    this.encuestaHttpService.getRbyId(id).subscribe(
      (response) => {
        this.currentEntityRespuesta = response;
      }
    )
  }

 //generacion del pdf encuesta

  async generatePDF() {
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

    const pageHeight = 1505;
    const imgData = await html2canvas(content, { useCORS: true });

    const headerImg = new Image();
    headerImg.src = 'assets/images/header.png';

    const footerImg = new Image();
    footerImg.src = 'assets/images/footer.png';

    let yPosition = 0;

    while (yPosition < imgData.height) {
      if (yPosition > 0) {
        pdf.addImage(headerImg, 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, 0);
        yPosition += headerImg.height;
      }
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = imgData.width;
      canvas.height = Math.min(pageHeight, imgData.height - yPosition);

      context.drawImage(imgData, 0, yPosition, imgData.width, canvas.height, 0, 0, imgData.width, canvas.height);

      const pdfData = canvas.toDataURL('image/jpeg',);
      pdf.addImage(pdfData, 'JPEG', 5, 25, pdf.internal.pageSize.getWidth() - 10, 0);
      yPosition += pageHeight - 20;

      if (yPosition < imgData.height) {
        pdf.addPage();
      }
    }

    pdf.save('generated-pdf.pdf');
  }










async generaatePDF() {
  const content = document.getElementById('content'); // Obtener el elemento por su ID

  if (!content) {
    console.error('El elemento de contenido no se encontró.');
    return;
  }

  const canvas = await html2canvas(content);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  var headerImg = new Image();
  headerImg.src = 'assets/images/header.png?' + new Date().getTime(); // Evitar caché

  var footerImg = new Image();
  footerImg.src = 'assets/images/footer.png?' + new Date().getTime(); // Evitar caché

  let startY = 10;
  const pageHeight = pdf.internal.pageSize.getHeight();

  while (startY < pdfHeight) {
    pdf.addImage(headerImg, 'PNG', 10, startY, pdfWidth - 20, 25);
    startY += 30; // Altura del encabezado

    const remainingPageSpace = pageHeight - startY;
    const imgHeightToFit = Math.min(remainingPageSpace, pdfHeight - startY);
    pdf.addImage(imgData, 'JPEG', 10, startY, pdfWidth - 20, imgHeightToFit);
    startY += imgHeightToFit;

    pdf.addImage(footerImg, 'PNG', 10, startY - 25, pdfWidth - 20, 25);
    startY += 30; // Altura del pie de página

    if (startY < pdfHeight) {
      pdf.addPage();
    }
  }

  // Guardar el PDF en una variable Blob
  const pdfBlob = pdf.output('blob');

  // Crear un objeto URL para el Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir el PDF en una nueva ventana/tab
  window.open(pdfUrl);
}
}







