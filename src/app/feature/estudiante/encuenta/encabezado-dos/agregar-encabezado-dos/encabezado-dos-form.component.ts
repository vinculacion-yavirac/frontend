import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';

@Component({
  selector: 'app-encabezado-dos-form',
  templateUrl: './encabezado-dos-form.component.html',
  styleUrls: ['./encabezado-dos-form.component.css']
})
export class EncabezadoDosFormComponent implements OnInit {

  constructor(private encabezadoDosHttpService:EncuestaHttpService,
    private  router: Router,
    private activatedRoute: ActivatedRoute,) { }

    encuestas: EncuestaModel[] = [];
    currentEntityadd: EncuestaModel = {
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

  ngOnInit(): void {
  }

  createEncabezadoD() :void{
    this.encabezadoDosHttpService.create(this.currentEntityadd).subscribe(()=>
    {
      this.currentEntityadd={
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
      this.router.navigate(['/system/estudiante/encuesta']);

    })
   }

}
