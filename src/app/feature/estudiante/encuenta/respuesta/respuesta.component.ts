import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { RespuestaHttpService } from 'src/app/service/estudiante/encuesta/respuesta-http.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css']
})
export class RespuestaComponent implements OnInit {

  constructor(private respuestaHttpService:RespuestaHttpService,
    private  router: Router,
    private activatedRoute: ActivatedRoute,) { }

    respuestas: RespuestaModel[] = [];
    currentEntityRespuesta: RespuestaModel = {
      id: 0,
      descripcion: '',
      preguntas_id: 0,
      encuestas_id: 0
    };

  ngOnInit(): void {
    this.getrespuesta();
  }

  public getrespuesta() :void{
    this.respuestaHttpService.getAll().subscribe(
      (response) => {
        this.respuestas = response;
        console.log(response);
      });
  }

}
