import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';
import { PreguntaHttpService } from 'src/app/service/estudiante/encuesta/pregunta-http.service';

@Component({
  selector: 'app-agregar-pregunta',
  templateUrl: './agregar-pregunta.component.html',
  styleUrls: ['./agregar-pregunta.component.css']
})
export class AgregarPreguntaComponent implements OnInit {

   constructor(private preguntaHttpService:PreguntaHttpService,
    private  router: Router,
    private activatedRoute: ActivatedRoute,) { }

    preguntas: PreguntaModel[] = [];

    addpEntity: PreguntaModel = {
      id: 0,
      descripcion: '',
      encuestas_id:0
    };

  ngOnInit(): void {
  }

  createPregunta() {
    this.preguntaHttpService.createp(this.addpEntity).subscribe(()=>
    {
      this.addpEntity={
        id: 0,
        descripcion: '',
        encuestas_id:0

      };
      this.router.navigate(['/system/estudiante/encuesta']);

    })
   }

}
