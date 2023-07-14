import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private encuestaHttpService:EncuestaHttpService,
    private  router: Router,
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

  public getencuesta() :void{
    this.encuestaHttpService.getAll().subscribe(
      (response) => {
        this.encuestas = response;
        console.log(response);
      });
  }

  // seccionPreguntas
  public getpregunta() :void{
    this.encuestaHttpService.getAllP().subscribe(
      (response) => {
        this.preguntas = response;
        console.log(response);
      });
  }

  //seccion respuestas
  public getrespuesta() :void{
    this.encuestaHttpService.getAllR().subscribe(
      (response) => {
        this.respuestas = response;
        console.log(response);
      });
  }


  // creacion pdf
  // pdfcrear1(){
  //   var data = document.getElementById('table');
  //   html2canvas(data).then(canvas => {
  //     var imgWidth = 208;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     let pdf = new jspdf('p','mm','a4');
  //     var posicion = 0;
  //     pdf.save('my pdf.pdf');
  //   });
  // }

  generatePDF() {
    var data = document.getElementById('pdf');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 190;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      var options = {
        size: '70px',
        background: '#fff',
        pagesplit: true,
      };

      let pdf = new jsPDF('p','mm','a4');
      var position = 0;
      var width = pdf.internal.pageSize.width;

      var pageHeight = pdf.internal.pageSize.height; // Tamaño de una
      var pageHeightLeft = pageHeight; // La utilizaremos para ver cuanto espacio nos queda
      pdf.addImage(contentDataURL, 'PNG', 2, position, imgWidth, imgHeight);
      pdf.addImage(contentDataURL, 'PNG', 2, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 2, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('skill-set.pdf');
    });
  }



  public downloadPDF(): void {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      pagesplit: true,
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG',10);

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
     doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

     doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }


  }








