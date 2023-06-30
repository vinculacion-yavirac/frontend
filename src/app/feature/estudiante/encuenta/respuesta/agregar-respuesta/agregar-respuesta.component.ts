import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { RespuestaHttpService } from 'src/app/service/estudiante/encuesta/respuesta-http.service';


@Component({
  selector: 'app-agregar-respuesta',
  templateUrl: './agregar-respuesta.component.html',
  styleUrls: ['./agregar-respuesta.component.css']
})
export class AgregarRespuestaComponent implements OnInit {

  constructor(private respuestaHttpService:RespuestaHttpService,
    private  router: Router,
    private activatedRoute: ActivatedRoute, ) { }

    addEntity: RespuestaModel = {
      id: 0,
      descripcion: '',
      preguntas_id: 0,
      encuestas_id: 0
    };

  ngOnInit(): void {
  }

  createRespuesta() :void{
    this.respuestaHttpService.create(this.addEntity).subscribe(()=>
    {
      this.addEntity={
        id: 0,
        descripcion: '',
       preguntas_id: 0,
       encuestas_id: 0

      };
      this.router.navigate(['/system/estudiante/encuesta']);


    })
   }

}
