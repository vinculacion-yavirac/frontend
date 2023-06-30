import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private encuestaHttpService:EncuestaHttpService,
    private  router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

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

}
